import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles/HomeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Map')}>
        <Text style={styles.text}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Messages')}>
        <Text style={styles.text}>Messages</Text>
      </TouchableOpacity>
    </View>
  );
}
