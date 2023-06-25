//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import {query} from 'firebase/database';
import {collection, onSnapshot, or, where} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {firestore} from '../firebase';
import Header from '../components/Header';
import styles from './styles/MessagesStyles';

// create a component
const Messages = ({navigation}) => {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    let unsubscribe = () => {};

    // get all the conversations
    const getConversations = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);

      const q = query(
        collection(firestore, 'conversations'),
        or(
          where(`user1.userId`, '==', userId),
          where('user2.userId', '==', userId),
        ),
      );

      // add listener for updates
      unsubscribe = onSnapshot(q, querySnapshot => {
        const tempConversations = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.user1.userId !== userId) {
            tempConversations.push({
              conversationId: doc.id,
              userName: data.user1.userName,
            });
          } else {
            tempConversations.push({
              conversationId: doc.id,
              userName: data.user2.userName,
            });
          }
        });
        setConversations(tempConversations);
        return unsubscribe;
      });
    };
    getConversations();

    // remove listener
    return () => {
      unsubscribe();
    };
  }, []);

  // message card
  const RenderCard = ({item, index}) => {
    const onPress = () => {
      navigation.navigate('Chat', {
        conversationId: item.conversationId,
        userName2: item.userName,
        userId1: userId,
      });
    };
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        <Text style={styles.userName}>{item.userName}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header text={'Messages'} isBack={true} navigation={navigation} />
      <FlatList
        style={styles.flatlist}
        data={conversations}
        renderItem={RenderCard}
      />
    </View>
  );
};

//make this component available to the app
export default Messages;
