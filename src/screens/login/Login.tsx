import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Platform, Image } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConstant, AppConstant, ScreenConstant } from '../../const';
import axios from 'axios';
import { POST_USER_LOGIN } from '../../const/api.const';
import { useMMKVString } from 'react-native-mmkv';
import { ILoginResponse, KeyAbleProps } from '../../modal';
import LinearGradient from 'react-native-linear-gradient';
import { ImageAssets } from '../../assets';
import { AppService } from '../../services';
import { CommonUtils } from '../../utils';

const LoginScreen = ({ navigation }: any) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [fcmToken] = useMMKVString('FCM_TOKEN');
    const [userNameStore, setUserNameStore] = useMMKVString(AppConstant.userNameStore);
    const [passwordStore, setPasswordStore] = useMMKVString(AppConstant.passwordStore);

    useEffect(() => {
        const checkAutoLogin = async () => {
            try {
                // Kiểm tra xem đã có thông tin đăng nhập trong store hay không
                if (userNameStore && passwordStore) {
                    await handleAutoLogin(userNameStore, passwordStore);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
            }
        };

        checkAutoLogin();
    }, [userNameStore, passwordStore]); // Dependency array bao gồm userNameStore và passwordStore

    const handleAutoLogin = async (autoUserName: string, autoPassword: string) => {
        try {
            const response = await axios.post(ApiConstant.POST_USER_LOGIN, {
                usr: autoUserName,
                pwd: autoPassword,
                device_name: Platform.OS,
                device_id: '12345',
            });

            if (response.status === ApiConstant.STT_OK) {
                const result = response.data.result;
                CommonUtils.storage.set(AppConstant.Api_key, result.key_details.api_key);
                CommonUtils.storage.set(AppConstant.Api_secret, result.key_details.api_secret);

                await CommonUtils.dismissKeyboard(() => {
                    navigation.navigate(ScreenConstant.ROOT);
                });
            } else {
                console.error('Auto Login failed:', response.data);
            }
        } catch (error) {
            console.error('Auto Login failed:', error);
        }
    };
    const handleLogin = async () => {
        const response = await axios.post(ApiConstant.POST_USER_LOGIN, {
            usr: userName,
            pwd: password,
            device_name: Platform.OS,
            device_id: fcmToken ?? '',
        });
        if (response.status === ApiConstant.STT_OK) {
            const result = response.data.result;

            CommonUtils.storage.set(AppConstant.Api_key, result.key_details.api_key);
            CommonUtils.storage.set(AppConstant.Api_secret, result.key_details.api_secret);
            setUserNameStore(userName);
            setPasswordStore(password);
            console.log('api_key:', result.key_details.api_key);
            console.log('api_secret:', result.key_details.api_secret);
            await CommonUtils.dismissKeyboard(() => {
                navigation.navigate(ScreenConstant.ROOT);
            });
            // setUserName('');
            // setPassword('');
        } else {
            console.error('Login failed:', response.data);
        }
    };

    return (
        <LinearGradient colors={['#1abc9c', '#3498db']} style={styles.linearGradient}>
            <View style={styles.container}>
                <TextInput
                    label="Name"
                    value={userName}
                    onChangeText={(text) => setUserName(text)}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Log In
                </Button>
                <Text style={styles.text}>
                    No account yet?{' '}
                    <Text onPress={() => navigation.navigate(ScreenConstant.FORGOTPASSWORD)} style={styles.link}>
                        Forgot Password
                    </Text>
                </Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        backgroundColor: '#1abc9c',
    },
    text: {
        marginTop: 16,
        textAlign: 'center',
        color: 'white',
    },
    link: {
        color: 'blue',
    },
    linearGradient: {
        flex: 1,
    },
});

export default LoginScreen;
