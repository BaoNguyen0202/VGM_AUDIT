// ProfileScreen.tsx

import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native'; // Thêm ScrollView
import { Avatar, Button, Card, Text, TextInput, Title } from 'react-native-paper';
import { UserData } from '../modal';
import { CommonUtils } from '../utils';
import { ApiConstant, AppConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions } from 'react-native';

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

const ProfileScreen = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false); // Thêm trạng thái isEditing

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
    const handleEditPress = () => {
        setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    };
    const handleSavePress = async () => {
        try {
            // Thực hiện logic lưu dữ liệu (ví dụ: gửi yêu cầu API để lưu dữ liệu)
            // ...

            setIsEditing(false); // Chuyển trạng thái về không chỉnh sửa sau khi lưu thành công
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <LinearGradient colors={['#1abc9c', '#3498db']} style={styles.linearGradient}>
            {userData && <Title style={styles.title}>{userData.full_name}</Title>}
            <View style={styles.container}>
                {userData && (
                    <View>
                        <Avatar.Text style={styles.avatar} size={100} label={userData.full_name[0]} />
                        {isEditing ? (
                            <View>
                                <TextInput
                                    style={styles.textInput}
                                    value={userData.full_name}
                                    onChangeText={(text) => setUserData({ ...userData, full_name: text })}
                                    placeholder="Full Name"
                                />
                                <TextInput
                                    style={styles.textInput}
                                    value={userData.email}
                                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                                    placeholder="Email"
                                />
                                <TextInput
                                    style={styles.textInput}
                                    value={userData.first_name}
                                    onChangeText={(text) => setUserData({ ...userData, first_name: text })}
                                    placeholder="First Name"
                                />
                                <TextInput
                                    style={styles.textInput}
                                    value={userData.username}
                                    onChangeText={(text) => setUserData({ ...userData, username: text })}
                                    placeholder="Username"
                                />
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.text}>{`Full Name: ${userData.full_name}`}</Text>
                                <Text style={styles.text}>{`Email: ${userData.email}`}</Text>
                                <Text style={styles.text}>{`First Name: ${userData.first_name}`}</Text>
                                <Text style={styles.text}>{`Username: ${userData.username}`}</Text>
                            </View>
                        )}
                        <Button
                            style={styles.button}
                            mode="contained-tonal"
                            buttonColor="#1abc9c"
                            onPress={isEditing ? handleSavePress : handleEditPress}
                        >
                            {isEditing ? 'Save' : 'Edit'}
                        </Button>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: '20%',
        backgroundColor: 'white',
        height: '100%',
        borderTopStartRadius: 60,
        borderTopEndRadius: 60,
    },
    text: {
        marginBottom: 10,
        paddingHorizontal: 50,
        paddingVertical: 8,
        top: 16,
    },
    linearGradient: {
        flex: 1,
    },
    cardContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        marginTop: '-15%',
        alignSelf: 'center',
    },
    textInput: {
        marginHorizontal: 32,
        marginBottom: 10,
        paddingHorizontal: 32,
        paddingVertical: 8,
        top: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 45,
    },
    button: {
        width: 200,
        alignSelf: 'center',
        marginVertical: 32,
    },
    title: {
        marginTop: '15%',
        alignSelf: 'center',
        fontSize: 25,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
