import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {


    const [isAuthenticate,setIsAuthenticate] =useState(true);
    // localStorage.getItem('Token')
    
    const [roleType,setRoleType] =useState(0);
    // localStorage.getItem('roleType')


    const Authlogin =()=>{
      // setIsAuthenticate(true)
    }
  return (
    <AuthContext.Provider value={{isAuthenticate ,Authlogin,setIsAuthenticate,roleType,setRoleType}} >
        {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () =>{
    return useContext(AuthContext);
}