import {useContext, useState} from "react";
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity } from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from "../context/AuthContext";

const RegisterScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {register, isLoading} = useContext(AuthContext);
    
    return (
        <View style={Styles.container}>
            <Spinner visible={isLoading} />
            <View style={Styles.wrapper}>
                <TextInput 
                    style={Styles.input} 
                    value={name} 
                    placeholder="Enter Name"
                    autoCapitalize="none"
                    onChangeText={text => setName(text)}
                />  
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
                
                <Button title="Register" onPress={() => {
                    register(name, email, password)
                }} />

                <View style={Styles.lowerWrapper}>
                    <Text>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={Styles.link}>Login</Text>
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

export default RegisterScreen; 