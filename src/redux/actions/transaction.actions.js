import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const GET_USER_BY_ID = 'GET_USER_BY_ID'
export const ERRORS = 'ERRORS'
export const APPLICATION_MONEY = 'APPLICATION_MONEY'
export const TRANSACTION_APPLICATION = 'TRANSACTION_APPLICATION'
export const SHARES_FOR_MEMBER = 'SHARES_FOR_MEMBER'
import { BASE_URL } from "../../../constants";

export const applicationMoneyList = BASE_URL + '/member/moneyTransactions/';
export const getSharesMember = BASE_URL + '/member/shareTransactions/';

let userToken = null;
let userDetails = null;
export const transactionApplicationMoneyApi = (userData, fn) => async dispatch => {
    let userDetailsdata = await AsyncStorage.getItem('userDetails');
    let extractUserToken = JSON.parse(userDetailsdata);
    userToken = extractUserToken[0].token;
    userDetails = extractUserToken[1];
    var config = {
        method: 'get',
        url: `${applicationMoneyList}${userDetails.user}`,
        headers: {
            Authorization: 'Bearer ' + userToken,
        },
    }
    try {
        dispatch(transactionShareIssuanceApi())
        const { data } = await axios(config)
        dispatch({ type: APPLICATION_MONEY, payload: data[0].balance })
        dispatch({ type: TRANSACTION_APPLICATION, payload: data })
    } catch (error) {
        console.log(error)
    }

}
export const transactionShareIssuanceApi = (userData, fn) => async dispatch => {
    let userDetailsdata = await AsyncStorage.getItem('userDetails');
    let extractUserToken = JSON.parse(userDetailsdata);
    userToken = extractUserToken[0].token;
    userDetails = extractUserToken[1];
    var config = {
        method: 'get',
        url: `${getSharesMember}${userDetails.user}`,
        headers: {
            Authorization: 'Bearer ' + userToken,
            'Content-Type': 'application/json',
        }
    }
    try {
        const { data } = await axios(config)
        dispatch({ type: SHARES_FOR_MEMBER, payload: data })
    } catch (error) {
        console.log(error)
    }

}