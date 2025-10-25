import React, { createContext } from 'react'
export const authContextData = createContext();

const AuthContext = ({children}) => {

    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    let value = {
        serverUrl
    }
    
  return (
    <div>
        <authContextData.Provider value={value}>
            {children}
        </authContextData.Provider>
    </div>
  )
}

export default AuthContext
