import {createContext, useState, useContext} from "react";
import { BASE_URL } from "../config";
import * as Ably  from 'ably';

import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const {isLoggedIn, UserInfo, logout} = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);

    const [chatId, setChatId] = useState('');
    const [messages, setMessages] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false); 

    const subscribeToChannel = (passedConversations) => {        
        var realtime =  new Ably.Realtime({
            authUrl: `${BASE_URL}/ably-connection-token`,
            authHeaders: {Authorization: `Bearer ${UserInfo.authToken}`},
        });
        var channel = realtime.channels.get(`presence:${UserInfo.email}`);
        
        realtime.connection.on('connected', () => {
            console.log('Connected to Ably!');
        });

        passedConversations.forEach(conversation => {
            console.log(conversation.name)
            channel.subscribe(conversation.name, function(member) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    member.data.message
                ])
            });
        });
    }

    const getConversations = () => {
        setIsLoading(true)
        fetch(`${BASE_URL}/get-conversations`,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${UserInfo.authToken}`,
            }
        })
        .then(response => response.json())
        .then(r => {
            setConversations(r.convos)
            subscribeToChannel(r.convos)
            setIsLoading(false)
        })
        .catch(e =>{
            logout();
            console.log(`Error ${e}`)

        })
    }
    
    const createConversation = () => {
        fetch(`${BASE_URL}/create-conversation`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${UserInfo.authToken}`,
            },
            body: JSON.stringify({
                reciever_email: 'test@email.com',
            })
        })
        .then(response => response.json())
        .then(r => {
            getConversations()
        })
        .catch(e =>{
            console.log(`Error ${e}`)

        })
    }

    const deleteConversation = () => {}

    const getMessages = () => {
        setIsLoading(true)
        // console.log(UserInfo)
        fetch(`${BASE_URL}/get-messages`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${UserInfo.authToken}`,
            },
            body: JSON.stringify({
                chat_id: chatId
            })
        })
        .then(response => response.json())
        .then(r => {
            setMessages(r.messages)
            setIsLoading(false)
        })
        .catch(e =>{
            console.log(`Error ${e}`)

        })
    }

    const sendMessage = (message) => {
        let data = {
            chat_id: chatId,
            message: message,
        }
        fetch(`${BASE_URL}/send-message`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${UserInfo.authToken}`,
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(r => {
            console.log(r)
            setMessages([
                ...messages,
                r
            ])
        })
        .catch(e => console.log(e))
    }

    return (
        <ChatContext.Provider value={{ isLoading, splashLoading, createConversation, conversations, getConversations, chatId, setChatId, messages, getMessages, sendMessage, subscribeToChannel}}>
            {children}
        </ChatContext.Provider>
    )
}