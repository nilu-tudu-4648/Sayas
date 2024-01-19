import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity, ScrollView, Image
} from 'react-native';
import colors from '../assets/colors/colors';
import { createNewUser, uploadImage } from '../../constants';
import Loader from '../components/loader';
import DocumentPicker from 'react-native-document-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-simple-toast';
import { Button, Dialog, Modal, Portal } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob'

import LinearGradient from 'react-native-linear-gradient';
import Signupheader2 from '../components/Signupheader2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutComponent from '../components/LogoutComponent';
const Identitydata = [
    { label: 'Pan Card', value: '1' },
    { label: 'Aadhar Card', value: '2' },
    { label: 'Passport', value: '3' },
    { label: 'Voter Card', value: '4' },
    { label: 'Driving License', value: '5' },
];
const addressdata = [
    { label: 'Aadhar Card', value: '1' },
    { label: 'Passport', value: '2' },
    { label: 'Voter Card', value: '3' },
    { label: 'Driving License', value: '4' },
    { label: 'Property Tax Reciept', value: '5' },
];
const paymentdata = [
    { label: 'Cheque', value: '1' },
    { label: 'Online transaction reciept', value: '2' },
];
const { width, height } = Dimensions.get('window');
function DocumentUploadScreen({ navigation }) {

    const [value, setValue] = useState(null);
    const [value2, setValue2] = useState(null);
    const [value3, setValue3] = useState(null);
    const [submitdialogVisible, setsubmitdialogVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [idProofname, setidProofname] = useState('');
    const [addressProofname, setaddressProofname] = useState('');
    const [paymentProofname, setpaymentProofname] = useState('');
    const [idProof, setidProof] = useState({ idProof: null });
    const [addressProof, setaddressProof] = useState({ addressProof: null });
    const [paymentProof, setpaymentProof] = useState({ paymentProof: null });
    const docPicker = async (type) => {
        try {
            let res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (res[0].size < 2000000) {
                RNFetchBlob.fs
                    .readFile(res[0]['uri'], 'base64')
                    .then(async (datas) => {
                        const func = async () => {
                            setLoading(true)
                            setLoaderMessage('Uploading')
                            try {
                                const data = await uploadImage({
                                    'name': res[0]['name'],
                                    'type': res[0]['type'],
                                    'imageData': `data:${res[0]['type']};base64,${datas}`,
                                })
                                setLoading(false)
                                if (type === 'address') {
                                    setaddressProofname(res[0]['name'])
                                    setaddressProof({ addressProof: data })
                                    Toast.show('Address Proof is uploaded Succesfully')
                                }
                                if (type === 'identity') {
                                    setidProof({ idProof: data })
                                    setidProofname(res[0]['name'])
                                    Toast.show('Identity Proof is uploaded Succesfully')
                                }
                                if (type === 'payment') {
                                    setpaymentProofname(res[0]['name'])
                                    setpaymentProof({ paymentProof: data })
                                    Toast.show('Paymemt Proof is uploaded Succesfully')
                                }
                            } catch (error) {
                                console.log(error)
                                setLoading(false)
                            }

                        }
                        if (res[0]['type'] == 'application/pdf') {
                            func()
                        } else if (res[0]['type'] == 'image/jpeg') {
                            func()
                        } else if (res[0]['type'] == 'image/png') {
                            func()
                        } else {
                            Toast.show('File type is not supported')
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
                        console.log(err, 'err')
                    });
            } else {
                Toast.show('maximum file size limit is 2 mb')
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('error -----', err);
            } else {
                // throw err
                console.log('error --', err);
            }
        }
    };
    console.log(idProof, addressProof, paymentProof)

    const findDoucu = async () => {
        setLoading(true)
        setLoaderMessage('loading')
        try {
            let userdata1 = await AsyncStorage.getItem('proof')
            userdata1 = JSON.parse(userdata1)
            setaddressProofname(userdata1.addressProofname)
            setidProofname(userdata1.idProofname)
            setpaymentProofname(userdata1.paymentProofname)
            setaddressProof(userdata1.addressProof)
            setpaymentProof(userdata1.paymentProof)
            setidProof(userdata1.idProof)
            setValue(userdata1.value)
            setValue2(userdata1.value2)
            setValue3(userdata1.value3)
            setLoading(false)
            console.log(userdata1)
        } catch (error) {
            setLoading(false)
        }

    }
    const saveproofs = async (data) => {
        try {
            await AsyncStorage.setItem('proof', JSON.stringify(data))
        } catch (error) {

        }
    }
    useEffect(() => {
        findDoucu()
    }, [])
    // getDatafromStorage()
    const hideDialog = () => setsubmitdialogVisible(false)
    return (
        <View style={styles.container}>
            <Loader loading={loading} message={loaderMessage} />
            <Signupheader2 heading={'Documents'} onPress2={() => navigation.navigate('Confirmation', { ...idProof, ...addressProof, ...paymentProof })} onPress={() => {
                navigation.goBack()
                saveproofs({ idProof, addressProof, paymentProof, idProofname, addressProofname, paymentProofname, value, value2, value3 })
            }} />
            <ScrollView >
                <View style={{ padding: 12 }}>
                    <View >
                        <Text allowFontScaling={false} style={{ fontWeight: '600', color: 'black' }}>
                            1. Proof of Identity </Text>
                        <View style={{ width: '90%', alignSelf: 'center', marginVertical: 10 }}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={Identitydata}
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select Type' : '...'}
                                searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue(item.value);
                                    setIsFocus(false);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, justifyContent: 'space-between' }}>
                            <View style={{ textAlign: 'justify', width: width * .6, left: 5 }}>
                                {idProofname !== '' && <Text allowFontScaling={false}>{idProofname}</Text>}
                            </View>
                            <TouchableOpacity 
                                onPress={() => docPicker('identity')}
                                style={{ width: width * .23, right: 10, backgroundColor: colors.headerBlue, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                                <Text allowFontScaling={false}
                                    style={{
                                        fontSize: 10,
                                        fontWeight: '600',
                                        color: 'white',
                                        marginVertical: 10
                                    }}>
                                    Choose
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text allowFontScaling={false} style={{ fontWeight: '600', color: 'black' }}>
                            2. Proof of address</Text>
                        <View style={{ width: '90%', alignSelf: 'center', marginVertical: 10 }}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={addressdata}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select Type' : '...'}
                                searchPlaceholder="Search..."
                                value={value2}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue2(item.value);
                                    setIsFocus(false);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, justifyContent: 'space-between' }}>
                            <View style={{ textAlign: 'justify', width: width * .6, left: 5 }}>
                                {addressProofname !== '' && <Text allowFontScaling={false}>{addressProofname}</Text>}
                            </View>
                            <TouchableOpacity
                                onPress={() => docPicker('address')}
                                style={{ width: width * .23, right: 10, backgroundColor: colors.headerBlue, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                                <Text allowFontScaling={false}
                                    style={{
                                        fontSize: 10,
                                        fontWeight: '600',
                                        color: 'white',
                                        marginVertical: 10
                                    }}>
                                    Choose
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text allowFontScaling={false} style={{ fontWeight: '600', color: 'black' }}>
                            3. Membership Fee Payment Proof. </Text>
                        <View style={{ width: '90%', alignSelf: 'center', marginVertical: 10 }}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={paymentdata}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select Type' : '...'}
                                searchPlaceholder="Search..."
                                value={value3}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue3(item.value);
                                    setIsFocus(false);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, justifyContent: 'space-between' }}>
                            <View style={{ textAlign: 'justify', width: width * .6, left: 5 }}>
                                {paymentProofname !== '' && <Text allowFontScaling={false}>{paymentProofname}</Text>}
                            </View>
                            <TouchableOpacity
                                onPress={() => docPicker('payment')}
                                style={{ width: width * .23, right: 10, backgroundColor: colors.headerBlue, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                                <Text allowFontScaling={false}
                                    style={{
                                        fontSize: 10,
                                        fontWeight: '600',
                                        color: 'white',
                                        marginVertical: 10
                                    }}>
                                    Choose
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() =>
                            //  getDatafromStorage()}
                            (paymentProof.paymentProof && addressProof.addressProof && idProof.idProof !== '') ? navigation.navigate('Confirmation', { ...idProof, ...addressProof, ...paymentProof }) : Toast.show('Please upload all documents')}
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
                                Next
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* <LogoutComponent
                visible={submitdialogVisible}
                heading={'Confirm Submission'}
                button2={'Submit'}
                body={'Are you sure want to submit the Application ?'}
                onPress={() => hideDialog()}
                onPress2={() => ()}
            /> */}
            {/* <Dialog style={{ height: height / 3 }} visible={submitdialogVisible}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['gray', 'white']}
                    style={{ height: height / 3, padding: 25, justifyContent: 'space-between' }}
                >
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: '600' }}>Confirm Submission</Text>
                    <View>
                        <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>Are you sure want to submit the Application ?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button uppercase={false} onPress={() => hideDialog()}
                            mode='contained' contentStyle={{ backgroundColor: colors.headerBlue }}>
                            Cancel
                        </Button>
                        <Button uppercase={false} onPress={() => ((paymentProof.paymentProof && addressProof.addressProof && idProof.idProof !== '') ? getDatafromStorage() : Toast.show('Please upload all documents'), hideDialog())}
                            mode='contained' contentStyle={{ backgroundColor: colors.headerBlue }}>
                            Submit
                        </Button>
                    </View>
                </LinearGradient>
            </Dialog> */}
        </View>
    );
}

