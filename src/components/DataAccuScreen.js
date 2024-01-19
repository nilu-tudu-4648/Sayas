import {
    Text, View, ScrollView, Dimensions, StyleSheet, Image,
    Platform,
    PermissionsAndroid,
    TouchableOpacity, TextInput,
    Pressable,
    BackHandler
} from 'react-native'
import RadioButtonRN from 'radio-buttons-react-native';
import CheckBox from '@react-native-community/checkbox'
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react'
import Toast from 'react-native-simple-toast';
import {  Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitdataAcquisition, getmemberDetails, uploadImage } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Loader from '../components/loader';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import colors from '../assets/colors/colors';

const DataAccuScreen = ({ route, navigation }) => {
    const choose = route.params?.choose
    const [answers, setanswers] = useState({ ans: '' });
    const [value, setValue] = useState({})
    const [loading, setLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');
    const [fileName, setfileName] = useState({});
    const [eachDataAc, seteachDataAc] = useState()
    const [showValidation, setshowValidation] = useState({})
    const getDataAccuResponse = () => {
        setLoading(true);
        setLoaderMessage('loading...');
        const anspush = choose?.questions?.map(item => ({ ...item, ans: [] })) || []
        seteachDataAc(anspush)
        setLoading(false);
    }
    useEffect(() => {
        getDataAccuResponse()
    }, [choose?.questions])
    const data = Object.keys(value);
    const answerkey = Object.keys(answers)
    const filteranswer = choose?.questions?.map(item => {
        if (item.questionType === 'Short Answer Text') {
            try {
                if (answerkey.includes(item.question)) return { ...item, answer: answers[item.question] }
            } catch (error) {
                return item
            }
            return item
        }
        if (item.questionType === 'Multiple Choice') {
            try {
                if (data.includes(item.question)) return { ...item, answer: value[item.question] }
            } catch (error) {
                return item
            }
            return item
        }
        if (item.questionType === 'Long Answer Text') {
            try {
                if (answerkey.includes(item.question)) return { ...item, answer: answers[item.question] }
            } catch (error) {
                return item
            }
            return item
        }
        if (item.questionType === 'File') {
            try {
                if (answerkey.includes(item.question)) return { ...item, answer: answers[item.question] }
            } catch (error) {
                return item
            }
            return item
        }
        if (item.questionType === 'Date') {
            try {
                if (data.includes(item.question)) return { ...item, answer: value[item.question] }
            } catch (error) {
                return item
            }
            return item
        }
        if (item.questionType === 'Check Box') {
            try {
                if (data.includes(item.question)) return { ...item, answer: value[item.question] }
            } catch (error) {
                return item
            }
            return item
        }
    })
    const hideDialog = () => {
        if (route.params.accu) {
            navigation.navigate("AcquisitionScreen", { props: route.params.accu })
        } else {
            navigation.navigate("LandingScreen")
        }
    }
    BackHandler.addEventListener('hardwareBackPress', () => {
        hideDialog()
        return true;
    }, []);
    const filtervalidation = Object.values(showValidation)?.filter(ite => ite !== null)
    const filtertrue = filteranswer?.filter(item => item.required !== false && !item.answer)
    const submitAnswers = async () => {
        // const filtervalidation = Object.values(showValidation)?.filter(ite => ite !== null)
        // const filtertrue = filteranswer.filter(item => item.required !== false && !item.answer)
        if (filtertrue.length == 0 && filtervalidation?.length == 0) {
            let userDetailsdata = JSON.parse(await AsyncStorage.getItem('userDetails'));
            if (Object.keys(answers).length > 1 || Object.keys(value).length) {
                const formdata = {
                    'dataAcquisitionId': `${choose.dataAcquisitionId}`,
                    'memberId': `${userDetailsdata[1].user}`,
                    'response': filteranswer,
                    'title': choose.title
                }
                console.log(formdata)
                try {
                    const result = await submitdataAcquisition(formdata)
                    hideDialog()
                } catch (error) {
                    console.log(error)
                    hideDialog()
                }

            }
        } else {
            if (filtervalidation.length) {
                Toast.show('Please check errors and try again')
            } else {
                Toast.show('Please fill required answers')
            }
        }
    }
    const checkPermission = async (fileUrl) => {
        if (Platform.OS === 'ios') {
            downloadFile();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'Application needs access to your storage to download File',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    downloadFile(fileUrl);
                } else {
                    alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                console.log("++++" + err);
            }
        }
    };

    const downloadFile = (fileUrl) => {
        let date = new Date();
        let FILE_URL = fileUrl;
        let file_ext = getFileExtention(FILE_URL);
        file_ext = '.' + file_ext[0];
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                path:
                    RootDir +
                    '/file_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    file_ext,
                description: 'downloading file...',
                notification: true,
                useDownloadManager: true,
            },
        };
        config(options)
            .fetch('GET', FILE_URL)
            .then(res => {
                Toast.show('File Downloaded Successfully.');
            });
    };

    const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };
    // console.log(choose, 'ho')
    const checkStr = (item, text) => {
        if (item.type === 'Alphabet') {
            if (/[0-9]/.test(text)) {
                setanswers({ ...answers, [item.question]: null })
                setshowValidation({ ...showValidation, [item.question]: `This answer accept only ${item.type}` })
            } else {
                if (item.limit) {
                    if (text.split(" ").length > parseInt(item.limit)) {
                        setanswers({ ...answers, [item.question]: null })
                        setshowValidation({ ...showValidation, [item.question]: `This answer has only ${item.limit} word limit` })
                    } else {
                        setanswers({ ...answers, [item.question]: text })
                        setshowValidation({ ...showValidation, [item.question]: null })
                    }
                } else {
                    setanswers({ ...answers, [item.question]: text })
                    setshowValidation({ ...showValidation, [item.question]: null })
                }
            }
        } else if (item.type === 'Alpha-Num') {
            if (item.limit) {
                if (text.split(" ").length > parseInt(item.limit)) {
                    setanswers({ ...answers, [item.question]: null })
                    setshowValidation({ ...showValidation, [item.question]: `This answer has only ${item.limit} word limit` })
                } else {
                    setanswers({ ...answers, [item.question]: text })
                    setshowValidation({ ...showValidation, [item.question]: null })
                }
            } else {
                setanswers({ ...answers, [item.question]: text })
            }
        } else if (item.type === 'Number') {
            if (item.limit) {
                if (text.length > parseInt(item.limit)) {
                    setanswers({ ...answers, [item.question]: null })
                    setshowValidation({ ...showValidation, [item.question]: `This answer has only ${item.limit} limit` })
                } else {
                    setanswers({ ...answers, [item.question]: text })
                    setshowValidation({ ...showValidation, [item.question]: null })
                }
            } else {
                setanswers({ ...answers, [item.question]: text })
                setshowValidation({ ...showValidation, [item.question]: null })
            }
        }
        else {
            setshowValidation({})
            setanswers({ ...answers, [item.question]: text })
        }
    }
    const docPicker = async (item) => {
        try {
            let res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            RNFetchBlob.fs
                .readFile(res[0]['uri'], 'base64')
                .then(async (dat) => {
                    setLoading(true)
                    setLoaderMessage('Uploading...')
                    const data = await uploadImage({
                        'name': res[0]['name'],
                        'type': res[0]['type'],
                        'imageData': `data:${res[0]['type']};base64,${dat}`,
                    })
                    setLoading(false)
                    if (data) {
                        Toast.show('File is uploaded Succesfully')
                        setanswers({ ...answers, [item.question]: data })
                        setfileName({ ...fileName, [item.question]: res[0]['name'] })
                    }
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false)
                });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('error -----', err);
            } else {
                throw err;
            }
        }
    };
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
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
    const disabled = choose.type !== 'Application' && (choose.members?.includes(getmemberDetails?.id)) && true
    return (
        <View style={{ padding: 25 }}>
            <Loader loading={loading} message={loaderMessage} />
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }} >
                {/* <Entypo onPress={() => hideDialog()} name='cross' color={'black'} size={28} style={{ alignSelf: 'flex-end' }} /> */}
                <Text style={{ fontSize: 19, fontWeight: '500', color: 'black', bottom: 10 }}>{choose?.title}</Text>
                <View>
                    {
                        choose?.about ? <Text style={{ fontSize: 13, fontWeight: '400', color: 'black', marginVertical: 5 }}>{choose?.about}</Text> : null
                    }
                </View>
                <View>
                    {
                        choose?.description ? <Text style={{ fontSize: 13, fontWeight: '400', color: 'black', marginVertical: 5 }}>{choose?.description}</Text> : null
                    }
                </View>
                {
                    choose.attachmentUrl ?
                        <Image resizeMode='contain' onPress={() => checkPermission(choose?.attachmentUrl)}
                            style={{ width: 100, height: 100 }} source={{ uri: choose?.attachmentUrl }} />
                        : null
                }
                <View >
                    {
                        eachDataAc?.map((item, i) => (
                            <View key={i + 1} style={{
                                elevation: 5, padding: 10, marginVertical: 8, borderRadius: 10, backgroundColor: '#FFFFFF', width: '100%'
                            }} >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 17, fontWeight: '500', color: 'black', bottom: 5 }}>{item?.question}</Text>
                                        </View>
                                        {
                                            (item.attachmentUrl || item.attechmentUrl) ?
                                                <Image resizeMode='contain' onPress={() => checkPermission(item?.attachmentUrl)}
                                                    style={{ width: 100, height: 100 }} source={{ uri: item?.attachmentUrl }} />
                                                : null
                                        }
                                    </View>
                                    {
                                        (choose.members?.includes(getmemberDetails?.id)) ?
                                            <Image
                                                source={require('../assets/images/tickMark.png')}
                                                resizeMode={'contain'}
                                                style={{ width: 10, height: 10 }}
                                            /> :
                                            item.required &&
                                            <Ionicons
                                                name="star"
                                                size={14}
                                                color={'red'}
                                            />
                                    }
                                </View>
                                <Text style={{ fontSize: 9, color: 'red', alignSelf: 'flex-end' }}>{showValidation && showValidation[item.question]}</Text>
                                {item.questionType === 'Short Answer Text' ?
                                    <TextInput mode='flat' placeholder='Your answer'
                                        disabled={disabled}
                                        style={{ backgroundColor: 'lightgray' }}
                                        keyboardType={item.type === "Number" ? 'numeric' : 'visible-password'}
                                        onChangeText={(text) => checkStr(item, text)
                                        }
                                        activeUnderlineColor={'gray'} /> :
                                    item.questionType === 'Multiple Choice' ?
                                        <View>
                                            <RadioButtonRN
                                                data={item.options.map(ite => (
                                                    { ...ite, label: ite.option }
                                                ))}
                                                box={false}
                                                selectedBtn={newValue => (setValue({ ...value, [item.question]: newValue }))}
                                            />
                                        </View>
                                        :
                                        item.questionType === 'Check Box' ?
                                            <View>
                                                {
                                                    item.options?.map((ite, i) => (
                                                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <CheckBox
                                                                value={
                                                                    item.ans?.includes(item.options[i]) ? true : false
                                                                }
                                                                onValueChange={() => {
                                                                    if (item.ans?.includes(item.options[i])) {
                                                                        item.ans = item.ans.filter(fite => fite !== item.options[i])
                                                                        const mapd = eachDataAc.map(it => it.id === item.id ? { ...it, ans: item.ans } : it)
                                                                        seteachDataAc(mapd)
                                                                        setValue({ ...value, [item.question]: item.ans })
                                                                    } else {
                                                                        const data = [...item.ans, item.options[i]]
                                                                        item.ans = data
                                                                        const mapd = eachDataAc.map(it => it.id === item.id ? { ...it, ans: data } : it)
                                                                        seteachDataAc(mapd)
                                                                        setValue({ ...value, [item.question]: data })
                                                                    }

                                                                }}
                                                            />
                                                            <Text>{ite.option}</Text>
                                                        </View>
                                                    ))

                                                }
                                            </View>
                                            :
                                            item.questionType === 'Date' ?
                                                <Pressable onPress={() => (showDatepicker(), setValue({ ...value, [item.question]: moment(date).format("DD/MM/YYYY") }))
                                                } >
                                                    <View style={
                                                        styles.smallF
                                                    }>
                                                        <Text>{moment(date).format("DD/MM/YYYY")}</Text>
                                                        <FontAwesome5
                                                            name="calendar-alt"
                                                            size={24}
                                                            color={'black'}
                                                        />
                                                    </View>
                                                </Pressable>
                                                :
                                                item.questionType === "File" ?
                                                    <>
                                                        <Text>{fileName[item.question]}</Text>
                                                        <Button style={{ backgroundColor: colors.headerBlue }} mode="contained" onPress={() => docPicker(item)}>
                                                            Choose
                                                        </Button>
                                                    </> :
                                                    <View style={styles.textAreaContainer}>
                                                        <TextInput
                                                            onChangeText={(text) => checkStr(item, text)}
                                                            placeholder='Your answer'
                                                            numberOfLines={13}
                                                            multiline={true}
                                                            style={{ textAlignVertical: 'top', backgroundColor: 'lightgray' }}
                                                            disabled={disabled}
                                                            keyboardType={item.type === "Number" ? 'numeric' : 'visible-password'}
                                                            activeUnderlineColor={'gray'}
                                                        />
                                                    </View>
                                }
                            </View>
                        ))
                    }
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                    <Button uppercase={false}
                        disabled={disabled}
                        onPress={() => {
                            submitAnswers()
                            getDataAccuResponse()
                        }}
                        mode='contained'
                        contentStyle={{ backgroundColor: colors.headerBlue }}
                    >
                        Submit
                    </Button>
                </View>
            </ScrollView>
            {/* </Dialog.ScrollArea>
            </Dialog> */}
        </View>
    )
}
const styles = StyleSheet.create({
    textAreaContainer: {
        width: '100%',
        height: 200,
        fontSize: 15,
        borderRadius: 8,
        top: 5,
        overflow: 'hidden',
    }, smallF: {
        height: 43,
        borderColor: 'gray', flexDirection: 'row',
        borderWidth: 1, borderRadius: 11, width: '100%',
        justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 12
    },
})
export default DataAccuScreen


