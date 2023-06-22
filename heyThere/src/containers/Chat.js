import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {firestore} from '../firebase.js';
import {query} from 'firebase/database';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';

import {
  collection,
  setDoc,
  doc,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import Header from '../components/Header.js';
import styles from './styles/ChatStyles.js';

export default function Chat({navigation, route}) {
  const {
    conversationId: convId,
    userId1,
    userId2,
    userName1,
    userName2,
  } = route.params;

  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    // check if conversation id exists,
    // if not create one
    const getConversationId = async () => {
      const q1 = query(
        collection(firestore, 'conversations'),
        where('user1.userId', 'in', [userId1, userId2]),
        where('user2.userId', 'in', [userId1, userId2]),
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
          user1: {userId: userId1, userName: userName1},
          user2: {userId: userId2, userName: userName2},
        });
      } else {
        setConversationId(conversationId);
      }
    };
    if (!convId) getConversationId();
    else setConversationId(convId);
  }, [convId, userId1, userId2]);

  useEffect(() => {
    // get chats from conversation id
    if (conversationId) {
      const q = query(
        collection(firestore, 'chats', conversationId, conversationId),
        orderBy('t_create', 'desc'),
      );

      // add listener to get updates
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
              // avatar: 'https://placeimg.com/140/140/any',
            },
          };
          newMessages.push(message);
        });
        setMessages(newMessages);
      });

      // remove listener
      return () => {
        unsubscribe();
      };
    }
  }, [conversationId]);

  const [messages, setMessages] = useState([]);

  // send message
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
    <View style={styles.container}>
      <Header text={userName2} navigation={navigation} isBack={true} />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userId1,
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={styles.inputbar}
              textInputStyle={styles.textInput}
            />
          );
        }}
      />
    </View>
  );
}
