import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';




export async function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email || re.test(email) === false) {
    return false;
  } else {
    return true;
  }
}

export const isTestnet = true;
export const BASE_URL =
  // 'https://fv4qt3kj8g.execute-api.ap-south-1.amazonaws.com/api/v1'
  'https://8ik06ithu2.execute-api.ap-south-1.amazonaws.com/api/v1'



//signUp 
export const signUpUrl = BASE_URL + "/member/create"

// Login Screen
export const userLogin = BASE_URL + '/auth/login';
export const signUp = BASE_URL + '/user/signup';
export const countryList = BASE_URL + '/openInfo/countries';

//Notifications
export const notificationList = BASE_URL + '/member';
export const getNotificationsforMemberApi = BASE_URL + '/member/getNotifications/';

//TransactionApplicationMoneyScreen
export const applicationMoneyList = BASE_URL + '/member/moneyTransactions/';
export const getSharesMember = BASE_URL + '/member/shareTransactions/';

//CertificateScreen
export const getCertificateData = BASE_URL + '/member/shareDetails/';

//LandingScreen
export const getDataAcquistion = BASE_URL + '/dataAcquisition/data/dashboard';
export const getUserDetailsByMemberIdApi = BASE_URL + '/member/';
export const submitdataAcquitionApi = BASE_URL + '/dataAcquisitionResponse';
export const getdataAcquitionResponseApi = BASE_URL + '/dataAcquisitionResponse/member/';

//portfolioScreen
export const getshareTransactionsForGraph = BASE_URL + '/member/shareTransactionsForGraph/'

//reset-password
export const Otpsend = BASE_URL + '/auth/otp/generate/';
export const OtpVerifyapi = BASE_URL + '/auth/otp/verify/';
export const resetPasswordApi = BASE_URL + '/auth/resetPassword/';
export let sdgCategoryOfMonth = null;
export let landingCompleteResponse = null;
export let favouriteListLocal = null;
export let getmemberDetails = null;
export let getShares = null;
export let Sharestransaction = null;
export let dataAcquisitionId = null;
let userToken = null;
let userDetails = null;

export async function userLoginDetails(loginDetails) {
  let userDetailsdata = await AsyncStorage.getItem('userDetails');
  let extractUserToken = JSON.parse(userDetailsdata);
  userToken = extractUserToken[0].token;
  // console.log('extractUserToken', extractUserToken);
  userDetails = extractUserToken[1];
  // console.log('userDetails', userDetails);
}

export async function getAcquistionDataApi(authToken) {
  if (!authToken) {
    await userLoginDetails();
  }
  return new Promise(async (resolve, reject) => {
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
      // console.log(data.data)
      resolve(data.data)
    } catch (error) {
      reject(error)
      Toast.show(`${error.response.data.message} login again`)
      console.log(error.response.data.message, 'getAcquistionDataApi')
    }
  });
}
export async function createNewUser(formdatas) {
  return new Promise(async (resolve, reject) => {
    var config1 = {
      method: 'post',
      url: signUpUrl,
      data: formdatas,
      headers: {
        'Content-Type': 'application/json'
      },
    };
    await axios(config1)
      .then(async function (response) {
        resolve(response.data)
        console.log(JSON.stringify(response.data));
        // Toast.show('Your Membership Application is successfully submitted')
        await AsyncStorage.clear()
      })
      .catch(function (error) {
        console.log(error.response.data);
        Toast.show('Member Creation failed')
      })
  });
}

export async function getCertficateDataOfMember(authToken) {
  if (!authToken) {
    await userLoginDetails();
  }
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${getCertificateData}${userDetails?.user}`,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    };
    try {
      axios(config)
        .then(async response => {
          if (response.status == 200) {
            console.log('coming inside, response', response.status)
            resolve(response.data);
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          resolve(null);
          reject(error);
        });
    } catch (e) {
      resolve(null);
      reject(e);
    }
  });
}
export async function loginApi(userId, password) {
  return new Promise(async (resolve, reject) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    var data = JSON.stringify({
      userId: userId,
      password: password,
      fcmToken: fcmToken,
      type: 'member'
    });
    var config = {
      method: 'post',
      url: userLogin,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(async function (response) {
        // console.log('JSON.stringify(response.data)', response);
        if (response.status == 200) {
          await AsyncStorage.setItem(
            'userDetails',
            JSON.stringify([response.data.tokens.access, response.data.user]),
          );
          await AsyncStorage.setItem('loggedIn', 'true');
          let userDetailsResponse = await AsyncStorage.getItem('userDetails');
          console.log('userDetailsResponse', JSON.parse(userDetailsResponse));
          resolve('success');
          Toast.show('Login succesfully', Toast.LONG);
        } else {
          resolve('null');
          Toast.show('Login failed', Toast.LONG);
        }
      })
      .catch(function (error) {
        Toast.show(error.response.data.error)
        // console.log('error error', error.response.data.error);
        resolve('null')
      });
  });
}

export async function getUserDetailsByMemberId(authToken) {
  if (!authToken) {
    await userLoginDetails();
  }
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${getUserDetailsByMemberIdApi}${userDetails?.user}`,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
        // Authorization: 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjIzNTkwNTc5NDczNWZjOWRlMzNiMzIzIiwiaWF0IjoxNjQ5ODIwOTAzLCJleHAiOjE2NDk4NjQxMDMsInJvbGUiOiJhZG1pbiIsInR5cGUiOiJhY2Nlc3MifQ.M3debxf129zVSLhRauyODQLEm05Kfb9ltPuMm8j8sXM',
      },
    };
    try {
      axios(config)
        .then(async response => {
          // console.log('getUserDetailsByMemberId', response.data);
          if (response.status == 200) {
            // console.log('coming inside, response', response.status)
            resolve(response.data);
            getmemberDetails = response.data
          } else {
            resolve('null');
            Toast.show('Please try again');
          }
        })
        .catch(function (error) {
          resolve(error.response.data);
          // Toast.show(error.response.data)
          console.log('getUserDetailsByMemberId', error.response.data)
        });
    } catch (e) {
      // reject(e);
      // console.log('reject2')
    }
  });
}

