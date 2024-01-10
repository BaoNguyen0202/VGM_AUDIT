import React, { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/login/Login';
import ChangePasswordScreen from './src/screens/login/ChangePassword';
import ForgotPasswordScreen from './src/screens/login/ForgotPassword';
import Product from './src/screens/Product';
import HomeCard from './src/components/HomeCard';
import Home from './src/screens/HomeScreen';
import CameraModal from './src/components/CameraModal';
import SubmitFormModal from './src/components/SubmitForm';
import ScenarioScreen from './src/screens/ScenatioScreen';
import ScenarioSKU from './src/components/ScenarioType/ScenarioSKU';
import ScenarioASSET from './src/components/ScenarioType/ScenarioASSET';
import ScenarioPOSM from './src/components/ScenarioType/ScenarioPOSM';

MapLibreGL.setAccessToken(null);
const Stack = createStackNavigator();

const App = () => {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen
                        name="ForgotPassWord"
                        component={ForgotPasswordScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="ChangePass" component={ChangePasswordScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Root" component={RootNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="Product" component={Product} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                    <Stack.Screen name="Scenario" component={ScenarioScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ScenarioSKU" component={ScenarioSKU} options={{ headerShown: false }} />
                    <Stack.Screen name="ScenarioASSET" component={ScenarioASSET} options={{ headerShown: false }} />
                    <Stack.Screen name="ScenarioPOSM" component={ScenarioPOSM} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};
export default App;
