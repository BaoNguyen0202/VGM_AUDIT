import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { View as NativeView } from 'react-native';
import { ScreenConstant } from '../const';

interface IWidget {
    id: number;
    name: string;
    icon: string;
    navigate: string | any;
    isUse?: boolean;
    color?: string;
}

const MoreScreen = ({ navigation }: any) => {
    const DataWidget: IWidget[] = [
        {
            id: 1,
            name: 'Hồ sơ',
            icon: 'account-outline',
            color: '#000',
            navigate: ScreenConstant.LOG_IN,
        },
        {
            id: 2,
            name: 'Sản phẩm',
            icon: 'briefcase-outline',
            color: '#000',
            navigate: '',
        },
        {
            id: 3,
            name: 'Khuyến mại',
            icon: 'tag-outline',
            color: '#000',
            navigate: '',
        },
        {
            id: 4,
            name: 'Thông báo',
            icon: 'bell-outline',
            color: '#000',
            navigate: '',
        },
        {
            id: 5,
            name: 'Nhắc nhở',
            icon: 'bell-badge-outline',
            color: '#000',
            navigate: '',
        },
        {
            id: 6,
            name: 'hình ảnh',
            icon: 'image-multiple-outline',
            color: '#000',
            navigate: '',
        },
    ];

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
                <Text style={{ marginVertical: 8, color: 'gray' }}>danh mục</Text>
                <View style={styles.walletContainer}>
                    <View style={styles.rowContainer}>
                        {DataWidget.slice(0, Math.ceil(DataWidget.length / 2)).map((widget) => (
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
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        paddingVertical: 20,
        backgroundColor: '#FFF',
        borderRadius: 8,
        flexDirection: 'column',
    },
    otherIconsContainer: {
        alignItems: 'center',
        paddingHorizontal: 26,
        paddingVertical: 8,
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
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
    },
});

export default MoreScreen;
