import React, { useState } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/login/Login';
import ChangePasswordScreen from './src/screens/login/ChangePassword';
import ForgotPasswordScreen from './src/screens/login/ForgotPassword';
import Product from './src/screens/Product';
import HomeCard from './src/components/VisitCard/HomeCard';
import Home from './src/screens/Home/HomeScreen';
import CameraModal from './src/components/CameraModal';
import SubmitFormModal from './src/components/SubmitForm';
import ScenarioScreen from './src/screens/Scenario/ScenatioScreen';
import ScenarioSKU from './src/components/ScenarioType/ScenarioSKU';
import ScenarioASSET from './src/components/ScenarioType/ScenarioASSET';
import ScenarioPOSM from './src/components/ScenarioType/ScenarioPOSM';
import DetailScreen from './src/screens/DetailScreen';
import Pickture from './src/screens/ListPickture/Pickture';
import PicktureAsset from './src/screens/ListPickture/PicktureAsset';
import PickturePosm from './src/screens/ListPickture/PickturePosm';
import { ScreenConstant } from './src/const';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import AppNavigationContainer from './src/navigation';

MapLibreGL.setAccessToken(null);
const Stack = createStackNavigator();
const newTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000',
    },
};
const App = () => {
    return (
        <PaperProvider theme={newTheme}>
            <AppNavigationContainer></AppNavigationContainer>
        </PaperProvider>
    );
};
export default App;
