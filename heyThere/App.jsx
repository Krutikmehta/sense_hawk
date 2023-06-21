import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {db, firestore} from './src/firebase.js';
import {ref, onValue, push, update, remove, set} from 'firebase/database';
import {GiftedChat} from 'react-native-gifted-chat';
import {collection, addDoc} from 'firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Chat from './src/containers/Chat.js';
import Home from './src/containers/Home.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/containers/Login.js';
import AuthProvider, {AuthContext} from './src/AuthProvider.js';
import Root from './src/Root.js';

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
