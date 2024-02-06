import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CommonUtils } from '../../../utils';
import { ApiConstant, AppConstant } from '../../../const';
import axios from 'axios';
import { UserData } from '../../../modal';
import { ActivityIndicator, Avatar, Button, Icon, IconButton, Modal, TextInput, Title } from 'react-native-paper';
import { ImageAssets } from '../../../assets';
import { openImagePicker, openImagePickerCamera } from '../../../utils/camera.utils';
import { styles } from './information.style';
import RNFetchBlob from 'rn-fetch-blob';

const Information = ({ navigation }: any) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);
    const [birthDateInput, setBirthDateInput] = useState<string>('');
    const [isServerImage, setIsServerImage] = useState(true);

    const fetchUserData = async () => {
        let success = false;

        while (!success) {
            try {
                const apiKey = await CommonUtils.storage.getString(AppConstant.Api_key);
                const apiSecret = await CommonUtils.storage.getString(AppConstant.Api_secret);

                if (apiKey && apiSecret) {
                    const response = await axios.get(ApiConstant.GET_USER_PROFILE, {
                        headers: {
                            Authorization: CommonUtils.Auth_header(apiKey, apiSecret).Authorization,
                        },
                    });
                    if (response.status === 200) {
                        setUserData(response.data.result as UserData);
                        console.log(userData);

                        success = true;
                    } else {
                        console.error('Failed to fetch user profile:', response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }

        setLoading(false);
    };
    const handleInputChange = (field: string, value: string) => {
        if (field === 'birth_date') {
            setBirthDateInput(value);
        } else {
            setUserData((prevData: UserData | null) => ({
                ...(prevData as UserData),
                [field]: value,
            }));
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);
    const handleChooseImage = () => {
        setModalVisible(true);
    };

    const handlePicker = async (pickerType: 'camera' | 'gallery') => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted) {
                if (pickerType === 'camera') {
                    openCamera();
                } else {
                    openImage();
                }
            } else {
                requestCameraPermission();
            }
        } catch (error) {
            console.error('Error checking or requesting camera permission:', error);
        }
        setModalVisible(false);
    };

    const openCamera = () => {
        openImagePickerCamera((uri: any) => {
            setUserData((prevData: UserData | null) => ({
                ...(prevData as UserData),
                avatar: uri,
            }));
            console.log('Image captured:', uri);
            setIsServerImage(false); // Người dùng đã chọn ảnh mới, không phải từ server
            setModalVisible(false);
        });
    };

    const openImage = () => {
        openImagePicker((uri: any) => {
            setUserData((prevData: UserData | null) => ({
                ...(prevData as UserData),
                avatar: uri,
            }));
            console.log('Image picked from gallery:', uri);
            setIsServerImage(false); // Người dùng đã chọn ảnh mới, không phải từ server
            setModalVisible(false);
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
    const uploadImages = async (img: any) => {
        if (!img) {
            console.error('No image provided for upload.');
            return null;
        }

        const maxTimeInSeconds = 5;
        const startTime = Date.now();

        while (Date.now() - startTime < maxTimeInSeconds * 1000) {
            try {
                setLoading(true);
                const capturedImageUri = img;
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
                formData.append('doctype', 'User');
                formData.append('fieldname', 'user_image');
                formData.append('docname', userData?.email);

                if (!apiKey || !apiSecret) {
                    throw new Error('API key or secret not available');
                }

                const response = await axios.post(ApiConstant.UPDATE_FILE_IMAGE, formData, {
                    headers: CommonUtils.Header_Image(apiKey, apiSecret),
                });

                if (response.status === 200 && response.data.message.file_url) {
                    console.log('Upload successful');
                    return response.data.message.file_url;
                } else {
                    console.error('Error uploading image: Invalid status or undefined file_url');
                }
            } catch (uploadError: any) {
                console.error('Error during image upload attempt:', uploadError);
            } finally {
                setLoading(false);
            }
        }
        Alert.alert('Lỗi hệ thống vui lòng thử lại!');
        console.error('Max upload time reached. Image upload failed.');
        return null;
    };
    const fetchImageAsBase64 = async (imageUrl: any) => {
        try {
            const response = await RNFetchBlob.fetch('GET', imageUrl);
            const base64Data = response.base64();
            return base64Data;
        } catch (error: any) {
            console.error('Error fetching image as base64:', error.message);
            throw error;
        }
    };

    const convertLocalFileToBase64 = async (filePath: any) => {
        try {
            const base64Data = await RNFetchBlob.fs.readFile(filePath, 'base64');
            return base64Data;
        } catch (error: any) {
            console.error('Error converting local file to base64:', error.message);
            throw error;
        }
    };
    const handleSave = async () => {
        try {
            let uploadedImageUrls = userData?.user_image;
            if (!isServerImage) {
                // Check if the URL is a local file path
                if (userData?.avatar && userData.avatar.startsWith('file://')) {
                    const base64Image = await convertLocalFileToBase64(userData.avatar);
                    uploadedImageUrls = base64Image;
                } else {
                    // Fetch the image as a base64 string
                    const base64Image = await fetchImageAsBase64(userData?.avatar);
                    uploadedImageUrls = base64Image;
                }
            }
            const data = {
                // birth_date: birthDateInput,
                birth_date: '',
                full_name: userData?.full_name,
                user_image: uploadedImageUrls,
            };
            const dataPost = {
                doc: JSON.stringify(data),
                action: 'Save',
            };
            if (!apiKey || !apiSecret) throw new Error('API key or secret not available');
            const response = await axios.put(ApiConstant.PUT_USER_PROFILE, data, {
                headers: CommonUtils.Auth_header(apiKey, apiSecret),
            });

            if (response.status === 200) {
                console.log('saved Information successful', response.data);
                Alert.alert('thanh cong');
            } else {
                console.error('saved Information faild');
            }
        } catch (error: any) {
            console.error('Error in handleSave:', error.message);
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
                <Text style={styles.headerLabel}>Thông tin cá nhân</Text>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>
            {loading ? (
                <ActivityIndicator style={styles.loader} animating={true} color={'#000'} size="large" />
            ) : (
                <View style={styles.contentContainer}>
                    <Avatar.Image
                        size={140}
                        source={
                            userData?.avatar
                                ? { uri: userData?.avatar }
                                : userData?.user_image
                                ? { uri: userData?.user_image }
                                : ImageAssets.UserDefault
                        }
                    />
                    <Text style={{ marginVertical: 8, color: '#12a364' }} onPress={handleChooseImage}>
                        Thay ảnh
                    </Text>
                    <Title style={{ fontWeight: '700', fontSize: 26, marginVertical: 4, color: '#000' }}>
                        {userData?.full_name}
                    </Title>
                    <Text style={{ marginVertical: 4, color: '#000' }}>{userData?.username}</Text>
                    <Text style={{ fontSize: 16, marginVertical: 4, color: '#000' }}>{userData?.email}</Text>
                    <View style={styles.containerInput}>
                        <TextInput
                            textColor="#000"
                            style={styles.countInput}
                            label={'Tên nhân viên:'}
                            value={userData?.full_name}
                            onChangeText={(text) => handleInputChange('full_name', text)}
                        />
                        <TextInput
                            textColor="#000"
                            style={styles.countInput}
                            label={'Email:'}
                            value={userData?.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />
                        <TextInput
                            textColor="#000"
                            style={styles.countInput}
                            label={'Ngày sinh:'}
                            placeholder="yyyy-mm-dd"
                            value={userData?.birth_date}
                            onChangeText={(text) => handleInputChange('birth_date', text)}
                        />
                    </View>
                    <View style={styles.saveButtonContainer}>
                        <Button
                            mode="elevated"
                            style={styles.takeButton}
                            textColor={'#FFF'}
                            icon={'content-save'}
                            onPress={() => handleSave()}
                        >
                            Lưu
                        </Button>
                    </View>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                        contentContainerStyle={styles.modalContent}
                    >
                        <View>
                            <Text>Thay ảnh</Text>
                            <View style={styles.line} />
                            <TouchableOpacity onPress={() => handlePicker('camera')} style={styles.row}>
                                <Icon source={'camera-outline'} size={24} />
                                <Text style={{ fontSize: 18, color: '#000', marginLeft: 6 }}>Chụp ảnh</Text>
                            </TouchableOpacity>
                            <View style={styles.line} />
                            <TouchableOpacity onPress={() => handlePicker('gallery')} style={styles.row}>
                                <Icon source={'image-multiple-outline'} size={24} />
                                <Text style={{ fontSize: 18, color: '#000', marginLeft: 6 }}>Chọn ảnh từ thư viện</Text>
                            </TouchableOpacity>
                            <View style={styles.line} />
                            <Text
                                style={{ color: '#000', fontWeight: '700', fontSize: 18 }}
                                onPress={() => setModalVisible(false)}
                            >
                                Bỏ qua
                            </Text>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
};

export default Information;
