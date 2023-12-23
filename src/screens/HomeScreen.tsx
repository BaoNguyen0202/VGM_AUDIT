import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import HomeCard from '../components/HomeCard';
import HomeMenu from '../components/HomeMenu';
import CameraModal from '../components/CameraModal';
import SubmitForm from '../components/SubmitForm';

const Home = ({ navigation, route }: any) => {
    const _goBack = () => console.log('Went back');
    const _handleSearch = () => console.log('Searching');

    const [visible, setVisible] = useState(false);
    const [isCameraOpen, setCameraOpen] = useState(false);

    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const [isFrontSubmit, setIsFrontSubmit] = useState(false);
    const [capturedImage, setCapturedImage] = useState('');
    const [submitPoint, setSubmitPoint] = useState(null);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const toggleCamera = () => {
        setIsFrontCamera((prev) => !prev);
    };
    const toggleSubmit = () => {
        setIsFrontSubmit((prev) => !prev);
    };
    const handleModalClose = () => {
        setCapturedImage('');
        setSubmitPoint(null);
    };
    const { openSubmitForm, product } = route.params || {};
    const [isSubmitOpen, setSubmitOpen] = useState(!!openSubmitForm);
    const openSubmitFormCallback = useCallback(() => {
        setSubmitOpen(true);
    }, []);
    return (
        <>
            <HomeMenu visible={visible} closeMenu={closeMenu} />
            <CameraModal
                isCameraOpen={isCameraOpen}
                setCameraOpen={setCameraOpen}
                toggleCamera={toggleCamera}
                setCapturedImage={setCapturedImage}
            />
            <HomeCard
                navigation={navigation}
                setCameraOpen={setCameraOpen}
                setSubmitOpen={setSubmitOpen}
                capturedImage={capturedImage}
                setSubmitPoint={setSubmitPoint}
            />
            {isSubmitOpen && (
                <>
                    <View style={styles.modalBackground}>
                        <SubmitForm
                            isSubmitOpen={isSubmitOpen}
                            setSubmitOpen={setSubmitOpen}
                            setCameraOpen={setCameraOpen}
                            toggleSubmit={toggleSubmit}
                            capturedImage={capturedImage}
                            onCloseModal={handleModalClose}
                            submitPoint={submitPoint}
                            openSubmitFormCallback={openSubmitFormCallback}
                        />
                    </View>
                </>
            )}
        </>
    );
};
const styles = StyleSheet.create({
    modalBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Home;
