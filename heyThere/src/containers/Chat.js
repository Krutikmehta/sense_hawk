import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {db, firestore} from '../firebase.js';
import {ref, onValue, push, update, remove, set} from 'firebase/database';
import {GiftedChat} from 'react-native-gifted-chat';
import {collection, addDoc} from 'firebase/firestore';

export default function Chat() {
  const func = async () => {
    push(ref(db, '/users'), {
      1245: {
        done: false,
        title: 'presentTodo1',
      },
    });

    try {
      const docRef = await addDoc(collection(firestore, 'users'), {
        first: 'Ada',
        last: 'Lovelace',
        born: 1815,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    console.log(firestore);
    console.log(db.type);
  };
  useEffect(() => {
    func();
    return onValue(ref(db, '/users'), querySnapShot => {
      let data = querySnapShot.val() || {};
      let todoItems = {...data};
      console.log(todoItems);
    });
  }, []);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  };

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
