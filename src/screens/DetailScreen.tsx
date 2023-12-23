// Detail.js
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Title, Paragraph, Avatar, Text, Button, Portal, Dialog } from 'react-native-paper';
import { getAllProducts, deleteProduct } from '../../db';

interface Product {
    id: number;
    name: string;
    quantity: number;
    description: string;
    imagePath: string;
    submitPoint: number;
}

const Detail = () => {
    const temporaryPoints = [
        { id: 1, name: 'Hà Nội' },
        { id: 2, name: 'Hồ Chí Minh' },
        { id: 3, name: 'Sài Gòn' },
        { id: 4, name: 'Paris' },
    ];
    const [products, setProducts] = useState<Product[]>([]);
    const [visible, setVisible] = React.useState(false);
    const [selectedProductId, setSelectedProductId] = React.useState(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const _goBack = () => console.log('Went back');

    const _handleSearch = () => console.log('Searching');

    const _handleMore = () => console.log('Shown more');

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProducts();
        setRefreshing(false);
    }, []);

    const fetchProducts = async () => {
        try {
            const productList = await getAllProducts();
            setProducts(productList);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const showDialog = (productId: any) => {
        setVisible(true);
        setSelectedProductId(productId);
    };

    const hideDialog = () => {
        setVisible(false);
        setSelectedProductId(null);
    };

    const deleteProductById = async (productId: any) => {
        try {
            await deleteProduct(productId);
            fetchProducts();
            hideDialog();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <ScrollView
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {products.map((product) => (
                    <Card key={product.id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <View style={styles.leftContent}>
                                <Card.Cover source={{ uri: product.imagePath }} />
                            </View>
                            <View style={styles.rightContent}>
                                <Card.Content>
                                    <Text variant="bodyMedium" style={styles.text}>
                                        Điểm bán tại:
                                        {temporaryPoints.find((point) => point.id === product.submitPoint)?.name ||
                                            'Unknown'}
                                    </Text>
                                    <Text variant="titleLarge" style={styles.text}>
                                        Name:{product.name}
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.text}>
                                        Quantity: {product.quantity}
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.text}>
                                        Description: {product.description}
                                    </Text>
                                </Card.Content>
                                <View style={styles.buttonContainer}>
                                    <Card.Actions>
                                        <Button onPress={() => showDialog(product.id)}>Delete</Button>
                                        <Button>Ok</Button>
                                    </Card.Actions>
                                </View>
                            </View>
                        </View>
                    </Card>
                ))}
            </ScrollView>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Confirm Deletion</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Are you sure you want to delete this product?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Cancel</Button>
                        <Button onPress={() => deleteProductById(selectedProductId)}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Button icon="sync" mode="contained-tonal" onPress={() => console.log('sync')}>
                Sync
            </Button>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
    },
    leftContent: {
        flex: 1,
    },
    rightContent: {
        flex: 1,
        paddingLeft: 16,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    text: {
        marginTop: 8,
    },
});
export default Detail;
