import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState, useContext} from 'react';
import {firestore} from '../firebase.js';
import {setDoc, doc} from 'firebase/firestore';
import uuid from 'react-native-uuid';
import styles from './styles/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthProvider.js';

export default function Login() {
  const {setIsLoggedIn} = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const onChangeText = input => {
    setUserName(input);
  };

  const onSubmit = async () => {
    console.log(userName);
    try {
      const userId = uuid.v4();
      console.log(userId);
      await setDoc(doc(firestore, 'users', userId), {
        userName,
        userId: userId,
      });
      AsyncStorage.setItem('userId', userId);
      setIsLoggedIn(true);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <TextInput
          placeholder="Enter User Name"
          value={userName}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onSubmit}
        disabled={!userName || userName === ''}>
        <Text style={styles.text}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
