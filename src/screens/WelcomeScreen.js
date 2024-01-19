import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Keyboard, BackHandler, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../assets/colors/colors';
import CountDown from 'react-native-countdown-component';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Toast from 'react-native-simple-toast';
import { Portal, Button, Dialog } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient';
import { getOtpformember, resetPassword, verifyOtp } from '../../constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WhiteLogo from '../assets/images/whiteLogo.png';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RNRestart from 'react-native-restart';
const { height } = Dimensions.get('screen')
const WelcomeScreen = ({ navigation, route }) => {
    const [firstTimeuserField, setfirstTimeuserField] = useState(false)
    const [memberId, setmemberId] = useState('');
    const [timerShow, settimerShow] = useState(false);
    const [otpValue, setotpValue] = useState('');
    const [otpfield, setotpfield] = useState(false);
    const [loading, setLoading] = useState(false);
    const [textfieldopen, settextfieldopen] = useState(false);
    const [verify, setverify] = useState(false);
    const [cpassword, setCPassword] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setshowPassword] = useState(true)
    const [showPassword1, setshowPassword1] = useState(true)
    const [disableResend, setdisableResend] = useState(false);
    const [confirmDialog, setconfirmDialog] = useState(false);
    const dispatch = useDispatch()
    const clearAll = async () => {
        try {
            await AsyncStorage.clear()
            if (route.params.showWindow) {
                setconfirmDialog(true)
                setTimeout(() => {
                    setconfirmDialog(false)
                }, 10000);
            }
        } catch (error) {
        }
    }
    useEffect(() => {
        clearAll()
    }, [timerShow])
    BackHandler.addEventListener('hardwareBackPress', () => {
        if (firstTimeuserField) {
            setfirstTimeuserField(false)
            setmemberId('')
            setverify(false)
            setotpfield(false)
        } else {
            BackHandler.exitApp()
        }
        return true
    }, []);
    // const arr = [1, 2, 3, 4, 0, -3, -4]
    // function hello(arr){
    //     for (let v of arr) {
    //         for (let i = 1; i < arr.length; i++) {
    //             if (v + arr[i] == 0) {
    //                 return [v, v]
    //             }
    //         }
    //         console.log(arr)
    //     }
    // }
    // const result =hello([1, 2, 3, 4, 0, -3, -4])
    // console.log(result)




    const checkOtpValid = async () => {
        // setLoading(true)
        // setLoaderMessage('Verifying otp')
        try {
            const responseviri = await verifyOtp({
                memberId,
                otp: otpValue
            })
            // setLoading(false)
            if (responseviri?.success == true) {
                settextfieldopen(true)
            }
        } catch (error) {
            setLoading(false)
            Toast.show('try again')
        }
        // setLoading(false)
    }
    const checkBothPassword = async () => {
        if (password.length < 8) {
            Toast.show('Password must be 8 digit')
        } else {
            if (password === cpassword) {
                await resetPassword({
                    memberId,
                    password,
                    confirmPassword: cpassword
                })
                // navigation.navigate('LoginScreen')
                RNRestart.Restart()
            } else {
                Toast.show('password mismatched')
            }
        }
    }
    const sendOtpApicall = async () => {
        setdisableResend(true)
        const result = await getOtpformember({ memberId })
        if (result === 'Sent success') {
            settimerShow(!timerShow),
                setotpfield(true),
                setverify(true)
        }
    }


    return (
        <View style={styles.container}>
            <Portal>
                <Dialog style={{ width: '75%', height: height / 4, justifyContent: 'center', alignSelf: 'center' }} visible={confirmDialog}>
                    <View style={{ height: height / 4, padding: 12, justifyContent: 'space-between' }}>
                        <Text style={{ alignSelf: 'center', fontSize: 17, color: 'black', fontWeight: '600', top: 10 }}>Confirmation</Text>
                        <View>
                            <Text style={{ alignSelf: 'center', fontSize: 13, color: 'black' }}>Your membership application has been submitted successfully.
                                Once the application data is verified and approved, you will receive the sms with login details.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: -10 }}>
                            <Button uppercase={false} onPress={() => setconfirmDialog(!confirmDialog)}
                                mode='text' labelStyle={{ color: colors.headerBlue, fontWeight: '600' }} >
                                Cancel
                            </Button>
                            <Button uppercase={false} style={{ borderRadius: 18 }} onPress={() => setconfirmDialog(!confirmDialog)}
                                mode='contained' contentStyle={{ backgroundColor: colors.headerBlue }}>
                                OK
                            </Button>
                        </View>
                    </View>
                </Dialog>
            </Portal>
            {
                !firstTimeuserField ?
                    <View style={{ backgroundColor: colors.headerBlue }}>
                        <View
                            style={{
                                justifyContent: 'flex-end',
                                alignSelf: 'center',
                                height: '60%',
                            }}>
                            <Image
                                source={WhiteLogo}
                                resizeMode={'contain'}
                                style={{ width: 160, height: 160, aspectRatio: 1, marginBottom: 122, tintColor: 'white' }}
                            />
                        </View>
                        <View style={{
                            alignItems: 'center',
                            height: '40%', justifyContent: 'space-between', paddingVertical: 30
                        }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SignUpScreen')}
                                style={styles.btnsstyles}
                            >
                                <Text allowFontScaling={false}
                                    style={{
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        fontWeight: '500',
                                        margin: 15,
                                        color: colors.headerBlue,
                                    }}>
                                    Become a Member
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setfirstTimeuserField(true)}
                                style={styles.btnsstyles}
                            >
                                <Text allowFontScaling={false}
                                    style={{
                                        fontSize: 15,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        fontWeight: '500',
                                        margin: 15,
                                        color: colors.headerBlue,
                                    }}>
                                    First Time User
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('LoginScreen')}
                                style={styles.btnsstyles}
                            >
                                <View>
                                    <Text allowFontScaling={false}
                                        style={{
                                            fontSize: 15,
                                            textAlign: 'center',
                                            textAlignVertical: 'center',
                                            fontWeight: '500',
                                            margin: 15,
                                            color: colors.headerBlue,
                                        }}>
                                        Login
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <>
                        <View style={{ height: '30%', backgroundColor: colors.headerBlue }}>
                            <TouchableOpacity style={{ width: 50, margin: 12 }}
                                onPress={() => (setfirstTimeuserField(false),
                                    setmemberId(''), setverify(false), setotpfield(false))}>
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
                                    height: '100%',
                                }}>
                                <Image
                                    source={WhiteLogo}
                                    resizeMode={'contain'}
                                    style={{ width: 130, height: 130, aspectRatio: 1, marginBottom: 90, tintColor: 'white' }}
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
                                <Text allowFontScaling={false}
                                    style={{
                                        fontSize: 30,
                                        fontWeight: '600',
                                        fontFamily: 'Quicksand',
                                        color: 'black',
                                        marginTop: 20,
                                        marginBottom: 20,
                                    }}>
                                    Membership ID
                                </Text>
                            </View>
                            {
                                !textfieldopen ?
                                    <View style={{ marginHorizontal: 40 }}>
                                        <View style={styles.loginContainer}>
                                            <View style={{ margin: 3 }}>
                                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                                    <Text allowFontScaling={false} style={styles.userNameText}>Enter Membership Id</Text>
                                                </View>
                                                <TextInput
                                                    style={styles.userNameInput}
                                                    placeholder="Enter Membership Id"
                                                    value={memberId}
                                                    // maxLength={10}
                                                    placeholderTextColor={colors.darkGray}
                                                    returnKeyType={'next'}
                                                    onChangeText={text => setmemberId(text.trim())}
                                                    autoCapitalize="none"
                                                />
                                            </View>
                                        </View>
                                        {otpfield &&
                                            <>
                                                <View style={styles.loginContainer}>
                                                    <View style={{ margin: 3 }}>
                                                        <View style={{ marginLeft: 10 }}>
                                                            <Text allowFontScaling={false} style={styles.userNameText}>Enter OTP</Text>
                                                        </View>
                                                        <OTPInputView
                                                            pinCount={4}
                                                            style={styles.otpView}
                                                            codeInputFieldStyle={styles.underlineStyleBase}
                                                            onCodeFilled={value => {
                                                                setotpValue(value)
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    {
                                                        timerShow ?
                                                            <View>
                                                                <CountDown
                                                                    until={60 * 3}
                                                                    size={15}
                                                                    onFinish={() => setdisableResend(false)}
                                                                    digitStyle={{ backgroundColor: '#FFF' }}
                                                                    digitTxtStyle={{ color: colors.gray }}
                                                                    timeToShow={['M', 'S']}
                                                                    timeLabels={{ m: '', s: '' }}
                                                                />
                                                            </View>
                                                            : <CountDown
                                                                until={60 * 3}
                                                                size={15}
                                                                onFinish={() => setdisableResend(false)}
                                                                digitStyle={{ backgroundColor: '#FFF' }}
                                                                digitTxtStyle={{ color: colors.gray }}
                                                                timeToShow={['M', 'S']}
                                                                timeLabels={{ m: '', s: '' }}
                                                            />
                                                    }
                                                    <TouchableOpacity disabled={disableResend} onPress={() => (sendOtpApicall(), setotpValue(''))}
                                                        style={{ justifyContent: 'center', alignSelf: 'flex-end' }}>
                                                        <View>
                                                            <Text allowFontScaling={false} style={{ color: colors.gray, fontSize: 12, fontWeight: '600' }}>
                                                                Resend OTP ?
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        }
                                        <View style={{ marginTop: 10 }} />
                                        {
                                            !verify ?
                                                <TouchableOpacity
                                                    onPress={() => (sendOtpApicall())}
                                                    style={{ backgroundColor: colors.headerBlue, borderRadius: 10 }}>
                                                    <View>
                                                        <Text allowFontScaling={false}
                                                            style={{
                                                                fontSize: 13,
                                                                textAlign: 'center',
                                                                textAlignVertical: 'center',
                                                                fontWeight: '600',
                                                                margin: 15,
                                                                color: 'white',
                                                            }}>
                                                            Send OTP
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity> :
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        otpValue.length < 4 ? Toast.show('Please fill otp correctly') : checkOtpValid()}
                                                    style={{ backgroundColor: colors.headerBlue, borderRadius: 10 }}>
                                                    <View>
                                                        <Text allowFontScaling={false}
                                                            style={{
                                                                fontSize: 13,
                                                                textAlign: 'center',
                                                                textAlignVertical: 'center',
                                                                fontWeight: '600',
                                                                margin: 15,
                                                                color: 'white',
                                                            }}>
                                                            Verify
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                    </View> :
                                    <View style={{ marginHorizontal: 40 }}>
                                        <View style={{ margin: 3 }}>
                                            <View style={{ marginTop: 10, marginLeft: 10 }}>
                                                <Text allowFontScaling={false} style={styles.userNameText}>Enter Password</Text>
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
                                                <FontAwesome5 onPress={() => setshowPassword(!showPassword)} style={styles.searchIcon} name={!showPassword ? "eye" : "eye-slash"} size={30} color='#5A5A5A' />
                                            </View>
                                        </View>
                                        <View style={{ margin: 3 }}>
                                            <View style={{ marginTop: 10, marginLeft: 10 }}>
                                                <Text allowFontScaling={false} style={styles.userNameText}>Confirm Password</Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between', width: '85%'
                                            }}>
                                                <TextInput
                                                    secureTextEntry={showPassword1}
                                                    value={cpassword}
                                                    style={styles.userNameInput}
                                                    placeholder="Enter Password"
                                                    placeholderTextColor={colors.darkGray}
                                                    returnKeyType={'next'}
                                                    onChangeText={text => setCPassword(text.trim())}
                                                    autoCapitalize="none"
                                                />
                                                <FontAwesome5 onPress={() => setshowPassword1(!showPassword1)} style={styles.searchIcon} name={!showPassword1 ? "eye" : "eye-slash"} size={30} color='#5A5A5A' />
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => checkBothPassword()}
                                            style={{ backgroundColor: colors.headerBlue, borderRadius: 10 }}>
                                            <View>
                                                <Text allowFontScaling={false}
                                                    style={{
                                                        fontSize: 13,
                                                        textAlign: 'center',
                                                        textAlignVertical: 'center',
                                                        fontWeight: '600',
                                                        margin: 15,
                                                        color: 'white',
                                                    }}>
                                                    Set Password
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                    </>
            }
        </View>
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.headerBlue,
        justifyContent: 'center'
    }, btnsstyles: {
        backgroundColor: 'white',
        borderRadius: 22,
        width: '75%',
    },
    container1: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 42,
        flexDirection: 'row',
        alignSelf: 'center',
        height: '90%',
        width: '100%',
        // backgroundColor: 'gray',
    },
    eachitem: {
        minWidth: 140, height: 80,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        elevation: 6, marginVertical: 12,
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
    otpView: {
        width: '90%',
        height: 90,
        alignSelf: 'center'
    }, searchIcon: {
        padding: 10,
        fontSize: 17
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: 'black',
        borderBottomColor: '#17BED0',

    },
});