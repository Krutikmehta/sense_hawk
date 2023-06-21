import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {db, firestore} from '../firebase.js';
import {
  ref,
  onValue,
  push,
  update,
  remove,
  set,
  query,
} from 'firebase/database';
import {GiftedChat} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';

import {
  collection,
  addDoc,
  setDoc,
  doc,
  where,
  getDocs,
  getDoc,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import {LeftAction, ChatInput, SendButton} from 'react-native-gifted-chat';
import Header from '../components/Header.js';

export default function Chat({navigation, route}) {
  const {conversationId: convId, userId1, userId2, userName} = route.params;

  const [conversationId, setConversationId] = useState(null);
  useEffect(() => {
    const getConversationId = async () => {
      const q1 = query(
        collection(firestore, 'conversations'),
        where('userId1', 'in', [userId1, userId2]),
        where('userId2', 'in', [userId1, userId2]),
      );
      const querySnapshot = await getDocs(q1);
      let conversationId = null;
      querySnapshot.forEach(doc => {
        conversationId = doc.id;
      });
      if (conversationId === null) {
        conversationId = uuid.v4();
        setConversationId(conversationId);
        await setDoc(doc(firestore, 'conversations', conversationId), {
          userId1,
          userId2,
        });
      } else {
        setConversationId(conversationId);
      }
    };
    if (!convId) getConversationId();
    else setConversationId(convId);
  }, [convId, userId1, userId2]);

  useEffect(() => {
    if (conversationId) {
      const q = query(
        collection(firestore, 'chats', conversationId, conversationId),
        orderBy('t_create', 'desc'),
      );
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const newMessages = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();

          const message = {
            _id: doc.id,
            text: data.text,
            createdAt: new Timestamp(
              data.t_create.seconds,
              data.t_create.nanoseconds,
            ).toDate(),
            user: {
              _id: data.sender,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          };
          newMessages.push(message);
        });
        setMessages(newMessages);
      });

      // return unsubscribe;
    }
  }, [conversationId]);

  const [messages, setMessages] = useState([]);

  const onSend = async (messages = []) => {
    await setDoc(
      doc(firestore, 'chats', conversationId, conversationId, messages[0]._id),
      {
        sender: userId1,
        text: messages[0].text,
        t_create: messages[0].createdAt,
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header text={userName} navigation={navigation} isBack={true} />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userId1,
        }}
      />
    </View>
  );
}
