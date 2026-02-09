/**
 * Crime Data API Service
 */

import { apiClient } from './api-config';
import type { CrimeDataPoint } from '@/types/crime';

/**
 * Validates that crime data has required fields and valid coordinates
 */
const validateCrimeData = (data: any[]): CrimeDataPoint[] => {
  return data.filter(item => {
    const isValid =
      typeof item.lat === 'number' &&
      typeof item.lng === 'number' &&
      typeof item.date === 'string' &&
      item.lat >= -90 &&
      item.lat <= 90 &&
      item.lng >= -180 &&
      item.lng <= 180 &&
      !isNaN(Date.parse(item.date));

    if (!isValid) {
      console.warn('Skipping invalid crime data point:', item);
    }

    return isValid;
  });
};

/**
 * Crime API Service
 * Handles all crime data related API calls
 */
export class CrimeApiService {
  /**
   * Fetch crime heatmap data from API
   * @returns Array of crime data points
   * @throws Error if API request fails
   */
  static async fetchCrimeHeatmap(): Promise<CrimeDataPoint[]> {
    try {
      console.log('Fetching crime heatmap data...');

      const response = await apiClient.get<any[]>('/crime-heatmap');

      // Validate response data
      const validatedData = validateCrimeData(response.data);

      console.log(
        `Fetched ${validatedData.length} valid crime data points (${response.data.length - validatedData.length} invalid)`
      );

      return validatedData;
    } catch (error) {
      console.error('Failed to fetch crime heatmap:', error);
      throw error;
    }
  }
}
