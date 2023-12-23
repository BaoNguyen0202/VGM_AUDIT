import React from 'react';
import { View } from 'react-native';
import { Menu } from 'react-native-paper';

const HomeMenu = ({ visible, closeMenu }: any) => (
    <View
        style={{
            position: 'absolute',
            top: 70,
            right: 0,
        }}
    >
        <Menu visible={visible} onDismiss={closeMenu} anchor={<View style={{ width: 10, height: 10 }} />}>
            <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />
            <Menu.Item leadingIcon="undo" onPress={() => {}} title="Undo" />
            <Menu.Item leadingIcon="content-cut" onPress={() => {}} title="Cut" disabled />
            <Menu.Item leadingIcon="content-copy" onPress={() => {}} title="Copy" disabled />
            <Menu.Item leadingIcon="content-paste" onPress={() => {}} title="Paste" />
        </Menu>
    </View>
);

export default HomeMenu;
