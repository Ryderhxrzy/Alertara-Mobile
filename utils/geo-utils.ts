/**
 * Geographic Utilities
 * Helper functions for location and distance calculations
 */

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculate distance between two geographic points using Haversine formula
 * Returns distance in kilometers
 *
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate days between two dates
 * @param date1 - First date
 * @param date2 - Second date (defaults to current date)
 * @returns Number of days between dates
 */
export function daysBetween(date1: Date, date2: Date = new Date()): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format distance for display
 * @param distanceInKm - Distance in kilometers
 * @returns Formatted string (e.g., "0.5 km" or "500 m")
 */
export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
}

/**
 * Check if a point is within a circular radius
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param pointLat - Point's latitude
 * @param pointLon - Point's longitude
 * @param radiusKm - Radius in kilometers
 * @returns true if point is within radius, false otherwise
 */
export function isWithinRadius(
  userLat: number,
  userLon: number,
  pointLat: number,
  pointLon: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(userLat, userLon, pointLat, pointLon);
  return distance <= radiusKm;
}

/**
 * Get all points within a certain radius
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param points - Array of points with lat/lng
 * @param radiusKm - Radius in kilometers
 * @returns Array of points within radius
 */
export function getPointsWithinRadius<
  T extends { lat: number; lng: number }
>(
  userLat: number,
  userLon: number,
  points: T[],
  radiusKm: number
): T[] {
  return points.filter(point =>
    isWithinRadius(userLat, userLon, point.lat, point.lng, radiusKm)
  );
}

/**
 * Group points by proximity clusters
 * Simple clustering: points within clusterDistance are grouped together
 * @param points - Array of points with lat/lng
 * @param clusterDistanceKm - Distance threshold for clustering
 * @returns Array of clusters, each containing nearby points
 */
export function clusterPoints<T extends { lat: number; lng: number }>(
  points: T[],
  clusterDistanceKm: number = 0.5
): T[][] {
  if (points.length === 0) return [];

  const clusters: T[][] = [];
  const used = new Set<number>();

  for (let i = 0; i < points.length; i++) {
    if (used.has(i)) continue;

    const cluster: T[] = [points[i]];
    used.add(i);

    for (let j = i + 1; j < points.length; j++) {
      if (used.has(j)) continue;

      const distance = calculateDistance(
        points[i].lat,
        points[i].lng,
        points[j].lat,
        points[j].lng
      );

      if (distance <= clusterDistanceKm) {
        cluster.push(points[j]);
        used.add(j);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}
