import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableNativeFeedback, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { Avatar, Icon, IconButton, Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiConstant, AppConstant, ScreenConstant } from '../../const';
import AppContainer from '../../components/CustomApp/AppContainer';
import { ImageAssets } from '../../assets';
import ProgressCircle from 'react-native-progress-circle';
import BarChartStatistical from './BarChart';
import CardLoading from './component/CardLoading';
import { IWidget, UserData, VisitListItemType } from '../../modal';
import { styles } from './home.style';
import { CommonUtils } from '../../utils';
import axios from 'axios';

const Home = ({ navigation }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const fetchUserData = async () => {
        let success = false;

        while (!success) {
            try {
                const apiKey = await CommonUtils.storage.getString(AppConstant.Api_key);
                const apiSecret = await CommonUtils.storage.getString(AppConstant.Api_secret);

                if (apiKey && apiSecret) {
                    const response = await axios.get(ApiConstant.GET_USER_PROFILE, {
                        headers: {
                            Authorization: CommonUtils.Auth_header(apiKey, apiSecret).Authorization,
                        },
                    });

                    if (response.status === 200) {
                        setUserData(response.data.result as UserData);
                        success = true;
                    } else {
                        console.error('Failed to fetch user profile:', response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }

        setLoading(false);
    };
    useEffect(() => {
        fetchUserData();
    }, []);
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
            name: 'Thông báo',
            icon: 'bell-outline',
            color: '#3b83f7',
            navigate: '',
        },
        {
            id: 3,
            name: 'Điểm bán',
            icon: 'briefcase-outline',
            color: '#f5bc6c',
            navigate: ScreenConstant.HOMECARD,
        },
        {
            id: 4,
            name: 'Cài đặt',
            icon: 'cog-outline',
            color: '#2cb8db',
            navigate: '',
        },
    ];
    const renderUiWidget = () => {
        return (
            <View style={styles.walletContainer}>
                <View style={styles.rowContainer}>
                    {DataWidget.slice(0, Math.ceil(DataWidget.length)).map((widget) => (
                        <TouchableNativeFeedback
                            key={widget.id}
                            onPress={() => {
                                navigation.navigate(widget.navigate);
                            }}
                        >
                            <View style={[styles.otherIconsContainer, { flex: 1 }]}>
                                <View style={styles.BorderIcon}>
                                    <Icon source={widget.icon} size={28} color={widget.color} />
                                </View>
                                <Text style={styles.iconText}>{widget.name}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    ))}
                </View>
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
                {userData && (
                    <View style={styles.userInfoContainer}>
                        <Avatar.Image size={48} source={{ uri: userData?.user_image }} />
                        <View style={styles.containerIfU}>
                            <Text style={styles.greetingText}>Xin chào,</Text>
                            <Text style={styles.userName}>{userData.full_name}</Text>
                        </View>
                    </View>
                )}
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
                                <Icon source={'clock-outline'} size={16} />
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
                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.tilteSection]}>Doanh số</Text>
                        </View>
                        <View>
                            {loading ? <CardLoading /> : <BarChartStatistical color={'#1877F2'} />}

                            {/* <BarChartStatistical color={colors.action} /> */}
                        </View>
                    </View>

                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.tilteSection]}>Doanh thu</Text>
                        </View>
                        <View>
                            {loading ? <CardLoading /> : <BarChartStatistical color={'rgba(0, 167, 111, 1)'} />}
                        </View>
                    </View>
                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.tilteSection]}>Viếng thăm</Text>
                        </View>
                        {loading ? (
                            <CardLoading />
                        ) : (
                            <View style={[styles.containerCheckin]}>
                                <ProgressCircle
                                    percent={18}
                                    radius={80}
                                    borderWidth={30}
                                    color={'#1877F2'}
                                    shadowColor={'#637381'}
                                    bgColor={'#FFF'}
                                >
                                    <View>
                                        <Text style={[styles.textProcess]}>3/50</Text>
                                        <Text style={[styles.textProcessDesc]}> {'(Đạt 6 %)'} </Text>
                                    </View>
                                </ProgressCircle>
                                <Text style={[styles.checkinDesc]}>Số lượt viếng thăm khách hàng/tháng</Text>
                            </View>
                        )}
                    </View>
                </View>
            </AppContainer>
        </SafeAreaView>
    );
};

export default Home;
