import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { Avatar, Icon, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppConstant, ScreenConstant } from '../../const';
import AppContainer from '../../components/CustomApp/AppContainer';
import { ImageAssets } from '../../assets';
import ProgressCircle from 'react-native-progress-circle';

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
                {renderIconWithText('account-outline', 'Account', '#12a364')}
                {renderIconWithText('bell-outline', 'Thông báo', '#3b83f7')}
                {renderIconWithText('briefcase-outline', 'Điểm bán', '#f5bc6c')}
                {renderIconWithText('cog-outline', 'Cài đặt', '#2cb8db')}
            </View>
        );
    };
    const renderUiStatistical = () => {
        return (
            <View>
                <View style={[styles.flexSpace]}>
                    <Text style={[styles.tilteSection]}>Thống kê</Text>
                </View>
                <View style={styles.containProgressView}>
                    <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 64) / 3 }]}>
                        <Text style={[styles.worksheetLb]}>Doanh thu</Text>
                        <View style={[styles.worksheetBar]}>
                            <ProgressCircle
                                percent={55}
                                radius={16}
                                borderWidth={5}
                                color={'#1877F2'}
                                shadowColor={'637381'}
                                bgColor={'#FFF'}
                            />
                            <Text style={[styles.worksheetDt, { color: '#1877F2' }]}>55 %</Text>
                        </View>
                    </View>

                    <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 64) / 3, marginHorizontal: 15 }]}>
                        <Text style={[styles.worksheetLb]}>Doanh số</Text>
                        <View style={[styles.worksheetBar]}>
                            <ProgressCircle
                                percent={15}
                                radius={16}
                                borderWidth={5}
                                color={'#118D57'}
                                shadowColor={'637381'}
                                bgColor={'#FFF'}
                            />
                            <Text style={[styles.worksheetDt, { color: '#118D57' }]}>15 %</Text>
                        </View>
                    </View>

                    <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 64) / 3 }]}>
                        <Text style={[styles.worksheetLb]}>Đơn hàng</Text>
                        <View style={[styles.worksheetBar]}>
                            <ProgressCircle
                                percent={65}
                                radius={16}
                                borderWidth={5}
                                color={'#006C9C'}
                                shadowColor={'637381'}
                                bgColor={'#FFF'}
                            />
                            <Text style={[styles.worksheetDt, { color: '#006C9C' }]}>65 %</Text>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.itemWorkSheet,
                            {
                                width: (AppConstant.WIDTH - 48) / 2,
                                marginRight: 16,
                                marginBottom: 0,
                            },
                        ]}
                    >
                        <Text style={[styles.worksheetLb]}>Viếng thăm</Text>
                        <View style={[styles.worksheetBar]}>
                            <ProgressCircle
                                percent={25}
                                radius={16}
                                borderWidth={5}
                                color={'#881111'}
                                shadowColor={'637381'}
                                bgColor={'#FFF'}
                            />
                            <Text style={[styles.worksheetDt, { color: '#881111' }]}>25 %</Text>
                        </View>
                    </View>

                    <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 48) / 2, marginBottom: 0 }]}>
                        <Text style={[styles.worksheetLb]}>Khách hàng mới</Text>
                        <View style={[styles.worksheetBar]}>
                            <ProgressCircle
                                percent={77}
                                radius={16}
                                borderWidth={5}
                                color={'#5119B7'}
                                shadowColor={'637381'}
                                bgColor={'#FFF'}
                            />
                            <Text style={[styles.worksheetDt, { color: '#5119B7' }]}>77 %</Text>
                        </View>
                    </View>
                </View>
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
                    <IconButton icon="bell-outline" iconColor={'#000'} size={20} onPress={() => {}} />
                </View>
            </View>
            <AppContainer>
                <View style={styles.mainLayout}>
                    <View style={[styles.shadow, styles.containerTimekeep]}>
                        <View>
                            <Text style={[styles.userName]}>Chấm công vào</Text>
                            <View style={[styles.flex, { marginTop: 8 }]}>
                                <Icon source={'clock-outline'} size={12} />
                                <Text
                                    style={{
                                        marginLeft: 5,
                                        fontSize: 16,
                                        color: '#919EAB',
                                    }}
                                >
                                    08:00 - 12:00
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.btnTimekeep} onPress={() => {}}>
                            <Image source={ImageAssets.Usercheckin} resizeMode={'cover'} style={styles.iconBtnTk} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginVertical: 8, color: 'gray' }}>Tiện ích</Text>
                    {renderUiWidget()}
                    {renderUiStatistical()}
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
        shadowColor: '#919EAB',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingVertical: 26,
        paddingTop: 18,
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
    shadow: {
        shadowColor: '#919EAB',

        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    } as ViewStyle,
    containerTimekeep: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#FFF',
        marginTop: 20,
    } as ViewStyle,
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    btnTimekeep: {
        width: 48,
        height: 48,
        backgroundColor: '#12a364',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    } as ViewStyle,
    iconBtnTk: {
        width: 32,
        height: 32,
        tintColor: '#FFF',
    },
    flexSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
    tilteSection: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '500',
        color: '#919EAB',
        marginVertical: 8,
    } as TextStyle,
    containProgressView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    } as ViewStyle,
    itemWorkSheet: {
        shadowColor: '#919EAB',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 16,
    } as ViewStyle,
    worksheetLb: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
        color: '#212B36',
    } as TextStyle,
    worksheetBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 4,
    } as ViewStyle,
    worksheetDt: {
        fontSize: 18,
        lineHeight: 27,
        fontWeight: '500',
        marginLeft: 8,
    } as TextStyle,
});

export default Home;
