/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CountDown from 'react-native-countdown-component';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import WhiteLogo from '../assets/images/whiteLogo.png';
import colors from '../assets/colors/colors';
import Loader from '../components/loader';
import Toast from 'react-native-simple-toast';
import { LogBox } from "react-native";
import { getOtpformember, resetPassword, verifyOtp } from '../../constants';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
const { width, height } = Dimensions.get('window');
function ForgotpasswordScreen({ navigation }) {
    const [phoneNo, setphoneNo] = useState('');
    const [showPassword, setshowPassword] = useState(true)
    const [showPassword1, setshowPassword1] = useState(true)
    const [cpassword, setCPassword] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [verify, setverify] = useState(false);
    const [otpfield, setotpfield] = useState(false);
    const [textfieldopen, settextfieldopen] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');
    const [timerShow, settimerShow] = useState(false);
    const [otpValue, setotpValue] = useState('');
    const [disableResend, setdisableResend] = useState(false);

    useEffect(() => {
    }, [timerShow])
    const checkOtpValid = async () => {
        // setLoading(true)
        // setLoaderMessage('Verifying otp')
        try {
            const responseviri = await verifyOtp({
                mobileNumber: phoneNo,
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
        if (password === cpassword) {
            if (password.length < 8) {
                Toast.show('Password must be 8 digit')
            } else {
                await resetPassword({
                    mobileNumber: phoneNo,
                    password,
                    confirmPassword: cpassword
                })
                navigation.navigate('LoginScreen')
            }
        } else {
            Toast.show('password mismatched')
        }
    }
    const sendOtpApicall = async () => {
        const result = await getOtpformember({ mobileNumber: phoneNo })
        setdisableResend(true)
        if (result == 'Sent success') {
            setotpfield(true),
                settimerShow(!timerShow),
                setverify(true)
            // setotpclear(false)
        }
    }
    return (
        <View style={styles.container}>
            <Loader loading={loading} message={loaderMessage} />
            <View style={{ height: '30%', backgroundColor: colors.headerBlue }}>
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
                        height: '100%',
                    }}>
                    <Image
                        source={WhiteLogo}
                        resizeMode={'contain'}
                        style={{
                            width: 130, height: 130, aspectRatio: 1, marginBottom: 90,tintColor:'white'
                        }}
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
                    <Text  allowFontScaling={false}
                        style={{
                            fontSize: width * .06,
                            fontWeight: '600',
                            fontFamily: 'Quicksand',
                            color: 'black',
                            marginTop: 20,
                            marginBottom: 20,
                        }}>
                        Forgot Password
                    </Text>
                </View>
                {
                    !textfieldopen ?
                        <View style={{ marginHorizontal: 40 }}>
                            <View style={styles.loginContainer}>
                                <View style={{ margin: 3 }}>
                                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                                        <Text  allowFontScaling={false} style={styles.userNameText}>Enter Mobile No</Text>
                                    </View>
                                    <TextInput
                                        style={styles.userNameInput}
                                        placeholder="Enter Mobile No"
                                        value={phoneNo}
                                        placeholderTextColor={colors.darkGray}
                                        returnKeyType={'next'}
                                        maxLength={10}
                                        onChangeText={text => setphoneNo(text.trim())}
                                        autoCapitalize="none"
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>
                            {otpfield &&
                                <>
                                    <View style={styles.loginContainer}>
                                        <View style={{ margin: 3 }}>
                                            <View style={{ marginTop: 10, marginLeft: 10 }}>
                                                <Text  allowFontScaling={false} style={styles.userNameText}>Enter OTP</Text>
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
                                        <TouchableOpacity disabled={disableResend} onPress={() => (sendOtpApicall())}
                                            style={{ justifyContent: 'center', alignSelf: 'flex-end' }}>
                                            <View>
                                                <Text  allowFontScaling={false} style={{ color: colors.gray, fontSize: 12, fontWeight: '600' }}>
                                                    Resend OTP ?
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                            <View style={{ marginTop: 40 }} />
                            {
                                !verify ?
                                    <TouchableOpacity
                                        onPress={() => phoneNo ? phoneNo.length < 10 || phoneNo.length > 10 ? Toast.show('please enter valid number')
                                            : (sendOtpApicall()) :
                                            Toast.show('please enter phone number')}
                                        style={{ backgroundColor: colors.headerBlue, borderRadius: 10 }}>
                                        <View>
                                            <Text  allowFontScaling={false}
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
                                            <Text  allowFontScaling={false}
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
                                    <Text  allowFontScaling={false} style={styles.userNameText}>Enter Password</Text>
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
                                        // maxLength={8}
                                        onChangeText={text => setPassword(text.trim())}
                                        autoCapitalize="none"
                                    />
                                    <FontAwesome5 onPress={() => setshowPassword(!showPassword)} style={styles.searchIcon} name={showPassword ? "eye" : "eye-slash"} size={30} color='#5A5A5A' />
                                </View>
                            </View>
                            <View style={{ margin: 3 }}>
                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text  allowFontScaling={false} style={styles.userNameText}>Confirm Password</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between', width: '85%'
                                }}>
                                    <TextInput
                                        secureTextEntry={showPassword1}
                                        value={cpassword}
                                        style={styles.userNameInput}
                                        // maxLength={8}
                                        placeholder="Enter Password"
                                        placeholderTextColor={colors.darkGray}
                                        returnKeyType={'next'}
                                        onChangeText={text => setCPassword(text.trim())}
                                        autoCapitalize="none"
                                    />
                                    <FontAwesome5 onPress={() => setshowPassword1(!showPassword1)} style={styles.searchIcon} name={showPassword1 ? "eye" : "eye-slash"} size={30} color='#5A5A5A' />
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => checkBothPassword()}
                                style={{ backgroundColor: colors.headerBlue, borderRadius: 10 }}>
                                <View>
                                    <Text  allowFontScaling={false}
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
        </View>
    );
}

export default ForgotpasswordScreen;

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
        shadowRadius: 4.65, margin: 5
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
