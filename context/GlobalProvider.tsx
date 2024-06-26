import React, { createContext, useContext, useState, useEffect } from "react";
import { Models} from 'react-native-appwrite';
import { getCurrentUser } from "../lib/appwrite";
import { Alert } from "react-native";

interface GlobalProviderProps{
    isLogged?: boolean;
    setIsLogged: (value:boolean) => void;
    user?: Models.Document| null;
    setUser: (value:Models.Document) => void;
    loading?: boolean;
};

const GlobalContext = createContext({} as GlobalProviderProps);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }:any) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState<any|null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser().then((user) => {
            if(user) {
                setIsLogged(true);
                setUser(user);
            } else {
                setIsLogged(false);
                setUser(null);
            }
        }).catch((error) => {
            Alert.alert("Global Provider Get Current User"+error.message);
        }).finally(() => {
            setLoading(false);
        });
    },[])


    return (
        <GlobalContext.Provider 
            value={{
                isLogged, 
                setIsLogged,
                user, 
                setUser, 
                loading
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
