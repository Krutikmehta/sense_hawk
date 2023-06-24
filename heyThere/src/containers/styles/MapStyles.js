import {StyleSheet} from 'react-native';

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
  noLocationText: {
    fontSize: 20,
    fontWeight: 400,
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
  toggleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: '5%',
    alignItems: 'center',
  },
  toggleText: {
    color: 'white',
    fontSize: 15,
  },
});

export default styles;
