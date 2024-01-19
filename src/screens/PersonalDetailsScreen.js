import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet, TextInput,
    TouchableOpacity, ScrollView, Platform, Pressable, BackHandler,
} from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik'
import SignupHeader from '../components/SignupHeader'
import Signupheader2 from '../components/Signupheader2'
import colors from '../assets/colors/colors';
import moment from 'moment';
import { RadioButton, Checkbox } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { statesData } from '../components/States'
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { getMobileNo } from '../redux/actions/portfolio.actions';
import axios from 'axios';
import { BASE_URL } from '../../constants';
const familySizedata = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
]

function PersonalDetailsScreen({ navigation }) {
    const dispatch = useDispatch()
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //     navigation.goBack()
    //     return true
    // }, []);
    const [religion, setreligion] = useState(null);
    const [email, setemail] = useState(null);
    const [checked, setChecked] = useState(false);
    const [caste, setcaste] = useState(null);
    const [panNumber, setpanNumber] = useState(null);
    const [aadharNumber, setaadharNumber] = useState(null);
    const [commAddressLine_2, setcommAddressLine_2] = useState(null);
    // .matches(/^(([A-Z]){5}([0-9]){4}([A-Z]){1})+$/, "Please enter valid pan"),
    const ValidationSchema = yup.object().shape({
        contactNo: yup.string().min(10, 'Mobile number must be 10 digits').max(10, 'Mobile number must be 10 digits').
            required(' Mobile number must required'),
        firstName: yup.string().required('FirstName must required').
            matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        middleName: yup.string().required('MiddleName must required').
            matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        lastName: yup.string().required('LastName must required').
            matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        // email: yup.string().email('Please enter valid email').required('Email must required'),
        commAddressLine_1: yup.string().required('Communication address must required'),
        // commAddressLine_2: yup.string().required('Communication 2 must required'),
        commAddressState: yup.string().required('State must required'),
        gender: yup.string().required('Gender must required'),
        dob: yup.string().required('DOB must required'),
        nomineeName: yup.string().required('Nominee Full Name must required'),
        nomineeRelation: yup.string().required('Relation with Nominee must required'),
        commAddressCity: yup.string().required('City must required'),
        commAddressPincode: yup.string().min(6, ({ min }) => `Pincode must be ${min} digits`).
            max(6, 'Pincode must be 6 digits').
            required('Pincode must required'),
    });
    const [isFocus, setIsFocus] = useState(false);
    const [isFocus2, setIsFocus2] = useState(false);
    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus4, setIsFocus4] = useState(false);
    const [contactCheckerror, setcontactCheckerror] = useState(null);
    const [statesArray, setstatesArray] = useState();
    const [cityArray, setcityArray] = useState();
    const [permanentAddressLine_1, setpermanentAddressLine_1] = useState(null);
    const [permanentAddressLine_2, setpermanentAddressLine_2] = useState(null);
    const [permanentAddressCity, setpermanentAddressCity] = useState(null);
    const [permanentAddressState, setpermanentAddressState] = useState(null);
    const [permanentAddressPincode, setpermanentAddressPincode] = useState(null);
    const [familySize, setfamilySize] = useState(null)
    const [value, setValue] = useState(null);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [value2, setValue2] = useState(null);
    const [taluka, settaluka] = useState(null);
    const [village, setvillage] = useState(null);
    const [talukafull, settalukafull] = useState(null);
    const [pertaluka, setpertaluka] = useState(null);
    const [permanentVillage, setpermanentVillage] = useState(null);
    const [pertalukafull, setpertalukafull] = useState(null);
    const [perfiletertaluka, setperfiletertaluka] = useState([]);
    const [filetertaluka, setfiletertaluka] = useState([]);
    const [filterStates, setfilterStates] = useState([]);
    const [filterCity, setfilterCity] = useState([]);
    const [permanentfilterStates, setpermanentfilterStates] = useState([]);
    const [permanentfilterCity, setpermanentfilterCity] = useState([]);
    const [permanentStatesName, setPermanentStatesName] = useState(null);
    const [permanentCityName, setPermanentCityName] = useState(null);
    const [phoneNos, setphoneNos] = useState([]);
    const findNo = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/member/getMembers/allPhoneNumbers`)
            setphoneNos(data)
        } catch (error) {

        }
    }
    useEffect(() => {
        findNo()
        let data = Object.keys(statesData)
        data = data.map(item => ({
            value: item, label: item
        }))
        setstatesArray(data)
        setfilterStates(data)
        setpermanentfilterStates(data)
    }, [])
    useEffect(() => {
        if (value2) {
            let cdata = (statesData[value2])
            cdata = cdata?.map(item => ({
                value: item.name ? item.name : item, label: item.name ? item.name : item
            }))
            setcityArray([...cdata, { value: 'others', label: "others" }])
            setfilterCity([...cdata, { value: 'others', label: "others" }])
            try {
                console.log({ value2, value })
                const totalMahar = statesData.Maharashtra
                console.log(totalMahar[1].name, 's')
                const fill = totalMahar.filter(ite => ite.name == value)[0].tahasil.map(item => ({
                    label: item, value: item
                }))
                settalukafull(fill)
                setfiletertaluka(fill)
            } catch (error) {
                console.log(error, 'err')
            }
        }

    }, [value2, value])
    useEffect(() => {
        if (permanentStatesName) {
            let cdata = (statesData[permanentStatesName])
            cdata = cdata?.map(item => ({
                value: item.name ? item.name : item, label: item.name ? item.name : item
            }))
            setpermanentfilterCity([...cdata, { value: 'others', label: "others" }])
            try {
                const totalMahar = statesData.Maharashtra
                const fill = totalMahar.filter(ite => ite.name == permanentCityName)[0].tahasil.map(item => ({
                    label: item, value: item
                }))
                setpertalukafull(fill)
                setperfiletertaluka(fill)
            } catch (error) {
                console.log(error, 'err')
            }
        }
    }, [permanentStatesName, permanentCityName])
    const saveInStorage = async (data) => {
        console.log(data)
        await AsyncStorage.setItem('personal', JSON.stringify(data))
    }

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        setDate(selectedDate);
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };
    const formikRef = useRef()
    const [panError, setpanError] = useState(null);
    const [aadharError, setaadharError] = useState(null);
    function validatePAN(Pan) {
        // console.log(Pan.replace(/[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''))
        var PAN_Card_No = Pan.toUpperCase();
        var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
        if (PAN_Card_No.length !== 10) {
            if (PAN_Card_No.length == 0) {
                setpanError(null)
            } else {
                setpanError("Enter Valid Pan number")
                setpanNumber(PAN_Card_No)
            }
        } else {
            if (PAN_Card_No.match(regex)) {
                setpanNumber(PAN_Card_No)
                setpanError(null)
            } else {
                setpanError("Enter Valid Pan number")
                setpanNumber(PAN_Card_No)
            }
        }

    };
    //   console.log({ panNumber })
    return (
        <View style={styles.container}>
            <Signupheader2 heading={'Personal Details'} onPress={() => navigation.goBack()}
                // onPress2={() => navigation.navigate("OccupationDetailsScreen")}
                onPress2={() => {
                    formikRef.current.isValid ? !aadharError && !panError ?
                        navigation.navigate("OccupationDetailsScreen") : Toast.show('All fields are required') : Toast.show('All fields are required')
                }}
            />
            <Formik
                // initialValues={{
                //     firstName: 'Ranu', middleName: 'Ranu',
                //     lastName: 'Ranu', gender: 'male', commAddressLine_1: 'Nilesh',
                //     commAddressLine_2: 'Nilesh', commAddressPincode: '816190', commAddressCity: '',
                //     contactNo: '8975424028', commAddressState: '', dob: '06/04/2022'
                // }}
                initialValues={{
                    firstName: '', middleName: '',
                    lastName: '', gender: '', commAddressLine_1: '',
                    commAddressPincode: '', commAddressCity: '',
                    contactNo: '', commAddressState: '', dob: '', nomineeName: '', nomineeRelation: ''
                }}
                onSubmit={(values) => saveInStorage({
                    ...values, religion, caste, aadharNumber, panNumber, email,  village,
                    familySize, permanentAddressCity, permanentAddressState, commAddressLine_2, taluka, permanentVillage,
                    permanentAddressLine_1, permanentAddressLine_2, permanentAddressPincode, pertaluka
                })
                }
                validateOnMount={true}
                validationSchema={ValidationSchema}
                innerRef={formikRef}
            >
                {({ handleChange, handleSubmit, touched, errors, values, isValid, setFieldValue }) => (
                    <>
                        <ScrollView>
                            {/* {console.log(values)} */}
                            <View style={{ padding: 12 }}>
                                <View>
                                    <View>
                                        {show && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={date}
                                                mode={mode}
                                                maximumDate={new Date()}
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChange}
                                            />
                                        )}
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ width: '45%' }}>
                                            <TextInput
                                                style={{ ...styles.smallF, width: '100%', }}
                                                placeholder="First Name"
                                                onChangeText={handleChange('firstName')}
                                                value={values.firstName} />
                                            {(errors.firstName && touched.firstName) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.firstName}</Text>
                                                </View>}
                                        </View>
                                        <View style={{ width: '45%' }}>
                                            <TextInput style={{ ...styles.smallF, width: '100%', }}
                                                value={values.middleName}
                                                onChangeText={handleChange('middleName')}
                                                placeholder="Middle Name" />
                                            {(errors.middleName && touched.middleName) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.middleName}</Text>
                                                </View>}
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ width: '45%' }}>
                                            <TextInput
                                                style={{ ...styles.smallF, width: '100%', }}
                                                placeholder="Last Name"
                                                value={values.lastName}
                                                onChangeText={handleChange('lastName')}
                                            />
                                            {(errors.lastName && touched.lastName) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.lastName}</Text>
                                                </View>}
                                        </View>
                                        <View style={{ width: '45%' }}>
                                            <View style={{ ...styles.smallF, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 10, bottom: .8, marginLeft: 18 }}>+91</Text>
                                                <TextInput
                                                    style={{ width: '100%', fontSize: 10 }}
                                                    placeholder="Mobile Number"
                                                    value={values.contactNo}
                                                    keyboardType='numeric'
                                                    maxLength={10}
                                                    onChangeText={(t) => {
                                                        setFieldValue('contactNo', t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                                        const d = phoneNos.filter(ite => ite == t)
                                                        if (d.length !== 0) {
                                                            setcontactCheckerror("Mobile no is already exist")
                                                        } else {
                                                            setcontactCheckerror(null)
                                                        }

                                                    }}
                                                />
                                            </View>
                                            {(errors.contactNo && touched.contactNo) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.contactNo}</Text>
                                                </View>}
                                            {
                                                contactCheckerror &&
                                                <Text style={styles.errors}>{contactCheckerror}</Text>}
                                        </View>
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <TextInput
                                            style={{ ...styles.bigF, width: '100%', }}
                                            placeholder="Email"
                                            value={email}
                                            keyboardType='email-address'
                                            onChangeText={t => setemail(t)}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '35%' }}>
                                            <Text style={{ left: 10, fontSize: 10 }}>Date of Birth</Text>
                                            <Pressable onPress={() => (showDatepicker(), setFieldValue('dob', moment(date).format("DD/MM/YYYY")))} >
                                                <View style={{
                                                    ...styles.smallF,
                                                    width: '100%', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Text style={{ fontSize: 10 }}>{moment(date).format("DD/MM/YYYY")}</Text>
                                                </View>
                                            </Pressable>
                                            {(errors.dob && touched.dob) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.dob}</Text>
                                                </View>}
                                        </View>
                                        <View style={{ width: '50%', marginVertical: 5 }}>
                                            <Text style={{ left: 10, fontSize: 10 }}>Gender</Text>
                                            <RadioButton.Group onValueChange={newValue => setFieldValue('gender', newValue)} value={values.gender}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <RadioButton uncheckedColor='gray' value="Male" />
                                                        <Text style={{ fontSize: 10 }}>Male</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <RadioButton uncheckedColor='gray' value="Female" />
                                                        <Text style={{ fontSize: 10 }}>Female</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <RadioButton uncheckedColor='gray' value="Other" />
                                                        <Text style={{ fontSize: 10 }}>Other</Text>
                                                    </View>
                                                </View>
                                            </RadioButton.Group>
                                            {(errors.gender && touched.gender) &&
                                                <View >
                                                    <Text style={{ ...styles.errors, left: 20 }}>{errors.gender}</Text>
                                                </View>}
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ width: '45%' }}>
                                            <TextInput
                                                value={religion}
                                                style={{ ...styles.smallF, width: '100%', }}
                                                placeholder="Religion"
                                                onChangeText={t => setreligion(t)}
                                            // onChangeText={t => {
                                            //     const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
                                            //     const char = t.toLowerCase()
                                            //     const lastChar = t.replace(religion, '')
                                            //     // const lastChar = char.slice(char.length-1)
                                            //     console.log({
                                            //         lastChar,
                                            //         includes: arr.includes(lastChar),
                                            //         charlen: char.length,
                                            //         lastlen: lastChar.length
                                            //     })
                                            //     if (arr.includes(lastChar) && (lastChar.length === 1 || lastChar.length === 0)) {
                                            //         setreligion(t)
                                            //     }
                                            // }}
                                            />
                                        </View>
                                        <View style={{ width: '45%' }}>
                                            <TextInput
                                                style={{ ...styles.smallF, width: '100%', }}
                                                placeholder="Caste"
                                                onChangeText={t => setcaste(t)}
                                                value={caste}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <TextInput
                                            style={{ ...styles.bigF, width: '100%', }}
                                            placeholder="Flat/HouseNo/Building/Apartmemt"
                                            value={values.commAddressLine_1}
                                            onChangeText={(t) => {
                                                setpermanentAddressLine_1(t)
                                                setFieldValue('commAddressLine_1', t)
                                            }
                                            }
                                        />
                                        {(errors.commAddressLine_1 && touched.commAddressLine_1) &&
                                            <View >
                                                <Text style={styles.errors}>{errors.commAddressLine_1}</Text>
                                            </View>}
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <TextInput
                                            style={{ ...styles.bigF, width: '100%', }}
                                            placeholder="Area/Colony"
                                            value={commAddressLine_2}
                                            onChangeText={(t) => setcommAddressLine_2(t)}
                                        />
                                    </View>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: 'space-between',
                                        marginVertical: 5, alignItems: 'center'
                                    }}>
                                        {console.log(value, 'city')}
                                        <View style={{ width: '45%' }}>
                                            <Dropdown
                                                style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={filterStates}
                                                search
                                                searchQuery={(t) => {
                                                    const fdata = statesArray.filter(item => {
                                                        const value = item.label.toLowerCase()
                                                        if (value.slice(0, t.length) === t.toLowerCase()) return true
                                                        return false
                                                    })
                                                    if (fdata && fdata.length !== 0) {
                                                        setfilterStates(fdata)
                                                    } else {
                                                        setfilterStates(statesArray)
                                                    }
                                                    // setfilterStates(statesArray)
                                                }}
                                                maxHeight={300}
                                                labelField="label"
                                                valueField="value"
                                                placeholder={!isFocus2 ? 'Select State' : '...'}
                                                searchPlaceholder="Search..."
                                                value={value2}
                                                onFocus={() => setIsFocus2(true)}
                                                onBlur={() => {
                                                    setIsFocus2(false)
                                                    setfilterStates(statesArray)
                                                }}
                                                onChange={item => {
                                                    setValue2(item.value);
                                                    setIsFocus2(false);
                                                    setFieldValue('commAddressState', item.value)
                                                    setfilterStates(statesArray)
                                                    setpermanentAddressState(item.value)
                                                    setvillage('')
                                                    setValue('')
                                                    settaluka('')
                                                }}
                                            />
                                            {(errors.commAddressState && touched.commAddressState) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.commAddressState}</Text>
                                                </View>}
                                        </View>
                                        {
                                            value2 == "Maharashtra" ?

                                                <View style={{ width: '45%' }}>
                                                    <Dropdown
                                                        style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        inputSearchStyle={styles.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
                                                        data={filterCity}
                                                        search
                                                        searchQuery={t => {
                                                            const fc = cityArray.filter(item => {
                                                                const cd = item.label.toLowerCase()
                                                                if (cd.slice(0, t.length) === t.toLowerCase()) return true
                                                                return false
                                                            })
                                                            if (fc && fc.length !== 0) {
                                                                setfilterCity(fc)
                                                            } else {
                                                                setfilterCity(cityArray)
                                                            }
                                                        }}
                                                        maxHeight={300}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder={!isFocus ? 'Select Distict' : '...'}
                                                        searchPlaceholder="Search..."
                                                        value={value}
                                                        onFocus={() => setIsFocus(true)}
                                                        onBlur={() => {
                                                            setIsFocus(false)
                                                            setfilterCity(cityArray)
                                                        }}
                                                        onChange={item => {
                                                            setValue(item.value);
                                                            setIsFocus(false);
                                                            setFieldValue('commAddressCity', item.value)
                                                            setfilterCity(cityArray)
                                                            setpermanentAddressCity(item.value)
                                                        }}
                                                    />
                                                    {(errors.commAddressCity && touched.commAddressCity) &&
                                                        <View >
                                                            <Text style={styles.errors}>{errors.commAddressCity}</Text>
                                                        </View>}
                                                </View>
                                                :
                                                <View style={{ width: '45%' }}>
                                                    <TextInput
                                                        style={{ ...styles.smallF, width: '100%', }}
                                                        placeholder="Village / City"
                                                        onChangeText={t => {
                                                            setFieldValue('commAddressCity', t)
                                                            setpermanentVillage(t)
                                                            setvillage(t)
                                                        }}
                                                        value={village}
                                                    />
                                                </View>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {
                                            value2 == "Maharashtra" && value !== "Mumbai City" &&
                                            <View style={{ width: '45%' }}>
                                                <Dropdown
                                                    style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={styles.selectedTextStyle}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    data={filetertaluka}
                                                    search
                                                    searchQuery={t => {
                                                        const fc = talukafull.filter(item => {
                                                            const cd = item.label.toLowerCase()
                                                            if (cd.slice(0, t.length) === t.toLowerCase()) return true
                                                            return false
                                                        })
                                                        if (fc.length == 0) {
                                                            setfiletertaluka(talukafull)
                                                        } else {
                                                            setfiletertaluka(fc)
                                                        }
                                                    }}
                                                    maxHeight={300}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder={!isFocus3 ? 'Select Taluka' : '...'}
                                                    searchPlaceholder="Search..."
                                                    value={taluka}
                                                    onFocus={() => setIsFocus3(true)}
                                                    onBlur={() => {
                                                        setIsFocus3(false)
                                                        setfiletertaluka(talukafull)
                                                    }}
                                                    onChange={item => {
                                                        settaluka(item.value)
                                                        setIsFocus3(false);
                                                        setfiletertaluka(talukafull)
                                                        setpertaluka(item.value)
                                                    }}
                                                />
                                            </View>
                                        }
                                        {
                                            value2 == "Maharashtra" ?
                                                <View style={{ width: value == "Mumbai City" ? '100%' : '45%' }}>
                                                    <TextInput
                                                        style={{ ...styles.smallF, width: '100%', }}
                                                        placeholder="Village / City"
                                                        onChangeText={t => {
                                                            setvillage(t)
                                                            setpermanentVillage(t)
                                                        }}
                                                        value={village}
                                                    />
                                                </View>
                                                :
                                                value2 == "Maharashtra" &&
                                                <View style={{ width: '45%' }}>
                                                    <TextInput
                                                        style={{ ...styles.smallF, width: '100%', }}
                                                        placeholder="Pincodes"
                                                        maxLength={6}
                                                        keyboardType='numeric'
                                                        value={values.commAddressPincode}
                                                        onChangeText={(t) => {
                                                            setpermanentAddressPincode(t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                                            setFieldValue('commAddressPincode', t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                                        }}
                                                    />
                                                    {(errors.commAddressPincode && touched.commAddressPincode) &&
                                                        <View >
                                                            <Text style={styles.errors}>{errors.commAddressPincode}</Text>
                                                        </View>}
                                                </View>
                                        }
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <TextInput
                                            style={{ ...styles.smallF, width: '100%', }}
                                            placeholder="Pincode"
                                            maxLength={6}
                                            keyboardType='numeric'
                                            value={values.commAddressPincode}
                                            onChangeText={(t) => {
                                                setpermanentAddressPincode(t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                                setFieldValue('commAddressPincode', t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                            }}
                                        />
                                        {(errors.commAddressPincode && touched.commAddressPincode) &&
                                            <View >
                                                <Text style={styles.errors}>{errors.commAddressPincode}</Text>
                                            </View>}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View>
                                            <Checkbox uncheckedColor='gray'
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    setChecked(!checked),
                                                        setpermanentAddressCity(!checked ? "" : values.commAddressCity),
                                                        setpermanentAddressPincode(!checked ? "" : values.commAddressPincode),
                                                        setpermanentAddressState(!checked ? "" : values.commAddressState),
                                                        setpermanentAddressLine_1(!checked ? "" : values.commAddressLine_1),
                                                        setpertaluka(!checked ? "" : taluka),
                                                        setpermanentVillage(!checked ? "" : village)
                                                    setpermanentAddressLine_2(!checked ? "" : commAddressLine_2)
                                                }
                                                }
                                            />
                                        </View>
                                        <View style={{ textAlign: 'justify', flexGrow: 1 }}>
                                            <Text style={{
                                                maxWidth: '100%',
                                                fontSize: 11
                                            }}>Check if your permanent address is different.</Text>
                                        </View>
                                    </View>
                                    {
                                        checked &&
                                        <View>
                                            <View style={{ width: '100%' }}>
                                                <TextInput
                                                    style={{ ...styles.bigF, width: '100%', }}
                                                    placeholder="  Flat/HouseNo/Building/Apartmemt"
                                                    value={permanentAddressLine_1}
                                                    onChangeText={text => setpermanentAddressLine_1(text)}
                                                />
                                            </View>
                                            <View style={{ width: '100%' }}>
                                                <TextInput
                                                    style={{ ...styles.bigF, width: '100%', }}
                                                    placeholder="Area/Colony"
                                                    value={permanentAddressLine_2}
                                                    onChangeText={text => setpermanentAddressLine_2(text)}
                                                />
                                            </View>
                                            <View style={{
                                                flexDirection: 'row', justifyContent: 'space-between',
                                                marginVertical: 5, alignItems: 'center'
                                            }}>
                                                <View style={{ width: '45%' }}>
                                                    <Dropdown
                                                        style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        inputSearchStyle={styles.inputSearchStyle}
                                                        iconStyle={styles.iconStyle}
                                                        data={permanentfilterStates}
                                                        search
                                                        searchQuery={(t) => {
                                                            const fdata = statesArray.filter(item => {
                                                                const value = item.label.toLowerCase()
                                                                if (value.slice(0, t.length) === t.toLowerCase()) return true
                                                                return false
                                                            })
                                                            if (fdata && fdata.length !== 0) {
                                                                setpermanentfilterStates(fdata)
                                                            } else {
                                                                setpermanentfilterStates(statesArray)
                                                            }
                                                        }}
                                                        maxHeight={300}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder={!isFocus2 ? 'Select State' : '...'}
                                                        searchPlaceholder="Search..."
                                                        value={permanentStatesName}
                                                        onFocus={() => setIsFocus2(true)}
                                                        onBlur={() => setIsFocus2(false)}
                                                        onChange={item => {
                                                            setPermanentStatesName(item.value);
                                                            setIsFocus2(false);
                                                            setpermanentfilterStates(statesArray)
                                                            setpermanentAddressState(item.value)
                                                            setpermanentVillage('')
                                                            setPermanentCityName('');
                                                            setpertaluka('')
                                                        }}
                                                    />
                                                </View>
                                                <View style={{ width: '45%' }}>
                                                    {
                                                        permanentStatesName == "Maharashtra" ?
                                                            <Dropdown
                                                                style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                                                placeholderStyle={styles.placeholderStyle}
                                                                selectedTextStyle={styles.selectedTextStyle}
                                                                inputSearchStyle={styles.inputSearchStyle}
                                                                iconStyle={styles.iconStyle}
                                                                data={permanentfilterCity}
                                                                search
                                                                searchQuery={t => {
                                                                    const fc = cityArray.filter(item => {
                                                                        const cd = item.label.toLowerCase()
                                                                        if (cd.slice(0, fc.length) === t.toLowerCase()) return true
                                                                        return false
                                                                    })
                                                                    if (fc && fc.length !== 0) {
                                                                        setpermanentfilterCity(fc)
                                                                    } else {
                                                                        setpermanentfilterCity(cityArray)
                                                                    }
                                                                }}
                                                                maxHeight={300}
                                                                labelField="label"
                                                                valueField="value"
                                                                placeholder={!isFocus ? 'Select City' : '...'}
                                                                searchPlaceholder="Search..."
                                                                value={permanentCityName}
                                                                onFocus={() => setIsFocus(true)}
                                                                onBlur={() => {
                                                                    setIsFocus(false)
                                                                    setpermanentfilterCity(cityArray)
                                                                }}
                                                                onChange={item => {
                                                                    setPermanentCityName(item.value);
                                                                    setIsFocus(false);
                                                                    setpermanentfilterCity(cityArray)
                                                                    setpermanentAddressCity(item.value)
                                                                }}
                                                            />
                                                            :
                                                            <TextInput
                                                                style={{ ...styles.smallF, width: '100%', }}
                                                                placeholder="Village / City"
                                                                value={permanentVillage}
                                                                onChangeText={text => setpermanentVillage(text)}
                                                            />
                                                    }
                                                </View>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row', justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                {
                                                    permanentStatesName == "Maharashtra" && permanentCityName !== "Mumbai City" &&
                                                    <View style={{ width: '45%' }}>
                                                        <Dropdown
                                                            style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                                            placeholderStyle={styles.placeholderStyle}
                                                            selectedTextStyle={styles.selectedTextStyle}
                                                            inputSearchStyle={styles.inputSearchStyle}
                                                            iconStyle={styles.iconStyle}
                                                            data={perfiletertaluka}
                                                            search
                                                            searchQuery={t => {
                                                                const fc = pertalukafull.filter(item => {
                                                                    const cd = item.label.toLowerCase()
                                                                    if (cd.slice(0, t.length) === t.toLowerCase()) return true
                                                                    return false
                                                                })
                                                                if (fc.length == 0) {
                                                                    setperfiletertaluka(pertalukafull)
                                                                } else {
                                                                    setperfiletertaluka(fc)
                                                                }

                                                            }}
                                                            maxHeight={300}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder={!isFocus4 ? 'Select Taluka' : '...'}
                                                            searchPlaceholder="Search..."
                                                            value={pertaluka}
                                                            onFocus={() => setIsFocus4(true)}
                                                            onBlur={() => {
                                                                setIsFocus4(false)
                                                                setperfiletertaluka(pertalukafull)
                                                            }}
                                                            onChange={item => {
                                                                setpertaluka(item.value)
                                                                setIsFocus4(false);
                                                                setperfiletertaluka(pertalukafull)
                                                            }}
                                                        />
                                                    </View>
                                                }
                                                <View style={{ width: permanentCityName == "Mumbai City" ? '100%' : '45%' }}>
                                                    {
                                                        permanentStatesName !== "Maharashtra" ?
                                                            <></>
                                                            :
                                                            <TextInput
                                                                style={{ ...styles.smallF, width: '100%', }}
                                                                placeholder="Village /City"
                                                                value={permanentVillage}
                                                                onChangeText={text => setpermanentVillage(text)}
                                                            />
                                                    }
                                                </View>
                                            </View>
                                            <View style={{ width: '100%' }}>
                                                <TextInput
                                                    style={{ ...styles.smallF, width: '100%', }}
                                                    placeholder="Pincode"
                                                    maxLength={6}
                                                    keyboardType='numeric'
                                                    value={permanentAddressPincode}
                                                    onChangeText={text => setpermanentAddressPincode(text)}
                                                />
                                            </View>
                                        </View>
                                    }

                                    <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                        <View style={{ width: '45%', paddingBottom: 6 }}>
                                            <TextInput
                                                style={{ ...styles.bigF, width: '100%', }}
                                                placeholder="Aadhar Number"
                                                keyboardType='numeric'
                                                maxLength={12}
                                                value={aadharNumber}
                                                onChangeText={(t) => {
                                                    if (t.length == 0) {
                                                        setaadharError(null)
                                                        setaadharNumber(t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                                    } else if (t.length < 12) {
                                                        setaadharNumber(t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                                        setaadharError('Enter valid Aadhar number')
                                                    } else {
                                                        setaadharNumber(t.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>]/gi, ''))
                                                        setaadharError(null)
                                                    }
                                                }}
                                            />
                                            {aadharError &&
                                                <View>
                                                    <Text style={styles.errors}>{aadharError}</Text>
                                                </View>}
                                        </View>
                                        <View style={{ width: '45%' }}>
                                            <TextInput
                                                style={{ ...styles.smallF, width: '100%' }}
                                                placeholder="Pan Number"
                                                maxLength={10}
                                                onChangeText={(t) => validatePAN(t.trim())}
                                            />
                                            {panError &&
                                                <View>
                                                    <Text style={styles.errors}>{panError}</Text>
                                                </View>}
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ width: '45%' }}>
                                            <TextInput
                                                style={{ ...styles.smallF, width: '100%', }}
                                                placeholder="Nominee Full Name"
                                                value={values.nomineeName}
                                                onChangeText={handleChange('nomineeName')}
                                            />
                                            {(errors.nomineeName && touched.nomineeName) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.nomineeName}</Text>
                                                </View>}
                                        </View>
                                        <View style={{ width: '45%', paddingBottom: 20 }}>
                                            <TextInput
                                                style={{ ...styles.smallF, width: '100%', }}
                                                placeholder="Relation with Nominee"
                                                value={values.nomineeRelation}
                                                onChangeText={handleChange('nomineeRelation')}
                                            />
                                            {(errors.nomineeRelation && touched.nomineeRelation) &&
                                                <View >
                                                    <Text style={styles.errors}>{errors.nomineeRelation}</Text>
                                                </View>}
                                        </View>
                                    </View>
                                    <View style={{ width: '45%' }}>
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={familySizedata}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus2 ? 'Family Size' : '...'}
                                            value={familySize}
                                            onFocus={() => setIsFocus2(true)}
                                            onBlur={() => setIsFocus2(false)}
                                            onChange={item => {
                                                setfamilySize(item.value);
                                                setIsFocus2(false);
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginVertical: 20 }} >
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleSubmit(), isValid ?
                                                !aadharError && !panError ? navigation.navigate("OccupationDetailsScreen")
                                                    : Toast.show("Please check errors") : Toast.show("Please check errors")
                                        }}
                                        style={{
                                            alignSelf: 'center', backgroundColor: colors.headerBlue,
                                            borderRadius: 10, width: '55%'
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
                            </View>
                        </ScrollView>
                    </>
                )}
            </Formik>
        </View>
    );
}

export default PersonalDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.snow,
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
        fontSize: 11,
        fontWeight: '600',
        fontFamily: 'Quicksand',
    },
    title: {
        textAlign: 'center',
        fontSize: 2,
        fontWeight: 'bold',
        padding: 20,
    },
    datePickerStyle: {
        width: 200,
        marginTop: 20,
    },
    userNameInput: {
        width: '100%',
        color: colors.darkGray,
        padding: 10,
        fontFamily: 'Quicksand',
    }, smallF: {
        height: 43, width: "45%",
        borderColor: 'gray',
        borderWidth: 1, borderRadius: 11,
        fontSize: 10, marginVertical: 6, paddingHorizontal: 4
    }, bigF: {
        height: 43, borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 11,
        fontSize: 10, marginVertical: 6,
        paddingHorizontal: 4
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
    errors: {
        color: 'red', fontSize: 10
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 10,
    },
    placeholderStyle: {
        fontSize: 10,
    },
    selectedTextStyle: {
        fontSize: 10,
        color: 'black'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 10
    },
});
