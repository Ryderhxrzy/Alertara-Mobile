/**
 * Safety Score Calculation Utilities
 * Calculates area safety assessment based on crime data
 */

import type { CrimeDataPoint, SafetyStatus } from "@/types/crime";
import { calculateDistance } from "./geo-utils";

/**
 * Calculate safety score for a given location based on nearby crime data
 * @param userLat - User's latitude
 * @param userLng - User's longitude
 * @param crimeData - Array of crime data points
 * @param radiusKm - Search radius in kilometers
 * @returns Safety status assessment
 */
export function calculateSafetyScore(
  userLat: number,
  userLng: number,
  crimeData: CrimeDataPoint[],
  radiusKm: number = 2,
): SafetyStatus {
  // Filter crimes within radius
  const nearbyCrimes = crimeData.filter((crime) => {
    const distance = calculateDistance(userLat, userLng, crime.lat, crime.lng);
    return distance <= radiusKm;
  });

  const crimeCount = nearbyCrimes.length;

  // Find nearest crime
  let nearestCrimeDistance = Infinity;
  if (crimeData.length > 0) {
    for (const crime of crimeData) {
      const distance = calculateDistance(
        userLat,
        userLng,
        crime.lat,
        crime.lng,
      );
      if (distance < nearestCrimeDistance) {
        nearestCrimeDistance = distance;
      }
    }
  }

  // Determine safety level based on crime count in radius
  let level: "safe" | "moderate" | "caution" | "danger";
  let message: string;
  let color: string;
  let isSafe: boolean;

  if (crimeCount === 0) {
    level = "safe";
    message = `No reported crimes within ${radiusKm}km. This area appears to be safe.`;
    color = "#10B981";
    isSafe = true;
  } else if (crimeCount <= 2) {
    level = "moderate";
    message = `${crimeCount} crime${crimeCount > 1 ? "s" : ""} reported within ${radiusKm}km. Exercise normal caution.`;
    color = "#F59E0B";
    isSafe = true;
  } else if (crimeCount <= 5) {
    level = "caution";
    message = `${crimeCount} crimes reported within ${radiusKm}km. Increased caution advised.`;
    color = "#F97316";
    isSafe = false;
  } else {
    level = "danger";
    message = `${crimeCount} crimes reported within ${radiusKm}km. High caution recommended.`;
    color = "#EF4444";
    isSafe = false;
  }

  return {
    isSafe,
    level,
    nearestCrimeDistance:
      nearestCrimeDistance === Infinity ? 0 : nearestCrimeDistance,
    crimesNearby: crimeCount,
    message,
    color,
  };
}
