/**
 * Crime API Service
 * Handles fetching crime data from the backend API
 */

import { CrimeDataPoint } from '@/types/crime';

export class CrimeApiService {
  private static readonly API_URL = 'https://crime-analytics.alertaraqc.com/api/crime-heatmap';

  /**
   * Fetch crime heatmap data from API
   * @returns Promise<CrimeDataPoint[]> - Array of crime data points
   * @throws Error if API request fails
   */
  static async fetchCrimeHeatmap(): Promise<CrimeDataPoint[]> {
    try {
      console.log('Fetching crime data from API...');

      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);

      // Handle different response formats
      if (Array.isArray(data)) {
        // Direct array format
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        // Nested data property
        return data.data;
      } else if (data.features && Array.isArray(data.features)) {
        // GeoJSON format
        return data.features.map((feature: any) => ({
          lat: feature.geometry?.coordinates?.[1],
          lng: feature.geometry?.coordinates?.[0],
          date: feature.properties?.date || new Date().toISOString().split('T')[0]
        }));
      }

      // If we get here, the data format is not recognized
      throw new Error('Invalid data format received from API');
    } catch (error) {
      console.error('Failed to fetch crime data:', error);
      throw error;
    }
  }
}
