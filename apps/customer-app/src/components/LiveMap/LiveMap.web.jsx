import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const LiveMapWeb = () => {
  return (
    <View style={styles.container}>
      <Feather name="map" size={28} color="#9AA79E" />
      <Text style={styles.text}>Map is not supported on the web platform.</Text>
      <Text style={styles.subtext}>Please test on an Android/iOS emulator or physical device.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5EDE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#7C8A80',
  },
  subtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#9AA79E',
  }
});

export default LiveMapWeb;
