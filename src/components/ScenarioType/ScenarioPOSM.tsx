import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, PermissionsAndroid, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Avatar,
    Button,
    Card,
    Icon,
    IconButton,
    Modal,
    Portal,
    Text,
    TextInput,
    TouchableRipple,
} from 'react-native-paper';
import { ApiConstant, AppConstant } from '../../const';
import LinearGradient from 'react-native-linear-gradient';
import { openImagePickerCamera } from '../../utils/camera.utils';
import { CommonUtils } from '../../utils';
import { useMMKVString } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScenarioPOSM = ({ route, navigation }: any) => {
    const [scenarioIdWithoutDoctype, setScenarioIdWithoutDoctype] = useState<string | null>(null);
    const [productData, setProductData] = useState<any[]>([]);
    const [responseData, setResponseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [nameProduct, setNameProduct] = useState<string | null>(null);
    const [capturedImageUriMap, setCapturedImageUriMap] = useState<Record<string, string>>({}); // Thêm state mới để theo dõi ảnh cho từng card
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [deleteButtonVisible, setDeleteButtonVisible] = useState<boolean>(false);
    const [userInput, setUserInput] = useState<Record<string, { name: string; count: string; image: string }>>({});
    const [currentName, setCurrentName] = useState<Record<string, string>>({});
    const [countInputMap, setCountInputMap] = useState<Record<string, string>>({});
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);
    const [userNameStore] = useMMKVString(AppConstant.userNameStore);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    const LeftContent = (props: any) => <Avatar.Icon {...props} icon="briefcase" />;

    const fetchData = async () => {
        try {
            const { scenarioId, scenarioName } = route.params;
            const [doctype, scenarioIdWithoutDoctype] = scenarioId.split('::');
            setScenarioIdWithoutDoctype(scenarioIdWithoutDoctype);
            const response = await axios.get(
                ApiConstant.GET_PRODUCT + `doctype=${doctype}&name=${scenarioIdWithoutDoctype}`,
            );
            const data = response.data;

            if (response.status === 200) {
                const scenarioLinks = data._link_titles;
                const scenarioList = Object.entries(scenarioLinks).map(([key, value]) => ({ key, value }));
                setProductData(scenarioList);
                setResponseData(data);
            } else {
                console.error('Error fetching product data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleRetry = () => {
        setLoading(true);
        fetchData();
    };
    const handleCheckin = async (key: string) => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            granted ? openCamera(key) : requestCameraPermission();
        } catch (error) {
            console.error('Error checking or requesting camera permission:', error);
        }
    };
    const openCamera = (key: string) => {
        openImagePickerCamera((uri: any) => {
            setNameProduct(key);
            setCapturedImageUriMap((prev) => ({ ...prev, [key]: uri }));
            setCapturedImageUri(uri);

            setDeleteButtonVisible(true);
            Keyboard.dismiss();
            setUserInput((prev) => ({
                ...prev,
                [key]: {
                    name: currentName[key] || '',
                    count: countInputMap[key] || '',
                    image: uri,
                },
            }));
        });
    };
    const handleDeleteImage = (key: string) => {
        setCapturedImageUriMap((prev) => ({ ...prev, [nameProduct || '']: '' }));
        setDeleteButtonVisible(false);
    };
    const requestCameraPermission = async () => {
        try {
            const requestResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

            if (requestResult === PermissionsAndroid.RESULTS.GRANTED) openCamera;
            else console.log('Camera permission denied');
        } catch (error) {
            console.error('Error checking or requesting camera permission:', error);
        }
    };
    const uploadImages = async (imageArray: any) => {
        try {
            const uploadedImageUrls = [];

            while (imageArray.length > 0) {
                setLoading(true);

                const capturedImageUri = imageArray[0];
                const fileExtension = capturedImageUri.split('.').pop();
                const fileName = `my_profile_${Date.now()}.${fileExtension}`;
                const formData = new FormData();
                formData.append('file', {
                    uri: capturedImageUri,
                    type: `image/${fileExtension}`,
                    name: fileName,
                });
                formData.append('is_private', 0);
                formData.append('folder', 'Home');
                formData.append('doctype', 'ReportScenario_SKU');
                formData.append('fieldname', 'photos_display');
                formData.append('docname', CommonUtils.renderRandomDocName('new-reportscenario_asset'));

                if (!apiKey || !apiSecret) throw new Error('API key or secret not available');

                try {
                    console.log(JSON.stringify(formData));
                    const response = await axios.post(ApiConstant.UPDATE_FILE_IMAGE, formData, {
                        headers: CommonUtils.Header_Image(apiKey, apiSecret),
                    });
                    console.log(response);

                    if (response.status === 200) {
                        console.log('Upload successful');
                        uploadedImageUrls.push(capturedImageUri);
                        imageArray.splice(0, 1);
                    } else {
                        console.error('Error uploading image: Invalid status or undefined file_url');
                    }
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                }
            }

            return uploadedImageUrls;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        const imageArray = [];
        const formsData = [];
        for (const key in userInput) {
            if (userInput.hasOwnProperty(key)) {
                const obj = userInput[key];
                const imageValue = obj.image;
                imageArray.push(imageValue);
            }
        }

        const uploadedImageUrls = await uploadImages(imageArray);

        const keysToUpdate = Object.keys(userInput);

        for (let i = 0; i < keysToUpdate.length; i++) {
            const key = keysToUpdate[i];
            const obj = userInput[key];

            const matchingImage = uploadedImageUrls[i];

            if (matchingImage) {
                userInput[key].image = matchingImage;
            }
        }
        const form_answer = [];
        try {
            // setLoading(true);
            console.log('load images sucsses');
            for (const key in userInput) {
                if (userInput.hasOwnProperty(key)) {
                    const obj = userInput[key];
                    const imageValue = obj.image;
                    const name = obj.name;
                    const count = obj.count;

                    const data = {
                        docstatus: 0,
                        doctype: 'ReportPOSM',
                        parentfield: 'report_posm',
                        parenttype: 'DashboardRetail',
                        scenario_name: dataValues.scenario_name,
                        asset_name: name,
                        asset_count: count,
                        asset_image: imageValue,
                    };

                    formsData.push(data);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Submit Failed', 'Submit failed. Please try again.');
        } finally {
            setLoading(false);
        }
        console.log(formsData);
        await AsyncStorage.setItem('savedFormPOSM', JSON.stringify(formsData));
        const a = await AsyncStorage.getItem('savedFormPOSM');
        console.log('zzz', a);
        await AsyncStorage.removeItem('savedFormPOSM');
        await navigation.goBack();
    };
    useEffect(() => {
        fetchData();
    }, [route.params]);
    useEffect(() => {
        if (submitSuccess) {
            setCapturedImageUri('');
        }
    }, [submitSuccess]);

    const _renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <IconButton
                    icon="arrow-left"
                    iconColor="#000"
                    size={24}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <Text style={styles.headerLabel}>Kịch bản POSM</Text>

                {/* <IconButton
                    icon="magnify"
                    iconColor="#000"
                    size={24}
                    onPress={() => {
                        // Xử lý sự kiện khi nhấn vào icon search
                    }}
                /> */}
            </View>
        );
    };
    var dataValues = responseData && responseData.docs && responseData.docs.length > 0 ? responseData.docs[0] : null;

    const renderProductItem = ({ item }: any) => {
        const keyParts = item.key.split('::');
        let checkDoctype = keyParts[0];
        let names = keyParts[1];
        const capturedImageUri = capturedImageUriMap[item.key] || '';
        const showDeleteButton = !!capturedImageUri;
        return (
            <Card style={styles.card}>
                <Card.Title title={dataValues?.scenario_name} left={LeftContent} />
                <View style={styles.line} />

                <Card.Content>
                    <View style={styles.cardSection}>
                        <TextInput
                            style={styles.countInput}
                            label={'name'}
                            value={currentName[item.key] || ''}
                            onChangeText={(text) => setCurrentName((prev) => ({ ...prev, [item.key]: text }))}
                        />
                    </View>

                    <View style={styles.cardSection}>
                        <TextInput
                            style={styles.countInput}
                            label={'count'}
                            value={countInputMap[item.key] || ''}
                            onChangeText={(text) => setCountInputMap((prev) => ({ ...prev, [item.key]: text }))}
                        />
                    </View>
                </Card.Content>
                <View style={styles.cardHeader}>
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            <Button
                                style={styles.takeButton}
                                icon={'camera'}
                                mode="contained-tonal"
                                onPress={() => handleCheckin(item.key)}
                            >
                                Take
                            </Button>
                        </View>
                        {showDeleteButton && (
                            <TouchableRipple style={styles.takeButton} onPress={() => handleDeleteImage(item.key)}>
                                <Button style={styles.takeButton} mode="contained-tonal" icon={'close'}>
                                    close
                                </Button>
                            </TouchableRipple>
                        )}
                    </View>
                    {capturedImageUri ? (
                        <Card.Cover style={styles.image} source={{ uri: capturedImageUri }} />
                    ) : (
                        <Card.Content>
                            <Card.Title title="No Image" />
                        </Card.Content>
                    )}
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator style={styles.loader} animating={true} color={'#000'} size="large" />
                ) : (
                    <FlatList
                        data={productData}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item.key}
                        contentContainerStyle={styles.flatListContainer}
                        ListEmptyComponent={<Text>No products found.</Text>}
                    />
                )}
                {!loading && productData.length === 0 && (
                    <View style={styles.retryContainer}>
                        <Text style={styles.retryText}>No data available. Please retry.</Text>
                        <Button mode="contained" onPress={handleRetry} style={styles.retryButton}>
                            Retry
                        </Button>
                    </View>
                )}
                <View style={styles.saveButtonContainer}>
                    <Button style={styles.saveButton} icon={'content-save'} mode="contained-tonal" onPress={handleSave}>
                        Save
                    </Button>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    linearGradient: {
        flex: 1,
    },
    retryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryText: {
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#1abc9c',
    },
    saveButtonContainer: {
        paddingHorizontal: 10,
        alignSelf: 'center',
        bottom: 15,
    },
    saveButton: {
        width: 100,
        height: 40,
    },
    cardHeader: {
        top: 0,
        right: 0,
        padding: 10,
        zIndex: 1,
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 100,
        marginLeft: '25%',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    countInput: {
        width: '100%',
        height: 50,
        marginVertical: 3,
    },
    takeButton: {
        width: '100%',
        height: 40,
        marginBottom: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'gray',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
    },
    line: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 4,
        marginHorizontal: 20,
    },
});

export default ScenarioPOSM;
