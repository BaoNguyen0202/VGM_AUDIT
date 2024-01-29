import React, { useState } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenConstant } from '../const';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/login/Login';
import ForgotPasswordScreen from '../screens/login/ForgotPassword';
import ChangePasswordScreen from '../screens/login/ChangePassword';
import RootNavigator from './RootNavigator';
import Product from '../screens/Product';
import Home from '../screens/Home/HomeScreen';
import ScenarioScreen from '../screens/Scenario/ScenatioScreen';
import ScenarioSKU from '../components/ScenarioType/ScenarioSKU';
import ScenarioASSET from '../components/ScenarioType/ScenarioASSET';
import ScenarioPOSM from '../components/ScenarioType/ScenarioPOSM';
import Pickture from '../screens/ListPickture/Pickture';
import PicktureAsset from '../screens/ListPickture/PicktureAsset';
import PickturePosm from '../screens/ListPickture/PickturePosm';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SelectOrganizer from '../screens/login/SelectOrganizer';
import Information from '../screens/Profile/component/Information';
import HomeCard from '../components/VisitCard/HomeCard';

const AppNavigationContainer = () => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={ScreenConstant.LOG_IN} component={LoginScreen} options={{ headerShown: false }} />

                <Stack.Screen
                    name={ScreenConstant.FORGOTPASSWORD}
                    component={ForgotPasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.CHANGE_PASS}
                    component={ChangePasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.ORGANIZER}
                    component={SelectOrganizer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name={ScreenConstant.ROOT} component={RootNavigator} options={{ headerShown: false }} />
                <Stack.Screen name={ScreenConstant.PRODUCT} component={Product} options={{ headerShown: false }} />
                <Stack.Screen name={ScreenConstant.HOME} component={Home} options={{ headerShown: false }} />
                <Stack.Screen name={ScreenConstant.HOMECARD} component={HomeCard} options={{ headerShown: false }} />
                <Stack.Screen
                    name={ScreenConstant.SCENARIO}
                    component={ScenarioScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.SCENARIOSKU}
                    component={ScenarioSKU}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.SCENARIOASSET}
                    component={ScenarioASSET}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.SCENARIOPOSM}
                    component={ScenarioPOSM}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name={ScreenConstant.PCKTURE_SKU} component={Pickture} options={{ headerShown: false }} />
                <Stack.Screen
                    name={ScreenConstant.PCKTURE_ASSET}
                    component={PicktureAsset}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.PCKTURE_POSM}
                    component={PickturePosm}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.PROFILE}
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ScreenConstant.INFORMATION}
                    component={Information}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigationContainer;
