import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity, Image,
    SafeAreaView,
    ScrollView,BackHandler,TextInput
} from 'react-native';
import colors from '../assets/colors/colors';
import { Button,  } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getUserDetailsByMemberId} from '../../constants';
import Loader from '../components/loader';

const { width, height } = Dimensions.get('window');

function ProfileScreen() {

    const navigation = useNavigation();
    BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate("LandingScreen")
        }, [])
    const [getmemberDetail, setgetmemberDetail] = useState(null);
    const getMemberbyIdApiCall = async () => {
        setLoading(true);
        setLoaderMessage('loading...');
        try {
            let datareseponse = await getUserDetailsByMemberId();
            setgetmemberDetail(datareseponse);
            setfirstName(datareseponse.firstName)
            setmiddleName(datareseponse.middleName)
            setlastName(datareseponse.lastName)
            setemail(datareseponse.email)
            setphone(`${datareseponse.phone}`)
            setaddressLine_1(datareseponse.addressLine_1)
            setaddressLine_2(datareseponse.addressLine_2)
            setcity(datareseponse.city)
            setpincode(`${datareseponse.pincode}`)
            setnominee_name(datareseponse.nominee_name)
            setStates(datareseponse.state)
            setorganisation_name(datareseponse.organisation_name)
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
   
    const [loading, setLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');
    const [firstName, setfirstName] = useState(null);
    const [middleName, setmiddleName] = useState(null);
    const [lastName, setlastName] = useState(null);
    const [email, setemail] = useState(null);
    const [states, setStates] = useState(null);
    const [phone, setphone] = useState(null);
    const [addressLine_1, setaddressLine_1] = useState(null);
    const [addressLine_2, setaddressLine_2] = useState(null);
    const [city, setcity] = useState(null);
    const [pincode, setpincode] = useState(null);
    const [nominee_name, setnominee_name] = useState(null);
    const [organisation_name, setorganisation_name] = useState(null);
    useEffect(() => {
        getMemberbyIdApiCall()
    }, [])
 
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    backgroundColor: colors.headerBlue,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center', elevation: 22
                }}>
                <View
                    style={{
                        justifyContent: 'flex-start',
                        margin: 10,
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign
                            name="arrowleft"
                            size={25}
                            color={'white'}
                            style={{ marginRight: 10 }}
                        />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                            Profile
                        </Text>
                    </View>
                </View>
                    </View>
            <Loader loading={loading} message={loaderMessage} />
            <ScrollView contentContainerStyle={{
                alignItems: 'center',
                marginTop: 10, width: width
            }}>
                <View style={{ alignItems: 'center', width: width }}>
                    <View style={{ width: width, alignItems: 'flex-end', paddingRight: 18 }}>
                        <Text>{getmemberDetail?.memberId}</Text>
                    </View>
                    <View style={styles.profilepic}>
                        {
                            getmemberDetail?.userImage ? <Image resizeMode='contain' source={{ uri: getmemberDetail.userImage }} style={styles.image} /> :
                                <FontAwesome name='user' color={'darkgray'} size={52} />
                        }
                    </View>
                    {/* <TouchableOpacity onPress={() => console.log('hello')} style={styles.plus}>
                        <FontAwesome name='plus-circle' color={'darkgray'} size={29} />
                    </TouchableOpacity> */}
                    {/* <Text style={styles.inputHeader}>Add Profile Photo</Text> */}
                </View>
                <View style={{ width: width, padding: 14 }}>
                    <Text style={styles.inputHeader}>PERSONAL INFORMATION</Text>
                    <TextInput editable={false}  value={firstName}  onChangeText={(text) => setfirstName(text)} style={styles.textinput}   mode='outlined' placeholder="First Name" />
                    <TextInput  editable={false} value={middleName} onChangeText={(text) => setmiddleName(text)} style={styles.textinput}   placeholder="Middle Name" />
                    <TextInput editable={false} value={lastName} onChangeText={(text) => setlastName(text)} style={styles.textinput}   placeholder="Last Name" />
                </View>
                <View style={{ width: width, padding: 14 }}>
                    <Text style={styles.inputHeader}>CONTACT INFORMATION</Text>
                    <TextInput editable={false} value={email} onChangeText={(text) => setemail(text)} style={styles.textinput}   placeholder="Email" />
                    <TextInput editable={false} value={phone} onChangeText={(text) => setphone(text)} style={styles.textinput}   placeholder="Phone" />
                </View>
                <View style={{ width: width, padding: 14 }}>
                    <Text style={styles.inputHeader}>ADDRESS INFORMATION</Text>
                    <TextInput editable={false} value={addressLine_1} onChangeText={(text) => setaddressLine_1(text)} style={styles.textinput}   placeholder="Address line 1" />
                    <TextInput editable={false} value={addressLine_2} onChangeText={(text) => setaddressLine_2(text)} style={styles.textinput}   placeholder="Address line 2" />
                    <TextInput editable={false} value={city} onChangeText={(text) => setcity(text)} style={styles.textinput}   placeholder="Town/City" />
                    <TextInput keyboardType='numeric' editable={false} value={pincode} onChangeText={(text) => setpincode(text)} style={styles.textinput}   placeholder="Pincode" />
                    <TextInput editable={false} value={states} onChangeText={(text) => setStates(text)} style={styles.textinput}   placeholder="State" />
                            </View>
                <View style={{ width: width, padding: 14,marginBottom:20 }}>
                    <Text style={styles.inputHeader}>ADDITIONAL INFORMATION</Text>
                    <TextInput  editable={false} value={nominee_name} onChangeText={(text) => setnominee_name(text)} style={styles.textinput}   placeholder="Nominee Name" />
                    <TextInput editable={false} value={organisation_name} onChangeText={(text) => setorganisation_name(text)} style={styles.textinput}   placeholder="Organisation Name" />
                    {/* <Button onPress={() => submit()} uppercase={false} mode='contained' contentStyle={{ backgroundColor: 'black' }} style={{ marginVertical: 12 }} >
                        Submit
                    </Button> */}
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}
export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }, inputHeader: {
        fontWeight: '500', fontSize: 15
    }, profilepic: {
        width: 100, height: 100,
        borderRadius: 50,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center'
        , overflow: 'hidden'
    },
    textinput: {
        marginTop: 8,
        backgroundColor: '#fff',borderColor:'gray',borderWidth:1,borderRadius:5
    }, plus: {
        width: 30, height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center', top: -20,
        left: 15
    }, image: {
        width: '100%',
        height: 100,
    },
});
