import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { Card, Text, Avatar, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import { ApiConstant, AppConstant, ScreenConstant } from '../const';
import LinearGradient from 'react-native-linear-gradient';
import { CommonUtils } from '../utils';

const HomeCard = ({ navigation }: any) => {
    const LeftContent = (props: any) => <Avatar.Icon {...props} icon="animation-outline" />;
    const [scenarioData, setScenarioData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleDeleteScenario = (nameId: string) => {
        console.log(nameId);
        Alert.alert('Currently developing, please return later!');
        // Alert.alert(
        //     'Confirm Delete',
        //     'Are you sure you want to delete this scenario?',
        //     [
        //         {
        //             text: 'No',
        //             style: 'cancel',
        //         },
        //         {
        //             text: 'Yes',
        //             onPress: () => performDeleteScenario(nameId),
        //         },
        //     ],
        //     { cancelable: false },
        // );
    };

    const performDeleteScenario = async (nameId: string) => {
        try {
            const formData = new FormData();
            formData.append('doctype', 'Scenario');
            formData.append('name', nameId);
            await axios.delete(ApiConstant.DELETE_SCENARIO, {
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Deleting scenario:', nameId);
            fetchData();
        } catch (error) {
            console.error('Error deleting scenario:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const UpdateScenario = (nameId: string) => {
        console.log(nameId);
        Alert.alert('Currently developing, please return later!');
    };

    const renderItem = ({ item }: any) => (
        <Card style={styles.card} onPress={() => goToProductScreen(item.name)}>
            <Card.Title title="Điểm bán" left={LeftContent} />
            <Card.Content>
                <Text variant="titleLarge">{item.retail_name}</Text>
                <Text variant="bodyMedium">{item.modified}</Text>
            </Card.Content>
            <Card.Actions>
                <View style={styles.iconContainer}>
                    <IconButton icon="pen" iconColor="#1abc9c" onPress={() => UpdateScenario(item.name)} />
                    <IconButton icon="delete" iconColor="#1abc9c" onPress={() => handleDeleteScenario(item.name)} />
                </View>
            </Card.Actions>
        </Card>
    );

    return (
        <LinearGradient colors={['#3498db', '#1abc9c']} style={styles.linearGradient}>
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
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
});

export default HomeCard;