export default DocumentUploadScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.snow,
    },
    dropdown: {
        height: 43,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 12,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    }, image: {
        height: 120,
        width: 120,
        backgroundColor: 'red'
    },
});


// {"aadharNumber": "", "addressProof": "", "caste": "", "commAddressCity": "Port Blair*", "commAddressLine_1": "asdfasfd", "commAddressLine_2": "343232", "commAddressPincode": "816122", "commAddressState": "Andaman and Nicobar Islands", "contactNo": "9875643524", "dob": "17/03/2022", "email": "", "familySize": null, "firstName": "Rty", "gender": "Female", "idProof": "", "incomeRange": "5-7LPA", "jobDescription": "asf", "landMark": "sdf", "lastName": "asdfasdfasf", "middleName": "asdfasdfasdf", "nomineeName": "", "nomineeRelation": "", "occupationType": "Professtional", "orgAddressLine_1": "asdf", "orgAddressLine_2": "asdf", "organizationName": "34", "orgcity": "Amalapuram", "orgstate": "Andhra Pradesh", "panNumber": "", "paymentProof": "", "permanentAddressCity": "", "permanentAddressLine_1": "", "permanentAddressLine_2": "", "permanentAddressPincode": "", "permanentAddressState": "", "pincode": "123456", "religion": ""}