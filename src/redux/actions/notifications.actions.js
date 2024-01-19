import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS'
export const READ_NOTIFICATIONS = 'READ_NOTIFICATIONS'
export const UNREAD_NOTIFICATIONS = 'UNREAD_NOTIFICATIONS'
export const ALL_NOTIFICATIONS = 'ALL_NOTIFICATIONS'
export const EMPTY_NOTIFICATIONS = 'EMPTY_NOTIFICATIONS'
export const NOTIFI_LENGTH = 'NOTIFI_LENGTH'
export const NOTIFI_STATE = 'NOTIFI_STATE'
export const SAVE_SINGLE_BACK_NOTIFI = 'SAVE_SINGLE_BACK_NOTIFI'

import { BASE_URL } from "../../../constants";


export const notificationList = BASE_URL + '/member';
export const getNotificationsforMemberApi = BASE_URL + '/member/getNotifications/';
export const readNotificationAPI = BASE_URL + '/member/membernotification/';


let userDetails = null;

export const getNotificationsforMemberbyId = (fn) => async dispatch => {
  try {
    let userDetailsdata = await AsyncStorage.getItem('userDetails');
    let extractUserToken = JSON.parse(userDetailsdata);
    userDetails = extractUserToken[1];
    var config = {
      method:'get',
      url: `${getNotificationsforMemberApi}${userDetails.user}`,
      headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjI1MDE0YzNjMzYyOWQ0OTM4ZjBmMjhjIiwiaWF0IjoxNjUzMzY4ODUzLCJleHAiOjE2NTM0MTIwNTMsInJvbGUiOiJhZG1pbiIsInR5cGUiOiJhY2Nlc3MifQ.miDqJMOHw1pPh4h6uDSYEGl3yoSm7yQ4QJf29iGlLpA'
      },
    };
    try {
      const { data } = await axios(config)
      const unread = data.filter(ite => !ite.read.includes(userDetails.user))
      const read = data.filter(ite => ite.read.includes(userDetails.user))
      dispatch({ type: UNREAD_NOTIFICATIONS, payload: unread })
      dispatch({ type: READ_NOTIFICATIONS, payload: read })
      dispatch({ type: ALL_NOTIFICATIONS, payload: data })
      if (fn) fn(data)
    } catch (error) {
      console.log(error.response.data,'inside error')
    }
  } catch (error) {
    console.log(error,'outside')
  }
}

export const notificationsread = (notifiID) => async dispatch => {
  const userDetailsdata = await AsyncStorage.getItem('userDetails');
  const userToken = JSON.parse(userDetailsdata)[0].token;

  var config = {
    url: `${readNotificationAPI}${userDetails.user}`,
    headers: { 
      'Authorization': 'Bearer ' + userToken,
    },
  }
  try {
    const { data } = await axios.put(config.url, { notificationId: notifiID },{
      headers:config.headers
    })
    data && dispatch(getNotificationsforMemberbyId())
  } catch (error) {
    console.log(error, 'nofiread')
  }
}
export const getNotificationsinForeground = (data) => async dispatch => {
  dispatch(getNotificationsforMemberbyId())
  dispatch({ type: SET_NOTIFICATIONS, payload: data })
}
export const getNotificationsLength = (data) => async dispatch => {
  dispatch({ type: NOTIFI_LENGTH, payload: data })
}

export const notifiStateChange = () => async dispatch => {
  dispatch({ type: NOTIFI_STATE })
}
export const getNotificationsinForegroundEmpty = () => async dispatch => {
  const resp = await AsyncStorage.getItem('notifi')
  // console.log(JSON.parse(resp), 'asdfasdfasd')
  dispatch({ type: EMPTY_NOTIFICATIONS })
}
export const singleBackgroundnotifsave = (data) => async dispatch => {
  dispatch({ type: SAVE_SINGLE_BACK_NOTIFI, payload: data })
}