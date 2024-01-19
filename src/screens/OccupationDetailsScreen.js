import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity, ScrollView, TextInput
} from 'react-native';
import * as yup from 'yup';
import { Formik, useFormik } from 'formik'
import colors from '../assets/colors/colors';
import Loader from '../components/loader';
import { RadioButton, } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { statesData } from '../components/States'
import { Dropdown } from 'react-native-element-dropdown';
import SignupHeader from '../components/SignupHeader';
import Signupheader2 from '../components/Signupheader2';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
const occupationdata = [
    { label: 'Professional', value: 'Professional' },
    { label: 'Unemployed', value: 'Unemployed' },
    { label: 'Salaried', value: 'Salaried' },
    { label: 'Business Person', value: 'BusinessPerson' },
]
function OccupationDetailsScreen({ navigation }) {

    const [value, setValue] = useState(null);
    const [value2, setValue2] = useState(null);
    const [occupationTypevalue, setoccupationTypevalue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');
    const [filterStates, setfilterStates] = useState([]);
    const [filterCity, setfilterCity] = useState([]);
    const [incomeRange, setincomeRange] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [orgtaluka, setorgtaluka] = useState(null);
    const [talukafull, settalukafull] = useState(null);
    const [filetertaluka, setfiletertaluka] = useState([]);
    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus2, setIsFocus2] = useState(false);
    const [organizationName, setorganizationName] = useState(null);
    const [orgAddressLine_1, setorgAddressLine_1] = useState(null);
    const [orgAddressLine_2, setorgAddressLine_2] = useState(null);
    const [orgCity, setorgCity] = useState(null);
    const [orgVillage, setorgVillage] = useState(null);
    const [orgState, setorgState] = useState(null);
    const [landMark, setlandMark] = useState(null);
    const [jobDescription, setjobDescription] = useState(null);
    const [orgPincode, setorgPincode] = useState(null);
    const [statesArray, setstatesArray] = useState();
    const [cityArray, setcityArray] = useState();
    const array = { orgVillage, orgtaluka, orgAddressLine_1, orgAddressLine_2, orgCity, orgPincode, organizationName, orgState, incomeRange, landMark, jobDescription, occupationTypevalue }
    const findData = async () => {
        try {
            setLoading(true)
            setLoaderMessage('loading')
            let userdata1 = await AsyncStorage.getItem('occupation')
            userdata1 = JSON.parse(userdata1)
            userdata1 && console.log(userdata1, 'd')
            setorgAddressLine_1(userdata1.orgAddressLine_1)
            setorganizationName(userdata1.organizationName)
            setorgAddressLine_2(userdata1.orgAddressLine_2)
            setlandMark(userdata1.landMark)
            setjobDescription(userdata1.jobDescription)
            setorgPincode(userdata1.orgPincode)
            setincomeRange(userdata1.incomeRange)
            setValue2(userdata1.orgState)
            setValue(userdata1.orgCity)
            setorgCity(userdata1.orgCity)
            setorgState(userdata1.orgState)
            setorgtaluka(userdata1.orgtaluka)
            setorgVillage(userdata1.orgVillage)
            setoccupationTypevalue(userdata1.occupationTypevalue)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    useEffect(() => {
        findData()
        let data = Object.keys(statesData)
        data = data.map(item => ({
            value: item, label: item
        }))
        setstatesArray(data)
        setfilterStates(data)
    }, [])
    const getDatafromStorageandUpdate = async (data) => {
        console.log({ data })
        try {
            await AsyncStorage.setItem('occupation', JSON.stringify(data))
        } catch (error) {
            console.log(error)
        }
    }
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
    const formikRef = useRef()
    return (
        <View style={styles.container}>
            <Loader loading={loading} message={loaderMessage} />
            <Signupheader2 heading={'Occupation Details'} onPress={() => (navigation.goBack(), getDatafromStorageandUpdate(array))}
                onPress2={() => {
                    navigation.navigate("DocumentUploadScreen")
                    getDatafromStorageandUpdate(array)
                }
                } />
            <>
                <ScrollView>
                    <View style={{ padding: 12 }}>
                        <View>
                            <View style={{ width: '100%', marginVertical: 3 }}>
                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={occupationdata}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus2 ? 'Occupation Type' : '...'}
                                    searchPlaceholder="Search..."
                                    value={occupationTypevalue}
                                    onFocus={() => setIsFocus2(true)}
                                    onBlur={() => setIsFocus2(false)}
                                    onChange={item => {
                                        setoccupationTypevalue(item.value);
                                        setIsFocus2(false);
                                    }}
                                />
                            </View>
                            <View style={{ width: '100%' }}>
                                <TextInput
                                    style={{ ...styles.bigF, width: '100%', }}
                                    placeholder="Organization Name"
                                    value={organizationName}
                                    onChangeText={t => setorganizationName(t)}
                                />
                            </View>
                            <View style={{ width: '100%' }}>
                                <TextInput
                                    style={{ ...styles.bigF, width: '100%', }}
                                    placeholder="Job Description"
                                    value={jobDescription}
                                    onChangeText={t => setjobDescription(t)} />
                            </View>
                            <View style={{ width: '100%' }}>
                                <TextInput
                                    style={{ ...styles.bigF, width: '100%', }}
                                    placeholder="Organization Address"
                                    onChangeText={t => setorgAddressLine_1(t)}
                                    value={orgAddressLine_1}
                                />
                            </View>
                            <View style={{ width: '100%' }}>
                                <TextInput
                                    style={{ ...styles.bigF, width: '100%', }}
                                    placeholder="Organization Address2"
                                    value={orgAddressLine_2}
                                    onChangeText={t => setorgAddressLine_2(t)}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ width: '45%' }}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
                                        placeholder={!isFocus2 ? 'Organization State' : '...'}
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
                                            setfilterStates(statesArray)
                                            setorgState(item.value)
                                        }}
                                    />
                                </View>

                                <View style={{ width: '45%' }}>
                                    {
                                        value2 == "Maharashtra" ?
                                            <Dropdown
                                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
                                                placeholder={!isFocus ? 'Organization City' : '...'}
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
                                                    setfilterCity(cityArray)
                                                    setorgCity(item.value)
                                                }}
                                            /> :
                                            <TextInput
                                                style={{ ...styles.smallF, width: '100%', }}
                                                placeholder="Village / City"
                                                onChangeText={t => {
                                                    setorgVillage(t)
                                                }}
                                                value={orgVillage}
                                            />
                                    }
                                </View>
                            </View>
                        </View>
                        {
                            value2 == "Maharashtra" && value !== "Mumbai City" &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                        value={orgtaluka}
                                        onFocus={() => setIsFocus3(true)}
                                        onBlur={() => {
                                            setIsFocus3(false)
                                            setfiletertaluka(talukafull)
                                        }}
                                        onChange={item => {
                                            setorgtaluka(item.value)
                                            setIsFocus3(false);
                                            setfiletertaluka(talukafull)
                                        }}
                                    />
                                </View>
                                <TextInput
                                    style={{ ...styles.smallF }}
                                    placeholder="Village / City"
                                    onChangeText={t => {
                                        setorgVillage(t)
                                    }}
                                    value={orgVillage}
                                />
                            </View>
                        }
                        {
                            value == "Mumbai City" &&
                            <View style={{ width: '100%' }}>
                                <TextInput
                                    style={{ ...styles.smallF, width: '100%', }}
                                    placeholder="Village / City"
                                    onChangeText={t => {
                                        setorgVillage(t)
                                    }}
                                    value={orgVillage}
                                />
                            </View>
                        }
                        <View style={{ width: '100%' }}>
                            <TextInput
                                style={{ ...styles.smallF, width: '100%', }}
                                placeholder="Pincode"
                                value={orgPincode}
                                onChangeText={t => setorgPincode(t)}
                                keyboardType='numeric'
                                maxLength={6}
                            />
                        </View>
                        <Text allowFontScaling={false}>Income Range</Text>
                        <View style={{ alignItems: 'center' }} >
                            <RadioButton.Group  onValueChange={newValue => setincomeRange(newValue)} value={incomeRange}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton uncheckedColor='gray' value="Less than 3LPA" />
                                            <Text allowFontScaling={false}>Less than 3LPA</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton uncheckedColor='gray' value="5-7LPA" />
                                            <Text  allowFontScaling={false}>5-7LPA</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton uncheckedColor='gray' value="3 - 5LPA" />
                                            <Text allowFontScaling={false}>3 - 5LPA</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton uncheckedColor='gray' value="Greater than 7LPA" />
                                            <Text allowFontScaling={false}>Greater than 7LPA</Text>
                                        </View>
                                    </View>
                                </View>

                            </RadioButton.Group>
                        </View>
                        <View style={{ marginVertical: 20 }} >
                            <TouchableOpacity
                                onPress={() => {
                                    getDatafromStorageandUpdate(array)
                                    navigation.navigate("DocumentUploadScreen")
                                }}
                                style={{
                                    alignSelf: 'center', backgroundColor: colors.headerBlue,
                                    borderRadius: 10, width: '55%'
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
                    </View>
                    {/* {console.log(errors)} */}
                </ScrollView>
            </>
            {/* )}
            </Formik> */}
        </View>
    );
}

export default OccupationDetailsScreen;

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
        fontSize: 10,
    },
    placeholderStyle: {
        fontSize: 10,
    },
    selectedTextStyle: {
        fontSize: 10,
        color: 'black'
    }, errors: {
        color: 'red', fontSize: 10
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 10
    },
    userNameText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Quicksand',
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
        fontSize: 10, marginVertical: 6, paddingHorizontal: 12
    }, bigF: {
        height: 43, borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 11,
        fontSize: 10, marginVertical: 6, paddingHorizontal: 12
    }
});
