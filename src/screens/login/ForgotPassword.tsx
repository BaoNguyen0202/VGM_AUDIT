import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, KeyboardEvent } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { ScreenConstant } from '../../const';
import LinearGradient from 'react-native-linear-gradient';
import { ImageAssets } from '../../assets';

const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const handleForgotPassword = () => {
        // Thực hiện xác nhận email và gửi yêu cầu quên mật khẩu
        // Sau khi yêu cầu quên mật khẩu được gửi đi thành công, bạn có thể hiển thị thông báo hoặc điều hướng người dùng đến một màn hình khác
        console.log('Yêu cầu quên mật khẩu cho email:', email);
    };
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

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
                <TextInput label="Email" value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
                <Button mode="contained" onPress={handleForgotPassword} style={styles.button}>
                    Forgot password
                </Button>
                <Text style={styles.text}>
                    Remembered password?{' '}
                    <Text onPress={() => navigation.navigate(ScreenConstant.LOG_IN)} style={styles.link}>
                        Log In
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

export default ForgotPasswordScreen;
