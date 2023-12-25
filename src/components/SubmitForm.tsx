import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, TouchableWithoutFeedback, PermissionsAndroid, Keyboard } from 'react-native';
import { Button, Card } from 'react-native-paper';
import axios from 'axios';
import { CommonUtils } from '../utils';
import { ApiConstant, AppConstant } from '../const';
import { useMMKVString } from 'react-native-mmkv';
import { openImagePickerCamera } from '../utils/camera.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckboxInputComponent, NumberInputComponent, TextInputComponent } from './InputCom';

interface FormAnswer {
    docstatus: number;
    doctype: string;
    parentfield: string;
    parenttype: string;
    question_name: string;
    question_value: any;
}

const SubmitFormModal = ({ visible, onClose, onSubmit, productId, scenarioName, formQuestion }: any) => {
    const [productName, setProductName] = useState('');
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [userNameStore] = useMMKVString(AppConstant.userNameStore);
    const [formAnswers, setFormAnswers] = useState<FormAnswer[]>([]);
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);

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
            formData.append('is_private', 0);
            formData.append('folder', 'Home');
            formData.append('doctype', 'ReportScenario');
            formData.append('fieldname', 'images');
            formData.append('docname', 'new-reportscenario-wehorxqyrq');

            if (!apiKey || !apiSecret) throw new Error('API key or secret not available');

            const response = await axios.post(ApiConstant.UPDATE_FILE_IMAGE, formData, {
                headers: CommonUtils.Header_Image(apiKey, apiSecret),
            });

            const res = response.data;

            if (response.status === 200 && res && res.message && res.message.file_url) {
                await AsyncStorage.setItem('uploadedImageUri', res.message.file_url);
                return res.message.file_url;
            } else {
                throw new Error('Error uploading image: Invalid status or undefined file_url');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            const uploadedImageUri = await uploadImage();

            if (!uploadedImageUri) throw new Error('Error uploading image or image not uploaded successfully');

            const data = {
                docstatus: 0,
                doctype: 'ReportScenario',
                user: userNameStore,
                scenario: scenarioName,
                product: productId,
                images: uploadedImageUri,
                form_answer: formAnswers,
            };

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
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleCheckin = async () => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

            if (granted) openCamera();
            else requestCameraPermission();
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

    const handleInputChange = (question_text: string, value: any) => {
        const existingAnswerIndex = formAnswers.findIndex((answer) => answer.question_name === question_text);

        if (existingAnswerIndex !== -1) {
            setFormAnswers((prevAnswers) => {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex].question_value = value;
                return updatedAnswers;
            });
        } else {
            const currentAnswer = {
                docstatus: 0,
                doctype: 'FormAnsewer',
                owner: userNameStore,
                parentfield: 'form_answer',
                parenttype: 'ReportScenario',
                question_name: question_text,
                question_value: value,
            };

            setFormAnswers((prevAnswers) => [...prevAnswers, currentAnswer]);
        }
    };

    const renderFormQuestions = () => {
        return formQuestion.map((question: any) => {
            switch (question.question_type) {
                case 'Text':
                    return (
                        <TextInputComponent
                            key={question.question_text}
                            label={question.question_text}
                            onChange={(value) => handleInputChange(question.question_text, value)}
                        />
                    );
                case 'Number':
                    return (
                        <NumberInputComponent
                            key={question.question_text}
                            label={question.question_text}
                            onChange={(value) => handleInputChange(question.question_text, value)}
                        />
                    );
                case 'YesNo':
                    return (
                        <CheckboxInputComponent
                            key={question.question_text}
                            label={question.question_text}
                            onChange={(value) => handleInputChange(question.question_text, value)}
                        />
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        <Card>
                            {renderFormQuestions()}
                            {capturedImageUri ? (
                                <Card.Cover source={{ uri: capturedImageUri }} />
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
                                    disabled={!capturedImageUri}
                                >
                                    Submit
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
        padding: 20,
        width: '80%',
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#1abc9c',
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default SubmitFormModal;
