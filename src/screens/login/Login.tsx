import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Platform, Image, Keyboard, KeyboardEvent, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, IconButton } from 'react-native-paper';
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
        let success = false;

        while (!success) {
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
                    success = true;

                    await CommonUtils.dismissKeyboard(() => {
                        navigation.navigate(ScreenConstant.ROOT);
                    });
                } else {
                    console.error('Auto Login failed:', response.data);
                }
            } catch (error) {
                console.error('Auto Login failed:', error);
            }
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
    const _renderLabel = () => {
        return <Text style={styles.headerLabel}>Đăng nhập</Text>;
    };
    return (
        <View style={styles.container}>
            {_renderLabel()}
            <View style={styles.container}>
                <TextInput
                    mode="outlined"
                    label="Tên đăng nhập"
                    value={userName}
                    onChangeText={setUserName}
                    style={styles.input}
                />
                <TextInput
                    label="Mật khẩu"
                    mode="outlined"
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
                <Text style={styles.text}>
                    <Text onPress={() => navigation.navigate(ScreenConstant.FORGOTPASSWORD)} style={styles.link}>
                        Quên mật khẩu
                    </Text>
                </Text>
                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Đăng nhập
                </Button>
                <Text
                    onPress={() => {
                        navigation.navigate(ScreenConstant.ORGANIZER);
                    }}
                    style={styles.textBold}
                >
                    Đăng nhập với tổ chức khác
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        padding: 8,
    },
    headerContainer: {
        marginTop: 46,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    headerLabel: {
        marginTop: 60,
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },
    input: {
        marginVertical: 16,
        backgroundColor: '#FFF',
    },
    button: {
        marginTop: 8,
        backgroundColor: '#881111',
    },
    text: {
        textAlign: 'right',
        color: '#000',
        marginVertical: 8,
    },
    link: {
        color: '#881111',
    },
    linearGradient: {
        flex: 1,
    },
    logo: {
        resizeMode: 'contain',
        alignSelf: 'center',
        width: '60%',
        top: '10%',
    },
    versionText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    textBold: {
        textAlign: 'center',
        marginVertical: 16,
        color: 'gray',
    },
});

export default LoginScreen;
