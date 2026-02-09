/**
 * Crime Map Feature Type Definitions
 */

/**
 * Individual crime data point with location and timestamp
 */
export interface CrimeDataPoint {
  lat: number;
  lng: number;
  date: string; // ISO 8601 format "YYYY-MM-DD"
}

/**
 * User's current location
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

/**
 * Safety assessment for a given location
 */
export interface SafetyStatus {
  isSafe: boolean;
  level: 'safe' | 'moderate' | 'caution' | 'danger';
  nearestCrimeDistance: number; // in kilometers
  crimesNearby: number;
  message: string;
  color: string;
}

/**
 * Map region for MapView
 */
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * Crime circle props for rendering on map
 */
export interface CrimeCircleProps {
  latitude: number;
  longitude: number;
  radius: number;
  fillColor: string;
}
