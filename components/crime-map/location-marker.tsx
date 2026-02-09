/**
 * User Location Marker Component
 * Displays user's current location on map with pulsing animation
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Marker, Circle } from 'react-native-maps';
import { TealColors } from '@/constants/theme';
import type { UserLocation } from '@/types/crime';

interface LocationMarkerProps {
  location: UserLocation;
  accuracy?: number; // Accuracy radius in meters
}

export function LocationMarker({
  location,
  accuracy = 20,
}: LocationMarkerProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Create pulsing animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  // Interpolate opacity for pulsing effect
  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  return (
    <>
      {/* Accuracy circle */}
      <Circle
        center={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        radius={accuracy}
        fillColor="rgba(58, 118, 117, 0.1)"
        strokeColor={TealColors.primary}
        strokeWidth={1}
      />

      {/* Pulsing ring */}
      <Circle
        center={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        radius={40}
        fillColor="rgba(58, 118, 117, 0.05)"
        strokeColor={TealColors.primary}
        strokeWidth={2}
      />

      {/* Location marker */}
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="Your Location"
        pinColor={TealColors.primary}
      >
        <Animated.View
          style={[
            styles.markerContainer,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <View style={styles.markerInner} />
        </Animated.View>
      </Marker>
    </>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(58, 118, 117, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a7675',
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3a7675',
  },
});