export async function notificationApiList(authToken) {
  if (!authToken) {
    await userLoginDetails();
  }
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: notificationList,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      axios(config)
        .then(async response => {
          // console.log("NotificationApiList", response)
          if (response.status == 200) {
            console.log('coming inside, response', response.status);
            resolve(response.data.data);
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          // reject({ error });
        });
    } catch (e) {
      // reject(e);
    }
  });
}
export async function transactionApplicationMoney(authToken) {
  if (!authToken) {
    await userLoginDetails();
  }
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${applicationMoneyList}${userDetails?.user}`,
      headers: {
        Authorization: 'Bearer ' + userToken,
      },
    };
    try {
      axios(config)
        .then(async response => {
          // console.log('transactionApplicationMoney', response);
          if (response.status == 200) {
            console.log('coming inside, response', response.status)
            resolve(response.data);
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          // reject(error);
        });
    } catch (e) {
      // reject(e);
    }
  });
}
export async function transactionShareIssuance(authToken) {
  if (!authToken) {
    await userLoginDetails();
  }
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${getSharesMember}${userDetails?.user}`,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    };
    try {
      axios(config)
        .then(async response => {
          // console.log('transactionShareIssuance', response);
          if (response.status == 200) {
            console.log('coming inside, response', response.status)
            resolve(response.data);
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          // reject(error);
        });
    } catch (e) {
      // reject(e);
    }
  });
}
export async function submitdataAcquisition(formdata) {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: submitdataAcquitionApi,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
      data: formdata,
    };
    await axios(config)
      .then(function (response) {
        resolve(response.data)
        // console.log(JSON.stringify(response.data), 'asdfasd');
        Toast.show('Submitted  Successfully')
      })
      .catch(function (error) {
        console.log(error.response.data, 'submitdataAcquisition');
        // reject(error)
        Toast.show(error.response.data.error)
      })
  });
}
export async function getDataAcquisitionsResponsesofamember() {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${getdataAcquitionResponseApi}${userDetails?.user}`,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    };
    try {
      axios(config)
        .then(async response => {
          // console.log('getDataAcquisitionsResponsesofamember', response.data.polls);
          if (response.status == 200) {
            console.log('coming inside, response', response.status)
            resolve(response.data);
            // console.log(response.data.application[0])
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          // reject(error);
        });
    } catch (e) {
      // reject(e);
    }
  });
}
export async function uploadImage(formdata) {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: `${BASE_URL}/s3/upload`,
      data: formdata
    };
    try {
      axios(config)
        .then(async response => {
          console.log('uploadImage', response.data.url);
          if (response.status == 200) {
            console.log('coming inside, response', response.status)
            resolve(response.data.url);
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}
export async function getNotificationsforMember() {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${getNotificationsforMemberApi}${userDetails?.user}`,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    };
    try {
      axios(config)
        .then(async response => {
          // console.log('getNotificationsforMember', response.data);
          if (response.status == 200) {
            // console.log('coming inside, response', response.status)
            resolve(response.data);
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          // reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}
export async function getshareTransactionsGraphforMember() {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${getshareTransactionsForGraph}${userDetails?.user}`,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    };
    try {
      axios(config)
        .then(async response => {
          // console.log('getshareTransactionsGraphforMember', response.data);
          if (response.status == 200) {
            // console.log('coming inside, response', response.status)
            resolve(response.data);
          } else {
            resolve(null);
            Toast.show('Please try again', Toast.LONG);
          }
        })
        .catch(function (error) {
          // reject(error);
        });
    } catch (e) {
      // reject(e);
    }
  });
}
export async function getOtpformember(userPhone) {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: Otpsend,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
      data: userPhone
    };
    axios(config)
      .then(function (response) {
        Toast.show('Otp sent successfully');
        console.log(JSON.stringify(response.data));
        resolve(response.data)
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        Toast.show(error.response.data.error)
        // reject(error.response.data)
      });
  });
}
export async function verifyOtp(formdata) {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: OtpVerifyapi,
      data: formdata
    };
    axios(config)
      .then(function (response) {
        Toast.show('Otp Verified successfully');
        console.log(JSON.stringify(response.data));
        resolve(response.data)
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        // reject(error)
        Toast.show(error.response.data.error)
      });
  });
}
export async function resetPassword(formdata) {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: resetPasswordApi,
      data: formdata
    };
    axios(config)
      .then(function (response) {
        Toast.show('Password set successfully');
        console.log(JSON.stringify(response.data));
        resolve(response.data)
      })
      .catch(function (error) {
        console.log(error.response.data);
        // reject(error)
      });
  });
}
export async function getCommunications() {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'get',
      url: `${BASE_URL}/communication`,
      headers: {
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    };
    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        resolve(response.data.data)
      })
      .catch(function (error) {
        console.log(error.response.data);
        // reject(error)
      });
  });
}

