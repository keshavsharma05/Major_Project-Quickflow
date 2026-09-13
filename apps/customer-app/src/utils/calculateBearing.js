export function calculateBearing(startLat, startLng, destLat, destLng) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const toDegrees = (rad) => (rad * 180) / Math.PI;

  const lat1 = toRadians(startLat);
  const lat2 = toRadians(destLat);
  const dLng = toRadians(destLng - startLng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const brng = toDegrees(Math.atan2(y, x));
  return (brng + 360) % 360;
}
