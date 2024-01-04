import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { ActivityIndicator, Avatar, Button, Card, Modal, Portal, Text } from 'react-native-paper';
import { ApiConstant, ScreenConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';

const ScenarioScreen = ({ route, navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [responseData, setResponseData] = useState<any>(null);

    const LeftContent = (props: any) => <Avatar.Icon {...props} icon="animation-outline" />;

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

        navigation.navigate(ScreenConstant.PRODUCT, { scenarioId, scenarioName });
    };
    useEffect(() => {
        fetchData();
    }, [route.params]);

    const renderScenarioItem = ({ item }: any) => {
        const dataValues =
            responseData && responseData.docs && responseData.docs.length > 0 ? responseData.docs[0] : null;

        return (
            <Card style={styles.card} onPress={() => productWithDoctype(item.key)}>
                <Card.Title title={dataValues.retail_name} left={LeftContent} />
                <Card.Content>
                    <Text variant="titleLarge">{item.value}</Text>
                    <Text variant="bodyMedium">{dataValues.retail_address}</Text>
                </Card.Content>
            </Card>
        );
    };

    return (
        <LinearGradient colors={['#3498db', '#1abc9c']} style={styles.linearGradient}>
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default ScenarioScreen;
