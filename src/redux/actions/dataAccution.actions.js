import axios from "axios";
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SET_DATAACQUISTION = 'SET_DATAACQUISTION'
import { BASE_URL } from "../../../constants";


export const getDataAcquistion = BASE_URL + '/dataAcquisition';
export const submitdataAcquitionApi = BASE_URL + '/dataAcquisitionResponse';

let userToken = null;
let userDetails = null;

export const getDataAccuApi = () => async dispatch => {
    let userDetailsdata = await AsyncStorage.getItem('userDetails');
    let extractUserToken = JSON.parse(userDetailsdata);
    userToken = extractUserToken[0].token;
    var config = {
        method: 'get',
        url: getDataAcquistion,
        headers: {
            Authorization: 'Bearer ' + userToken,
            'Content-Type': 'application/json',
        },
    };
    try {
        const data = await axios(config)
        // console.log(data.data,'action')
        dispatch({type:SET_DATAACQUISTION,payload:data.data})
    } catch (error) {
        console.log(error.response.data, 'getAcquistionDataApi')
    }
}
export const submitdataAcquisition = (formdata) => async dispatch => {
    var config = {
        method: 'post',
        url: submitdataAcquitionApi,
        headers: {
            Authorization: 'Bearer ' + userToken,
            'Content-Type': 'application/json',
        },
        data: formdata,
    };
    try {
        const data = await axios(config)
        console.log(data)
    } catch (error) {
        console.log(error.response.data, 'submitdataAcquisition')
    }
}