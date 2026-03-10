/**
 * Safety Status Card Component
 * Displays current safety status at user's location
 */

import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { DARK_CARD_BG, LIGHT_CARD_BG, DARK_BORDER, LIGHT_BORDER } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';
import type { SafetyStatus } from '@/types/crime';

interface SafetyStatusCardProps {
  status: SafetyStatus;
}

export function SafetyStatusCard({ status }: SafetyStatusCardProps) {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG,
          borderColor: status.color,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.indicator, { backgroundColor: status.color }]} />
        <ThemedText style={styles.levelText}>
          {status.level.toUpperCase()}
        </ThemedText>
      </View>

      <ThemedText style={[styles.message, { color: status.color }]}>
        {status.message}
      </ThemedText>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Nearest Incident:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {status.nearestCrimeDistance === Infinity
              ? 'N/A'
              : `${status.nearestCrimeDistance.toFixed(2)} km`}
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Nearby (2km):</ThemedText>
          <ThemedText style={styles.detailValue}>
            {status.crimesNearby} incident{status.crimesNearby !== 1 ? 's' : ''}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 18,
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
});
