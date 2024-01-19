import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StatusBar,
  BackHandler,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Splash from './src/assets/images/whiteLogo.png';
function SplashImageScreen({ navigation }) {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    storeData();
    setTimeout(() => {
      SplashScreen.hide();
    }, 300);
  }, []);

  const storeData = async () => {
    const value = await AsyncStorage.getItem('loggedIn');
    if (value) {
      navigation.replace('DrawerContainer');
      setLogin(true);
    } else {
      navigation.replace('LoginStack');
    }
  };

  return (
    <View style={styles.logocontainer}>
      <Image
        resizeMode={'contain'}
        source={Splash}
        style={{
          width: 100,
          height: 100,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </View>
  );
}

export default SplashImageScreen;

const styles = StyleSheet.create({
  logocontainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
