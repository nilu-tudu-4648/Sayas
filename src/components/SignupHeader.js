import { View, Text, Image } from 'react-native'
import React from 'react'
import WhiteLogo from '../assets/images/whiteLogo.png';
const SignupHeader = () => {
    return (
            <View style={{ height: '30%', backgroundColor: '#477BFF' }}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        height: '100%',
                    }}>
                    <Image
                        source={WhiteLogo}
                        resizeMode={'contain'}
                        style={{ width: 130, height: 130, aspectRatio: 1,tintColor:'white' }}
                    />
                </View>
            </View>
    )
}

export default SignupHeader