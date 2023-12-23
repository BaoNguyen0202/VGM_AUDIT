import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableNativeFeedback } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
    Text,
    Avatar,
    Title,
    Caption,
    IconButton,
    Menu,
    ActivityIndicator,
    TouchableRipple,
    Icon,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Home from '../screens/HomeScreen';
import Sync from '../screens/Sync';
import MapLibre from '../components/MapLibre';
import LoginScreen from '../screens/login/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from '../screens/ProfileScreen';
import { AppConstant, ScreenConstant } from '../const';
import { useMMKVString } from 'react-native-mmkv';
import Product from '../screens/Product';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userNameStore, setUserNameStore] = useMMKVString(AppConstant.userNameStore);
    const [passwordStore, setPasswordStore] = useMMKVString(AppConstant.passwordStore);
    const closeMenu = () => {
        setMenuVisible(false);
    };
    const handleTitlePress = () => {
        setMenuVisible(true);
    };
    const handleChangeprofile = () => {
        closeMenu();
        navigation.navigate(ScreenConstant.EDIT_PROFILE);
    };
    const handleLogout = async () => {
        await setUserNameStore('');
        await setPasswordStore('');
        navigation.navigate(ScreenConstant.LOG_IN);
    };

    const handleSyncServer = () => {
        setLoading(true);
        closeMenu();
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };
    const handleChangePass = () => {
        closeMenu();
        navigation.navigate(ScreenConstant.CHANGE_PASS);
    };

    return (
        <LinearGradient colors={['#1abc9c', '#3498db']} style={styles.linearGradient}>
            <DrawerContentScrollView style={styles.container}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <TouchableNativeFeedback onPress={handleChangeprofile}>
                            <Avatar.Image
                                source={{
                                    uri: 'https://toigingiuvedep.vn/wp-content/uploads/2022/03/hinh-nen-phong-canh-2-820x513.jpg',
                                }}
                                size={80}
                            />
                        </TouchableNativeFeedback>

                        <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableNativeFeedback onPress={handleChangeprofile}>
                                    <Title style={styles.title}>Bảo Nguyễn</Title>
                                </TouchableNativeFeedback>
                                <IconButton
                                    icon="dots-vertical"
                                    iconColor="white"
                                    size={25}
                                    onPress={() => setMenuVisible(true)}
                                />
                            </View>
                            <Caption style={styles.caption}>@baonq</Caption>
                        </View>
                    </View>
                    <DrawerItem
                        label="Home"
                        onPress={() => navigation.navigate('Home')}
                        icon={({ color, size }) => <Icon source="home" color={'white'} size={35} />}
                        labelStyle={{ color: 'white' }}
                        style={styles.drawerItem}
                    />
                    <DrawerItem
                        label="Map"
                        onPress={() => navigation.navigate('Map')}
                        icon={({ color, size }) => <Icon source="map" color={'white'} size={35} />}
                        labelStyle={{ color: 'white' }}
                        style={styles.drawerItem}
                    />
                    <DrawerItem
                        label="Sync up"
                        onPress={() => navigation.navigate('Sync up')}
                        icon={({ color, size }) => <Icon source="sync" color={'white'} size={35} />}
                        labelStyle={{ color: 'white' }}
                        style={styles.drawerItem}
                    />
                </View>
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<View style={{ width: 10, height: 10 }} />}
                    style={styles.menu}
                >
                    <TouchableRipple onPress={handleChangePass} rippleColor="#1abc9c">
                        <Menu.Item
                            theme={{ colors: { primary: '#1abc9c' } }}
                            leadingIcon="account-key"
                            onPress={handleChangePass}
                            title="Change Password"
                        />
                    </TouchableRipple>
                    <TouchableRipple onPress={handleLogout} rippleColor="#1abc9c">
                        <Menu.Item leadingIcon="logout" onPress={handleLogout} title="Log out" />
                    </TouchableRipple>
                    <TouchableRipple onPress={handleSyncServer} rippleColor="#1abc9c">
                        <Menu.Item leadingIcon="sync" onPress={handleSyncServer} title="Sync down" />
                    </TouchableRipple>
                </Menu>
            </DrawerContentScrollView>
            <View style={styles.companyInfo}>
                <Text style={styles.companyName}>VGM</Text>
                <Text style={styles.companyAddress}>Cố Nhuế, Hà Nội</Text>
                <Text style={styles.companyContact}>Liên hệ: (+84) 456-7890</Text>
            </View>
        </LinearGradient>
    );
};

export default function RootNavigator() {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{
                    headerStyle: {
                        backgroundColor: '#1abc9c',
                    },
                    drawerLabel: 'Home',
                    headerTintColor: 'white',
                    drawerIcon: ({ color, size }) => <Icon source="home" color={color} size={size} />,
                }}
            />
            <Drawer.Screen
                name="Map"
                component={MapLibre}
                options={{
                    headerStyle: {
                        backgroundColor: '#1abc9c',
                    },
                    drawerLabel: 'Map',
                    headerTintColor: 'white',
                    drawerIcon: ({ color, size }) => <Icon source="map" color={color} size={size} />,
                }}
            />
            <Drawer.Screen
                name="Sync up"
                component={Sync}
                options={{
                    headerStyle: {
                        backgroundColor: '#1abc9c',
                    },
                    drawerLabel: 'Sync',
                    headerTintColor: 'white',
                    drawerIcon: ({ color, size }) => <Icon source="cog" color={color} size={size} />,
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#1abc9c',
                    },
                    drawerLabel: 'Profile',
                    headerTintColor: 'white',
                    drawerIcon: ({ color, size }) => <Icon source="cog" color={color} size={size} />,
                }}
            />
            <Drawer.Screen
                name="Product"
                component={Product}
                options={{
                    headerStyle: {
                        backgroundColor: '#1abc9c',
                    },
                    drawerLabel: 'Product',
                    headerTintColor: 'white',
                    drawerIcon: ({ color, size }) => <Icon source="cog" color={color} size={size} />,
                }}
            />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerContent: {
        flex: 1,
        paddingTop: 20,
    },
    userInfoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    caption: {
        fontSize: 14,
        color: 'white',
    },
    drawerItem: {
        marginVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    linearGradient: {
        flex: 1,
    },
    menu: {
        top: '10%',
        width: '60%',
    },
    companyInfo: {
        marginVertical: 16,
        paddingHorizontal: 20,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    companyAddress: {
        fontSize: 14,
        color: 'white',
    },
    companyContact: {
        fontSize: 14,
        color: 'white',
        marginTop: 4,
    },
});
