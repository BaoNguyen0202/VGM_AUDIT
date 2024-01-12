import React from 'react';
import { View } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { ScreenConstant, AppConstant } from '../const';
import { Button } from 'react-native-paper';

const DetailScreen = ({ navigation }: any) => {
    // Lấy các hàm set của MMKV
    const setUserNameStore = useMMKVString(AppConstant.userNameStore)[1];
    const setPasswordStore = useMMKVString(AppConstant.passwordStore)[1];

    const handleLogout = () => {
        // Xóa thông tin người dùng và mật khẩu
        setUserNameStore('');
        setPasswordStore('');

        // Chuyển hướng đến màn hình đăng nhập
        navigation.navigate(ScreenConstant.LOG_IN);
    };

    return (
        <View>
            <Button mode="contained-tonal" onPress={handleLogout}>
                Logout
            </Button>
        </View>
    );
};

export default DetailScreen;
