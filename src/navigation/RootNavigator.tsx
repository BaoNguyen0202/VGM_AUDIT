import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'react-native-paper';
import Home from '../screens/HomeScreen';
import Sync from '../screens/Sync';
import MapLibre from '../components/MapLibre';
import ProfileScreen from '../screens/ProfileScreen';
import Product from '../screens/Product';
import { ScreenConstant } from '../const';
import HomeCard from '../components/HomeCard';

const Tab = createBottomTabNavigator(); // hoặc createMaterialBottomTabNavigator

const RootNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Sale"
                component={HomeCard}
                options={{
                    tabBarLabel: 'Sale',
                    tabBarIcon: ({ color, size }) => <Icon source="map" color={color} size={size} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Sync"
                component={Sync}
                options={{
                    tabBarLabel: 'Sync',
                    tabBarIcon: ({ color, size }) => <Icon source="sync" color={color} size={size} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => <Icon source="account" color={color} size={size} />,
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default RootNavigator;
