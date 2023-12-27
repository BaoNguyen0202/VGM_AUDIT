import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { ActivityIndicator, Button, Card, Modal, Portal, Text } from 'react-native-paper';
import SubmitFormModal from '../components/SubmitForm';
import { ApiConstant } from '../const';

const Product = ({ route, navigation }: any) => {
    const [productData, setProductData] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [nameProduct, setNameProduct] = useState<string | null>(null);
    const [formQuestion, setFormQuestion] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { scenarioName } = route.params;

            const response = await axios.get(ApiConstant.GET_PRODUCT + scenarioName);

            const responseData = response.data;

            if (response.status === 200) {
                const products = responseData.docs[0].products || [];
                setProductData(products);
                const fetchedFormQuestion = responseData.docs[0].form_question || [];
                setFormQuestion(fetchedFormQuestion);
            } else {
                console.error('Error fetching product data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [route.params]);
    const handleSubmit = (name: string) => {
        setNameProduct(name);
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
        setNameProduct(null);
    };
    const renderModalContent = () => {
        return (
            <SubmitFormModal
                visible={isModalVisible}
                onClose={hideModal}
                onSubmit={handleSubmit}
                productId={nameProduct}
                scenarioName={route.params?.scenarioName || ''}
                formQuestion={formQuestion}
            />
        );
    };

    const renderItem = ({ item }: any) => (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleLarge">{item.product_name}</Text>
            </Card.Content>
            <Card.Actions>
                <Button mode="contained-tonal">Checkin</Button>
                <Button buttonColor="#1abc9c" onPress={() => handleSubmit(item.product_name)}>
                    Submit
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator style={styles.loader} animating={true} color={'#000'} size="large" />
            ) : (
                <FlatList
                    data={productData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={styles.flatListContainer}
                    ListEmptyComponent={<Text>No products found.</Text>}
                />
            )}
            <Portal>
                <Modal visible={isModalVisible} onDismiss={hideModal}>
                    {renderModalContent()}
                </Modal>
            </Portal>
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
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Product;
