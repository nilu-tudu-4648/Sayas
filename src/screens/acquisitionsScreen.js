import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView, BackHandler, Dimensions, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../assets/colors/colors';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAcquistionDataApi, getmemberDetails } from '../../constants'
import Loader from '../components/loader';
import moment from 'moment';
import DialogLanding from '../components/DialogLanding';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsinForegroundEmpty } from '../redux/actions/notifications.actions';
import { useNavigation, useRoute } from '@react-navigation/native';
import LogoutComponent from '../components/LogoutComponent';
import RNRestart from 'react-native-restart';
import { Chip } from 'react-native-paper'

function AcquisitionsScreen({ route }) {
  const value = route.params?.props
  const [applicationTabSelected, setApplicationTabSelected] = useState(true);
  const [screenprops, setscreenprops] = useState('');
  const [surveyTabSelected, setSurveyTabSelected] = useState(false);
  const [pollTabSelected, setPollTabSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutdialogVisible, setlogoutdialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterValue, setfilterValue] = useState('Filled');
  const [choose, setchoose] = useState('');
  const [applica, setapplica] = useState([]);
  const [poll, setpoll] = useState([]);
  const [surv, setsurv] = useState([]);
  const [eachValue, seteachValue] = useState('');
  const [loaderMessage, setLoaderMessage] = useState('');
  const [acquisitionApiResponse, setAcquisitionApiResponse] = useState([]);

  const dispatch = useDispatch()
  const routes = useRoute()
  const navigation = useNavigation()
  const { unreadNotifications } = useSelector(state => state.notification)
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (routes.name == "AcquisitionScreen") {
      if (visible) {
        setVisible(false);
      } else {
        navigation.navigate('LandingScreen');
      }
    }
    return true
  }, [])
  const tabContainerChange = value => {
    if (value == 'application') {
      setApplicationTabSelected(true);
      setSurveyTabSelected(false);
      setscreenprops('application')
      setPollTabSelected(false);
    } else if (value == 'survey') {
      setSurveyTabSelected(true);
      setscreenprops('survey')
      setApplicationTabSelected(false);
      setPollTabSelected(false);
    } else {
      setPollTabSelected(true);
      setscreenprops('polls')
      setSurveyTabSelected(false);
      setApplicationTabSelected(false);
    }
  };
  useEffect(() => {
    seteachValue(value)
    tabContainerChange(value)
  }, [])
  useEffect(() => {
    getAcquistionApiCall()
  }, [value, visible]);
  const getAcquistionApiCall = async () => {
    setLoading(true)
    setLoaderMessage('loading...')
    if (eachValue == 'application') {
      tabContainerChange('application');
    }
    if (eachValue == 'survey') {
      tabContainerChange('survey')
    }
    if (eachValue == 'polls') {
      tabContainerChange('polls')
    }
    try {
      let getAcquistionDataApiResponse = await getAcquistionDataApi()
      setAcquisitionApiResponse(getAcquistionDataApiResponse.launch)
      if (getAcquistionDataApiResponse.launch) {
        const filterapplica = getAcquistionDataApiResponse.applications.filter(item => new Date() > new Date(item.startDate))
        const filtersurvey = getAcquistionDataApiResponse.surveys.filter(item => new Date() > new Date(item.startDate))
        const filterpolls = getAcquistionDataApiResponse.polls.filter(item => new Date() > new Date(item.startDate))
        setapplica(filterapplica.reverse())
        setsurv(filtersurvey.reverse())
        setpoll(filterpolls.reverse())
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
  const applciationFlatlist = (item) => {
    return (
      <TouchableOpacity style={{ borderBottomColor: colors.lightgray, borderBottomWidth: 1, padding: 3 }}
        onPress={() => {
          item.type !== 'Application' ?
            (item.members.includes(getmemberDetails?.id)) ? Toast.show('already submitted') :
              new Date() > new Date(item.endDate) ? Toast.show('expired') : navigation.replace("DataAccuScreen", { choose: item, accu: screenprops })
            : new Date() > new Date(item.endDate) ? Toast.show('expired') : navigation.replace("DataAccuScreen", { choose: item, accu: screenprops })
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <View
            style={{
              marginTop: 7,
              marginBottom: 7,
              width: '75%'
            }}>
            <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
              {item.title}
            </Text>
            <Text allowFontScaling={false}
              style={{ fontSize: 10, fontWeight: '400', color: colors.darkGray, marginVertical: 4 }}>
              {item?.description.length > 50 ? item?.description?.substring(0, 50) : item?.description}
            </Text>
          </View>
          <View style={{ justifyContent: 'center', right: 10 }}>
            {
              item.members.includes(getmemberDetails?.id) ?
                new Date() < new Date(item.endDate) ?
                  <Text allowFontScaling={false} style={{
                    fontSize: 12,
                    fontWeight: '600', color: 'blue'
                  }}>
                    {moment(item.startDate).format('DD/MM/YYYY')}
                  </Text> : <Text allowFontScaling={false} style={{
                    fontSize: 12,
                    fontWeight: '600', color: 'red'
                  }}>
                    {moment(item.startDate).format('DD/MM/YYYY')}
                  </Text> :
                new Date() < new Date(item.endDate) ?
                  <Text allowFontScaling={false} style={{
                    fontSize: 12,
                    fontWeight: '600', color: 'green'
                  }}>
                    {moment(item.startDate).format('DD/MM/YYYY')}
                  </Text> : <Text allowFontScaling={false} style={{
                    fontSize: 12,
                    fontWeight: '600', color: 'red'
                  }}>
                    {moment(item.startDate).format('DD/MM/YYYY')}
                  </Text>
            }
          </View>
        </View>
        <View>

        </View>
      </TouchableOpacity>
    );
  };
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
  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} message={loaderMessage} />
      <DialogLanding dataAcquisition={acquisitionApiResponse}
        setchoose={setchoose} choose={choose} visible={visible}
        setVisible={setVisible} />
      <View>
        <View
          style={{
            backgroundColor: colors.headerBlue,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              margin: 10,
              alignSelf: 'flex-start',
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('LandingScreen')}>
              <AntDesign
                name="arrowleft"
                size={25}
                color={'white'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                Acquisitions
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'flex-start',
              marginTop: 18,
              alignSelf: 'flex-start',
              flexDirection: 'row',
            }}>
            <TouchableOpacity style={{ alignItems: 'center', marginRight: 15 }}
              // onPress={() => savenotifi()}
              onPress={() => (navigation.navigate('NotificationScreen'), dispatch(getNotificationsinForegroundEmpty(null)))}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={'white'}
              />
              {
                unreadNotifications.length ?
                  <View style={{ position: 'absolute', left: 6, top: -15, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 25, height: 25, borderRadius: 12.5 }}>
                    <Text style={{ fontSize: 8, color: 'white' }}>{unreadNotifications.length}</Text>
                  </View> : null
              }
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setlogoutdialogVisible(true)}>
              <MaterialIcons
                name="logout"
                size={25}
                color={'white'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <View
          style={{
            backgroundColor: colors.headerBlue,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity onPress={() => (tabContainerChange('application'), seteachValue('application'))}>
            <View style={{ margin: 8 }}>
              <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>
                Application
              </Text>
              {applicationTabSelected ? (
                <View style={{ height: 2, backgroundColor: 'white' }} />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => (tabContainerChange('survey'), seteachValue('survey'))}>
            <View style={{ margin: 8 }}>
              <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>
                Survey
              </Text>
              {surveyTabSelected ? (
                <View style={{ height: 2, backgroundColor: 'white' }} />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => (tabContainerChange('polls'), seteachValue('polls'))}>
            <View style={{ margin: 8 }}>
              <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>
                Poll
              </Text>
              {pollTabSelected ? (
                <View style={{ height: 2, backgroundColor: 'white' }} />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <ScrollView contentContainerStyle={{ padding: 8, justifyContent: 'space-between' }} horizontal={true}>
            <Chip   selected={filterValue == 'Filled'} selectedColor='black' style={{backgroundColor:'white', height: 40, width: 90,borderColor:'gray',borderWidth:1,justifyContent:'center',alignItems:'center' }} mode='outlined' onPress={() => {
              setfilterValue('Filled')
            }}>
              <Text allowFontScaling={false} style={{color:'gray', fontSize: 10,alignSelf:'center' }}>Filled</Text>
            </Chip>
            <Chip selected={filterValue == 'Open'} selectedColor='black' style={{backgroundColor:'white', height: 40, width: 90,borderColor:'gray',borderWidth:1 }} mode='outlined' onPress={() => {
              setfilterValue('Open')
            }}> <Text allowFontScaling={false} style={{color:'gray', fontSize: 10 }}>Open</Text></Chip>
            <Chip selected={filterValue == 'Close'} selectedColor='black' style={{backgroundColor:'white', height: 40, width: 90,borderColor:'gray',borderWidth:1 }} mode='outlined' onPress={() => {
              setfilterValue('Close')
            }}> <Text allowFontScaling={false} style={{color:'gray', fontSize: 10 }}>Close</Text></Chip>
            <Chip selected={filterValue == 'Saved'} selectedColor='black' style={{backgroundColor:'white', height: 40, width: 90,borderColor:'gray',borderWidth:1 }} mode='outlined' onPress={() => {
              setfilterValue('Saved')
            }}> <Text allowFontScaling={false} style={{color:'gray', fontSize: 10 }}>Saved</Text></Chip>
          </ScrollView>
        </View>
        <View>
          <LogoutComponent
            visible={logoutdialogVisible}
            heading={'Confirm Logout'}
            button2={'Logout'}
            body={'Are you sure want to Logout ?'}
            onPress={() => setlogoutdialogVisible(!logoutdialogVisible)}
            onPress2={() => (logoutAndClearAsyncStorage(), setlogoutdialogVisible(!logoutdialogVisible))}
          />
          {applicationTabSelected ? (
            <>

              <View style={{ marginHorizontal: 10 }}>
                <View style={{ paddingBottom: 150 }}>
                  {acquisitionApiResponse ?
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={applica}
                      renderItem={item => applciationFlatlist(item.item)}
                      keyExtractor={(item, index) => index}
                    />
                    : null}
                </View>
              </View>
            </>
          ) : surveyTabSelected ? (
            <View style={{ marginHorizontal: 10 }}>
              <View style={{ paddingBottom: 150 }}>
                {acquisitionApiResponse ?
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={surv}
                    renderItem={item => applciationFlatlist(item.item)}
                    keyExtractor={(item, index) => index}
                  />
                  : null}
              </View>
            </View>
          ) : <View style={{ marginHorizontal: 10 }}>
            <View style={{ paddingBottom: 150 }}>
              {acquisitionApiResponse ?
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={poll}
                  renderItem={item => applciationFlatlist(item.item)}
                  keyExtractor={(item, index) => index}
                />
                : null}
            </View>
          </View>}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AcquisitionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
