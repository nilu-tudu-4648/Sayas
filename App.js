import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  LogBox,
} from 'react-native';


import PushNotification, { Importance } from 'react-native-push-notification';

import { getNotificationsinForeground, getNotificationsLength } from './src/redux/actions/notifications.actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigation from './AppNavigation';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  notificationListner,
  requestUserPermission,
} from './src/Notification/Notifications';
import ForegroundHandler from './src/Notification/ForegroundHandler';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead',
  "EventEmitter.removeListener('change', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function."
]);

const App = () => {

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    try {
      // PushNotification.localNotification({
      //   /* Android Only Properties */
      //   channelId: 'channel-id',
      //   color: 'green', // (optional) default: system default
      //   vibrate: true, // (optional) default: true
      //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //   title: 'notification', // (optional)
      //   message: 'notification', // (required)
      //   body: ' notification', // (required)
      //  picture: 'https://www.bing.com/th?id=ORMS.4ccef3966920e3b653a35d4b64b77504&pid=Wdp&w=300&h=225&qlt=60&c=1&rs=1&dpr=0.9749999642372131&p=0'
      // });
    } catch (error) {
      console.log(error)
    }
    PushNotification.deleteChannel("fcm_fallback_notification_channel")
    PushNotification.getChannels(function (channel_ids) {
      console.log(channel_ids); // ['channel_id_1'] 
    });
  }, [])
  useEffect(() => {
    requestUserPermission();
    notificationListner();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ForegroundHandler />
        <AppNavigation />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
