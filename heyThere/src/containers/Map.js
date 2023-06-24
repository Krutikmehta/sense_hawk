//import liraries
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Alert, Switch} from 'react-native';
import MapboxGL, {MarkerView} from '@rnmapbox/maps';
import GetLocation from 'react-native-get-location';
import {firestore} from '../firebase.js';
import {collection, updateDoc, doc, onSnapshot} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {query} from 'firebase/database';
import styles from './styles/MapStyles.js';
import {distance} from '../utils/utils.js';
import {
  LOCATION_ACCESS_DENIED,
  LOCATION_DISABLED,
  THUMB_COLOR,
  TRACK_COLOR,
  UNAUTHORIZED,
  UNAVAILABLE,
} from '../utils/constants.js';
import Config from 'react-native-config';
MapboxGL.setAccessToken(Config.MAPBOX_PUBLIC_KEY);

// create a component
const Map = ({navigation}) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userLocation, setUserLocation] = useState([]);
  const [markersData, setMarkersData] = useState([]);
  const [range, setRange] = useState(1);
  const mapRef = useRef();

  const toggleRange = enabled => {
    if (enabled) setRange(Infinity);
    else setRange(1);
  };

  // update the users location in database
  const updateUserLocation = async (longitude, latitude) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        location: [longitude, latitude],
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  // get all users locations
  const getAllDocs = () => {
    const q = query(collection(firestore, 'users'));
    const locations = [];
    const unsubscribe = onSnapshot(q, querySnapshot => {
      try {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.userId === userId) {
            setUserName(data.userName);
          }
          if (
            data &&
            data.location &&
            data.location.length === 2 &&
            userLocation &&
            userLocation.length === 2
          ) {
            const dist = distance(
              data.location[1],
              userLocation[1],
              data.location[0],
              userLocation[0],
            );
            if (dist <= range) {
              locations.push({...data});
            }
          }
        });
        setMarkersData(locations);
      } catch (e) {
        console.log(e);
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (range === Infinity) {
      mapRef.current.zoomTo(4);
    }
  }, [range]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (userLocation && userLocation.length === 2 && userId) {
      updateUserLocation(userLocation[0], userLocation[1]).then(() => {
        unsubscribe = getAllDocs();
      });
    }
    return () => {
      unsubscribe();
    };
  }, [userLocation, userId, range]);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(userId => {
      setUserId(userId);
    });
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setUserLocation([location.longitude, location.latitude]);

        mapRef.current.moveTo([location.longitude, location.latitude], 1200);
        setTimeout(() => {
          mapRef.current.zoomTo(13);
        }, 1400);
      })
      .catch(error => {
        const {code, message} = error;
        switch (code) {
          case UNAVAILABLE:
            Alert.alert(LOCATION_DISABLED[0], LOCATION_DISABLED[1]);
            break;
          case UNAUTHORIZED:
            Alert.alert(LOCATION_ACCESS_DENIED[0], LOCATION_ACCESS_DENIED[1]);
        }
      });
  }, []);

  // render the users location
  const RenderMarkers = ({data}) => {
    if (!data.location) return null;
    const onPress = () => {
      if (data.userId !== userId)
        navigation.navigate('Chat', {
          userId2: data.userId,
          userId1: userId,
          userName1: userName,
          userName2: data.userName,
        });
    };

    return (
      <MarkerView coordinate={[data.location[0], data.location[1]]}>
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
        {userLocation.length === 0 && (
          <Text style={styles.noLocationText}>Location not available</Text>
        )}
        <MapboxGL.MapView style={styles.map}>
          {[...markersData].map((data, index) => (
            <RenderMarkers data={data} key={index} />
          ))}
          <MapboxGL.Camera ref={mapRef} />
        </MapboxGL.MapView>
        <View style={styles.toggleView}>
          <Text style={styles.toggleText}>
            {range === 1 ? 'Toggle to see all users' : 'Range set to 1km'}
          </Text>
          <Switch
            trackColor={{false: TRACK_COLOR[0], true: TRACK_COLOR[1]}}
            thumbColor={range !== 1 ? THUMB_COLOR[0] : THUMB_COLOR[1]}
            onValueChange={toggleRange}
            value={range !== 1}
          />
        </View>
      </View>
    </View>
  );
};

//make this component available to the app
export default Map;
