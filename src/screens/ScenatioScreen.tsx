import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { ActivityIndicator, Avatar, Button, Card, Icon, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { ApiConstant, ScreenConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';

const ScenarioScreen = ({ route, navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [responseData, setResponseData] = useState<any>(null);

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
            console.log(data, 'zzz');

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
        console.log(scenarioId);
        const [doctype, scenarioIdWithoutDoctype] = scenarioId.split('::');
        console.log(doctype);
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
});

export default ScenarioScreen;
