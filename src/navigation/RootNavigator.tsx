import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import Home from '../screens/Home/HomeScreen';
import Sync from '../screens/Sync';

import HomeCard from '../components/VisitCard/HomeCard';
import DetailScreen from '../screens/DetailScreen';
import MoreScreen from '../screens/LookMore/MoreScreen';

const Tab = createBottomTabNavigator();
// color: '#881111'
const RootNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home" sceneContainerStyle={{ backgroundColor: '#f4f6f8' }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => <Icon source="home-outline" size={size} />,
                    headerShown: false,
                    tabBarStyle: { height: 60 },
                    tabBarLabelStyle: { paddingBottom: 8 },
                }}
            />
            <Tab.Screen
                name="HomeCard"
                component={HomeCard}
                options={{
                    tabBarLabel: 'Viếng thăm',
                    tabBarIcon: ({ color, size }) => <Icon source="map-outline" size={size} />,
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
                    tabBarIcon: ({ color, size }) => <Icon source="dots-horizontal" size={size} />,
                    headerShown: false,
                    tabBarStyle: { height: 60 },
                    tabBarLabelStyle: { paddingBottom: 8 },
                }}
            />
        </Tab.Navigator>
    );
};

export default RootNavigator;
