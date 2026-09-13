export const fetchRoute = async (storeLoc, customerLoc) => {
  try {
    // Call public OSRM for driving route
    const url = `https://router.project-osrm.org/route/v1/driving/${storeLoc.longitude},${storeLoc.latitude};${customerLoc.longitude},${customerLoc.latitude}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // OSRM returns GeoJSON coordinates as [longitude, latitude]
      const coordinates = route.geometry.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      return {
        coordinates,
        distanceMeters: route.distance, // in meters
        durationSeconds: route.duration, // in seconds
      };
    }
  } catch (error) {
    console.warn('OSRM routing failed, falling back to local dataset', error);
  }

  // Fallback route if OSRM fails
  const mockCoordinates = [
    { latitude: 26.9124, longitude: 75.7873 },
    { latitude: 26.9125, longitude: 75.7880 },
    { latitude: 26.9126, longitude: 75.7900 },
    { latitude: 26.9110, longitude: 75.7905 },
    { latitude: 26.9100, longitude: 75.7915 },
    { latitude: 26.9105, longitude: 75.7950 },
    { latitude: 26.9110, longitude: 75.7990 },
    { latitude: 26.9130, longitude: 75.8000 },
    { latitude: 26.9145, longitude: 75.8020 },
    { latitude: 26.9150, longitude: 75.8050 },
  ];

  return {
    coordinates: mockCoordinates,
    distanceMeters: 2400,
    durationSeconds: 12 * 60,
  };
};
