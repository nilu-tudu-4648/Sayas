import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createSwitchNavigator } from '@react-navigation/compat';
import SplashImageScreen from './splashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomDrawer from './src/screens/CustomDrawer'
import PortfolioScreen from './src/screens/PortfolioScreen'
import LoginScreen from './src/screens/loginScreen'
import TransactionScreen from './src/screens/transactionScreen';
import NotificationScreen from './src/screens/notificationScreen';
import CertificateScreen from './src/screens/certificateScreen';
import LandingScreen from './src/screens/landingScreen';
import AcquisitionScreen from './src/screens/acquisitionsScreen';
import ProfileScreen from './src/screens/ProfileScreen'
import ForgotScreen from './src/screens/ForgotpasswordScreen'
import SupportWeb from './src/screens/SupportWeb';
import SignUpScreen from './src/screens/SignUpScreen';
import PersonalDetailsScreen from './src/screens/PersonalDetailsScreen';
import TermsandConditionScreen from './src/screens/TermsandConditionScreen'
import OccupationDetailsScreen from './src/screens/OccupationDetailsScreen'
import DocumentUploadScreen from './src/screens/DocumentUploadScreen';
import Confirmation from './src/screens/Confirmation';
import Payment from './src/screens/Payment';
import DataAccuScreen from './src/components/DataAccuScreen';

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
  headerShown: false,
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const PortfolioStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="PortfolioScreen" component={PortfolioScreen} />
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="CertificateScreen" component={CertificateScreen} />
    </Stack.Navigator>
  );
};

const TransactionStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="CertificateScreen" component={CertificateScreen} />
    </Stack.Navigator>
  );
};



const HomeStack = () => {

  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="AcquisitionScreen" component={AcquisitionScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="CertificateScreen" component={CertificateScreen} />
      <Stack.Screen name="DataAccuScreen" component={DataAccuScreen} />
    </Stack.Navigator>
  );
}

const LoginStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName='WelcomeScreen' >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="PersonalDetailsScreen" component={PersonalDetailsScreen} />
      <Stack.Screen name="DocumentUploadScreen" component={DocumentUploadScreen} />
      <Stack.Screen name="OccupationDetailsScreen" component={OccupationDetailsScreen} />
      {/* <Stack.Screen name="TermsandConditionScreen" component={TermsandConditionScreen} /> */}
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
      <Stack.Screen name="Confirmation" component={Confirmation} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
}



function DrawerContainer() {
  return (
    <Drawer.Navigator screenOptions={screenOptionStyle} drawerContent={props => <CustomDrawer {...props} />} >
      <Drawer.Screen options={{
        drawerLabel: 'Home',
        drawerIcon: ({ color }) => (
          <Ionicons name='home-outline' size={22} color={color} />
        )
      }} name="HomeStack" component={HomeStack} />
      <Drawer.Screen options={{
        drawerIcon: ({ color }) => (
          <FontAwesome5 name='folder-open' size={22} color={color} />
        )
      }} name="Portfolio" component={PortfolioScreen} />
      <Drawer.Screen options={{
        drawerIcon: ({ color }) => (
          <FontAwesome5 name='history' size={22} color={color} />
        )
      }} name="Transactions" component={TransactionStack} />
      <Drawer.Screen
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name='support-agent' size={24} color={color} />
          )
        }} name="Support" component={SupportWeb} />
    </Drawer.Navigator>
  );
}






const RootStack1 = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="SplashScreen" component={SplashImageScreen} />
      <Stack.Screen name="LoginStack" component={LoginStack} />
      <Stack.Screen name="PortfolioStack" component={PortfolioStack} />
      <Stack.Screen name="DrawerContainer" component={DrawerContainer} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function StackNavigation() {

  // BackHandler.addEventListener('hardwareBackPress', () => {
  //   console.log('name')
  //   // BackHandler.exitApp()
  //   // if (routes.name == "WelcomeScreen" && !firstTimeuserField) {
  //   //     console.log('re')
  //   // }
  //   return true;
  // }, []);

  return (
    <NavigationContainer screenOptions={screenOptionStyle}>
      <RootStack1 />
    </NavigationContainer>
  );
}




// export default function StackNavigation() {

//   const { isLogin } = useSelector(state => state.portfolio)
//   console.log({ isLogin })
//   const [login, setLogin] = useState(false);
//   return (
//     <NavigationContainer screenOptions={screenOptionStyle}>
//       {!login ? <LoginStack /> : <RootStack />}
//     </NavigationContainer>
//   );
// }

// let arr = [
//   {name:'niel'},
//   {name:'ertyn'},
//   {name:'bogn'}
// ]

// const ans = {name :'niel',ans:'erirer'}

// const mapd = arr.map(item=>{
//   if (item.name.includes(ans.name)) return {...item,...ans}
//   return {...item}
// })
// // const mapd = arr.forEach(item=>{
// //   return {...item,yritem:'he'}
// // })
// console.log(mapd)