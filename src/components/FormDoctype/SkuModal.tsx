import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    PermissionsAndroid,
    Keyboard,
    Alert,
} from 'react-native';
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import { CommonUtils } from '../../utils';
import { ApiConstant, AppConstant } from '../../const';
import { openImagePickerCamera } from '../../utils/camera.utils';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMMKVString } from 'react-native-mmkv';

const FormSkuModal = ({
    visible,
    onClose,
    onSubmit,
    productId,
    scenarioName,
    product_name,
    nameToModal,
    scenario_code,
    onSaveImage,
}: any) => {
    const [productName, setProductName] = useState('');
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [userNameStore] = useMMKVString(AppConstant.userNameStore);
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);
    const [loading, setLoading] = useState(false);
    const [nameImg, setNameImg] = useState('');
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
            setNameImg(res.message.name);

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
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const uploadedImageUri = await uploadImage();
            if (!uploadedImageUri) throw new Error('Error uploading image or image not uploaded successfully');

            const data = {
                docstatus: 0,
                doctype: 'ReportScenario_SKU',
                localname: 'new-reportscenario_sku-wlrliuikqu',
                modified_by: userNameStore,
                photos_display: uploadedImageUri,
                owner: userNameStore,
                product_name: product_name,
                retail_code: scenarioName,
                scenario_code: scenario_code,
            };
            console.log('dataPost', data);

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

            onSubmit(productName);
            onClose();
            console.log('sucsses');
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Submit Failed', 'Submit failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            const uploadedImageUri = await uploadImage();
            console.log(uploadedImageUri);
            // Truyền uploadedImageUri về màn hình Product
            onSaveImage(uploadedImageUri);
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Save Failed', 'Save failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
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
            setCapturedImageUri(uri);
            Keyboard.dismiss();
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

    const handleDeleteImage = () => {
        setCapturedImageUri('');
    };
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        {loading && (
                            <ActivityIndicator
                                animating={true}
                                color={'#FFF'}
                                size={'large'}
                                style={styles.activiticator}
                            />
                        )}
                        <Card style={{ backgroundColor: 'white', borderRadius: 0, shadowColor: 'white' }}>
                            <Card.Title title="SKU!" />
                            {capturedImageUri ? (
                                <Card.Cover style={styles.image} source={{ uri: capturedImageUri }} />
                            ) : (
                                <Card.Content>
                                    <Card.Title title="No Image" />
                                </Card.Content>
                            )}
                            <Card.Actions>
                                <Button
                                    icon={'camera'}
                                    mode="contained-tonal"
                                    onPress={handleCheckin}
                                    disabled={!!capturedImageUri}
                                >
                                    Take a picture
                                </Button>
                                {capturedImageUri && (
                                    <Button mode="contained-tonal" onPress={handleDeleteImage}>
                                        Delete
                                    </Button>
                                )}
                            </Card.Actions>

                            <Card.Actions>
                                <Button mode="contained-tonal" onPress={onClose}>
                                    Cancel
                                </Button>

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit}
                                    style={[styles.button, !capturedImageUri && styles.disabledButton]}
                                    disabled={!capturedImageUri || loading}
                                >
                                    Submit
                                </Button>
                                <Button mode="contained" onPress={handleSave}>
                                    save
                                </Button>
                            </Card.Actions>
                        </Card>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#1abc9c',
    },
    disabledButton: {
        opacity: 0.5,
    },
    image: {
        marginHorizontal: 45,
    },
    activiticator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 999,
        alignSelf: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});
export default FormSkuModal;
