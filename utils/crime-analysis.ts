/**
 * Crime Analysis Utilities
 * Analyzes crime data to determine safety levels
 */

import { calculateDistance, daysBetween } from './geo-utils';
import {
  SAFETY_THRESHOLDS,
  SAFETY_COLORS,
} from '@/constants/map-config';
import type { CrimeDataPoint, UserLocation, SafetyStatus } from '@/types/crime';

/**
 * Filter crimes to only include recent incidents
 * @param crimes - Array of crime data points
 * @param daysThreshold - Number of days to consider as "recent"
 * @returns Filtered array of recent crimes
 */
function filterRecentCrimes(
  crimes: CrimeDataPoint[],
  daysThreshold: number
): CrimeDataPoint[] {
  const now = new Date();
  const thresholdDate = new Date(
    now.getTime() - daysThreshold * 24 * 60 * 60 * 1000
  );

  return crimes.filter(crime => {
    const crimeDate = new Date(crime.date);
    return crimeDate >= thresholdDate;
  });
}

/**
 * Calculate distance-weighted color for a crime point
 * More recent and denser crimes get warmer (redder) colors
 * @param crime - Crime data point
 * @param allRecentCrimes - All recent crimes for density calculation
 * @returns RGBA color string
 */
function getCrimeColor(
  crime: CrimeDataPoint,
  allRecentCrimes: CrimeDataPoint[]
): string {
  // Count nearby crimes within 200m to determine density
  const nearbyCrimes = allRecentCrimes.filter(c =>
    calculateDistance(crime.lat, crime.lng, c.lat, c.lng) < 0.2
  );

  const density = nearbyCrimes.length;
  const daysAgo = daysBetween(new Date(crime.date), new Date());
  const isRecent = daysAgo < SAFETY_THRESHOLDS.recentCrimeThreshold;

  // Recent crimes get warmer colors (red), older crimes get cooler colors (orange)
  if (isRecent) {
    // Red - more intense for higher density
    const opacity = Math.min(0.2 + density * 0.1, 0.9);
    return `rgba(231, 76, 60, ${opacity})`;
  } else {
    // Orange - less intense
    const opacity = Math.min(0.15 + density * 0.08, 0.7);
    return `rgba(243, 156, 18, ${opacity})`;
  }
}

/**
 * Analyze safety at a given location based on nearby crime data
 * @param userLocation - User's current location
 * @param crimeData - Array of all crime data points
 * @returns SafetyStatus object with safety level and details
 */
export class CrimeAnalyzer {
  static analyzeSafety(
    userLocation: UserLocation,
    crimeData: CrimeDataPoint[]
  ): SafetyStatus {
    // Filter to recent crimes only
    const recentCrimes = filterRecentCrimes(
      crimeData,
      SAFETY_THRESHOLDS.recentDaysThreshold
    );

    if (recentCrimes.length === 0) {
      return {
        isSafe: true,
        level: 'safe',
        nearestCrimeDistance: Infinity,
        crimesNearby: 0,
        message: 'No crime data available for your area.',
        color: SAFETY_COLORS.safe,
      };
    }

    // Calculate distances to all crimes
    const crimesWithDistance = recentCrimes.map(crime => ({
      ...crime,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        crime.lat,
        crime.lng
      ),
    }));

    // Sort by distance (nearest first)
    crimesWithDistance.sort((a, b) => a.distance - b.distance);

    // Get nearest crime
    const nearestCrime = crimesWithDistance[0];
    const nearestDistance = nearestCrime.distance;

    // Count crimes in different safety zones
    const dangerZoneCrimes = crimesWithDistance.filter(
      c => c.distance <= SAFETY_THRESHOLDS.dangerRadius
    ).length;

    const cautionZoneCrimes = crimesWithDistance.filter(
      c => c.distance <= SAFETY_THRESHOLDS.cautionRadius
    ).length;

    const moderateZoneCrimes = crimesWithDistance.filter(
      c => c.distance <= SAFETY_THRESHOLDS.moderateRadius
    ).length;

    // Determine safety level based on crime counts and proximity
    if (dangerZoneCrimes >= 3) {
      return {
        isSafe: false,
        level: 'danger',
        nearestCrimeDistance: nearestDistance,
        crimesNearby: dangerZoneCrimes,
        message: `⚠️ High crime area: ${dangerZoneCrimes} incidents within 500m`,
        color: SAFETY_COLORS.danger,
      };
    }

    if (cautionZoneCrimes >= 5 || dangerZoneCrimes >= 1) {
      return {
        isSafe: false,
        level: 'caution',
        nearestCrimeDistance: nearestDistance,
        crimesNearby: cautionZoneCrimes,
        message: `⚠️ Exercise caution: ${cautionZoneCrimes} incidents within 1km`,
        color: SAFETY_COLORS.caution,
      };
    }

    if (moderateZoneCrimes >= 3) {
      return {
        isSafe: true,
        level: 'moderate',
        nearestCrimeDistance: nearestDistance,
        crimesNearby: moderateZoneCrimes,
        message: `⚠️ Moderate safety: ${moderateZoneCrimes} incidents within 2km`,
        color: SAFETY_COLORS.moderate,
      };
    }

    return {
      isSafe: true,
      level: 'safe',
      nearestCrimeDistance: nearestDistance,
      crimesNearby: moderateZoneCrimes,
      message: '✓ Area appears safe. Stay vigilant.',
      color: SAFETY_COLORS.safe,
    };
  }

  /**
   * Get circle properties for rendering crime on map
   * Larger and more opaque circles for denser areas
   * @param crime - Crime data point
   * @param allRecentCrimes - All recent crimes for density calculation
   * @returns Object with radius and fillColor
   */
  static getCrimeCircleProps(
    crime: CrimeDataPoint,
    allRecentCrimes: CrimeDataPoint[]
  ) {
    // Count nearby crimes within 200m
    const nearbyCrimes = allRecentCrimes.filter(c =>
      calculateDistance(crime.lat, crime.lng, c.lat, c.lng) < 0.2
    );

    const density = nearbyCrimes.length;

    return {
      latitude: crime.lat,
      longitude: crime.lng,
      radius: 50 + density * 20, // Larger circles for denser areas
      fillColor: getCrimeColor(crime, allRecentCrimes),
    };
  }

  /**
   * Calculate heatmap intensity at a given point
   * Used for rendering heatmap overlay
   * @param lat - Latitude
   * @param lng - Longitude
   * @param crimeData - Array of crime data points
   * @param radiusKm - Radius to search within
   * @returns Intensity value between 0 and 1
   */
  static getHeatmapIntensity(
    lat: number,
    lng: number,
    crimeData: CrimeDataPoint[],
    radiusKm: number = 1.0
  ): number {
    const nearbyCrimes = crimeData.filter(crime =>
      calculateDistance(lat, lng, crime.lat, crime.lng) <= radiusKm
    );

    if (nearbyCrimes.length === 0) return 0;

    // Weight recent crimes higher
    let totalWeight = 0;
    nearbyCrimes.forEach(crime => {
      const daysAgo = daysBetween(new Date(crime.date), new Date());
      const recencyWeight =
        daysAgo < 7
          ? 1.0
          : daysAgo < 30
            ? 0.7
            : daysAgo < 90
              ? 0.4
              : 0.1;
      totalWeight += recencyWeight;
    });

    // Normalize to 0-1 range
    return Math.min(totalWeight / 10, 1.0);
  }
}
