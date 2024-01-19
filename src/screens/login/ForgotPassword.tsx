import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, KeyboardEvent } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { ScreenConstant } from '../../const';

const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const handleForgotPassword = () => {
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
            </View>
        );
    };
    const _renderLabel = () => {
        return <Text style={styles.headerLabel}>Quên mật khẩu</Text>;
    };
    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>

            {_renderLabel()}
            <Text
                onPress={() => {
                    navigation.navigate(ScreenConstant.ORGANIZER);
                }}
                style={styles.textBold}
            >
                Nhập email đăng ký với hệ thống để xác thực
            </Text>
            <View style={styles.container}>
                <TextInput
                    mode="outlined"
                    label="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleForgotPassword} style={styles.button}>
                    Xác thực
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f6f8',
    },
    headerContainer: {
        flex: 1,
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
        marginTop: 16,
        textAlign: 'center',
        color: '#000',
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
        width: '60%',
        top: '10%',
    },
    versionText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    headerLabel: {
        marginTop: 50,
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
        paddingHorizontal: 16,
    },
    textBold: {
        color: 'gray',
        paddingHorizontal: 16,
        marginTop: 8,
    },
});

export default ForgotPasswordScreen;
