import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView, BackHandler
} from 'react-native';
import colors from '../assets/colors/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { transactionApplicationMoney, getmemberDetails } from '../../constants';
import Loader from '../components/loader';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, Portal, DataTable, Badge, Dialog, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { transactionApplicationMoneyApi, transactionShareIssuanceApi } from '../redux/actions/transaction.actions';
import { getNotificationsinForegroundEmpty } from '../redux/actions/notifications.actions';
import LogoutComponent from '../components/LogoutComponent';
import RNRestart from 'react-native-restart';

const { width, height } = Dimensions.get('window');

function TransactionScreen({ navigation }) {
  BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.navigate("LandingScreen")
  }, [])
  const [tabSelected, setTabSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutdialogVisible, setlogoutdialogVisible] = useState(false);
  const [visible, setvisible] = useState(false);
  const [dialogItem, setdialogItem] = useState([]);
  const [loaderMessage, setLoaderMessage] = useState('');
  const dispatch = useDispatch()


  const { trasactionApplicationMoney, trasactionApplicationArray, transactionShareIssuanceArray } = useSelector(state => state.Reducer)
  useEffect(() => {
    applicationMoneyApiCall()
  }, []);
  const applicationMoneyApiCall = async () => {
    setLoading(true)
    setLoaderMessage('loading...')
    try {
      dispatch(transactionApplicationMoneyApi())
      dispatch(transactionShareIssuanceApi())
      await transactionApplicationMoney()
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }

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
  const applicationFlatlist = (item, share) => {
    return (
      <TouchableOpacity onPress={() => share ? (setvisible(true), setdialogItem(item.transactionId[0])) : null}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{ margin: 8, justifyContent: 'center', alignSelf: 'center' }}>
            <View style={{ marginVertical: 5, }}>
              <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: '600', color: !share ? 'black' : 'gray' }}>
                {share ? `${item.fromMemberId && item.fromMemberId.id === getmemberDetails?.id
                  ? "Transferred Out"
                  : item.transactionId[0]?.type === "issue"
                    ? "Issue"
                    : "Transferred In"}` :
                  item.particulars === 'debit' ? 'Paid towards shares' : 'Contribution added'
                }
              </Text>
            </View>
            <View>
              <Text allowFontScaling={false}
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                }}>
                {moment(share ? item.toMemberId?.updatedAt : item.updatedAt).format('Do MMM, YYYY hh:mm A')}
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
            <View style={{ marginVertical: 5 }}>
              <Text allowFontScaling={false} style={{ color: item.particulars === 'debit' ? 'red' : 'green', fontSize: 12, alignSelf: 'flex-end',right:5 }}>
                {share ?
                  item.fromMemberId && item.fromMemberId.id === getmemberDetails?.id ?
                    <Text style={{ color: 'red' }}>-{item.noOfShares}</Text> :
                    <Text style={{ color: 'green' }}>+{item.noOfShares}</Text>
                  :
                  item.particulars === 'debit' ? `- ₹${item.amount}` : `+ ₹${item.amount}`}
              </Text>
            </View>
            <Text allowFontScaling={false}
              style={{
                fontSize: 9,
                fontWeight: '400',
                textAlign: 'right',
                // right:10
              }}>
              {!share && item.id}
              {/* {!share ? item.particulars === 'debit' ? 'Pay towards shares' : 'Contribution added' : null} */}
            </Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: colors.lightgray, height: 1, marginTop: 10 }}
        />
      </TouchableOpacity>
    );
  };



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
            <TouchableOpacity onPress={() => (navigation.goBack(), setTabSelected(false))}>
              <AntDesign
                name="arrowleft"
                size={25}
                color={'white'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                Transactions
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
      <View>
        <View
          style={{
            backgroundColor: colors.headerBlue,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity onPress={() => setTabSelected(false)}>
            <View style={{ margin: 8 }}>
              <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16, color: !tabSelected ? 'black' : 'white' }}>
                Share Application Money
              </Text>
              {!tabSelected ? (
                <View style={{ height: 2, backgroundColor: 'white' }} />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTabSelected(true)}>
            <View style={{ margin: 8 }}>
              <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16, color: tabSelected ? 'black' : 'white' }}>
                Share Issuance
              </Text>
              {tabSelected ? (
                <View style={{ height: 2, backgroundColor: 'white' }} />
              ) : null}
            </View>
          </TouchableOpacity>
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
          {!tabSelected ? (
            <View style={{ marginHorizontal: 15, height: height }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <View>
                  <Text allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.totalGray,
                    }}>
                    Total
                  </Text>
                  <View>
                    <Text allowFontScaling={false}
                      style={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: colors.darkslategray,
                      }}>
                      ₹ {trasactionApplicationMoney || '0'}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: colors.lightgray,
                  height: 1,
                  marginTop: 15,
                }}
              />
              {trasactionApplicationArray && trasactionApplicationArray.length > 0 ?
                <View style={{ paddingBottom: 200 }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={trasactionApplicationArray}
                    renderItem={item => applicationFlatlist(item.item)}
                    keyExtractor={(item, index) => index}
                  />
                </View>
                : null}
            </View>
          ) : (
            <View style={{ marginHorizontal: 20, height: height }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <View>
                  <Text allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.totalGray,
                    }}>
                    Total Shares
                  </Text>
                  <View>
                    <Text allowFontScaling={false}
                      style={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: colors.darkslategray,
                      }}>
                      {transactionShareIssuanceArray?.length ? transactionShareIssuanceArray[0].toMemberId?.totalShare : '0'}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: colors.lightgray,
                  height: 1,
                  marginTop: 15,
                }}
              />
              {transactionShareIssuanceArray && transactionShareIssuanceArray.length > 0 ?
                <View style={{ paddingBottom: 200 }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={transactionShareIssuanceArray}
                    renderItem={item => applicationFlatlist(item.item, 'share')}
                    keyExtractor={(item, index) => index}
                  />
                </View>
                : null}
            </View>
          )}
          <Portal>
            <Modal contentContainerStyle={{
              backgroundColor: 'white', padding: 12,
              marginHorizontal: 12
            }} onDismiss={() => setvisible(false)}
              visible={visible}>
              <ScrollView >
                <DataTable>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}}><Text allowFontScaling={false} style={{ fontSize: 9, color: 'black', }}>
                        Type
                      </Text></DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right}>
                      <DataTable.Cell>
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.type}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}}><Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                        Transaction ID
                      </Text></DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right} >
                      <DataTable.Cell >
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.id}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}} ><Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                        Shares No(From)
                      </Text></DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right}>
                      <DataTable.Cell >
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.sharesFrom}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}} ><Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                        Shares No(To)
                      </Text></DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right}>
                      <DataTable.Cell >
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.sharesTo}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}} ><Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                        Total Share
                      </Text></DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right}>
                      <DataTable.Cell >
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.noOfShares}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}} ><Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                        Price Per Share
                      </Text></DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right}>
                      <DataTable.Cell >
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.pricePerShare}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}} >
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          ShareCertificationNo
                        </Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right}>
                      <DataTable.Cell >
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.shareCertificationNo}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <DataTable.Header style={styles.left}>
                      <DataTable.Title style={{bottom:4}}>
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          Type of Shares
                        </Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row style={styles.right}>
                      <DataTable.Cell>
                        <Text allowFontScaling={false} style={{ fontSize: 9, color: 'black' }}>
                          {`${dialogItem?.typeOfShares}`}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                </DataTable>
              </ScrollView>
            </Modal>
          </Portal>
        </View>
      </View>
    </SafeAreaView >
  );
}

export default TransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // height: height,
  }, header: { height: 50, backgroundColor: 'gray' },
  text: { textAlign: 'center', fontWeight: '500' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, }, left: { width: 145, backgroundColor: 'lightgray' }, right: { width: 220, }
});
