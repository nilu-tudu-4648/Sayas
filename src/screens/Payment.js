import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../assets/colors/colors'
import Signupheader2 from '../components/Signupheader2'

const Payment = ({ navigation }) => {
    return (
        <ScrollView style={{ flex: 1, padding: 18 }}>
            <Signupheader2 heading={'Membership Fee Payment'} onPress={() => navigation.goBack()}
                onPress2={() => navigation.navigate('PersonalDetailsScreen')} />
            <View style={{ height: 10 }} />
            <Text  allowFontScaling={false} style={{ lineHeight: 19 }}>Pay Membership Fee Amount Rs.1000 using any of the following method and save the screenshot.</Text>
            <View style={{ height: 20 }} />
            <Text allowFontScaling={false} style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>1.<Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>  UPI ID</Text> : 056003521@tjsb</Text>
            <View style={{ height: 20 }} />
            <Text allowFontScaling={false} style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>2.<Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>  QR Code</Text> :</Text>
            <View style={{ height: 10 }} />
            <Image style={{ width: 250, height: 250, alignSelf: 'center' }} source={require('../assets/images/Qr.jpg')} />
            <View style={{ height: 10 }} />
            <View style={{ height: 10 }} />
            <Text allowFontScaling={false} style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>3.<Text >  Bank Transfer</Text></Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View >
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>Bank Name :</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>Account Name :</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>Account No. :</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>IFSC Code :</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>Bank Branch :</Text>
                </View>
                <View >
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>Thane Janata Sahakari Bank Limited</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>Sayas Cooperative Society Limited</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>056120900000006</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>TJSB0000056</Text>
                    <View style={{ height: 10 }} />
                    <Text allowFontScaling={false}>Wanawadi, Pune – 411040</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('PersonalDetailsScreen')}
                style={{
                    alignSelf: 'center', backgroundColor: colors.headerBlue,
                    borderRadius: 10, width: '55%', marginVertical: 50,
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
        </ScrollView>
    )
}

export default Payment

const styles = StyleSheet.create({})