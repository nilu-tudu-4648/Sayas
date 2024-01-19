import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import colors from '../assets/colors/colors';
import Loader from '../components/loader';
import Toast from 'react-native-simple-toast';
import { Checkbox, } from 'react-native-paper'
import SignupHeader from '../components/SignupHeader';
import Signupheader2 from '../components/Signupheader2';

const { width, height } = Dimensions.get('window');
function TermsandConditionScreen({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');

    return (
        <View style={styles.container}>
            <Signupheader2 heading={'Terms and Conditions'} onPress={() => navigation.goBack()} onPress2={() =>!checked ? Toast.show('Please agree terms and conditions') : navigation.navigate("DocumentUploadScreen")} />
            <ScrollView >
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '600',
                            fontFamily: 'Quicksand',
                            color: '#B770FF',
                            marginTop: 20,
                            marginBottom: 20,
                        }}>
                        Terms and Conditions
                    </Text>

                    <View>
                        <Text>
                            • I am fully aware that Sayas Cooperative is an electronic
                        </Text>
                        <Text> aggregator platform for negotiating and thereby reducing </Text>
                        <Text> prices of various goods and services. </Text>
                        <Text>• I will buy goods and services offered on this electronic platform.</Text>
                        <View>
                            <Text> • I will install the mobile application of Sayas and transact</Text>
                            <Text> with Sayas through this application, without insisting on </Text>
                            <Text>any form of physical documentation.</Text>
                        </View>
                        <View>
                            <Text>• I accept the rules and guidelines to promote policies and</Text>
                            <Text> values of the Cooperative Society.</Text>
                        </View>
                        <View>
                            <Text> • I meet the conditions of membership as set out in the</Text>
                            <Text> cooperative society rules.</Text>
                        </View>
                        <View>
                            <Text>• I accept and conform to the rules, principles and policies</Text>
                            <Text> of the society.</Text>
                        </View>
                        <View>
                            <Text>• I am at least 18 years of age at the time of applying for</Text>
                            <Text>  the membership.</Text>
                        </View>
                        <View>
                            <Text> • I accept that 25% of the savings accumulated after</Text>
                            <Text>purchasing goods and services through the platform will</Text>
                            <Text>be contributed as capital in my own name to the </Text>
                            <Text>   cooperative.</Text>
                        </View>
                        <View>
                            <Text>• I acknowledge that the board of the cooperative society</Text>
                            <Text> reserves full rights to terminate my membership upon</Text>
                            <Text> violation of the terms, conditions and guidelines of the</Text>
                            <Text> cooperative society.</Text>
                        </View>
                        <View>
                            <Text> • I am aware of the provisions of the bye-laws of the</Text>
                            <Text>society, and I agree to be bound by them in all matters</Text>
                            <Text> relating to my transactions with the society.</Text>
                        </View>
                        <View>
                            <Text>• I agree to pay Rs.700 towards share capital in Sayas</Text>
                            <Text> Cooperative, Rs.100 as membership fees and Rs. 200 as</Text>
                            <Text>
                                donation at the time of application..</Text>
                        </View>
                        <View>
                            <Text>• I agree to pay Rs. 100 as donation to Sayas Cooperative</Text>
                            <Text>
                                annually from second year onwards</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(!checked);
                                }}
                            />
                            <Text>  agree to the above terms and conditions</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => checked ? navigation.navigate('DocumentUploadScreen') : Toast.show('Please agree terms and conditions')}
                        style={{
                            alignSelf: 'center', backgroundColor: colors.headerBlue,
                            borderRadius: 10, width: '55%', marginVertical: 30
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
    );
}

export default TermsandConditionScreen;

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
