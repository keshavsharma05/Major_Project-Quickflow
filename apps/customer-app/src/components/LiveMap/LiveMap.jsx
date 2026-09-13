import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { calculateBearing } from '../../utils/calculateBearing';
import { mapConfig } from '../../config/mapConfig';

// We do not require a mapbox token because we are using OSM tiles
MapLibreGL.setAccessToken(null);

const LiveMap = ({ routeCoordinates, storeLoc, customerLoc, onProgress, onDelivered, durationSeconds }) => {
  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  // Bike state
  const [bikeCoord, setBikeCoord] = useState([storeLoc.longitude, storeLoc.latitude]);
  const [bikeBearing, setBikeBearing] = useState(0);

  // GeoJSON for route
  const routeGeoJSON = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length === 0) return null;
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates.map(c => [c.longitude, c.latitude]),
          },
        },
      ],
    };
  }, [routeCoordinates]);

  // Fit camera initially when route is loaded
  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0 && cameraRef.current) {
      const coords = routeCoordinates.map(c => [c.longitude, c.latitude]);
      
      // Calculate bounding box
      const minLng = Math.min(...coords.map(c => c[0]));
      const maxLng = Math.max(...coords.map(c => c[0]));
      const minLat = Math.min(...coords.map(c => c[1]));
      const maxLat = Math.max(...coords.map(c => c[1]));

      cameraRef.current.fitBounds(
        [maxLng, maxLat],
        [minLng, minLat],
        50, // padding
        1000 // duration
      );
    }
  }, [routeCoordinates]);

  // Start simulation
  useEffect(() => {
    if (!routeCoordinates || routeCoordinates.length === 0) return;

    let isActive = true;
    let currentIdx = 0;
    
    // We will animate segment by segment
    const animateSimulation = async () => {
      const totalPoints = routeCoordinates.length;
      
      // Calculate realistic timing based on actual duration if available, else fallback
      // For demo purposes, we will speed it up slightly (e.g., 2s per segment)
      const timePerSegment = 2000;

      for (let i = 0; i < totalPoints - 1; i++) {
        if (!isActive) return;
        
        const startP = routeCoordinates[i];
        const endP = routeCoordinates[i + 1];

        const bearing = calculateBearing(startP.latitude, startP.longitude, endP.latitude, endP.longitude);
        setBikeBearing(bearing);

        // Interpolate points smoothly
        const steps = 30; // 30 frames for 2 seconds (approx 15fps for map state is enough)
        const stepTime = timePerSegment / steps;
        
        for (let j = 1; j <= steps; j++) {
          if (!isActive) return;
          const lat = startP.latitude + (endP.latitude - startP.latitude) * (j / steps);
          const lng = startP.longitude + (endP.longitude - startP.longitude) * (j / steps);
          setBikeCoord([lng, lat]);
          
          // Optionally update camera slightly occasionally
          if (j % 15 === 0 && cameraRef.current) {
             cameraRef.current.setCamera({
               centerCoordinate: [lng, lat],
               heading: bearing,
               pitch: 45,
               animationDuration: 1000,
             });
          }

          await new Promise(res => setTimeout(res, stepTime));
        }

        // Report progress ETA
        const remainingSegments = totalPoints - 1 - (i + 1);
        const remainingMins = Math.max(1, Math.ceil((remainingSegments * timePerSegment) / 60000) + 1);
        onProgress(remainingSegments > 0 ? remainingMins : 0);
      }

      if (isActive) {
        onDelivered();
      }
    };

    animateSimulation();

    return () => {
      isActive = false;
    };
  }, [routeCoordinates]);

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView 
        ref={mapRef} 
        style={styles.map} 
        styleURL={mapConfig.styleURL}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapLibreGL.Camera ref={cameraRef} />

        {/* Route */}
        {routeGeoJSON && (
          <MapLibreGL.ShapeSource id="routeSource" shape={routeGeoJSON}>
            <MapLibreGL.LineLayer 
              id="routeLine" 
              style={{
                lineColor: '#15803D',
                lineWidth: 5,
                lineJoin: 'round',
                lineCap: 'round',
              }} 
            />
          </MapLibreGL.ShapeSource>
        )}

        {/* Store */}
        <MapLibreGL.PointAnnotation id="store" coordinate={[storeLoc.longitude, storeLoc.latitude]}>
          <View style={styles.storeMarker}>
            <Ionicons name="home" size={16} color="#FFF" />
          </View>
        </MapLibreGL.PointAnnotation>

        {/* Customer */}
        <MapLibreGL.PointAnnotation id="customer" coordinate={[customerLoc.longitude, customerLoc.latitude]}>
          <View style={styles.customerMarker}>
            <Ionicons name="location" size={24} color="#15803D" />
          </View>
        </MapLibreGL.PointAnnotation>

        {/* Bike */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <MapLibreGL.PointAnnotation id="bike" coordinate={bikeCoord}>
            <View style={[styles.bikeMarker, { transform: [{ rotate: `${bikeBearing}deg` }] }]}>
              <MaterialCommunityIcons name="moped" size={20} color="#FFF" />
            </View>
          </MapLibreGL.PointAnnotation>
        )}

      </MapLibreGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  storeMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  customerMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default LiveMap;
