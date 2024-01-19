import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Signupheader2 from '../components/Signupheader2'
import LogoutComponent from '../components/LogoutComponent'
import colors from '../assets/colors/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNewUser } from '../../constants'

import CheckBox from '@react-native-community/checkbox'
import Toast from 'react-native-simple-toast';
const Confirmation = ({ navigation, route }) => {

    const [checked, setChecked] = useState(false);

    const [submitdialogVisible, setsubmitdialogVisible] = useState(false);

    const getDatafromStorage = async () => {
        try {
            let userdata = await AsyncStorage.getItem('personal')
            let userdata1 = await AsyncStorage.getItem('occupation')
            userdata = JSON.parse(userdata)
            userdata1 = JSON.parse(userdata1)
            const result = {
                ...userdata1,
                ...userdata,
                ...route.params
            }
            hideDialog()
            const sendtoApi = await createNewUser(result)
            if (sendtoApi.member) {
                navigation.replace('WelcomeScreen', { showWindow: true })
            }

        } catch (error) {

        }


    }
    const hideDialog = () => setsubmitdialogVisible(false)
    return (
        <ScrollView >
            <Signupheader2 heading={'Declaration'} onPress={() => navigation.goBack()} />
            <View style={{ paddingHorizontal: 40, marginVertical: '20%', flexDirection: 'row', left: -20 }}>
                <CheckBox
                    value={checked ? true : false}
                    onValueChange={() => {
                        setChecked(!checked);
                    }}
                />
                <Text  allowFontScaling={false}>
                    I hereby declare that the information furnished
                    above is true, complete and correct to the best of my knowledge and belief I authorize Sayas Cooperative Society and its representatives to call, SMS, email or communicate via WhatsApp regarding my membership application and other services offered by Sayas Cooperative Society Ltd. This consent overrides any registration for DNC/NDNC. I confirm I am a resident of Maharashtra, I am 18 years old or above and I have read and I accept Sayas Cooperative Society’s
                    <Text onPress={() => Linking.openURL('https://sayas.co.in/by-laws/')} style={{ color: 'blue' }}> By-laws</Text> ,<Text onPress={() => Linking.openURL('https://sayas.co.in/privacy-policy/')} style={{ color: 'blue' }}> Privacy Policy</Text>  and<Text onPress={() => Linking.openURL('https://sayas.co.in/terms-conditions/')} style={{ color: 'blue' }}> Terms & Conditions.</Text>
                </Text>

                <LogoutComponent
                    visible={submitdialogVisible}
                    heading={'Confirm Submission'}
                    button2={'Submit'}
                    body={'Are you sure want to submit the Application ?'}
                    onPress={() => hideDialog()}
                    onPress2={() => getDatafromStorage()}
                />

            </View>
            <TouchableOpacity
                onPress={() => checked ? setsubmitdialogVisible(true) : Toast.show('Please agree above T&C')}
                style={{
                    alignSelf: 'center', backgroundColor: colors.headerBlue,
                    borderRadius: 10, width: '55%', marginVertical: 30,
                }}>
                <View>
                    <Text allowFontScaling={false}
                        style={{
                            fontSize: 14,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontWeight: '600',
                            margin: 15,
                            color: 'white',
                        }}>
                        Submit
                    </Text>
                </View>
            </TouchableOpacity>
        </ScrollView >
    )
}

export default Confirmation

const styles = StyleSheet.create({})