import {useContext, useEffect} from "react";
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Spinner from 'react-native-loading-spinner-overlay';

const SettingsScreen = ({navigation}) => {
    const {logout} = useContext(AuthContext);

    return (        
        <View style={Styles.container}>
            <View style={Styles.wrapper}>
                <Button title="Log Out" onPress={() => logout()} />                            
            </View>
        </View>
    )
}  

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper:{
        width: '80%'
    },
    link: {
        color: 'blue',
        fontWeight: 'bold',
        marginLeft: 5
    }
})

export default SettingsScreen;