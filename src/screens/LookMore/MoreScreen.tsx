import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { View as NativeView } from 'react-native';
import { AppConstant, ScreenConstant } from '../../const';
import { useMMKVString } from 'react-native-mmkv';
import { IWidget } from '../../modal';

const MoreScreen = ({ navigation }: any) => {
    const [userNameStore, setUserNameStore] = useMMKVString(AppConstant.userNameStore);
    const [passwordStore, setPasswordStore] = useMMKVString(AppConstant.passwordStore);

    const DataWidget: IWidget[] = [
        {
            id: 1,
            name: 'Hồ sơ',
            icon: 'account-outline',
            color: '#12a364',
            navigate: ScreenConstant.PROFILE,
        },
        {
            id: 2,
            name: 'Sản phẩm',
            icon: 'briefcase-outline',
            color: '#f5bc6c',
            navigate: ScreenConstant.LOG_IN,
        },
        {
            id: 3,
            name: 'Khuyến mại',
            icon: 'tag-outline',
            color: '#3b83f7',
            navigate: '',
        },
        {
            id: 4,
            name: 'Thông báo',
            icon: 'bell-outline',
            color: '#3b83f7',
            navigate: '',
        },
        {
            id: 5,
            name: 'Nhắc nhở',
            icon: 'bell-badge-outline',
            color: '#e03d3d',
            navigate: '',
        },
        {
            id: 6,
            name: 'hình ảnh',
            icon: 'image-multiple-outline',
            color: '#2cb8db',
            navigate: '',
        },
    ];
    const clearUserAndPass = () => {
        setUserNameStore('');
        setPasswordStore('');
    };
    const _renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerLabel}>Xem thêm</Text>
            </View>
        );
    };

    return (
        <NativeView style={styles.safeArea}>
            {_renderHeader()}
            <View style={styles.mainLayout}>
                <View style={styles.walletContainer}>
                    <View style={styles.rowContainer}>
                        {DataWidget.slice(0, Math.ceil(DataWidget.length / 2)).map((widget) => (
                            <TouchableNativeFeedback
                                key={widget.id}
                                onPress={() => {
                                    // if (widget.navigate === ScreenConstant.LOG_IN) {
                                    //     clearUserAndPass();
                                    // }
                                    navigation.navigate(widget.navigate);
                                }}
                            >
                                <View style={[styles.otherIconsContainer, { flex: 1 }]}>
                                    <Icon source={widget.icon} size={28} color={widget.color} />
                                    <Text style={styles.iconText}>{widget.name}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        ))}
                    </View>
                    <View style={styles.rowContainer}>
                        {DataWidget.slice(Math.ceil(DataWidget.length / 2)).map((widget) => (
                            <TouchableNativeFeedback
                                key={widget.id}
                                onPress={() => navigation.navigate(widget.navigate)}
                            >
                                <View style={[styles.otherIconsContainer, { flex: 1 }]}>
                                    <Icon source={widget.icon} size={28} color={widget.color} />
                                    <Text style={styles.iconText}>{widget.name}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        ))}
                    </View>
                </View>
            </View>
        </NativeView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        flexDirection: 'column',
    },
    otherIconsContainer: {
        alignItems: 'center',
        paddingHorizontal: 26,
        paddingVertical: 8,
    },
    iconText: {
        fontSize: 14,
        color: 'gray',
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
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
    },
});

export default MoreScreen;
