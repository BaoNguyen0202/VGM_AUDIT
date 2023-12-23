// ProfileScreen.tsx

import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { UserData } from '../modal';
import { CommonUtils } from '../utils';
import { ApiConstant, AppConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = () => {
    const [userData, setUserData] = useState<UserData | null>(null);

    const fetchUserData = async () => {
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
                } else {
                    console.error('Failed to fetch user profile:', response.data);
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <LinearGradient colors={['#1abc9c', '#3498db']} style={styles.linearGradient}>
            <View style={styles.container}>
                {userData && (
                    <Card>
                        <Card.Content style={styles.cardContent}>
                            <Avatar.Text size={100} label={userData.full_name[0]} />
                            <View>
                                <Text style={styles.text}>{`Full Name: ${userData.full_name}`}</Text>
                                <Text style={styles.text}>{`Email: ${userData.email}`}</Text>
                                <Text style={styles.text}>{`First Name: ${userData.first_name}`}</Text>
                                <Text style={styles.text}>{`Username: ${userData.username}`}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        marginBottom: 10,
    },
    linearGradient: {
        flex: 1,
    },
    cardContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;
