import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { getmemberDetails } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import VersionNumber from 'react-native-version-number';
const CustomDrawer = props => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <LinearGradient
          start={{ x: 1.0, y: 0.5 }}
          end={{ x: 0.7, y: 1.0 }}
          colors={['rgba(43, 94, 227, 1)', 'rgba(43, 94, 227, .9)']}
          style={{ height: 200, top: -10, padding: 12 }}>
          <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255, 255, 255, 0.11)', position: 'absolute', top: -60, right: 30, }}></View>
          <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255, 255, 255, 0.11)', position: 'absolute', right: -58, top: -15 }}></View>
          <View style={{ marginTop: 'auto' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileScreen')}
            >
              {getmemberDetails?.userImage ?
                <Avatar.Image size={84} source={{ uri: getmemberDetails.userImage }} />
                : <Avatar.Icon icon="account" style={{ backgroundColor: 'purple' }} size={82} />}
            </TouchableOpacity>
            <View>
              <View style={{ marginTop: 3 }}>
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{getmemberDetails?.firstName}</Text>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 11 }}>{getmemberDetails?.email}</Text>
              </View>
              <View style={{ marginTop: 3 }}>
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 11 }}>{getmemberDetails?.memberId}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
        <View style={{ alignItems: 'center',bottom:15}}>
          <Text>{`Version : ${VersionNumber.appVersion}`} </Text>
        </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
