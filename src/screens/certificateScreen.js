import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Platform,
  PermissionsAndroid, BackHandler
} from 'react-native';
import colors from '../assets/colors/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getCertficateDataOfMember } from '../../constants'
import Loader from '../components/loader';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';

function CertificateScreen({ navigation }) {
  const checkPermission = async (fileUrl) => {
    console.log(fileUrl)
    // Function to check the platform
    // If Platform is Android then check for permissions.

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
        Toast.show('File Downloaded Successfully.');
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec(fileUrl) : undefined;
  };
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  useEffect(() => {
    getCertifiacteData()
  }, []);
  BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.goBack()
  }, [])
  const getCertifiacteData = async () => {
    try {
      setLoading(true);
      setLoaderMessage('loading...');
      let getCertficateDataOfMemberResponse = await getCertficateDataOfMember()
      console.log("getCertficateDataOfMemberResponse", getCertficateDataOfMemberResponse[0])
      const maps = getCertficateDataOfMemberResponse.filter(ite => ite.isValid == true)
      setCertificateDataArray(maps)
      setLoading(false);
      console.log(maps)
    } catch (error) {
      setLoading(false);
    }
  }

  const [certificateDataArray, setCertificateDataArray] = useState([]);
  const certificateFlatlist = (item) => {
    return (
      <TouchableOpacity
        style={{ paddingVertical: 12, borderBottomColor: colors.lightgray, borderBottomWidth: 1 }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',

          }}>
          <View
            style={{
              // marginTop: 10,
              alignSelf: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
              Certificate No - {item.shareCertificationNo}
            </Text>
            <View style={{ marginTop: 5 }}>
              <Text allowFontScaling={false}
                style={{
                  fontSize: 10,
                  fontWeight: 'normal',
                  color: colors.notificationTextGray,
                }}>
                Date Issued -{moment(item.updatedAt).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', width: '18%', justifyContent: 'space-between' }} onPress={() => checkPermission(item.shareCertificationUrl)} >
            <Text allowFontScaling={false} style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
              {item.noOfShares}
            </Text>
            <AntDesign
              name="download"
              size={20}
              color={'black'}
            />
          </TouchableOpacity>
          {/* <View >
            {item.isValid == true ?
              <Text style={{ fontSize: 12, fontWeight: '600', color: 'green' }}>
                isvalid
              </Text> :
              <Text style={{ fontSize: 12, fontWeight: '600', color: 'red' }}>invalid</Text>
            }
          </View> */}
        </View>
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={25}
                color={'white'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>

            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                Certificate
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 30, marginHorizontal: 15 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={certificateDataArray}
          renderItem={item => certificateFlatlist(item.item)}
          keyExtractor={(item, index) => index}
        />
      </View>
    </SafeAreaView>
  );
}

export default CertificateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // height: height,
  },
});