// setTimeout(async () => {
//     const re = members?.filter(item => item == getmemberDetails.id)
//     // const re = members.forEach(item=>{
//     //     if(item.includes(getmemberDetails.id)) return false
//     // })
//     console.log(re)
//     const response = await getDataAcquisitionsResponsesofamember()
//     setdataAcquisitionsResponses(response)
//     const filterQuestions = choose.questions?.map(item => item.question)
//     if (response) {
//         if (choose.type == 'Survey') {
//             const filterresponsesurvey = dataAcquisitionsResponses?.surveys[0].response?.map(item => item.question)
//             seteachDataAc(choose?.questions)
//             const result = filterresponsesurvey?.map(item => {
//                 if (filterQuestions?.includes(item))
//                     return { ...choose, ans: true }
//             })
//             settickCheck(result)
//             console.log('first', dataAcquisitionsResponses?.surveys.length)
//         } else if (choose?.type == 'Poll') {
//             seteachDataAc(choose?.questions)
//             const filterresponsepolls = dataAcquisitionsResponses?.polls[0].response?.map(item => item.question)
//             const result = filterresponsepolls?.map(item => {
//                 if (filterQuestions?.includes(item))
//                     return { ...choose, ans: true }
//             })
//             settickCheck(result)
//             console.log('se')
//         } else {
//             seteachDataAc(choose?.questions)
//             const filterresponseapp = dataAcquisitionsResponses?.applications[0].response?.map(item => item.question)
//             const result = filterresponseapp?.map(item => {
//                 if (filterQuestions?.includes(item))
//                     return { ...choose, ans: true }
//             })
//             console.log('thi')
//             settickCheck(result)
//         }
//     }
//     setLoading(false)
// }, 2000);