//import liraries
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapboxGL, {MarkerView, PointAnnotation} from '@rnmapbox/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoia3J1dGlrbWVodGEiLCJhIjoiY2xqNWdrZWloMDB6YzNqbXBzZWcwMzBzaCJ9.b2DQjc4Sn-g21eSaNesmlg',
);

// create a component
const Map = ({navigation}) => {
  const [markersData, setMarkersData] = useState([
    [0, 0],
    [100, 0],
  ]);

  const RenderMarkers = ({coordinate}) => {
    const onPress = () => {
      navigation.navigate('Chat', {userId: 10});
    };
    return (
      <MarkerView coordinate={coordinate}>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.markerText}>hi</Text>
        </TouchableOpacity>
      </MarkerView>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapboxGL.MapView style={styles.map}>
          {markersData.map((coordinate, index) => (
            <RenderMarkers coordinate={coordinate} key={index} />
          ))}
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
  markerText: {
    color: 'red',
    fontSize: 20,
  },
});

//make this component available to the app
export default Map;
