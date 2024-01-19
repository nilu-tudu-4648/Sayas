import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign';
const Signupheader2 = ({ onPress, heading, onPress2 }) => {
    return (
        <View style={{
            justifyContent: 'center',
            borderBottomColor: '#E5E5E5', borderBottomWidth: 4, width: '90%',
            alignSelf: 'center', alignItems: 'center'
        }}>
            <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false}
                    style={{
                        fontSize: 14,
                        fontWeight: '600',
                        fontFamily: 'Poppins',
                        color: 'black',
                        marginTop: 20,
                    }}>
                    Sayas Cooperative
                </Text>
                <Text allowFontScaling={false}
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
                <TouchableOpacity onPress={onPress}>
                    <AntDesign
                        name="arrowleft"
                        size={32}
                        color={'black'}
                    />
                </TouchableOpacity>
                <Text  allowFontScaling={false}
                    style={{
                        fontSize: 16,
                        fontWeight: '700',
                        fontFamily: 'Poppins',
                        color: 'black',
                        marginTop: 20,
                        marginBottom: 20,
                    }}>
                    {heading}
                </Text>
                <TouchableOpacity onPress={onPress2}>
                    <AntDesign
                        name="arrowright"
                        size={32}
                        color={'gray'}
                    />
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default Signupheader2