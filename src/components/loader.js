import React, { Component } from 'react';
import { StyleSheet, View, Modal, ActivityIndicator, Text } from 'react-native';
import { Dialog } from 'react-native-paper';
const Loader = props => {
  const { loading, message, ...attributes } = props;
  return loading ? (
    <View style={styles.centeredView}>
        <Dialog visible={loading}>
          <View style={styles.modalBackground}>
            <View style={{ marginRight: 30, marginLeft: 30 }}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator animating={loading} style={{ paddingTop: 10 }} />
                <Text style={{ textAlign: 'center', padding: 20 }}>{message}</Text>
              </View>
            </View>
          </View>
        </Dialog>
    </View>
  ) : null;
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  activityIndicatorWrapper: {
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    height: 100,
    width: '100%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
export default Loader;
