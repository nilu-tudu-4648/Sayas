import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Image, ScrollView, TouchableOpacity, BackHandler,
} from 'react-native';
import WhiteLogo from '../assets/images/whiteLogo.png';
import colors from '../assets/colors/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';



const { width, height } = Dimensions.get('window');
function SignUpScreen({ navigation }) {
    const routes = useRoute()
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //     if (routes.name == "SignUpScreen") {
    //         console.log('first')
    //         navigation.replace("WelcomeScreen")
    //     }
    //     return true;
    // }, []);

    return (
        <View style={styles.container}>
            <View style={{ height: '30%', backgroundColor: '#477BFF' }}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        height: '100%',
                    }}>
                    <Image
                        source={WhiteLogo}
                        resizeMode={'contain'}
                        style={{ width: 130, height: 130, aspectRatio: 1, tintColor: 'white' }}
                    />
                </View>
            </View>
            <View
                style={{
                    height: '70%',
                    backgroundColor: colors.snow,
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                }}>
                <View style={{
                    justifyContent: 'center',
                    borderBottomColor: '#E5E5E5', borderBottomWidth: 4, width: '90%',
                    alignSelf: 'center', alignItems: 'center'
                }}>
                    <View style={{ alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                fontFamily: 'Poppins',
                                color: 'black',
                                marginTop: 20,
                            }}>
                            Sayas Cooperative
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                fontFamily: 'Poppins',
                                color: 'black',
                            }}>
                            Membership Application
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                        <TouchableOpacity onPress={() => navigation.navigate("WelcomeScreen")}>
                            <AntDesign
                                name="arrowleft"
                                size={32}
                                color={'black'}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                fontFamily: 'Poppins',
                                color: 'black',
                                marginTop: 20,
                                marginBottom: 20,
                            }}>
                            Instructions
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
                            <AntDesign
                                name="arrowright"
                                size={32}
                                color={'gray'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView >
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 }}>
                        <View style={{ marginHorizontal: 11, justifyContent: 'flex-start', marginTop: 12 }}>
                            <Text allowFontScaling={false}>Before filling Sayas membership application form, please scan and store the following documents as
                                separate files.</Text>
                            <View style={{ marginVertical: 5 }}>
                                <Text allowFontScaling={false}><Text style={{ fontWeight: '600', fontSize: 15, color: 'black' }} >1. Identity proof</Text>- Pan Card / Aadhar Card / Passport / Driving Licence.</Text>
                            </View>
                            <View style={{ marginVertical: 5 }}>
                                <Text allowFontScaling={false}><Text style={{ fontWeight: '600', fontSize: 15, color: 'black' }}>2. Address proof </Text>- Aadhar Card / Passport / Driving Licence / Property Tax Receipt/ Rent Agreement.</Text>
                            </View>
                            <View style={{ marginVertical: 5 }}>
                                <Text allowFontScaling={false}><Text style={{ fontWeight: '600', fontSize: 15, color: 'black' }}>3. Payment proof </Text>- Cheque / Payment transaction receipt</Text>
                            </View>
                            <Text allowFontScaling={false} style={{ marginVertical: 10, fontWeight: '600', fontSize: 15, color: 'black' }}> Note:</Text>
                            <Text allowFontScaling={false} style={{ marginVertical: 10 }}>Only.pdf/.jpeg/.jpg/.png file types are allowed for upload.</Text>
                            <Text allowFontScaling={false} style={{ marginVertical: 14 }}>Max file size should not exceed 2 MB.</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Payment')}
                            style={{
                                alignSelf: 'center', backgroundColor: colors.headerBlue,
                                borderRadius: 10, width: '55%', marginBottom: 40
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        fontWeight: '600',
                                        margin: 15,
                                        color: 'white',
                                    }}>
                                    Next
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#477BFF',
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
});
