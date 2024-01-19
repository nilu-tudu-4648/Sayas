import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView, Alert, BackHandler
} from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../assets/colors/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

// import { LineChart } from "react-native-gifted-charts"
import {
  getshareTransactionsGraphforMember, getUserDetailsByMemberId,
} from '../../constants'
import Loader from '../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { getMemberDetailsApi } from '../redux/actions/portfolio.actions';
import LogoutComponent from '../components/LogoutComponent';
const { width, height } = Dimensions.get('window');

function PortfolioScreen() {
  BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.navigate("LandingScreen")
  }, [])
  const {  allNotification } = useSelector(state => state.notification)
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [logoutdialogVisible, setlogoutdialogVisible] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null)
  const [graph, setgraph] = useState([0])
  const chartConfig = {
    backgroundGradientFrom: "#FFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(6, 250, 74, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    // barPercentage: 0.5,
    decimalPlaces: 0,
    useShadowColorFromDataset: false // optional
  };
  const dispatch = useDispatch()
  useEffect(() => {
    getUserDetails()
    dispatch(getMemberDetailsApi())
  }, [allNotification?.length])
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
  const current = new Date().getFullYear()
  // const [first, setfirst] = useState('')

  //   useEffect(() => {
  //       const current =
  //            new Date().getFullYear()
  //      const data = {
  //          "2020": {
  //              "1": 100
  //          },
  //          "2022": {
  //              "2": 121
  //          },
  //      }
  //      Object.keys(data).filter(ite => {
  //           if (ite == current) {
  //               setfirst(data[current])
  //           }
  //       })
  //   }, [])
  //   console.log({first})
  const { memberDetails } = useSelector(state => state.portfolio)
  const getUserDetails = async () => {
    setLoading(true);
    setLoaderMessage('loading...');
    try {
      let getUserDetailsByMemberIdResponse = await getUserDetailsByMemberId()
      setUserDetails(getUserDetailsByMemberIdResponse)
      let getgraphforuser = await getshareTransactionsGraphforMember()
      const checkfunc = () => {
        if (Object.keys(getgraphforuser)?.length) {
          const ds = Object.keys(Object.values(getgraphforuser)[0])
          const defaultMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
          let ref = []
          ds.map(item => {
            ref[parseInt(item) - 1] = Object.values(getgraphforuser)[0][item]
          })
          let serverMonths = ds.map(item => parseInt(item) - 1)
          defaultMonths.map((item, i) => {
            if (!serverMonths.includes(item)) {
              ref[item] = 0
            }
          })
          setgraph(ref)
        } else {
          setgraph([0])
        }
      }

      checkfunc()
      setLoading(false);
    } catch (error) {
      setLoading(false)
    }
  }
  // console.log(graph)



  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} message={loaderMessage} />
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
            <TouchableOpacity onPress={() => (navigation.goBack(), getUserDetails())}>
              <AntDesign
                name="arrowleft"
                size={25}
                color={'white'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                Portfolio
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'flex-start',
              marginTop: 10,
              alignSelf: 'flex-start',
              flexDirection: 'row',
            }}>
             {/* <View>
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
              </View> */}
            <TouchableOpacity onPress={() => setlogoutdialogVisible(true)}>
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
      <View style={{ alignItems: 'center', marginTop: '4%', height: height * .4 }}>
        <LogoutComponent
          visible={logoutdialogVisible}
          heading={'Confirm Logout'}
          button2={'Logout'}
          body={'Are you sure want to Logout ?'}
          onPress={() => setlogoutdialogVisible(!logoutdialogVisible)}
          onPress2={() => (logoutAndClearAsyncStorage(), setlogoutdialogVisible(!logoutdialogVisible))}
        />
        <View style={{ flexDirection: 'row' }}>
          <LinearGradient
            start={{ x: 1.0, y: 0.5 }}
            end={{ x: 0.7, y: 1.0 }}
            colors={['rgba(49, 179, 252, 1)', 'rgba(110, 175, 236, 1)']}
            style={styles.eachbox}>
            <View style={styles.circletop} />
            <View style={styles.circlebottom} />
            <View style={styles.circle}>
              <View style={{ ...styles.incircle, backgroundColor: '#31B3FC' }}>
                <AntDesign name='linechart' color={'white'} />
              </View>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.font}>₹ {memberDetails?.shareCapital || '0'}</Text>
              <Text allowFontScaling={false} style={styles.font2}>Share Capital</Text>
            </View>
          </LinearGradient>
          <LinearGradient
            start={{ x: 1.0, y: 0.5 }}
            end={{ x: 0.7, y: 1.0 }}
            colors={['rgb(218,112,214)', 'rgb(138,43,226)']}
            style={styles.eachbox}>

            <View style={styles.circletop} />
            <View style={styles.circlebottom} />
            <View style={styles.circle}>
              <View style={{ ...styles.incircle, backgroundColor: 'purple' }}>
                <FontAwesome name='rupee' color={'white'} size={15} />
              </View>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.font}>₹ {memberDetails?.shareApplicationMoney || '0'} </Text>
              <Text allowFontScaling={false} style={styles.font2}>Share Application Money</Text></View>
          </LinearGradient>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <LinearGradient
            start={{ x: 1.0, y: 0.5 }}
            end={{ x: 0.7, y: 1.0 }}
            colors={['rgba(71, 123, 255, 1)', 'rgba(110, 175, 236, 1)']}
            style={styles.eachbox}>

            <View style={styles.circletop} />
            <View style={styles.circlebottom} />
            <View style={styles.circle}>
              <View style={{ ...styles.incircle, backgroundColor: 'blue' }}>
                <AntDesign name='profile' color={'white'} size={12} />
              </View>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.font}> {memberDetails?.totalShare || '0'} </Text>
              <Text allowFontScaling={false} style={styles.font2}>No Of Shares </Text>
            </View>
          </LinearGradient>
          <LinearGradient
            start={{ x: 1.0, y: 0.5 }}
            end={{ x: 0.7, y: 1.0 }}
            colors={['rgba(71, 123, 255, 1)', 'rgba(110, 175, 236, 1)']}
            style={styles.eachbox}>

            <View style={styles.circletop} />
            <View style={styles.circlebottom} />
            <TouchableOpacity
              onPress={() => navigation.navigate('CertificateScreen')}
            >
              <Image style={{ alignSelf: 'center', bottom: 12 }} source={require('../assets/images/Vector.png')} />
              <Text allowFontScaling={false} style={styles.font2}>Share Certificate</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      <LineChart
        // style={{ right: 20 }}
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              data: graph,
            }
          ]
        }}
        width={width}
        height={height * .5}
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        bezier
      // onDataPointClick={(item, i) =>
      //   Alert.alert(`your shares for jan,${item.value}`)
      // }
      />
    </SafeAreaView >
  );
}

export default PortfolioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // height: height,
  },
  eachbox: {
    width: '45%',
    height: height * .18,
    margin: 3,
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: 12,
    elevation: 10,
    overflow: 'hidden'
  },
  font: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '500'
  },
  font2: {
    color: '#fff',
    fontSize: width * .029,
    fontWeight: '500'
  },
  circle: {
    width: 45, height: 45,
    borderRadius: 22.5,
    backgroundColor: 'white',
    marginLeft: 'auto',
    marginBottom:'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  incircle: {
    backgroundColor: 'red',
    width: 28, height: 28,
    borderRadius: 14
    , alignItems: 'center',
    justifyContent: 'center'
  },
  circlebottom: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255, 255, 255, 0.11)', position: 'absolute', right: 138, top: -5 },
  circletop: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255, 255, 255, 0.11)', position: 'absolute', top: -40 }
});
