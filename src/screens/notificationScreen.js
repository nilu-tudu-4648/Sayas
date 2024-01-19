import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView, BackHandler, Platform,
  PermissionsAndroid, BackAndroid, Alert, Linking, ScrollView, Dimensions
} from 'react-native';
import Hyperlink from 'react-native-hyperlink'
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import colors from '../assets/colors/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getNotificationsforMember, getmemberDetails } from '../../constants';
import Loader from '../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsforMemberbyId, notificationsread, singleBackgroundnotifsave } from '../redux/actions/notifications.actions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
function NotificationScreen({ navigation, route }) {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [notificationEnlarge, setNotificaationEnlarge] = useState('');
  const { allNotification } = useSelector(state => state.notification)
  const dispatch = useDispatch()
  const routes = useRoute()
  useEffect(() => {
    notificationApiCall();
  }, [allNotification.length]);
  useEffect(() => {
    setNotificaationEnlarge(route.params)
    dispatch(notificationsread(route.params?.tag))
  }, [route.params, navigation])
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (routes.name === "NotificationScreen") {
      if (notificationEnlarge) {
        setNotificaationEnlarge('');
        notificationApiCall()
      } else {
        navigation.navigate("LandingScreen");
      }
    }
    return true
  }, [])
  const notificationApiCall = async () => {
    dispatch(getNotificationsforMemberbyId())
    setLoading(true);
    setLoaderMessage('loading...');
    try {
      await getNotificationsforMember();
      setNotificationData(allNotification);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, 'notifi')
    }
  };

  const headerBackButton = () => {
    dispatch(singleBackgroundnotifsave(''))
    if (notificationEnlarge) {
      setNotificaationEnlarge('');
      notificationApiCall()
    } else {
      navigation.navigate("LandingScreen");
    }
  };



  
  const downloadFile = (fileUrl) => {
    let date = new Date();
    let FILE_URL = fileUrl;
    let file_ext = getFileExtention(FILE_URL);
    file_ext = '.' + file_ext[0];
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        Toast.show('File Downloaded Successfully.'); // Show a toast message
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        Toast.show('Error downloading file.'); // Show an error toast message
      });
  };
  const checkPermission = async (fileUrl) => {
    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile(fileUrl);
        } else {
          alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        console.log("++++" + err);
      }
    }
  };

  
  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec(fileUrl) : undefined;
  };
  const notificationFlatlist = item => {
    return (
      <TouchableOpacity
        onPress={() =>
        (setNotificaationEnlarge(
          item
        ), dispatch(notificationsread(item._id)))
        }>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between', padding: 10
        }}>
          <View
          >
            <Text allowFontScaling={false} style={{ fontSize: 11, fontWeight: '500', color: 'black' }}>
              {item.title?.length > 20 ? `${item?.title?.substring(0, 20)}...` : item?.title}
            </Text>
            <Text allowFontScaling={false}
              style={{
                fontSize: 10,
                marginVertical: 5,
                fontWeight: 'normal',
                color: colors.notificationTextGray,
              }}>
              {item.body?.length > 40 ? `${item?.body?.substring(0, 40)}...` : item?.body}
            </Text>
            <Text allowFontScaling={false}
              style={{
                fontSize: width * .023,
                fontWeight: '500',
                color: colors.notificationGray,
              }}>
              {moment(item?.createdAt).format('lll')}
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: '15%' }}>
            <View style={{
              width: 15, height: 15, borderRadius: 7.25,right:10,
              backgroundColor:
                item.notificationType == "Alert" ? '#F30064' :
                  item.notificationType == "Announcement" ? "#00FAFF" :
                    item.notificationType == "Notification" ? 'green' : 'yellow'
            }} />
            <View style={{
              marginTop: 10, width: '60%', flexDirection: 'row',
              alignItems: 'center', justifyContent: 'space-between'
            }}>
              {
                (item?.attachmentUrl || item?.bigPictureUrl) ?
                  <TouchableOpacity
                    onPress={() => checkPermission(item?.attachmentUrl || item?.bigPictureUrl)}
                  >
                    <FontAwesome
                      name="download"
                      size={width * .03}
                      color={'black'}
                    />
                  </TouchableOpacity> :
                  <View style={{ width: width * .04 }} />
              }
              {
                item.read.includes(getmemberDetails?.id) &&
                <Ionicons
                  name="checkmark-done"
                  size={width * .03}
                  color={'black'}
                />}
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.lightgray,
            height: 1,
          }}
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
            <TouchableOpacity onPress={() => headerBackButton()}>
              <AntDesign
                name="arrowleft"
                size={25}
                color={'white'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>

            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                Communication
              </Text>
            </View>
          </View>
        </View>
      </View>
      {!notificationEnlarge && notificationData ? (
        <View style={{ marginBottom: 70, paddingHorizontal: 10 }}>
          <FlatList
            // onRefresh={() => onRefresh()}
            // refreshing={isFetching}
            showsVerticalScrollIndicator={false}
            data={notificationData}
            renderItem={item => notificationFlatlist(item.item)}
            keyExtractor={(item, index) => index}
          // onScroll
          />
        </View>
      ) : (
        <ScrollView style={{ marginHorizontal: 20, marginVertical: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, fontWeight: '600', color: 'black' }}>
              {notificationEnlarge?.title}
            </Text>
            <Text style={{ right: 30 }}>
              {
                (notificationEnlarge?.attachmentUrl || notificationEnlarge?.bigPictureUrl) &&
                <TouchableOpacity
                  onPress={() => downloadFile(notificationEnlarge?.attachmentUrl || notificationEnlarge?.bigPictureUrl)}
                >
                  <FontAwesome
                    name="download"
                    size={18}
                    color={'black'}
                  />
                </TouchableOpacity>
              }</Text>
          </View>
          <View style={{ marginTop: 5 }}>
            <Text allowFontScaling={false}
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: colors.notificationGray,
              }}>
              {moment(notificationEnlarge?.createdAt).format('lll')}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.lightgray,
              height: 1,
              marginTop: 10,
            }}
          />
          <View style={{ marginTop: 20 }}>
            <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2980b9', fontSize: 12 }}>
              <Text allowFontScaling={false}
                style={{
                  color: colors.notificationTextGray,
                  fontSize: 12,
                  // letterSpacing: 1,
                }}>
                {notificationEnlarge?.body || notificationEnlarge?.message}
              </Text>
            </Hyperlink>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // height: height,
  },
});
