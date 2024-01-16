import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, PermissionsAndroid, StyleSheet, View } from 'react-native';
import axios from 'axios';
import {
    ActivityIndicator,
    Avatar,
    Button,
    Card,
    Icon,
    Modal,
    Portal,
    Text,
    TextInput,
    TouchableRipple,
} from 'react-native-paper';
import SubmitFormModal from '../components/SubmitForm';
import { ApiConstant, AppConstant } from '../const';
import { openImagePickerCamera } from '../utils/camera.utils';
import LinearGradient from 'react-native-linear-gradient';
import FormSkuModal from '../components/FormDoctype/SkuModal';
import FormAssetsModal from '../components/FormDoctype/AssetModal';
import FormPosmModal from '../components/FormDoctype/PosmModal';
import { CommonUtils } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMMKVString } from 'react-native-mmkv';

const Product = ({ route }: any) => {
    const [productData, setProductData] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [nameProduct, setNameProduct] = useState<string | null>(null);
    const [formQuestion, setFormQuestion] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [responseData, setResponseData] = useState<any>(null);
    const [selectedDoctype, setSelectedDoctype] = useState<string | null>(null); // Store selected doctype
    const [nameToModal, setNameToModal] = useState<string | null>(null);
    const [scenarioIdWithoutDoctype, setScenarioIdWithoutDoctype] = useState<string | null>(null);
    const [capturedImageUriMap, setCapturedImageUriMap] = useState<Record<string, string>>({}); // Thêm state mới để theo dõi ảnh cho từng card
    const [deleteButtonVisible, setDeleteButtonVisible] = useState<boolean>(false);
    const [countInputMap, setCountInputMap] = useState<Record<string, string>>({});
    const [userInput, setUserInput] = useState<Record<string, { name: string; count: string; image: string }>>({});
    const [currentName, setCurrentName] = useState<Record<string, string>>({});
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);
    const [scenarioType, setScenarioType] = useState('');
    const [userNameStore] = useMMKVString(AppConstant.userNameStore);

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

    const handleSubmit = (name: string, doctype: string, names: string) => {
        setNameProduct(name);
        setModalVisible(true);
        setSelectedDoctype(doctype);
        setNameToModal(names);
    };

    const hideModal = () => {
        setModalVisible(false);
        setNameProduct(null);
        setSelectedDoctype(null);
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
    useEffect(() => {
        fetchData();
    }, [route.params]);
    const handleRetry = () => {
        setLoading(true);
        fetchData();
    };

    const renderModalContent = () => {
        const product_names = productData.map((item) => item.value);
        const product_names_string = product_names.join(', ');
        switch (selectedDoctype) {
            case 'Product_SKU':
                return (
                    <FormSkuModal
                        visible={isModalVisible}
                        onClose={hideModal}
                        onSubmit={handleSubmit}
                        productId={nameProduct}
                        scenarioName={route.params?.scenarioName || ''}
                        formQuestion={formQuestion}
                        product_name={product_names_string}
                        nameToModal={nameToModal}
                        scenario_code={scenarioIdWithoutDoctype}
                    />
                );
            case 'Assets':
                return (
                    <FormAssetsModal
                        visible={isModalVisible}
                        onClose={hideModal}
                        onSubmit={handleSubmit}
                        productId={nameProduct}
                        scenarioName={route.params?.scenarioName || ''}
                        formQuestion={formQuestion}
                        product_name={product_names_string}
                        nameToModal={nameToModal}
                        scenario_code={scenarioIdWithoutDoctype}
                    />
                );
            case 'POSM':
                return (
                    <FormPosmModal
                        visible={isModalVisible}
                        onClose={hideModal}
                        onSubmit={handleSubmit}
                        productId={nameProduct}
                        scenarioName={route.params?.scenarioName || ''}
                        formQuestion={formQuestion}
                        product_name={product_names_string}
                        nameToModal={nameToModal}
                        scenario_code={scenarioIdWithoutDoctype}
                    />
                );
            default:
                return null;
        }
    };
    const uploadImage = async () => {
        try {
            if (!capturedImageUri) throw new Error('No image to upload');
            const fileExtension = capturedImageUri.split('.').pop();
            const fileName = `my_profile_${Date.now()}.${fileExtension}`;
            const formData = new FormData();
            formData.append('file', {
                uri: capturedImageUri,
                type: `image/${fileExtension}`,
                name: fileName,
            });
            formData.append('is_private', 1);
            formData.append('folder', 'Home');
            formData.append('doctype', 'Product_SKU');
            formData.append('fieldname', 'uri_image');
            formData.append('docname', 'ebed2fdd7a');
            formData.append('optimize', true);
            if (!apiKey || !apiSecret) throw new Error('API key or secret not available');

            const response = await axios.post(ApiConstant.UPDATE_FILE_IMAGE, formData, {
                headers: CommonUtils.Header_Image(apiKey, apiSecret),
            });

            var res = response.data;

            if (response.status === 200 && res && res.message && res.message.file_url) {
                console.log('thanh cong');

                await AsyncStorage.setItem('uploadedImageUri', res.message.file_url);
                return res.message.file_url;
            } else {
                throw new Error('Error uploading image: Invalid status or undefined file_url');
            }
        } catch (error) {
            Alert.alert('Upload Failed', 'Upload failed. Please try again.');
            console.error('Error uploading image:', error);
            throw error;
        }
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            const uploadedImageUri = await uploadImage();
            console.log('load images sucsses');
            if (!uploadedImageUri) throw new Error('Error uploading image or image not uploaded successfully');
            const form_answer = [
                {
                    image: uploadedImageUri,
                    docstatus: 0,
                    doctype: 'FormAnswer_POSM',
                    parentfield: 'formanswer',
                    parenttype: 'ReportScenario_POSM',
                    owner: userNameStore,
                    modified_by: userNameStore,
                },
            ];
            const data = {
                docstatus: 0,
                doctype: 'ReportScenario_' + scenarioType,
                owner: userNameStore,
                modified_by: userNameStore,
                retail: route.params.scenarioName,
                scenario: scenarioIdWithoutDoctype,
                formanswer: form_answer,
            };
            console.log(data);

            const dataPost = {
                doc: JSON.stringify(data),
                action: 'Save',
            };

            if (!apiKey || !apiSecret) throw new Error('API key or secret not available');

            const response = await axios.post(ApiConstant.POST_SAVE_DOCS, dataPost, {
                headers: CommonUtils.Auth_header(apiKey, apiSecret),
            });

            if (response.status === 200) console.log('Submit successful.');
            else throw new Error('Submit failed: Invalid status.');

            console.log('sucsses');
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Submit Failed', 'Submit failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const renderProductItem = ({ item }: any) => {
        const dataValues =
            responseData && responseData.docs && responseData.docs.length > 0 ? responseData.docs[0] : null;

        const keyParts = item.key.split('::');
        let checkDoctype = keyParts[0];
        setScenarioType(checkDoctype);
        let names = keyParts[1];
        const capturedImageUri = capturedImageUriMap[item.key] || '';
        const showDeleteButton = !!capturedImageUri;
        const commonActions = (
            <Card.Actions>
                <Button buttonColor="#1abc9c" onPress={() => handleSubmit(item.value, checkDoctype, names)}>
                    Submit
                </Button>
            </Card.Actions>
        );

        switch (checkDoctype) {
            case 'Product_SKU':
                return (
                    <Card style={styles.card}>
                        <Card.Title title={dataValues?.scenario_name} left={LeftContent} />
                        <View style={styles.cardHeader}>
                            {capturedImageUri ? (
                                <Card.Cover style={styles.image} source={{ uri: capturedImageUri }} />
                            ) : (
                                <Card.Content>
                                    <Card.Title title="No Image" />
                                </Card.Content>
                            )}
                            {showDeleteButton && (
                                <TouchableRipple onPress={() => handleDeleteImage(item.key)}>
                                    <Icon source="close" size={20} />
                                </TouchableRipple>
                            )}
                        </View>
                        <Card.Content style={styles.cardContent}>
                            <View>
                                <Text variant="titleLarge">{item.value}</Text>
                            </View>
                            <View style={styles.cardSection}>
                                <Button
                                    style={styles.takeButton}
                                    icon={'camera'}
                                    mode="contained-tonal"
                                    onPress={() => handleCheckin(item.key)}
                                >
                                    Take
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                );

            case 'Assets':
                return (
                    <Card style={styles.card}>
                        <Card.Title title={item.value} left={LeftContent} />
                        <View style={styles.cardHeader}>
                            {capturedImageUri ? (
                                <Card.Cover style={styles.image} source={{ uri: capturedImageUri }} />
                            ) : (
                                <Card.Content>
                                    <Card.Title title="No Image" />
                                </Card.Content>
                            )}
                            {showDeleteButton && (
                                <TouchableRipple onPress={() => handleDeleteImage(item.key)}>
                                    <Icon source="close" size={20} />
                                </TouchableRipple>
                            )}
                        </View>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardSection}>
                                <TextInput
                                    style={styles.countInput}
                                    value={currentName[item.key] || item.value}
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

                            <View style={styles.cardSection}>
                                <Button
                                    style={styles.takeButton}
                                    icon={'camera'}
                                    mode="contained-tonal"
                                    onPress={() => handleCheckin(item.key)}
                                >
                                    Take
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                );

            case 'POSM':
                return (
                    <Card style={styles.card}>
                        <Card.Title title={item.value} left={LeftContent} />
                        <View style={styles.cardHeader}>
                            {capturedImageUri ? (
                                <Card.Cover style={styles.image} source={{ uri: capturedImageUri }} />
                            ) : (
                                <Card.Content>
                                    <Card.Title title="No Image" />
                                </Card.Content>
                            )}
                            {showDeleteButton && (
                                <TouchableRipple onPress={() => handleDeleteImage(item.key)}>
                                    <Icon source="close" size={20} />
                                </TouchableRipple>
                            )}
                        </View>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardSection}>
                                <TextInput
                                    style={styles.countInput}
                                    value={currentName[item.key] || item.value}
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

                            <View style={styles.cardSection}>
                                <Button
                                    style={styles.takeButton}
                                    icon={'camera'}
                                    mode="contained-tonal"
                                    onPress={() => handleCheckin(item.key)}
                                >
                                    Take
                                </Button>
                            </View>
                        </Card.Content>
                        {/* {commonActions} */}
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <LinearGradient colors={['#3498db', '#1abc9c']} style={styles.linearGradient}>
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
                <Portal>
                    <Modal visible={isModalVisible} onDismiss={hideModal}>
                        {renderModalContent()}
                    </Modal>
                </Portal>
                <View style={styles.saveButtonContainer}>
                    <Button style={styles.saveButton} icon={'content-save'} mode="contained-tonal" onPress={handleSave}>
                        Save
                    </Button>
                </View>
            </View>
        </LinearGradient>
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
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 60,
        height: 60,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countInput: {
        width: '80%',
        height: 50,
    },
    takeButton: {
        width: '80%',
        height: 40,
    },
});

export default Product;
