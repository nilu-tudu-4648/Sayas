import React, { useEffect, useState, useRef } from 'react'
import { WebView } from 'react-native-webview';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity, BackHandler
} from 'react-native';
import Loader from '../components/loader';
import colors from '../assets/colors/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { getmemberDetails } from '../../constants';

const SupportWeb = () => {

    const jsCode = `setTimeout(()=>{
        const frame = document.querySelectorAll('iframe')[1]
        frame.contentWindow.document.querySelectorAll("input")[0].disabled=true;
        frame.contentWindow.document.querySelectorAll("input")[1].disabled=true;
        frame.contentWindow.document.querySelectorAll("input")[0].style.color = 'black';
        frame.contentWindow.document.querySelectorAll("input")[1].style.color = 'black';
           },2000); true`;
    //    const frame = document.querySelectorAll('iframe')[1]
    //    const vari=  frame.contentWindow.document.querySelectorAll('p')[4]
    //    vari.innerText = 'resolved'
    // frame.contentWindow.document.querySelectorAll("input")[0].value = ${ getmemberDetails?.phone };
    // frame.contentWindow.document.querySelectorAll("input")[0].style.color = 'black';
    // frame.contentWindow.document.querySelectorAll("input")[0].disabled=true;
    const navigation = useNavigation()
    const [first, setfirst] = useState(false)
    BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate("LandingScreen")
    }, [])
    useEffect(() => {

        setfirst(true)
    }, [first])

    const [loading, setLoading] = useState(false);
    return (
        <View style={styles.container}>
            {
                first &&
                <View>
                    <View
                        style={{
                            backgroundColor: colors.headerBlue,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                margin: 10,
                                alignSelf: 'flex-start',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity onPress={() => (navigation.goBack(), setfirst(false))} >
                                <AntDesign
                                    name="arrowleft"
                                    size={25}
                                    color={'white'}
                                    style={{ marginRight: 10 }}
                                />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                                    Support
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            }
            <Loader loading={loading} message={'Loading'} />
            {
                first &&
                <WebView
                    onLoadStart={() => (setLoading(true))}
                    onLoadEnd={() => setLoading(false)}
                    javaScriptEnabledAndroid={true}
                    source={{ uri: `http://sayas-dev.s3-website.ap-south-1.amazonaws.com/support?email=${getmemberDetails?.email}&mobileNo=${getmemberDetails?.phone}` }}
                    injectedJavaScript={jsCode}
                />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        // alignItems:'center'
    },
})
export default SupportWeb
