import AsyncStorage from "@react-native-async-storage/async-storage";
import react, {createContext, useState, useEffect} from "react";
import { BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [UserInfo, setUserInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);
  
    const register = (name, email, password) =>{
        setIsLoading(true);

        fetch(`${BASE_URL}/register`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(r => {
            setUserInfo(r)
            AsyncStorage.setItem('userInfo', JSON.stringify(r));

            setIsLoading(false)
        })
        .catch(e =>{
            console.log(`Error ${e}`)
        })
    }

    const login = (email, password) => {
        fetch(`${BASE_URL}/login`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(r => {
            setUserInfo(r)
            AsyncStorage.setItem('userInfo', JSON.stringify(r));
            setIsLoading(false)
        })
        .catch(e =>{
            console.log(`Error ${e}`)
        })
    }
    
    const logout = () => {
        console.log('hereLogout')
        fetch(`${BASE_URL}/logout`,{
            method: 'GET',
            headers: {
                headers: {Authorization: `Bearer ${UserInfo.authToken}`},
            } 
        }).then(() => {
            AsyncStorage.removeItem('userInfo');
            setUserInfo({});
            setIsLoading(false);
        })
    }

    const isLoggedIn = async () => {
        try{
            setSplashLoading(true);

            let cachedUserInfo = await AsyncStorage.getItem('userInfo');
            cachedUserInfo = JSON.parse(cachedUserInfo);
            
            if (cachedUserInfo) {
                setUserInfo(cachedUserInfo);
                // AsyncStorage.removeItem('userTokens')
            }
            
            setSplashLoading(false);

        } catch (e) {

            setSplashLoading(false);
            console.dir(`is logged in error ${e}`);
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, []);

    return (
        <AuthContext.Provider value={{register, login, UserInfo, isLoading, splashLoading, logout, isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}