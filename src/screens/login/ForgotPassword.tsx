import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { ScreenConstant } from '../../const';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        // Thực hiện xác nhận email và gửi yêu cầu quên mật khẩu
        // Sau khi yêu cầu quên mật khẩu được gửi đi thành công, bạn có thể hiển thị thông báo hoặc điều hướng người dùng đến một màn hình khác
        console.log('Yêu cầu quên mật khẩu cho email:', email);
    };

    return (
        <LinearGradient colors={['#1abc9c', '#3498db']} style={styles.linearGradient}>
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

export default ForgotPasswordScreen;
