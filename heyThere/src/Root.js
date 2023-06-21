import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './containers/Home.js';
import Chat from './containers/Chat.js';
import {AuthContext} from './AuthProvider.js';
import Login from './containers/Login.js';
import Messages from './containers/Messages.js';
import Map from './containers/Map.js';

const Stack = createNativeStackNavigator();

export default function Root() {
  const {isLoggedIn, setIsLoggedIn} = React.useContext(AuthContext);

  useEffect(() => {
    const handlerUser = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setIsLoggedIn(userId !== null);
    };
    handlerUser();
  });
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Messages" component={Messages} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
