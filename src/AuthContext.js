import React, { createContext, useState } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [shopname, setShopname] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    // Function to handle user login
    const login = (username, token) => {
       
        setUser(username);
        setIsLoggedIn(true);
        setToken(token);
        console.log(token);
        localStorage.setItem('auth_token',token);
        localStorage.setItem('user',username);

    };
    
    const shopnae = (passedin) => {
        setShopname(passedin);
    };

    // Function to handle user logout
    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        setToken(null);
    };

    // Provide the user and login/logout functions to the child components
    const authContextValue = {
        user,
        shopname,
        isLoggedIn,
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
