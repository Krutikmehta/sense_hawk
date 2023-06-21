import React, {useState} from 'react';
import {Text} from 'react-native';
import Root from './Root';
export const AuthContext = React.createContext();

export default AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};
