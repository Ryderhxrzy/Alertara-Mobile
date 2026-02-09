/**
 * Loading Spinner Component
 * Reusable loading indicator with optional message
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { TealColors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';

interface LoadingSpinnerProps {
  message?: string;
  overlay?: boolean;
}

export function LoadingSpinner({
  message = 'Loading...',
  overlay = true,
}: LoadingSpinnerProps) {
  const { isDarkMode } = useTheme();
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={[
        styles.container,
        overlay && {
          width,
          height,
          backgroundColor: isDarkMode
            ? 'rgba(26, 26, 26, 0.7)'
            : 'rgba(255, 255, 255, 0.7)',
        },
      ]}
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color={TealColors.primary} />
        {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  message: {
    fontSize: 14,
    marginTop: 8,
  },
});
