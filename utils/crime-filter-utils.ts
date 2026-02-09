/**
 * Crime Data Filtering Utilities
 * Provides functions for filtering crime data by time range
 */

import { CrimeDataPoint, TimeFilterOption } from '@/types/crime';

/**
 * Get date threshold based on time filter option
 * @param filter - Time filter option: 'today', 'week', or 'month'
 * @returns Date threshold for filtering
 */
export function getDateThreshold(filter: TimeFilterOption): Date {
  const now = new Date();

  switch (filter) {
    case 'today':
      // Return start of today
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());

    case 'week':
      // Return date from 7 days ago
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo;

    case 'month':
      // Return date from 30 days ago
      const monthAgo = new Date(now);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return monthAgo;

    case 'alltime':
    default:
      // Return epoch (1970) to include all records
      return new Date(0);
  }
}

/**
 * Filter crime data by time range
 * @param data - Array of crime data points
 * @param filter - Time filter option
 * @returns Filtered array of crime data points
 */
export function filterCrimeDataByTime(
  data: CrimeDataPoint[],
  filter: TimeFilterOption
): CrimeDataPoint[] {
  const threshold = getDateThreshold(filter);

  return data.filter(point => {
    try {
      const crimeDate = new Date(point.date);
      return crimeDate >= threshold;
    } catch (error) {
      console.error('Error parsing crime date:', point.date, error);
      return false;
    }
  });
}

/**
 * Get a human-readable label for a time filter option
 * @param filter - Time filter option
 * @returns Label string
 */
export function getFilterLabel(filter: TimeFilterOption): string {
  switch (filter) {
    case 'today':
      return 'Today';
    case 'week':
      return 'Last 7 Days';
    case 'month':
      return 'Last 30 Days';
    case 'alltime':
      return 'All Time';
    default:
      return 'All Time';
  }
}
