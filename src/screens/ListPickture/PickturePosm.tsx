import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, PermissionsAndroid, Image, View, Alert, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Button, Icon, IconButton, Surface, Text } from 'react-native-paper';
import { openImagePickerCamera } from '../../utils/camera.utils';
import { CommonUtils } from '../../utils';
import { ApiConstant, AppConstant, ScreenConstant } from '../../const';
import axios from 'axios';

const PickturePosm = ({ navigation, route }: any) => {
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [showTextSurface, setShowTextSurface] = useState(true);
    const [loading, setLoading] = useState(false);
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);

    const handleCheckin = async () => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            granted ? openCamera() : requestCameraPermission();
        } catch (error) {
            console.error('Error checking or requesting camera permission:', error);
        }
    };

    const openCamera = () => {
        openImagePickerCamera((uri: any) => {
            setCapturedImages((prevImages) => [...prevImages, uri]);
            setShowTextSurface(false);
        });
    };

    const requestCameraPermission = async () => {
        try {
            const requestResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

            if (requestResult === PermissionsAndroid.RESULTS.GRANTED) openCamera();
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
                formData.append('doctype', 'ReportScenario_POSM');
                formData.append('fieldname', 'image');
                formData.append('docname', CommonUtils.renderRandomDocName('new-reportscenario_asset'));

                if (!apiKey || !apiSecret) throw new Error('API key or secret not available');

                try {
                    console.log(JSON.stringify(formData));
                    const response = await axios.post(ApiConstant.UPDATE_FILE_IMAGE, formData, {
                        headers: CommonUtils.Header_Image(apiKey, apiSecret),
                    });

                    if (response.status === 200) {
                        console.log('Upload successful');
                        uploadedImageUrls.push(response.data.message.file_url);
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
                <Text style={styles.headerLabel}>Chụp ảnh</Text>
            </View>
        );
    };
    const handleSave = async () => {
        const uploadedImageUrls = await uploadImages(capturedImages);
        const selectedProduct = route.params?.selectedProduct || {};
        const { scenarioName } = route.params;

        const updatedProduct = {
            ...selectedProduct,
            uri_image: uploadedImageUrls,
        };

        navigation.navigate(ScreenConstant.SCENARIOPOSM, { updatedProduct, scenarioName });
    };
    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>

            {loading ? (
                <ActivityIndicator style={styles.loader} animating={true} color={'#000'} size="large" />
            ) : (
                <View style={styles.cardImage}>
                    <ScrollView horizontal contentContainerStyle={styles.scrollViewContainer}>
                        <Surface style={styles.surface} elevation={4}>
                            <TouchableOpacity onPress={() => handleCheckin()}>
                                <Icon source={'camera-outline'} size={24} />
                            </TouchableOpacity>
                        </Surface>
                        {showTextSurface && (
                            <Surface style={styles.surface} elevation={4}>
                                <Text>images</Text>
                            </Surface>
                        )}
                        {capturedImages.map((uri, index) => (
                            <Surface key={index} style={styles.surface} elevation={4}>
                                <Image source={{ uri }} style={styles.image} />
                            </Surface>
                        ))}
                    </ScrollView>
                </View>
            )}
            <Button
                style={{ position: 'absolute', bottom: 20, width: '100%', backgroundColor: '#881111' }}
                textColor="#FFF"
                onPress={() => handleSave()}
            >
                Hoàn thành
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    scrollViewContainer: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    surface: {
        height: 120,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: '#FFF',
        borderRadius: 20,
        backgroundColor: '#f4f6f8',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        margin: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
    },
});

export default PickturePosm;
