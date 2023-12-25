import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { openImagePickerCamera } from '../utils/camera.utils';
import axios from 'axios';
import { ApiConstant, ScreenConstant } from '../const';

const HomeCard = ({ navigation }: any) => {
    const LeftContent = (props: any) => <Avatar.Icon {...props} icon="map" />;
    const [scenarioData, setScenarioData] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await axios.get(ApiConstant.GET_SCENARIO_FIELDS);
            const responseData = response.data.data;
            setScenarioData(responseData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const goToProductScreen = (scenarioName: string) => {
        navigation.navigate(ScreenConstant.PRODUCT, { scenarioName });
    };
    const renderItem = ({ item }: any) => (
        <Card style={styles.card} onPress={() => goToProductScreen(item.name)}>
            <Card.Title title="Kịch bản" left={LeftContent} />
            <Card.Content>
                <Text variant="titleLarge">{item.scenario_name}</Text>
                <Text variant="bodyMedium">{item.description}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <FlatList
            data={scenarioData}
            renderItem={renderItem}
            keyExtractor={(item) => item.name.toString()}
            onEndReachedThreshold={0.1}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 8,
    },
});

export default HomeCard;
