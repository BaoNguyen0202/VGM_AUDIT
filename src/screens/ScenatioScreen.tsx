import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { ActivityIndicator, Avatar, Button, Card, Icon, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { ApiConstant, AppConstant, ScreenConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonUtils } from '../utils';

const ScenarioScreen = ({ route, navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [responseData, setResponseData] = useState<any>(null);
    const apiKey = CommonUtils.storage.getString(AppConstant.Api_key);
    const apiSecret = CommonUtils.storage.getString(AppConstant.Api_secret);
    const LeftContent = () => <Icon source={'book-multiple-outline'} size={24} color="#22c55e" />;
    const rightContent = () => (
        <View style={styles.rightContentContainer}>
            <Text style={{ margin: 10, fontWeight: 'bold', color: 'green' }}> Checking</Text>
        </View>
    );
    const fetchData = async () => {
        try {
            const { scenarioName } = route.params;
            const response = await axios.get(ApiConstant.GET_SCENARIO + scenarioName);
            const data = response.data;

            if (response.status === 200) {
                const scenarioLinks = data._link_titles;
                const scenarioList = Object.entries(scenarioLinks).map(([key, value]) => ({ key, value }));
                setScenarios(scenarioList);
                setResponseData(data);
            } else {
                console.error('Error fetching product data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleRetry = () => {
        setLoading(true);
        fetchData();
    };
    const productWithDoctype = (scenarioId: any) => {
        const { scenarioName } = route.params;
        const [doctype, scenarioIdWithoutDoctype] = scenarioId.split('::');
        if (doctype == 'Scenario_SKU') {
            navigation.navigate(ScreenConstant.SCENARIOSKU, { scenarioId, scenarioName });
        }
        if (doctype == 'Scenario_Asset') {
            navigation.navigate(ScreenConstant.SCENARIOASSET, { scenarioId, scenarioName });
        }
        if (doctype == 'Scenario_POSM') {
            navigation.navigate(ScreenConstant.SCENARIOPOSM, { scenarioId, scenarioName });
        }

        // navigation.navigate(ScreenConstant.PRODUCT, { scenarioId, scenarioName });
    };
    const handleGoBackHomeCard = async () => {
        const { scenarioName } = route.params;

        const formSKUString = await AsyncStorage.getItem('savedFormSKU' + scenarioName);
        const formPOSSString = await AsyncStorage.getItem('savedFormPOSM' + scenarioName);
        const formASSETString = await AsyncStorage.getItem('savedFormASSET' + scenarioName);

        const formSKU = formSKUString ? JSON.parse(formSKUString) : null;
        const formPOSS = formPOSSString ? JSON.parse(formPOSSString) : null;
        const formASSET = formASSETString ? JSON.parse(formASSETString) : null;

        if (!formSKU || !formPOSS || !formASSET) {
            Alert.alert('Bạn chưa hoàn thành báo cáo!', 'Bạn có chắc rời đi không?', [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        navigation.goBack();
                    },
                },
            ]);
            return;
        }
        setLoading(true);

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
                await AsyncStorage.removeItem('savedFormSKU' + scenarioName);
                await AsyncStorage.removeItem('savedFormPOSM' + scenarioName);
                await AsyncStorage.removeItem('savedFormASSET' + scenarioName);

                Alert.alert('gửi báo cáo thành công');
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }

        await navigation.goBack();
    };
    useEffect(() => {
        fetchData();
    }, [route.params]);
    const _renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <IconButton
                    icon="arrow-left"
                    iconColor="#000"
                    size={24}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <Text style={styles.headerLabel}>Kịch bản</Text>

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
    const _renderCheckout = () => {
        return (
            <TouchableOpacity
                style={{ marginBottom: 20 }}
                onPress={() => {
                    handleGoBackHomeCard();
                }}
            >
                <View style={styles.checkoutContainer}>
                    <Text style={styles.checkout}>Checkout</Text>
                </View>
            </TouchableOpacity>
        );
    };
    const renderScenarioItem = ({ item }: any) => {
        const dataValues =
            responseData && responseData.docs && responseData.docs.length > 0 ? responseData.docs[0] : null;

        return (
            <Card style={styles.card} mode="contained" onPress={() => productWithDoctype(item.key)}>
                <Card.Title
                    titleStyle={{ marginLeft: -20, fontSize: 18, fontWeight: 'bold' }}
                    title={`Tại ` + dataValues.retail_name}
                    left={LeftContent}
                />
                <View style={styles.line} />

                <Card.Content>
                    <View style={styles.iconTextContainer}>
                        <IconButton
                            style={styles.iconButton}
                            icon="account-arrow-right-outline"
                            iconColor="#000"
                            size={20}
                        />
                        <Text variant="bodyMedium">{dataValues.user_supervisor}</Text>
                    </View>
                    <View style={styles.iconTextContainer}>
                        <IconButton style={styles.iconButton} icon="book-open-outline" iconColor="#000" size={20} />
                        <Text variant="titleMedium">{item.value}</Text>
                    </View>
                    <View style={styles.iconTextContainer}>
                        <IconButton
                            style={styles.iconButton}
                            icon="map-marker-radius-outline"
                            iconColor="#000"
                            size={20}
                        />
                        <Text variant="bodyMedium">{dataValues.retail_address}</Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <View>{_renderHeader()}</View>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator style={styles.loader} animating={true} color={'#000'} size="large" />
                ) : (
                    <FlatList
                        data={scenarios}
                        renderItem={renderScenarioItem}
                        keyExtractor={(item) => item.key}
                        contentContainerStyle={styles.flatListContainer}
                        onEndReachedThreshold={0.1}
                    />
                )}
                {!loading && scenarios.length === 0 && (
                    <View style={styles.retryContainer}>
                        <Text style={styles.retryText}>No data available. Please retry.</Text>
                        <Button mode="contained" onPress={handleRetry} style={styles.retryButton}>
                            Retry
                        </Button>
                    </View>
                )}
            </View>
            <View>{_renderCheckout()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    linearGradient: {
        flex: 1,
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
    },
    line: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 4,
        marginHorizontal: 20,
    },
    rightContentContainer: {
        backgroundColor: '#a2ded0',
        borderRadius: 8,
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
    checkout: {
        fontSize: 24,
        color: '#881111',
        textAlign: 'center',
        flex: 1,
        fontWeight: '500',
    },
    checkoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderColor: '#881111',
        borderWidth: 1,
        backgroundColor: '#F4F6F8',
        borderTopStartRadius: 20,
        borderTopRightRadius: 20,
        borderBottomStartRadius: 20,
        borderBottomRightRadius: 20,
    },
});

export default ScenarioScreen;
