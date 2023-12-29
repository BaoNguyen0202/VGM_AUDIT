import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, IconButton, Text, TextInput, Title } from 'react-native-paper';
import { UserData } from '../modal';
import { CommonUtils } from '../utils';
import { ApiConstant, AppConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showRetry, setShowRetry] = useState(false);
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
                    setShowRetry(true);
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setShowRetry(true);
        }
    };
    const handleRetry = () => {
        setShowRetry(false);
        fetchUserData();
    };
    const handleEditPress = () => {
        setIsEditing(true);
    };
    const handleSavePress = async () => {
        try {
            setIsEditing(false);
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
                {showRetry ? (
                    <View style={styles.retryContainer}>
                        <Text style={styles.retryText}>Retry</Text>
                        <IconButton icon="sync" iconColor={'#1abc9c'} size={35} onPress={handleRetry} />
                    </View>
                ) : (
                    <View>
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
                                            value={userData.email || ''}
                                            onChangeText={(text) => setUserData({ ...userData, email: text })}
                                            placeholder="Email"
                                        />
                                        <TextInput
                                            style={styles.textInput}
                                            value={userData.first_name || ''}
                                            onChangeText={(text) => setUserData({ ...userData, first_name: text })}
                                            placeholder="First Name"
                                        />
                                        <TextInput
                                            style={styles.textInput}
                                            value={userData.username || ''}
                                            onChangeText={(text) => setUserData({ ...userData, username: text })}
                                            placeholder="Username"
                                        />
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={styles.text}>{`Full Name: ${userData.full_name}`}</Text>
                                        <Text style={styles.text}>{`Email: ${userData.email || ''}`}</Text>
                                        <Text style={styles.text}>{`First Name: ${userData.first_name || ''}`}</Text>
                                        <Text style={styles.text}>{`Username: ${userData.username || ''}`}</Text>
                                    </View>
                                )}
                                <Button
                                    style={styles.button}
                                    mode="elevated"
                                    buttonColor="#3498db"
                                    textColor="#FFF"
                                    onPress={isEditing ? handleSavePress : handleEditPress}
                                >
                                    {isEditing ? 'Save' : 'Edit'}
                                </Button>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        marginTop: '20%',
        backgroundColor: '#036a91',
        height: '50%',
        borderRadius: 40,
    },
    text: {
        marginBottom: 10,
        paddingHorizontal: 50,
        paddingVertical: 8,
        top: 16,
        color: 'white',
    },
    retryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryText: {
        fontSize: 16,
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
