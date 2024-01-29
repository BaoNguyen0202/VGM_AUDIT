import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, PermissionsAndroid, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    ActivityIndicator,
    Avatar,
    Button,
    Card,
    Icon,
    IconButton,
    Modal,
    Portal,
    Surface,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import { ApiConstant, AppConstant } from '../../const';
import LinearGradient from 'react-native-linear-gradient';
import { openImagePickerCamera } from '../../utils/camera.utils';
import { CommonUtils } from '../../utils';
import { useMMKVString } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScenarioSKU = ({ route, navigation }: any) => {
    const [scenarioIdWithoutDoctype, setScenarioIdWithoutDoctype] = useState<string | null>(null);
    const [productData, setProductData] = useState<any[]>([]);
    const [responseData, setResponseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [hasCapturedImage, setHasCapturedImage] = useState(false);

    const LeftContent = () => <Icon source={'note-check-outline'} size={24} color="#22c55e" />;
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
    const handleRetry = () => {
        setLoading(true);
        fetchData();
    };
    const handleCheckin = async (key: string) => {
        const selectedProduct = productData.find((product) => product.key === key);
        const { scenarioName } = route.params;

        if (selectedProduct) {
            navigation.navigate('Pickture', { selectedProduct, scenarioName });
        }
    };

    const handleSave = async () => {
        // Sử dụng giá trị từ allProducts

        const formsData = [];

        // Duyệt qua mảng allProducts để tạo dữ liệu
        for (const product of allProducts) {
            const formData = {
                docstatus: 0,
                doctype: 'ReportProduct_SKU',
                parentfield: 'report_product',
                parenttype: 'DashboardRetail',
                scenario_name: dataValues.scenario_name,
                product_name: product.value,
                product_count: 0,
                uri_images: JSON.stringify(product.uri_image),
            };

            formsData.push(formData);
        }

        try {
            await AsyncStorage.setItem('savedFormSKU' + route.params.scenarioName, JSON.stringify(formsData));
            const a = await AsyncStorage.getItem('savedFormSKU' + route.params.scenarioName);
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Submit Failed', 'Submit failed. Please try again.');
        } finally {
            setLoading(false);
            Alert.alert('Lưu thành công');
            await navigation.goBack();
        }
    };

    useEffect(() => {
        const updatedProduct = route.params?.updatedProduct;
        if (updatedProduct) {
            setAllProducts((prevProducts) => {
                const index = prevProducts.findIndex((product) => product.key === updatedProduct.key);
                setHasCapturedImage(true);

                if (index !== -1) {
                    return [...prevProducts.slice(0, index), updatedProduct, ...prevProducts.slice(index + 1)];
                } else {
                    return [...prevProducts, updatedProduct];
                }
            });
        }
    }, [route.params?.updatedProduct]);
    useEffect(() => {}, [allProducts]);
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
                <Text style={styles.headerLabel}>Kịch bản SKU</Text>

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
    var dataValues = responseData && responseData.docs && responseData.docs.length > 0 ? responseData.docs[0] : null;
    const renderProductItem = ({ item }: any) => {
        const keyParts = item.key.split('::');
        let checkDoctype = keyParts[0];
        let names = keyParts[1];
        return (
            <View>
                <Card mode="contained" style={styles.card}>
                    <Card.Title
                        titleStyle={{ marginLeft: -20, fontSize: 18, fontWeight: 'bold' }}
                        title={dataValues?.scenario_name}
                        left={LeftContent}
                    />
                    <View style={styles.line} />
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.iconTextContainer}>
                            <IconButton style={styles.iconButton} icon="file-outline" iconColor="#000" size={20} />
                            <Text variant="bodyMedium">{item.value}</Text>
                        </View>
                    </Card.Content>
                    <TouchableOpacity onPress={() => handleCheckin(item.key)}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardSection}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Surface style={styles.surface} elevation={4}>
                                        <Icon color="#8e2ad1" source={'camera-outline'} size={24} />
                                    </Surface>
                                    <Text>Chụp ảnh</Text>
                                </View>
                                <Icon source={'chevron-right'} size={24} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>
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
                <View style={styles.saveButtonContainer}>
                    <Button style={styles.takeButton} textColor={'#FFF'} icon={'content-save'} onPress={handleSave}>
                        Lưu
                    </Button>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
        borderRadius: 20,
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
    saveButtonContainer: {
        paddingHorizontal: 10,
        alignSelf: 'center',
        bottom: 15,
    },
    saveButton: {
        width: 100,
        height: 40,
    },
    cardHeader: {
        top: 0,
        right: 0,
        padding: 10,
        zIndex: 1,
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 100,
        marginLeft: '25%',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardSection: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    countInput: {
        width: '80%',
        height: 50,
    },
    takeButton: {
        width: '100%',
        height: 40,
        marginBottom: 20,
        borderColor: '#4697e8',
        backgroundColor: '#22c55e',
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
    rightContentContainer: {
        backgroundColor: '#a2ded0',
        borderRadius: 8,
        margin: 8,
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '20%',
    },
    line: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 4,
        marginHorizontal: 20,
    },
    iconButton: {
        marginLeft: -5,
    },
    capturedButton: {
        borderColor: '#22c55e',
    },
    surface: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: '#FFF',
        borderRadius: 10,
        backgroundColor: '#efe4f7',
    },
});

export default ScenarioSKU;
