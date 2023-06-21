//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import {query} from 'firebase/database';
import {collection, onSnapshot, or, where} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {firestore} from '../firebase';
import Header from '../components/Header';

// create a component
const Messages = ({navigation}) => {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    const getConversations = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const q = query(
        collection(firestore, 'conversations'),
        or(
          where(`user1.userId`, '==', userId),
          where('user2.userId', '==', userId),
        ),
      );
      const unsubscribe = onSnapshot(q, querySnapshot => {
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
        console.log(tempConversations);
      });
    };
    getConversations();
  }, []);

  const RenderCard = ({item, index}) => {
    const onPress = () => {
      navigation.navigate('Chat', {conversationId: item.conversationId});
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

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  flatlist: {
    flex: 1,
  },
  cardContainer: {
    padding: '3%',
    marginBottom: '2%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  userName: {
    fontSize: 20,
  },
});

//make this component available to the app
export default Messages;
