import React, {  useEffect } from "react";
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useDispatch,  } from 'react-redux';
import { getNotificationsforMemberbyId,   } from '../redux/actions/notifications.actions';


const ForegroundHandler = () => {
  const dispatch = useDispatch()
  const notififunc = (para) => {
    if (para[0].attachmentUrl) {
      const urls = para[0].attachmentUrl?.split(".")
      PushNotification.localNotification({
        /* Android Only Properties */
        largeIcon: '',
        channelId: 'channel-id',
        color: 'green', // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        title: para[0]?.title, // (optional)
        message: para[0]?.body, // (required)
        body: para[0]?.body, // (required)
        tag: para[0]?._id,
        bigPictureUrl: `${urls[urls.length - 1] == 'pdf' ? 'https://as1.ftcdn.net/v2/jpg/00/82/56/50/1000_F_82565082_VlCkD9spnOhdjlB9LnO6ukaUXTHKZm0v.jpg'
          : para[0].attachmentUrl}`
      });
    } else {
      PushNotification.localNotification({
        /* Android Only Properties */
        largeIcon: '',
        channelId: 'channel-id',
        color: 'green', // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        title: para[0]?.title, // (optional)
        message: para[0]?.body, // (required)
        body: para[0]?.body, // (required)
        tag: para[0]?._id,
        // bigPictureUrl: `${urls[urls.length - 1] == 'pdf' ? 'https://as1.ftcdn.net/v2/jpg/00/82/56/50/1000_F_82565082_VlCkD9spnOhdjlB9LnO6ukaUXTHKZm0v.jpg'
        //   : para[0].attachmentUrl}`
      });
    }
    // const urlchange = "https://sayas-public.s3.amazonaws.com/1651565286745Corrigendum&Amendmentno.5ofCENRRC01-2019-Hi.jpg"

  }
  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      remoteMessage && dispatch(getNotificationsforMemberbyId(notififunc))
      console.log({ remoteMessage })
    });
    return unsubscribe;
  }, []);
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background handler!', remoteMessage);
    // remoteMessage && dispatch(getNotificationsforMemberbyId(notififunc))
  });
  return null;
};
export default ForegroundHandler;
