import {useContext, useEffect, useState} from "react";
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Spinner from 'react-native-loading-spinner-overlay';

const ChatScreen = ({navigation}) => {
    const {logout, UserInfo} = useContext(AuthContext);
    const { sendMessage, isLoading, getMessages, messages, subscribeToChannel} = useContext(ChatContext);
    
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        getMessages()
    }, []);

    return (        
        <View style={Styles.container}>
            <View style={Styles.wrapper}>
            <Spinner visible={isLoading} />
            <FlatList
                data={messages}
                scrollToEnd
                keyExtractor={({id}) => id}
                renderItem={({item}) => (
                    <Text
                        style={[Styles.message, UserInfo.userId === item.sender_id && Styles.sent]}
                    >
                        {item.message}
                    </Text>
                )}      
            />
                <View style={Styles.InputWrapper}>
                    <TextInput 
                        style={Styles.input} 
                        value={message} 
                        multiline
                        numberOfLines={2}
                        onChangeText={text => setMessage(text)}
                    /> 
                        <Button 
                            title="Send Messijj"
                            style={Styles.button} 
                            onPress={() => {
                                sendMessage(message)
                                setMessage('')
                            }}
                        />                            
                </View>
            </View>
        </View>
    )
}  

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 45
    },
    wrapper:{
        width: '80%'
    },
    input: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexGrow: 1
    },
    link: {
        color: 'blue',
        fontWeight: 'bold',
        marginLeft: 5
    },
    message: {
        margin: 5,
        padding: 8,
        flex: 1,
        backgroundColor: 'crimson',
        alignSelf: 'flex-start',
        borderRadius: 4,
        color: '#fff',
        maxWidth: '48%'
    },
    sent: {
        backgroundColor: 'teal',
        alignSelf: 'flex-end' 
    },
    InputWrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 8,
        gap: 8
    }
})

export default ChatScreen;