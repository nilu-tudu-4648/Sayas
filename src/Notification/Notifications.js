import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Store } from '../redux/store';

export async function requestUserPermission() {

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getfcmToken();
  }
}

const getfcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('the old token', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'new');
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'errorNotification');
    }
  }
};
export const notificationListner = async (callback) => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    )
    // Store.dispatch(singleBackgroundnotifsave(Store.getState().notification.allNotification[0]))
    // console.log(Store.getState().notification.allNotification[0],'back')
    // callback(remoteMessage)
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // console.log(Store.getState().notification.allNotification,'kill')
        // Store.dispatch(singleBackgroundnotifsave(Store.getState().notification.allNotification[0]))
        // callback(remoteMessage)
      }
    });
};
