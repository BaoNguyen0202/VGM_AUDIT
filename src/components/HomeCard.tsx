import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Button, IconButton, Icon } from 'react-native-paper';
import axios from 'axios';
import { ApiConstant, AppConstant, ScreenConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';
import { CommonUtils } from '../utils';

const HomeCard = ({ navigation }: any) => {
    const [scenarioData, setScenarioData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedScenario, setSelectedScenario] = useState<string[]>([]);

    const LeftContent = (props: any) => <Avatar.Icon {...props} icon="store-check-outline" />;
    const rightContent = (scenarioName: string) => (
        <TouchableOpacity onPress={() => handleReportScenario(scenarioName)}>
            <View
                style={[
                    styles.rightContentContainerGreen,
                    selectedScenario.includes(scenarioName) && styles.rightContentContainerRed,
                ]}
            >
                <Text style={{ margin: 10, fontWeight: 'bold', color: 'green' }}> Checking</Text>
            </View>
        </TouchableOpacity>
    );
    const handleReportScenario = async (scenarioName: any) => {
        console.log('Clicked on scenario:', scenarioName);
        const isSelected = selectedScenario.includes(scenarioName);

        // Nếu chưa chọn thì thêm vào danh sách
        if (!isSelected) {
            setSelectedScenario((prevSelected) => [...prevSelected, scenarioName]);
        }
    };
    const fetchData = async () => {
        try {
            const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
            const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);

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
                console.log(formattedData);

                setScenarioData(formattedData);
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
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
                <Text style={styles.headerLabel}>Điểm bán</Text>

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

    const renderItem = ({ item }: any) => (
        <Card style={styles.card} onPress={() => goToProductScreen(item.name)}>
            <Card.Title
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                title={item.retail_name}
                left={LeftContent}
                right={() => rightContent(item.name)}
            />
            <View style={styles.line} />
            <Card.Content>
                <View style={styles.iconTextContainer}>
                    <IconButton icon="clock-time-four-outline" iconColor="#000" size={20} />
                    <Text variant="bodyMedium">{item.modified}</Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>
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
        fontWeight: 'bold',
        color: 'gray',
        marginLeft: 8,
        alignSelf: 'center',
    },
    rightContentContainerGreen: {
        backgroundColor: '#a2ded0',
        borderRadius: 8,
        margin: 8,
    },
    rightContentContainerRed: {
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderRadius: 8,
        margin: 8,
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default HomeCard;
