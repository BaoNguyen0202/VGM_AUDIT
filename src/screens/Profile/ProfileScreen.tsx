import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Icon, IconButton, Text } from 'react-native-paper';
import { UserData } from '../../modal';
import { CommonUtils } from '../../utils';
import { ApiConstant, AppConstant, ScreenConstant } from '../../const';
import axios from 'axios';
import { useMMKVString } from 'react-native-mmkv';
import { styles } from './profile.style';
const ProfileScreen = ({ navigation }: any) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userNameStore, setUserNameStore] = useMMKVString(AppConstant.userNameStore);
    const [passwordStore, setPasswordStore] = useMMKVString(AppConstant.passwordStore);
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
    const handleLogout = () => {
        setUserNameStore('');
        setPasswordStore('');
        navigation.navigate(ScreenConstant.LOG_IN);
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
    const renderListContent = () => {
        return (
            <Card style={styles.card} mode="contained">
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate(ScreenConstant.INFORMATION)}>
                    <Icon source={'account-outline'} size={24} color="#12a364" />
                    <Text style={{ paddingHorizontal: 8 }}>Thông tin tài khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <Icon source={'cog-outline'} size={24} color="#2cb8db" />
                    <Text style={{ paddingHorizontal: 8 }}>Cài đặt tài khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={() => handleLogout()}>
                    <Icon source={'exit-to-app'} size={24} color="#e03d3d" />
                    <Text style={{ paddingHorizontal: 8 }}>Đăng xuất</Text>
                </TouchableOpacity>
            </Card>
        );
    };
    useEffect(() => {
        fetchUserData();
    }, []);
    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>
            {userData && (
                <View style={styles.containView}>
                    <Avatar.Image
                        size={48}
                        source={{
                            uri: 'https://picture.vn/wp-content/uploads/2015/12/da-lat.png',
                        }}
                    />
                    <View style={styles.containLabel}>
                        <Text style={styles.textPrimary}>{userData.full_name}</Text>
                        <View style={styles.containSecondView}>
                            <Icon size={16} source="account-outline" />
                            <Text style={styles.textSecondary}> {userData.email} </Text>
                            <Text style={styles.textSecondary}> NV-199 </Text>
                        </View>
                    </View>
                </View>
            )}

            <View style={{ margin: 24 }}>{renderListContent()}</View>
        </View>
    );
};

export default ProfileScreen;
