import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Icon, IconButton, Text } from 'react-native-paper';
import { UserData } from '../../modal';
import { CommonUtils } from '../../utils';
import { ApiConstant, AppConstant, ScreenConstant } from '../../const';
import axios from 'axios';
import { useMMKVString } from 'react-native-mmkv';
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
                <View>
                    <Button
                        onPress={() => {
                            handleLogout();
                        }}
                    >
                        Logout
                    </Button>
                </View>
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

            <View>{renderListContent()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    containView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
    },
    containLabel: {
        marginLeft: 12,
    },
    containSecondView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    textPrimary: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    textSecondary: {
        fontSize: 14,
        color: 'gray',
        fontWeight: '400',
    },
    icon: {
        backgroundColor: 'transparent',
        marginRight: 4,
    },
    retryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryText: {
        fontSize: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
});

export default ProfileScreen;
