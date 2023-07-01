import {useContext, useState} from "react";
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from 'react-native-loading-spinner-overlay';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoading} = useContext(AuthContext);

    return (
        <View style={Styles.container}>
            <Spinner visible={isLoading} />
            <View style={Styles.wrapper}>
                <TextInput 
                    style={Styles.input} 
                    value={email} 
                    placeholder="Enter Email"
                    autoCapitalize="none"
                    onChangeText={text => setEmail(text)}
                />            
                <TextInput 
                    style={Styles.input} 
                    value={password} 
                    placeholder="Enter Password" 
                    autoCapitalize="none"
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                
                <Button title="Login" onPress={() => {
                    login(email, password)
                }} />

                <View style={Styles.lowerWrapper}>
                    <Text>Dont have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={Styles.link}>Register</Text>
                    </TouchableOpacity>
                </View>

            </View>            
        </View>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper:{
        width: '80%'
    },
    lowerWrapper:{
        flexDirection: 'row',
        marginTop: 15
    },
    input: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 5
    },
    link: {
        color: 'blue',
        fontWeight: 'bold',
        marginLeft: 5
    }
});

export default LoginScreen; 