import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { Button, Dialog, Portal } from 'react-native-paper';

import LinearGradient from 'react-native-linear-gradient';
import colors from '../assets/colors/colors';
const { width, height } = Dimensions.get('window');
const LogoutComponent = ({ visible, onPress, onPress2, heading, body, button2 }) => {
    return (
        <Portal>
            <Dialog style={{ height: height / 4 }} visible={visible}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['white', 'white']}
                    style={{ height: height / 4, padding: 25, justifyContent: 'space-between' }}
                >
                    <Text style={{ alignSelf: 'center', fontSize: 20, color: 'black', fontWeight: '600' }}>{heading}</Text>
                    <View>
                        <Text style={{ alignSelf: 'center', fontSize: 18, color: 'black', fontWeight: '600' }}>{body}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button uppercase={false} onPress={() => onPress()}
                            mode='text' labelStyle={{ color: colors.headerBlue, fontWeight: '600' }} >
                            Cancel
                        </Button>
                        <Button uppercase={false} style={{ borderRadius: 18 }} onPress={() => onPress2()}
                            mode='contained' contentStyle={{ backgroundColor: colors.headerBlue }}>
                            {button2}
                        </Button>
                    </View>
                </LinearGradient>
            </Dialog>
        </Portal>
    )
}

export default LogoutComponent

const styles = StyleSheet.create({})