import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Button, IconButton, Icon } from 'react-native-paper';
import axios from 'axios';
import { ApiConstant, AppConstant, ScreenConstant } from '../../const';
import { CommonUtils } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterView from '../CustomSheet/FilterView';
import BottomSheet from '@gorhom/bottom-sheet';
interface RootState {
    selectedScenarios: string[];
}
const HomeCard = ({ navigation }: any) => {
    const [scenarioData, setScenarioData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedScenario, setSelectedScenario] = useState<string[]>([]);
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const LeftContent = () => <Icon source={'store-check-outline'} size={24} color="#22c55e" />;
    const rightContent = (scenarioName: string) => (
        <TouchableOpacity>
            <View
                style={[
                    styles.rightContentContainerGreen,
                    selectedScenario.includes(scenarioName) && styles.rightContentContainerRed,
                ]}
            >
                <Text style={{ margin: 10, fontWeight: 'bold', color: '#22c55e' }}> Checking</Text>
                {/* #ffab00 */}
            </View>
        </TouchableOpacity>
    );

    const handleReportScenario = async (scenarioName: string) => {
        const formSKUString = await AsyncStorage.getItem('savedFormSKU' + scenarioName);
        const formPOSSString = await AsyncStorage.getItem('savedFormPOSM' + scenarioName);
        const formASSETString = await AsyncStorage.getItem('savedFormASSET' + scenarioName);

        const formSKU = formSKUString ? JSON.parse(formSKUString) : null;
        const formPOSS = formPOSSString ? JSON.parse(formPOSSString) : null;
        const formASSET = formASSETString ? JSON.parse(formASSETString) : null;

        if (!formSKU || !formPOSS || !formASSET) {
            Alert.alert('Vui lòng chọn báo cáo và nhập đủ thông tin trước khi gửi báo cáo.');
            return;
        }

        try {
            const data = {
                docstatus: 0,
                doctype: 'DashboardRetail',
                retail: scenarioName,
                check_longitude: '105.77351976716446',
                check_latitude: '21.037335873828784',
                report_product: formSKU,
                report_posm: formPOSS,
                report_asset: formASSET,
            };

            const dataPost = {
                doc: JSON.stringify(data),
                action: 'Save',
            };

            if (!apiKey || !apiSecret) {
                throw new Error('API key or secret not available');
            }

            const response = await axios.post(ApiConstant.POST_SAVE_DOCS, dataPost, {
                headers: CommonUtils.Auth_header(apiKey, apiSecret),
            });

            if (response.status === 200) {
                console.log('Submit successful.');
                const isSelected = selectedScenario.includes(scenarioName);
                await AsyncStorage.removeItem('savedFormSKU' + scenarioName);
                await AsyncStorage.removeItem('savedFormPOSM' + scenarioName);
                await AsyncStorage.removeItem('savedFormASSET' + scenarioName);
                if (!isSelected) {
                    setSelectedScenario((prevSelected) => [...prevSelected, scenarioName]);
                }
                Alert.alert('gửi báo cáo thành công');
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const fetchData = async () => {
        let success = false;

        while (!success) {
            try {
                const apiKey = await CommonUtils.storage.getString(AppConstant.Api_key);
                const apiSecret = await CommonUtils.storage.getString(AppConstant.Api_secret);

                if (!apiKey || !apiSecret) {
                    throw new Error('API key or secret not available');
                }

                const data = {
                    doctype: 'Retail_Audit',
                    fields: ['name', 'retail_name', 'modified'],
                    order_by: 'modified desc',
                    filters: [],
                    start: 0,
                    page_length: 4,
                };

                const response = await axios.post(ApiConstant.POST_ALL_SCENARIO, data, {
                    headers: CommonUtils.Auth_header(apiKey, apiSecret),
                });

                if (response.data?.message?.values) {
                    const formattedData = response.data.message.values.map((value: any) => ({
                        name: value[0],
                        retail_name: value[1],
                        modified: value[2],
                    }));

                    setScenarioData(formattedData);
                    success = true;
                } else {
                    console.error('Invalid response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRetry = () => {
        setLoading(true);
        fetchData();
    };

    const goToProductScreen = (scenarioName: string) => {
        navigation.navigate(ScreenConstant.SCENARIO, { scenarioName });
    };

    useEffect(() => {
        fetchData();
    }, []);
    const _renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerLabel}>Viếng thăm</Text>

                <IconButton
                    icon="magnify"
                    iconColor="#000"
                    size={24}
                    onPress={() => {
                        // Xử lý sự kiện khi nhấn vào icon search
                    }}
                />
            </View>
        );
    };
    const renderFillter = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginVertical: 16,
                    marginLeft: 16,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: 8,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: 'gray',
                        maxWidth: 180,
                    }}
                >
                    <Text style={{ color: 'gray' }}>Khoảng cách:</Text>
                    <Text style={{ color: '#000', marginLeft: 8 }}>Gần nhất</Text>
                </View>
                <FilterView
                    style={{ marginLeft: 12 }}
                    onPress={() => {
                        bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0);
                    }}
                />
            </View>
        );
    };
    const renderItem = ({ item }: any) => (
        <Card style={styles.card} mode="contained">
            <Card.Title
                titleStyle={{ marginLeft: -20, fontSize: 18, fontWeight: 'bold' }}
                title={item.retail_name}
                left={LeftContent}
                right={() => rightContent(item.name)}
            />
            <View style={styles.line} />
            <Card.Content>
                <View style={styles.iconTextContainer}>
                    <IconButton style={styles.iconButton} icon="clock-time-four-outline" iconColor="#000" size={20} />
                    <Text variant="bodyMedium">{item.modified}</Text>
                </View>
            </Card.Content>
            <Card.Content>
                <View style={styles.iconTextContainer}>
                    <IconButton style={styles.iconButton} icon="map-marker-outline" iconColor="#000" size={20} />
                    <Text variant="bodyMedium">4X, Đ. Lê Đức Thọ, Mỹ Đình, Từ Liêm, Hà Nội, Việt Nam</Text>
                </View>
            </Card.Content>
            <Card.Content>
                <View style={styles.iconTextContainer}>
                    <IconButton style={styles.iconButton} icon="phone-outline" iconColor="#000" size={20} />
                    <Text variant="bodyMedium">+84 1234 333 093</Text>
                </View>
            </Card.Content>
            <Card.Actions>
                {/* <Button
                    onPress={() => {
                        handleReportScenario(item.name);
                    }}
                    mode="outlined"
                    textColor="#4697e8"
                    style={{ borderColor: '#4697e8' }}
                >
                    Send report
                </Button> */}
                <Button
                    onPress={() => goToProductScreen(item.name)}
                    mode="outlined"
                    textColor="#4697e8"
                    style={{ borderColor: '#4697e8' }}
                >
                    Checkin
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>
            <>{renderFillter()}</>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator style={styles.loader} animating={true} color={'#000'} size="large" />
                ) : (
                    <FlatList
                        data={scenarioData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.name.toString()}
                        contentContainerStyle={styles.flatListContainer}
                        onEndReachedThreshold={0.1}
                    />
                )}
                {!loading && scenarioData.length === 0 && (
                    <View style={styles.retryContainer}>
                        <Text style={styles.retryText}>No data available. Please retry.</Text>
                        <Button mode="contained" onPress={handleRetry} style={styles.retryButton}>
                            Retry
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    line: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 4,
        marginHorizontal: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryText: {
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#1abc9c',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    linearGradient: {
        flex: 1,
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
    rightContentContainerGreen: {
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        borderRadius: 10,
        margin: 8,
    },
    rightContentContainerRed: {
        backgroundColor: 'rgba(255, 171, 0, 0.08)',
        borderRadius: 10,
        margin: 8,
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '10%',
    },
    iconButton: {
        marginLeft: -5,
    },
});

export default HomeCard;
