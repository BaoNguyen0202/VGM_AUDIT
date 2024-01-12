import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Avatar, Icon, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import { ScreenConstant } from '../const';

const MoreScreen = ({ navigation }: any) => {
    const renderUiWidget = () => {
        const renderIconWithText = (iconSource: string, text: string, color: string) => (
            <TouchableNativeFeedback onPress={() => navigation.navigate(ScreenConstant.LOG_IN)}>
                <View style={styles.otherIconsContainer}>
                    <Icon source={iconSource} size={28} color={color} />
                    <Text style={styles.iconText}>{text}</Text>
                </View>
            </TouchableNativeFeedback>
        );

        return (
            <View style={styles.walletContainer}>
                {renderIconWithText('account', 'Account', '#12a364')}
                {renderIconWithText('bell', 'Thông báo', 'gray')}
                {renderIconWithText('cog', 'Cài đặt', '#e84646')}
            </View>
        );
    };
    const _renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerLabel}>Tiện ích</Text>

                {/* <IconButton
                    icon="magnify"
                    iconColor="#000"
                    size={24}
                    onPress={() => {
                        // Xử lý sự kiện khi nhấn vào icon search
                    }}
                /> */}
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View>{_renderHeader()}</View>
            <AppContainer>
                <View style={styles.mainLayout}>
                    <Text style={{ marginVertical: 8, color: 'gray' }}>Tiện ích</Text>
                    {renderUiWidget()}
                    {/* Thêm các thành phần khác của màn hình Home nếu cần */}
                </View>
            </AppContainer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerIfU: {
        marginLeft: 16,
    },
    greetingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userName: {
        fontSize: 16,
        color: '#000',
    },
    mainLayout: {
        flex: 1,
        paddingHorizontal: 16,
        marginVertical: 20,
    },
    walletContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        elevation: 5,
        backgroundColor: '#FFF',
        borderRadius: 8,
    },
    otherIconsContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    iconText: {
        fontSize: 14,
        color: '#000',
        marginTop: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        marginLeft: 8,
        alignSelf: 'center',
    },
});

export default MoreScreen;
