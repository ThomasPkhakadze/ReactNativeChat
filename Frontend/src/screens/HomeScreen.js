import {useContext, useEffect} from "react";
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity, FlatList } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Spinner from 'react-native-loading-spinner-overlay';

const HomeScreen = ({navigation}) => {
    const {logout} = useContext(AuthContext);
    const { createConversation, conversations, isLoading, getMessages, setChatId, getConversations, subscribeToChannel} = useContext(ChatContext);
    
    useEffect(() => {
        getConversations()
    }, []);

    return (        
        <View style={Styles.container}>
            <View style={Styles.wrapper}>
            <Spinner visible={isLoading} />
            <FlatList
                data={conversations}
                keyExtractor={({id}) => id}
                renderItem={({item}) => (
                    <View style={Styles.conversation}>
                        <Text onPress={() =>{
                            setChatId(item.name)
                            navigation.navigate('Chat')                            
                        }}>
                            {item.name}
                        </Text>
                    </View>
                )}      
            />
            </View>

        </View>
    )
}  

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 16
    },
    wrapper:{
        width: '80%'
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
    },
    conversation:{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#055',
        borderRadius: 3,
        paddingHorizontal: 6,
        paddingVertical: 8,
        marginBottom: 12
    }
})

export default HomeScreen;