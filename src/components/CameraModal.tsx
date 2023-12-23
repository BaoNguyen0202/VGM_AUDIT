import React, { useRef } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { IconButton } from 'react-native-paper';
import { insertPhoto } from '../../db';

const CameraModal = ({ isCameraOpen, setCameraOpen, toggleCamera, setCapturedImage }: any) => {
    const cameraRef = useRef<RNCamera | null>(null);

    const takePicture = async () => {
        if (cameraRef.current && isCameraOpen) {
            try {
                const options = { quality: 0.5, base64: true };
                const data = await cameraRef.current.takePictureAsync(options);
                setCapturedImage(data.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
            } finally {
                setCameraOpen(false);
            }
        }
    };

    return (
        <Modal visible={isCameraOpen} animationType="slide" transparent>
            <RNCamera style={{ flex: 1 }} ref={cameraRef}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                        <View style={styles.captureIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.cameraControls}>
                    <IconButton
                        icon="arrow-left-bold"
                        iconColor={'#FFF'}
                        size={20}
                        onPress={() => setCameraOpen(false)}
                    />
                    <IconButton icon="sync" iconColor={'#FFF'} size={20} onPress={toggleCamera} />
                </View>
            </RNCamera>
        </Modal>
    );
};
export const styles = StyleSheet.create({
    captureButton: {
        backgroundColor: 'white',
        borderRadius: 45,
        padding: 15,
        paddingHorizontal: 20,
        marginBottom: -50,
    },
    captureIcon: {
        backgroundColor: 'gray',
        borderRadius: 25,
        width: 30,
        height: 30,
    },
    cameraControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    menuContainer: {
        position: 'absolute',
        top: 70,
        right: 0,
    },
});
export default CameraModal;
