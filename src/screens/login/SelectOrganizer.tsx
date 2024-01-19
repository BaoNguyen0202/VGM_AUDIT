import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { ImageAssets } from '../../assets';
import { Button, TextInput } from 'react-native-paper';

const SelectOrganizer = ({ navigation }: any) => {
    const [organizer, setOrganizer] = useState('');
    const _renderLabel = () => {
        return <Text style={styles.headerLabel}>Tổ chức</Text>;
    };
    return (
        <View style={styles.headerContainer}>
            <Image source={ImageAssets.InitLogo} style={styles.logo} />
            <View style={styles.container}>
                {_renderLabel()}

                <TextInput
                    label="Tên tổ chức"
                    mode="outlined"
                    value={organizer}
                    onChangeText={(text) => setOrganizer(text)}
                    style={styles.input}
                />
                <Button
                    onPress={() => {
                        navigation.goBack();
                    }}
                    mode="contained"
                    style={styles.button}
                >
                    Tiếp tục
                </Button>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f6f8',
    },
    container: {
        padding: 16,
        top: '20%',
    },
    logo: {
        resizeMode: 'contain',
        alignSelf: 'center',
        width: '30%',
        top: '10%',
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 24,
    },
    input: {
        marginVertical: 16,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    button: {
        marginTop: 8,
        backgroundColor: '#881111',
    },
});

export default SelectOrganizer;
