/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert, BackHandler
} from 'react-native';

import PushNotification, { Importance } from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../assets/colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Loader from '../components/loader';
import Toast from 'react-native-simple-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAcquistionDataApi, getUserDetailsByMemberId, getmemberDetails, getshareTransactionsGraphforMember, } from '../../constants';
import DialogLanding from '../components/DialogLanding';
import { Avatar, Badge, Dialog, Portal, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { transactionApplicationMoneyApi } from '../redux/actions/transaction.actions';
import { changeLogin, getMemberDetailsApi } from '../redux/actions/portfolio.actions';
import { getNotificationsforMemberbyId, getNotificationsinForegroundEmpty, notifiStateChange, singleBackgroundnotifsave } from '../redux/actions/notifications.actions';
import { useRoute } from '@react-navigation/native';
import LogoutComponent from '../components/LogoutComponent';
import RNRestart from 'react-native-restart';
const { width, height } = Dimensions.get('window');

function LandingScreen({ navigation, route }) {
  const [visible, setVisible] = useState(false);
  const [choose, setchoose] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [logoutdialogVisible, setlogoutdialogVisible] = useState(false);
  const [exitdialogVisible, setexitdialogVisible] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [userDetails, setuserDetails] = useState(null);
  const [dataAcquisition, setdataAcquisition] = useState(null);
  const [applica, setapplica] = useState([]);
  const [poll, setpoll] = useState([]);
  const [surv, setsurv] = useState([]);
  const { singleBackNotifi, unreadNotifications } = useSelector(state => state.notification)
  const routes = useRoute();
  useEffect(() => {
    getdataAcquistionApiCall()
    dispatch(getNotificationsforMemberbyId())
  }, [])
  const logoutAndClearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear()
        .then(() => {
          RNRestart.Restart()
          navigation.replace('LoginStack', { screen: 'WelcomeScreen' });
        })
    } catch (error) {
      console.log(error, 'logout')
    }

  };
  const checkstatus = async () => {
    try {
      const data = await getUserDetailsByMemberId()
      // console.log(data, 'datas')
      if (data && Object.keys(data).length > 6) {
        if (!data.activityStatus) {
          console.log('1')
          logoutAndClearAsyncStorage()
        }
        if (!data.mobileSignUpStatus) {
          console.log('2')
          logoutAndClearAsyncStorage()
        }
      } else if (data.message == "Invalid Token") {
        console.log('3')
        logoutAndClearAsyncStorage()
      }
    } catch (error) {
      // console.log(error, 'status')
    }
  }


  useEffect(() => {
    if (!visible) {
      setInterval(() => {
        checkstatus()
      }, 5000);
    }
  }, [])


  const getdataAcquistionApiCall = async () => {
    setLoading(true);
    setLoaderMessage('loading...');
    try {
      let datareseponse = await getAcquistionDataApi();
      let datareseponseuser = await getUserDetailsByMemberId();
      setuserDetails(datareseponseuser)
      setdataAcquisition(datareseponse);
      if (datareseponse) {
        const filterapplica = datareseponse.applications.filter(item => new Date() > new Date(item.startDate))
        const filtersurvey = datareseponse.surveys.filter(item => new Date() > new Date(item.startDate))
        const filterpolls = datareseponse.polls.filter(item => new Date() > new Date(item.startDate))
        setapplica(filterapplica.reverse())
        setsurv(filtersurvey.reverse())
        setpoll(filterpolls.reverse())
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log({ error })
    }
    setLoading(false);
  };
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (routes.name === "LandingScreen" && !visible) {
      setexitdialogVisible(!exitdialogVisible)
      return true;
    }
  }, []);
  const dispatch = useDispatch()
  const updateapicalled = async () => {
    getshareTransactionsGraphforMember()
    dispatch(transactionApplicationMoneyApi())
    dispatch(getMemberDetailsApi())
  }
  const onRefresh = () => {
    setrefresh(true)
    try {
      setrefresh(false)
      getshareTransactionsGraphforMember()
      getdataAcquistionApiCall()
    } catch (error) {
      console.log(error.message)
      setrefresh(false)
    }
  }
  const applicationsFlatlist = (item, memberId) => {
    return (
      <TouchableOpacity
        onPress={() => {
          item.type !== 'Application' ?
            (item.members.includes(getmemberDetails?.id)) ? Toast.show('already submitted') :
              new Date() > new Date(item.endDate) ? Toast.show('expired') : navigation.replace("DataAccuScreen", { choose: item })
            : new Date() > new Date(item.endDate) ? Toast.show('expired') : navigation.replace("DataAccuScreen", { choose: item })

        }}
        // onPress={() =>
        //   item.type !== 'Application' ?
        //     (item.members.includes(getmemberDetails?.id)) ? Toast.show('already submitted') :
        //       new Date() > new Date(item.endDate) ? Toast.show('expired') : (setVisible(true), setchoose(item))
        //     : new Date() > new Date(item.endDate) ? Toast.show('expired') : (setVisible(true), setchoose(item))
        // }
        style={{
          backgroundColor: 'white',
          margin: 8,
          elevation: 10,
          borderRadius: 9,
          width: width * .4,
          height: height * .08,
          padding: 4
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between', width: '92%'
          }}>
          <Text allowFontScaling={false} style={{ fontSize: width * .030, fontWeight: '600' }}>
            {item.title?.length > 58 ? `${item.title?.substring(0, 58)}...` : item.title}
          </Text>
          <View style={{ width: "7%", left: "3%" }}>
            {
              (item.members?.includes(memberId)) &&
              <Image
                source={require('../assets/images/tickMark.png')}
                resizeMode={'contain'}
                style={{ width: 10, height: 10 }}
              />
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    PushNotification.configure({
      onNotification: (notification) => {
        const clicked = notification.userInteraction;
        if (clicked && notification?.message) {
          console.log({ clicked, notification })
          dispatch(notifiStateChange())
          navigation.navigate('NotificationScreen', notification)
        }
      },
    });
  }, [])
  useEffect(() => {
    if (routes.name === 'LandingScreen' && singleBackNotifi) {
      navigation.navigate('NotificationScreen', singleBackNotifi)
    }
  }, [singleBackNotifi, routes.name])
  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} message={loaderMessage} />
      <View style={{ height: '36%' }}>
        <View style={{ backgroundColor: colors.headerBlue }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <View
              style={{
                justifyContent: 'flex-start',
                margin: 10,
                alignSelf: 'flex-start',
                flexDirection: 'row',
              }}>
              <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => (navigation.openDrawer(), updateapicalled())}>
                {
                  userDetails?.userImage ?
                    <Avatar.Image size={44} source={{ uri: userDetails?.userImage }} /> :
                    <Avatar.Icon icon="account" style={{ backgroundColor: 'purple' }} size={44} />
                }
                <View style={{
                  width: 20, height: 20,
                  backgroundColor: 'white', borderRadius: 10, position: 'absolute',
                  alignItems: 'center', justifyContent: 'center', top: 28, left: 35
                }}>
                  <Entypo name='menu' size={18} />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: 'flex-start',
                marginTop: 20,
                alignSelf: 'flex-start',
                flexDirection: 'row',
              }}>
              <View>
                <TouchableOpacity style={{ alignItems: 'center', marginRight: 15 }}
                  onPress={() => navigation.navigate('NotificationScreen')}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={25}
                    color={'white'}
                  />
                  {
                    unreadNotifications.length ?
                      <View style={{ position: 'absolute', left: 6, top: -15, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 25, height: 25, borderRadius: 12.5 }}>
                        <Text allowFontScaling={false} style={{ fontSize: 8, color: 'white' }}>{unreadNotifications.length}</Text>
                      </View> : null
                  }
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setlogoutdialogVisible(true)}>
                <View>
                  <MaterialIcons
                    name="logout"
                    size={25}
                    color={'white'}
                    style={{ marginRight: 10 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.portfolioBackgroundBlue,
            borderBottomRightRadius: 100,
            borderBottomLeftRadius: 100,
            height: '61%',
          }}>
          <View
            style={{
              height: '95%',
              marginTop: '5%',
              elevation: 20,
              backgroundColor: 'white',
              marginHorizontal: width * .05,
              borderRadius: 20,
              alignItems: 'center',
              overflow: 'hidden',
              justifyContent: 'center',
            }}>
            <View style={{
              width: '100%', padding: 8,
              flexDirection: 'row', height: '100%', justifyContent: 'space-between'
            }}>
              <View style={{ height: '100%', justifyContent: 'space-between' }}>
                <Text></Text>
                <Text
                  allowFontScaling={false} style={{ ...styles.graphtext, color: 'blue' }}>Total</Text>
                <Text
                  allowFontScaling={false} style={{ ...styles.graphtext, color: 'green' }}>Open</Text>
                <Text
                  allowFontScaling={false} style={{ ...styles.graphtext, color: '#F78D45', fontWeight: 'bold' }}>Submitted</Text>
              </View>
              <View style={{ height: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, fontSize: 11, fontWeight: '600' }}>Applications</Text>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, color: 'blue' }}>{dataAcquisition?.applications.length || '0'}</Text>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, color: 'green' }}>{dataAcquisition?.applications.filter(item => new Date() > new Date(item.startDate) && new Date() < new Date(item.endDate)).length || '0'}</Text>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, color: '#F78D45', fontWeight: 'bold' }}>{dataAcquisition?.applications.filter(item => item.members.includes(getmemberDetails?.id)).length || '0'}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, fontSize: 11, fontWeight: '600' }}>Surveys</Text>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, color: 'blue' }}>{dataAcquisition?.surveys.length || '0'}</Text>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, color: 'green' }}>{dataAcquisition?.launch.surveys.filter(item => new Date() > new Date(item.startDate) && new Date() < new Date(item.endDate)).length || '0'}</Text>
                  <Text
                    allowFontScaling={false} style={{ ...styles.graphtext, color: '#F78D45', fontWeight: 'bold' }}>{dataAcquisition?.surveys.filter(item => item.members.includes(getmemberDetails?.id)).length || '0'}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text allowFontScaling={false} style={{ ...styles.graphtext, fontSize: 11, fontWeight: '600' }}>Polls</Text>
                  <Text allowFontScaling={false} style={{ ...styles.graphtext, color: 'blue' }}>{dataAcquisition?.polls.length || '0'}</Text>
                  <Text allowFontScaling={false} style={{ ...styles.graphtext, color: 'green' }}>{dataAcquisition?.polls.filter(item => new Date() > new Date(item.startDate) && new Date() < new Date(item.endDate)).length || '0'}</Text>
                  <Text allowFontScaling={false} style={{ ...styles.graphtext, color: '#F78D45', fontWeight: 'bold' }}>{dataAcquisition?.polls.filter(item => item.members.includes(getmemberDetails?.id)).length || '0'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>


      </View>
      <LogoutComponent
        visible={logoutdialogVisible}
        heading={'Confirm Logout'}
        button2={'Logout'}
        body={'Are you sure want to Logout ?'}
        onPress={() => setlogoutdialogVisible(!logoutdialogVisible)}
        onPress2={() => (logoutAndClearAsyncStorage(), setlogoutdialogVisible(!logoutdialogVisible))}
      />
      <LogoutComponent
        visible={exitdialogVisible}
        heading={'Confirm Exit'}
        button2={'Exit'}
        body={'Are you sure want to Exit ?'}
        onPress={() => setexitdialogVisible(!exitdialogVisible)}
        onPress2={() => {
          setexitdialogVisible(!exitdialogVisible)
          BackHandler.exitApp()
        }}
      />
      <View style={{ height: '64%', marginTop: '3%' }}>
        <ScrollView contentContainerStyle={{ justifyContent: 'space-between' }} refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} title='plaese wait' />
        }>
          <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
            <LinearGradient
              start={{ x: 1.0, y: 0.5 }}
              end={{ x: 0.7, y: 1.0 }}
              colors={['rgba(71, 123, 255, 1)', 'rgba(110, 175, 236, 1)']}
              style={styles.linearGradient}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text allowFontScaling={false}
                    style={[
                      styles.buttonText,
                      { fontWeight: '600', fontSize: width * .033 },
                    ]}>
                    Applications for Services
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => (navigation.replace('AcquisitionScreen', { props: 'application' }), getdataAcquistionApiCall())}
                >
                  <View >
                    <Text allowFontScaling={false}
                      style={[
                        styles.buttonText,
                        {
                          fontWeight: '600', fontSize: width * .023,
                          borderBottomColor: 'white', borderBottomWidth: 1, marginRight: 14
                        },
                      ]}>
                      See more
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View >
                {
                  applica.length ?
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={applica}
                      renderItem={item => applicationsFlatlist(item.item, getmemberDetails?.id)}
                      keyExtractor={(item, index) => index}
                    /> :
                    <View style={{ alignSelf: 'center' }}>
                      <Text allowFontScaling={false}>No Applications Found</Text>
                    </View>
                }
              </View>
            </LinearGradient>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <LinearGradient
              start={{ x: 1.0, y: 0.5 }}
              end={{ x: 0.7, y: 1.0 }}
              colors={['rgba(71, 123, 255, 1)', 'rgba(110, 175, 236, 1)']}
              style={styles.linearGradient}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text allowFontScaling={false}
                    style={[
                      styles.buttonText,
                      { fontWeight: '600', fontSize: width * .033 },
                    ]}>
                    Surveys
                  </Text>
                </View>
                <TouchableOpacity onPress={() => (navigation.replace('AcquisitionScreen', { props: 'survey' }), getdataAcquistionApiCall())} >
                  <Text allowFontScaling={false}
                    style={[
                      styles.buttonText,
                      {
                        fontWeight: '600', fontSize: width * .023,
                        borderBottomColor: 'white', borderBottomWidth: 1, marginRight: 14,
                      },
                    ]}>
                    See more
                  </Text>
                </TouchableOpacity>
              </View>
              <View >
                {
                  surv.length ?
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={surv}
                      renderItem={(item) => applicationsFlatlist(item.item, getmemberDetails?.id)}
                      keyExtractor={(item, index) => index}
                    /> :
                    <View style={{ alignSelf: 'center' }}>
                      <Text allowFontScaling={false}>No Surveys Found</Text>
                    </View>
                }
              </View>
            </LinearGradient>
          </View>
          <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
            <LinearGradient
              start={{ x: 1.0, y: 0.5 }}
              end={{ x: 0.7, y: 1.0 }}
              colors={['rgba(71, 123, 255, 1)', 'rgba(110, 175, 236, 1)']}
              style={styles.linearGradient}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text allowFontScaling={false}
                    style={[
                      styles.buttonText,
                      { fontWeight: '600', fontSize: width * .033 },
                    ]}>
                    Polls
                  </Text>
                </View>
                <TouchableOpacity onPress={() => (navigation.replace('AcquisitionScreen', { props: 'polls' }), getdataAcquistionApiCall())} >
                  <Text allowFontScaling={false}
                    style={[
                      styles.buttonText,
                      {
                        fontWeight: '600', fontSize: width * .023,
                        borderBottomColor: 'white', borderBottomWidth: 1, marginRight: 14
                      },
                    ]}>
                    See more
                  </Text>
                </TouchableOpacity>
              </View>
              <View >
                {
                  poll.length ?
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={poll}
                      renderItem={(item) => applicationsFlatlist(item.item, getmemberDetails?.id)}
                      keyExtractor={(item, index) => index}
                    /> :
                    <View style={{ alignSelf: 'center' }}>
                      <Text allowFontScaling={false}>No Polls Found</Text>
                    </View>
                }
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
      <DialogLanding dataAcquisition={dataAcquisition} setchoose={setchoose} choose={choose} visible={visible} setVisible={setVisible} />
    </SafeAreaView>
  );
}
export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // height: height,
  },
  bottomBorder: {
    backgroundColor: colors.lightgray,
    height: 0.5,
    marginTop: 15,
  },
  linearGradient: {
    padding: 4,
    borderRadius: 5,
    height: width * .32,
  },
  buttonText: {
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 5,
    left: 3,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  graphtext: {
    fontFamily: 'Gill Sans',
    marginHorizontal: 6,
    fontSize: 13
    // fontSize: width * .040
  }
});
