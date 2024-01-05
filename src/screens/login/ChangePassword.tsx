import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, KeyboardEvent } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { ScreenConstant } from '../../const';
import LinearGradient from 'react-native-linear-gradient';
import { ImageAssets } from '../../assets';

const ChangePasswordScreen = ({ navigation }: any) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const handleChangePassword = () => {
        // Thực hiện xác nhận mật khẩu hiện tại và các kiểm tra thay đổi mật khẩu khác ở đây
        if (newPassword === confirmNewPassword) {
            // Gọi API thay đổi mật khẩu hoặc thực hiện các xử lý thay đổi mật khẩu
            // Sau khi thay đổi mật khẩu thành công, bạn có thể điều hướng người dùng đến màn hình đăng nhập
            navigation.navigate(ScreenConstant.LOG_IN);
        } else {
            // Hiển thị thông báo lỗi khi mật khẩu mới không khớp
            console.error('Lỗi: Mật khẩu mới không khớp');
        }
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
                <TextInput
                    label="Current password"
                    value={currentPassword}
                    onChangeText={(text) => setCurrentPassword(text)}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    label="New password"
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    label="Confirm password"
                    value={confirmNewPassword}
                    onChangeText={(text) => setConfirmNewPassword(text)}
                    secureTextEntry
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
                    Change Password
                </Button>
                <Text style={styles.text}>
                    Go back{' '}
                    <Text onPress={() => navigation.goBack()} style={styles.link}>
                        Previous Screen
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

export default ChangePasswordScreen;
