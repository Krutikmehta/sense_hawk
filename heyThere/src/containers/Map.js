//import liraries
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import MapboxGL, {MarkerView, PointAnnotation} from '@rnmapbox/maps';
import GetLocation from 'react-native-get-location';
import {db, firestore} from '../firebase.js';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  getDocs,
  where,
  Timestamp,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {query} from 'firebase/database';

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoia3J1dGlrbWVodGEiLCJhIjoiY2xqNWdrZWloMDB6YzNqbXBzZWcwMzBzaCJ9.b2DQjc4Sn-g21eSaNesmlg',
);

const distance = (lat1, lat2, lon1, lon2) => {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return c * r;
};
// create a component
const Map = ({navigation}) => {
  const [userId, setUserId] = useState(null);
  const [userLocation, setUserLocation] = useState([70, 20]);
  const [markersData, setMarkersData] = useState([]);
  const mapRef = useRef();

  const updateUserLocation = async (longitude, latitude) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        location: [longitude, latitude],
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  const getAllDocs = async () => {
    const q = query(collection(firestore, 'users'));
    const locations = [];
    const unsubscribe = onSnapshot(q, querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const dist = distance(
          data.location[1],
          userLocation[1],
          data.location[0],
          userLocation[0],
        );
        if (dist >= 0) {
          locations.push({...data});
        }
      });
      setMarkersData(locations);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getAllDocs();
    // return () => unsubscribe();
  }, [userLocation]);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setUserLocation([location.longitude, location.latitude]);
        updateUserLocation(location.longitude, location.latitude);
        mapRef.current.flyTo([location.longitude, location.latitude], 1200);
      })
      .catch(error => {
        const {code, message} = error;
        switch (code) {
          case 'UNAVAILABLE':
            Alert.alert('Location is OFF', 'Kindly Enable Location');
            break;
          case 'UNAUTHORIZED':
            Alert.alert(
              'Location access denies',
              'Kindly Grant Access to Location',
            );
        }
      });
  }, []);

  const RenderMarkers = ({data}) => {
    const onPress = () => {
      if (data.userId !== userId)
        navigation.navigate('Chat', {
          userId2: data.userId,
          userId1: userId,
          userName: data.userName,
        });
    };
    return (
      <MarkerView coordinate={data.location}>
        <TouchableOpacity onPress={onPress}>
          {data.userId === userId ? (
            <Text style={styles.markerTextSelf}>{'ME'}</Text>
          ) : (
            <Text style={styles.markerText}>{data.userName}</Text>
          )}
        </TouchableOpacity>
      </MarkerView>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapboxGL.MapView style={styles.map} showUserLocation={true}>
          {[userLocation, ...markersData].map((data, index) => (
            <RenderMarkers data={data} key={index} />
          ))}
          <MapboxGL.Camera ref={mapRef} zoomLevel={10} />
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  mapWrapper: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  markerTextSelf: {color: 'blue', fontSize: 20},
  markerText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 400,
  },
});

//make this component available to the app
export default Map;
