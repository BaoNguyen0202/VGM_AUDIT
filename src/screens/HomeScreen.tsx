import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Avatar, Icon, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import { ScreenConstant } from '../const';

const Home = ({ navigation }: any) => {
    const renderUiWidget = () => {
        const renderIconWithText = (iconSource: string, text: string, color: string) => (
            <TouchableNativeFeedback onPress={() => {}}>
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
                {renderIconWithText('cog', 'Cài đặt', '#881111')}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.userInfoContainer}>
                    <Avatar.Image size={48} source={{ uri: 'https://example.com/avatar.jpg' }} />
                    <View style={styles.containerIfU}>
                        <Text style={styles.greetingText}>Xin chào,</Text>
                        <Text style={styles.userName}>Nguyễn Bảo</Text>
                    </View>
                </View>
                <View>
                    <IconButton
                        icon="bell-outline"
                        iconColor={'#000'} // Thay đổi màu sắc theo ý muốn
                        size={20}
                        onPress={() => {
                            // Xử lý sự kiện khi nhấn vào biểu tượng thông báo
                        }}
                    />
                </View>
            </View>
            {/* Thêm phần nội dung chính của màn hình Home ở đây */}
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
});

export default Home;
