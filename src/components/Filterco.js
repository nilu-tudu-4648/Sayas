import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'

import { Dropdown } from 'react-native-element-dropdown';
const WelcomeScreen = () => {
    const [isFocus, setIsFocus] = useState(false)
    const [value, setvalue] = useState(null)
    const [renderArray, setrenderArray] = useState([])
    const data = [
        { name: 'nilu', age: '12', class: '' },
        { name: 'boby', age: '', class: '12' },
        { name: 'bhutuk', age: '', class: '12' },
        { name: 'guddi', age: '13', class: '' },
        { name: '', age: '15', class: '12' },
    ]
    const datas = ['unanswred', 'answered', 'draft']
    const fil = {
        byname: data.filter(ite => ite.name),
        byclass: data.filter(ite => ite.class),
        byAge: data.filter(ite => ite.age)
    }

    const valuechange = datas.map((ite) => ({
        label: ite, value: ite
    }))

    const renderItem = ({ item }) => {
        console.log(item, 'in')
        return (
            <View>
                <Text>{item.name}</Text>
            </View>
        )
    }
    console.log(renderArray, 'arr')
    return (
        <View>
            <Text>WelcomeScreen</Text>
            {/* {console.log(fil.)} */}
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={valuechange}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Data Type' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setvalue(item.value);
                    setIsFocus(false);
                    if (item.value == 'unanswred') {
                        setrenderArray(fil.byname)
                    } else if (item.value == 'answered') {
                        setrenderArray(fil.byname)
                    } else {
                        setrenderArray(fil.byAge)
                    }
                }}
            />
            <FlatList
                data={renderArray}
                renderItem={(item) => renderItem(item)}
                keyExtractor={(ite, index) => index} />
        </View>
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
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
        fontSize: 12,
        color: 'black'
    }, errors: {
        color: 'red', fontSize: 12
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 12
    },
    userNameText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Quicksand',
    },
})