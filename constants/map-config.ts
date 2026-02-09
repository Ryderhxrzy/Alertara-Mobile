/**
 * Map Configuration & Styling
 */

import { TealColors } from './theme';
import type { MapRegion } from '@/types/crime';

/**
 * Default center of Quezon City, Philippines
 */
export const QC_CENTER: MapRegion = {
  latitude: 14.6760,
  longitude: 121.0437,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

/**
 * Light mode map style (default Google Maps)
 */
export const LIGHT_MAP_STYLE = [];

/**
 * Dark mode map style for better viewing at night
 */
export const DARK_MAP_STYLE = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#1d2c4d' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8ec3b9' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1a3646' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#4b6878' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8ec3b9' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#4b6878' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64779f' }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#4b6878' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [{ color: '#334e87' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [{ color: '#023e25' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [{ color: '#283d35' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#023e25' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3ee57e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#304a7d' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3751ff' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry.fill',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#0e1626' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
];

/**
 * Heatmap configuration
 */
export const HEATMAP_CONFIG = {
  radius: 40, // pixels
  opacity: 0.6,
};

/**
 * Safety level thresholds (in kilometers)
 */
export const SAFETY_THRESHOLDS = {
  dangerRadius: 0.5, // 500 meters
  cautionRadius: 1.0, // 1 kilometer
  moderateRadius: 2.0, // 2 kilometers
  recentDaysThreshold: 90, // Consider crimes within 90 days as recent
  recentCrimeThreshold: 30, // Days threshold for considering a crime "recent"
};

/**
 * Safety level colors and thresholds
 */
export const SAFETY_COLORS = {
  safe: '#27AE60', // Green
  moderate: '#F1C40F', // Yellow
  caution: '#F39C12', // Orange
  danger: '#E74C3C', // Red
};

/**
 * Crime severity colors for heatmap
 * Gradient from safe (green) to dangerous (red)
 */
export const CRIME_COLORS = {
  recentDanger: 'rgba(231, 76, 60, 0.8)', // Red for recent crimes
  recentWarning: 'rgba(241, 196, 15, 0.6)', // Yellow for moderately recent
  recentModerate: 'rgba(52, 152, 219, 0.4)', // Blue for older crimes
  oldDanger: 'rgba(243, 156, 18, 0.5)', // Orange for old crimes
};
