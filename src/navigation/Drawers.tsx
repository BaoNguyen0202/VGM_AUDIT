import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { ScreenConstant } from '../const';

const Drawers = ({ navigation }: any) => {
    return (
        <DrawerContentScrollView>
            <DrawerItem
                label="First Item"
                onPress={() => {
                    navigation.navigate(ScreenConstant.HOME);
                }}
            />
            <DrawerItem
                label="Second Item"
                onPress={() => {
                    // Handle navigation to the second screen
                }}
            />
        </DrawerContentScrollView>
    );
};

export default Drawers;
