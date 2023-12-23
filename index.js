import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';

export default function Main() {
    return <App />;
}

AppRegistry.registerComponent(appName, () => Main);
