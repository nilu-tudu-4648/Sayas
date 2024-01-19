/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import React from 'react'
// import 'react-native-gesture-handler';
import { name as appName } from './app.json';
import { Store } from './src/redux/store'
import { Provider } from 'react-redux'

export default function Main() {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
