//import liraries
import React, {useNavigation} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
const backIcon = require('../../src/assets/icons/backIcon.jpg');
// create a component
const Header = ({text, isBack, navigation}) => {
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Image source={backIcon} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: '10%',
    width: '100%',
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 25,
    fontWeight: 300,
    color: 'white',
  },
});

//make this component available to the app
export default Header;
