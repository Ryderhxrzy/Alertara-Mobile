/**
 * QC Boundary Utility
 * Loads and converts QC boundary coordinates from GeoJSON
 */

import { qcGeoJson } from '@/data/qc-geojson';

export function getQCBoundaryCoordinates() {
  // Extract coordinates from the first feature (Polygon)
  const geoJsonCoordinates = qcGeoJson.features[0].geometry.coordinates[0];

  // Convert from GeoJSON [longitude, latitude] to react-native-maps {latitude, longitude}
  return geoJsonCoordinates.map((coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  }));
}
