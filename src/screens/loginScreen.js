import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WhiteLogo from '../assets/images/whiteLogo.png';
import colors from '../assets/colors/colors';
import { loginApi } from '../../constants';
import Loader from '../components/loader';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');
function LoginScreen({ navigation }) {

  const [showPassword, setshowPassword] = useState(true)
  // const [userName, setUserName] = useState('M07'); // sapna11 testing21
  // const [password, setPassword] = useState('nilesh123'); //nilesh123 sahil@nirmitee
  const [userName, setUserName] = useState(''); //703844 test1234
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');

  const onClickLogin = async () => {
    if (!userName) {
      Toast.show('Please enter user name', Toast.LONG);
    } else if (!password) {
      Toast.show('Please enter password', Toast.LONG);
    } else {
      setLoading(true);
      setLoaderMessage('loading...');
      let LoginApiResponse = await loginApi(userName, password);
      if (LoginApiResponse == 'success') {
        navigation.navigate('DrawerContainer');
      }
      // console.log('LoginApiResponse', LoginApiResponse);
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Loader loading={loading} message={loaderMessage} />
        <View style={{ height: '30%' }}>
          <TouchableOpacity style={{ width: 50, margin: 12 }} onPress={() => navigation.goBack()}>
            <AntDesign
              name="arrowleft"
              size={25}
              color={'white'}
            />
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              height: '100%'
            }}>
            <Image
              source={WhiteLogo}
              resizeMode={'contain'}
              style={{ width: 130, height: 130, aspectRatio: 1, top: -40, tintColor: 'white' }}
            />
          </View>
        </View>
        <View
          style={{
            height: '70%',
            backgroundColor: colors.snow,
            borderTopLeftRadius: 100,
          }}>
          <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '600',
                fontFamily: 'Quicksand',
                color: 'black',
                marginTop: 20,
                marginBottom: 20,
              }}>
              Login
            </Text>
          </View>
          <View style={{ marginHorizontal: 40 }}>
            <View style={styles.loginContainer}>
              <View style={{ margin: 3 }}>
                <View style={{ marginTop: 10, marginLeft: 10 }}>
                  <Text style={styles.userNameText}>Membership ID</Text>
                </View>
                <TextInput
                  style={styles.userNameInput}
                  placeholder="Enter Membership ID"
                  value={userName}
                  placeholderTextColor={colors.darkGray}
                  returnKeyType={'next'}
                  onChangeText={text => setUserName(text.trim())}
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }} />
            <View style={styles.loginContainer}>
              <View style={{ margin: 3 }}>
                <View style={{ marginTop: 10, marginLeft: 10 }}>
                  <Text style={styles.userNameText}>Password</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between', width: '85%'
                }}>
                  <TextInput
                    secureTextEntry={showPassword}
                    value={password}
                    style={styles.userNameInput}
                    placeholder="Enter Password"
                    placeholderTextColor={colors.darkGray}
                    returnKeyType={'next'}
                    onChangeText={text => setPassword(text.trim())}
                    autoCapitalize="none"
                  />
                  <FontAwesome5 onPress={() => setshowPassword(!showPassword)} style={styles.searchIcon} name={showPassword ? "eye" : "eye-slash"} size={30} color='#5A5A5A' />
                </View>
              </View>
            </View>
            <View style={{ marginTop: 20 }} />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotScreen')} style={{ justifyContent: 'center', alignSelf: 'flex-end' }}>
              <Text style={{ color: colors.gray, fontSize: 12, fontWeight: '600' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 20 }} />
            <TouchableOpacity
              onPress={() => onClickLogin()}
              style={{ backgroundColor: colors.headerBlue, borderRadius: 10 }}>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontWeight: '600',
                    margin: 15,
                    color: 'white',
                  }}>
                  Login
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 20 }} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.headerBlue,
    height: height,
  },
  loginContainer: {
    elevation: 6,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: colors.loginBorderShadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1.27,
    shadowRadius: 4.65,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Quicksand',
  },
  userNameInput: {
    width: '100%',
    color: colors.darkGray,
    padding: 10,
    fontFamily: 'Quicksand',
  },
  searchIcon: {
    padding: 10,
    fontSize: 17
  },
});
