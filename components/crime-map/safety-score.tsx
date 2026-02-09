/**
 * Safety Score Component
 * Displays area safety rating and crime statistics for user's location
 */

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  DARK_BORDER,
  DARK_CARD_BG,
  LIGHT_BORDER,
  LIGHT_CARD_BG
} from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import type { CrimeDataPoint, SafetyStatus } from "@/types/crime";
import { calculateSafetyScore } from "@/utils/safety-utils";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface SafetyScoreProps {
  userLatitude: number;
  userLongitude: number;
  crimeData: CrimeDataPoint[];
  radiusKm?: number;
}

const LEVEL_CONFIG = {
  safe: {
    icon: "checkmark",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  moderate: {
    icon: "exclamationmark",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  caution: {
    icon: "exclamationmark",
    color: "#F97316",
    bgColor: "rgba(249, 115, 22, 0.1)",
  },
  danger: {
    icon: "xmark",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
};

export function SafetyScore({
  userLatitude,
  userLongitude,
  crimeData,
  radiusKm = 2,
}: SafetyScoreProps) {
  const { isDarkMode } = useTheme();

  // Calculate safety score based on crime data
  const safetyStatus = useMemo<SafetyStatus>(() => {
    return calculateSafetyScore(
      userLatitude,
      userLongitude,
      crimeData,
      radiusKm,
    );
  }, [userLatitude, userLongitude, crimeData, radiusKm]);

  const levelConfig = LEVEL_CONFIG[safetyStatus.level];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG,
          borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: levelConfig.bgColor },
          ]}
        >
          <IconSymbol
            name={levelConfig.icon}
            size={28}
            color={levelConfig.color}
          />
        </View>
        <View style={styles.headerContent}>
          <ThemedText style={styles.title}>Area Safety Score</ThemedText>
          <ThemedText style={[styles.levelText, { color: levelConfig.color }]}>
            {safetyStatus.level.toUpperCase()}
          </ThemedText>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <ThemedText style={styles.message}>{safetyStatus.message}</ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <IconSymbol
              name="exclamationmark"
              size={18}
              color={isDarkMode ? "#b0b0b0" : "#687076"}
            />
          </View>
          <View style={styles.statContent}>
            <ThemedText style={styles.statLabel}>Crimes Nearby</ThemedText>
            <ThemedText style={styles.statValue}>
              {safetyStatus.crimesNearby}
            </ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <IconSymbol
              name="location"
              size={18}
              color={isDarkMode ? "#b0b0b0" : "#687076"}
            />
          </View>
          <View style={styles.statContent}>
            <ThemedText style={styles.statLabel}>Nearest Incident</ThemedText>
            <ThemedText style={styles.statValue}>
              {safetyStatus.nearestCrimeDistance > 0
                ? safetyStatus.nearestCrimeDistance.toFixed(1) + " km"
                : "No data"}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  levelText: {
    fontSize: 13,
    fontWeight: "700",
  },
  messageContainer: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  statIconContainer: {
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
