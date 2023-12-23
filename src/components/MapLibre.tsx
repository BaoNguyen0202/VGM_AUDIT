import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

const MapLibre = () => {
    return (
        <View style={styles.page}>
            <MapLibreGL.MapView
                style={styles.map}
                logoEnabled={false}
                styleURL="https://demotiles.maplibre.org/style.json"
            />
        </View>
    );
};
export default MapLibre;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        flex: 1,
        alignSelf: 'stretch',
    },
});
