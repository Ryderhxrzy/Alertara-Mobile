/**
 * Location Service
 * Handles location permissions and fetching user's current location
 */

import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';
import type { UserLocation } from '@/types/crime';

/**
 * Location Service
 * Manages location permissions and current position retrieval
 */
export class LocationService {
  /**
   * Request foreground location permissions from user
   * @returns true if permission is granted, false otherwise
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        console.log('Location permission granted');
        return true;
      }

      if (status === 'denied') {
        console.log('Location permission denied');
        return false;
      }

      // Status is 'undetermined' - permission already denied before
      console.log('Location permission previously denied');
      return false;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Check if user has already granted location permission
   * @returns true if permission exists, false otherwise
   */
  static async checkPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  }

  /**
   * Get user's current location
   * Requests permission if not already granted
   * @returns UserLocation or null if permission denied or location unavailable
   */
  static async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      // Check if permission is already granted
      const hasPermission = await this.checkPermission();

      if (!hasPermission) {
        // Request permission
        const granted = await this.requestPermissions();

        if (!granted) {
          console.log('Location permission not granted');
          this.showPermissionAlert();
          return null;
        }
      }

      // Get current position
      console.log('Getting current location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };

      console.log(
        'Current location:',
        userLocation.latitude,
        userLocation.longitude
      );

      return userLocation;
    } catch (error) {
      console.error('Failed to get location:', error);

      // Handle specific errors
      if (
        error instanceof Error &&
        error.message.includes('Location services are disabled')
      ) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings.'
        );
      }

      return null;
    }
  }

  /**
   * Show alert explaining why location permission is needed
   */
  private static showPermissionAlert(): void {
    Alert.alert(
      'Location Permission Required',
      'This feature needs your location to show safety information. Please enable location access in Settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]
    );
  }
}
