import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Platform, Image, Keyboard, KeyboardEvent } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { ApiConstant, AppConstant, ScreenConstant } from '../../const';
import axios from 'axios';
import { useMMKVString } from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';
import { CommonUtils } from '../../utils';
import { InitLogo } from '../../assets/images';
import { ImageAssets } from '../../assets';

const LoginScreen = ({ navigation }: any) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [fcmToken] = useMMKVString('FCM_TOKEN');
    const [userNameStore, setUserNameStore] = useMMKVString(AppConstant.userNameStore);
    const [passwordStore, setPasswordStore] = useMMKVString(AppConstant.passwordStore);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const checkAutoLogin = async () => {
            try {
                if (userNameStore && passwordStore) {
                    await handleAutoLogin(userNameStore, passwordStore);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
            }
        };

        checkAutoLogin();
    }, [userNameStore, passwordStore]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

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
        try {
            const response = await fetch(ApiConstant.POST_USER_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usr: userName,
                    pwd: password,
                    device_name: Platform.OS,
                    device_id: fcmToken ?? '12345',
                }),
            });

            if (response.status === 200) {
                const result = await response.json();
                CommonUtils.storage.set(AppConstant.Api_key, result.result.key_details.api_key);
                CommonUtils.storage.set(AppConstant.Api_secret, result.result.key_details.api_secret);
                setUserNameStore(userName);
                setPasswordStore(password);

                await CommonUtils.dismissKeyboard(() => {
                    navigation.navigate(ScreenConstant.ROOT);
                });
            } else {
                console.error('Login failed:', await response.json());
                Alert.alert('Login Failed', 'Invalid username or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('Error', 'An error occurred during login. Please try again later.');
        }
    };

    const handleKeyboardDidShow = (event: KeyboardEvent) => {
        setKeyboardVisible(true);
    };

    const handleKeyboardDidHide = () => {
        setKeyboardVisible(false);
    };

    return (
        <LinearGradient colors={['#3498db', '#1abc9c']} style={styles.linearGradient}>
            <Image source={ImageAssets.InitLogo} style={styles.logo} />
            <View style={styles.container}>
                <TextInput label="Name" value={userName} onChangeText={setUserName} style={styles.input} />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    style={styles.input}
                    right={
                        <TextInput.Icon
                            icon={secureTextEntry ? 'eye-off' : 'eye'}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        />
                    }
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
            {!isKeyboardVisible && <Text style={styles.versionText}>VGM Version 0.0.1</Text>}
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
        backgroundColor: '#34cadb',
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
    logo: {
        resizeMode: 'contain',
        alignSelf: 'center',
        width: '70%',
        top: '10%',
    },
    versionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
});

export default LoginScreen;
