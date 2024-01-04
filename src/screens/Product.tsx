import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { ActivityIndicator, Avatar, Button, Card, Modal, Portal, Text } from 'react-native-paper';
import SubmitFormModal from '../components/SubmitForm';
import { ApiConstant } from '../const';
import { openImagePickerCamera } from '../utils/camera.utils';
import LinearGradient from 'react-native-linear-gradient';
import FormSkuModal from '../components/FormDoctype/SkuModal';
import FormAssetsModal from '../components/FormDoctype/AssetModal';
import FormPosmModal from '../components/FormDoctype/PosmModal';

const Product = ({ route }: any) => {
    const [productData, setProductData] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [nameProduct, setNameProduct] = useState<string | null>(null);
    const [formQuestion, setFormQuestion] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [responseData, setResponseData] = useState<any>(null);
    const [selectedDoctype, setSelectedDoctype] = useState<string | null>(null); // Store selected doctype
    const [nameToModal, setNameToModal] = useState<string | null>(null);
    const [scenarioIdWithoutDoctype, setScenarioIdWithoutDoctype] = useState<string | null>(null);

    const LeftContent = (props: any) => <Avatar.Icon {...props} icon="briefcase" />;

    const fetchData = async () => {
        try {
            const { scenarioId, scenarioName } = route.params;
            const [doctype, scenarioIdWithoutDoctype] = scenarioId.split('::');
            setScenarioIdWithoutDoctype(scenarioIdWithoutDoctype);
            const response = await axios.get(
                ApiConstant.GET_PRODUCT + `doctype=${doctype}&name=${scenarioIdWithoutDoctype}`,
            );
            const data = response.data;

            if (response.status === 200) {
                const scenarioLinks = data._link_titles;
                const scenarioList = Object.entries(scenarioLinks).map(([key, value]) => ({ key, value }));
                setProductData(scenarioList);
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

    const handleSubmit = (name: string, doctype: string, names: string) => {
        setNameProduct(name);
        setModalVisible(true);
        setSelectedDoctype(doctype);
        setNameToModal(names);
    };

    const hideModal = () => {
        setModalVisible(false);
        setNameProduct(null);
        setSelectedDoctype(null);
    };

    const handleCheckin = (name: string) => {
        console.log(name);
        openImagePickerCamera((uri: any) => {
            setCapturedImageUri(uri);
            console.log(uri);
        });
    };
    useEffect(() => {
        fetchData();
    }, [route.params]);
    const handleRetry = () => {
        setLoading(true);
        fetchData();
    };

    const renderModalContent = () => {
        const product_names = productData.map((item) => item.value);
        const product_names_string = product_names.join(', ');
        switch (selectedDoctype) {
            case 'Product_SKU':
                return (
                    <FormSkuModal
                        visible={isModalVisible}
                        onClose={hideModal}
                        onSubmit={handleSubmit}
                        productId={nameProduct}
                        scenarioName={route.params?.scenarioName || ''}
                        formQuestion={formQuestion}
                        product_name={product_names_string}
                        nameToModal={nameToModal}
                        scenario_code={scenarioIdWithoutDoctype}
                    />
                );
            case 'Assets':
                return (
                    <FormAssetsModal
                        visible={isModalVisible}
                        onClose={hideModal}
                        onSubmit={handleSubmit}
                        productId={nameProduct}
                        scenarioName={route.params?.scenarioName || ''}
                        formQuestion={formQuestion}
                        product_name={product_names_string}
                        nameToModal={nameToModal}
                        scenario_code={scenarioIdWithoutDoctype}
                    />
                );
            case 'POSM':
                return (
                    <FormPosmModal
                        visible={isModalVisible}
                        onClose={hideModal}
                        onSubmit={handleSubmit}
                        productId={nameProduct}
                        scenarioName={route.params?.scenarioName || ''}
                        formQuestion={formQuestion}
                        product_name={product_names_string}
                        nameToModal={nameToModal}
                        scenario_code={scenarioIdWithoutDoctype}
                    />
                );
            default:
                return null;
        }
    };

    const renderProductItem = ({ item }: any) => {
        const dataValues =
            responseData && responseData.docs && responseData.docs.length > 0 ? responseData.docs[0] : null;

        const keyParts = item.key.split('::');
        let checkDoctype = keyParts[0];
        let names = keyParts[1];
        return (
            <Card style={styles.card}>
                <Card.Title title={item.value} left={LeftContent} />
                <Card.Content>
                    <Text variant="titleLarge">{dataValues.scenario_name}</Text>
                    <Text variant="titleLarge">{dataValues.description}</Text>
                </Card.Content>
                <Card.Actions>
                    {/* <Button mode="contained-tonal" onPress={() => handleCheckin(item.product_name)}>
                Checkin
            </Button> */}
                    <Button buttonColor="#1abc9c" onPress={() => handleSubmit(item.value, checkDoctype, names)}>
                        Submit
                    </Button>
                </Card.Actions>
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
                        data={productData}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item.key}
                        contentContainerStyle={styles.flatListContainer}
                        ListEmptyComponent={<Text>No products found.</Text>}
                    />
                )}
                {!loading && productData.length === 0 && (
                    <View style={styles.retryContainer}>
                        <Text style={styles.retryText}>No data available. Please retry.</Text>
                        <Button mode="contained" onPress={handleRetry} style={styles.retryButton}>
                            Retry
                        </Button>
                    </View>
                )}
                <Portal>
                    <Modal visible={isModalVisible} onDismiss={hideModal}>
                        {renderModalContent()}
                    </Modal>
                </Portal>
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
    linearGradient: {
        flex: 1,
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

export default Product;
