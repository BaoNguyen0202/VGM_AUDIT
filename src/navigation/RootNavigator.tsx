import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import Home from '../screens/HomeScreen';
import Sync from '../screens/Sync';

import HomeCard from '../components/HomeCard';
import DetailScreen from '../screens/DetailScreen';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home" sceneContainerStyle={{ backgroundColor: '#f4f6f8' }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => <Icon source="home-outline" color={color} size={size} />,
                    headerShown: false,
                    tabBarStyle: { height: 60 },
                    tabBarLabelStyle: { paddingBottom: 8 },
                }}
            />
            <Tab.Screen
                name="Sale"
                component={HomeCard}
                options={{
                    tabBarLabel: 'Điểm bán',
                    tabBarIcon: ({ color, size }) => <Icon source="map" color={color} size={size} />,
                    headerShown: false,
                    tabBarStyle: { height: 60 },
                    tabBarLabelStyle: { paddingBottom: 8 },
                }}
            />
            <Tab.Screen
                name="Sync"
                component={Sync}
                options={{
                    tabBarLabel: 'Sync',
                    tabBarIcon: ({ color, size }) => <Icon source="sync" color={color} size={size} />,
                    headerShown: false,
                    tabBarStyle: { height: 60 },
                    tabBarLabelStyle: { paddingBottom: 8 },
                }}
            />
            <Tab.Screen
                name="Detail"
                component={MoreScreen}
                options={{
                    tabBarLabel: 'Xem thêm',
                    tabBarIcon: ({ color, size }) => <Icon source="dots-horizontal" color={color} size={size} />,
                    headerShown: false,
                    tabBarStyle: { height: 60 },
                    tabBarLabelStyle: { paddingBottom: 8 },
                }}
            />
        </Tab.Navigator>
    );
};

export default RootNavigator;
