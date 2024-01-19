import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SET_GRAPH = 'SET_GRAPH'
export const TRANSACTION_APPLICATION = 'TRANSACTION_APPLICATION'
export const SET_MEMBER = 'SET_MEMBER'
export const CHECK_LOGIN = 'CHECK_LOGIN'
export const CHANGE_LOGIN = 'CHANGE_LOGIN'
export const START_LOADER = 'START_LOADER'
export const STOP_LOADER = 'STOP_LOADER'
export const LOG_OUT = 'LOG_OUT'
import { BASE_URL } from "../../../constants";


export const userLogin = BASE_URL + '/auth/login';
export const getshareTransactionsForGraph = BASE_URL + '/member/shareTransactionsForGraph/'
export const getUserDetailsByMemberIdApi = BASE_URL + '/member/';

let userToken = null;
let userDetails = null;

export const loginApiredux = (userId, password) => async dispatch => {
  let fcmToken = await AsyncStorage.getItem('fcmToken')
  var fdata = {
    userId: userId,
    password: password,
    fcmToken: fcmToken
  };
  try {
    const { data } = await axios.post(`${userLogin}`, fdata)
    await AsyncStorage.setItem('userDetails', JSON.stringify([data.tokens.access, data.user]))
    data && dispatch(getMemberDetailsApi())
  } catch (error) {
    console.log(error.response.data)
  }
}


export const getMemberDetailsApi = (userData, fn) => async dispatch => {
  let userDetailsdata = await AsyncStorage.getItem('userDetails');
  let extractUserToken = JSON.parse(userDetailsdata);
  userToken = extractUserToken[0].token;
  userDetails = extractUserToken[1];
  var config = {
    method: 'get',
    url: `${getUserDetailsByMemberIdApi}${userDetails.user}`,
    headers: {
      Authorization: 'Bearer ' + userToken,
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios(config)
    dispatch({ type: SET_MEMBER, payload: data })
    console.log('getMemberDetailsApiaciton')
  } catch (error) {
    console.log(error)
  }
}
export const logoutandclear = () => async dispatch => {
  dispatch({ type: LOG_OUT })
}
export const checkLogin = (data) => async dispatch => {
  dispatch({ type: CHECK_LOGIN, payload: data })
}

export const changeLogin = () => async dispatch => {
  dispatch({ type: CHANGE_LOGIN })
}
