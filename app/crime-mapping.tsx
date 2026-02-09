/**
 * Crime Map Screen
 * Shows overview of crime mapping service (map removed)
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  DARK_BORDER,
  DARK_CARD_BG,
  LIGHT_BORDER,
  LIGHT_CARD_BG,
  TealColors,
} from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { getQCBoundaryCoordinates } from "@/utils/qc-boundary";
import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE } from "react-native-maps";

// Helper function to calculate bounding box from coordinates
const calculateBounds = (coordinates: { latitude: number; longitude: number }[]) => {
  let minLat = coordinates[0]?.latitude || 0;
  let maxLat = coordinates[0]?.latitude || 0;
  let minLng = coordinates[0]?.longitude || 0;
  let maxLng = coordinates[0]?.longitude || 0;

  for (const coord of coordinates) {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  const latDelta = (maxLat - minLat) * 1.02;
  const lngDelta = (maxLng - minLng) * 1.02;

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: Math.max(latDelta, 0.01),
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
};

export default function CrimeMapScreen() {
  const { isDarkMode } = useTheme();
  const qcBoundaryCoordinates = getQCBoundaryCoordinates();
  const initialRegion = calculateBounds(qcBoundaryCoordinates);

  const features = [
    {
      title: "Crime Heatmap",
      description: "Visualize crime density across different areas",
      icon: "flame",
      color: "#EF4444",
    },
    {
      title: "QC Boundary",
      description: "View crime data within Quezon City limits",
      icon: "map",
      color: "#3B82F6",
    },
    {
      title: "Real-time Data",
      description: "Access up-to-date crime incident reports",
      icon: "clock",
      color: "#10B981",
    },
  ];

  const moreServices = [
    {
      title: "Submit Tip",
      icon: "chevron.right",
      color: "#3498DB",
    },
    {
      title: "Alerts",
      icon: "bell",
      color: "#3a7675",
    },
    {
      title: "Profile",
      icon: "person",
      color: "#9B59B6",
    },
    {
      title: "Settings",
      icon: "gear",
      color: "#F39C12",
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.heroIcon,
              { backgroundColor: "rgba(239, 68, 68, 0.1)" },
            ]}
          >
            <IconSymbol size={48} name="map" color="#EF4444" />
          </View>
          <ThemedText style={styles.heroTitle}>Crime Mapping</ThemedText>
          <ThemedText style={styles.heroDescription}>
            Explore crime incidents and safety patterns across Quezon City with
            our comprehensive mapping service.
          </ThemedText>
        </View>


        {/* Features Horizontal Scroll */}
        <View style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>Service Features</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuresScroll}
          >
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG,
                    borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                  },
                ]}
              >
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: `${feature.color}20` },
                  ]}
                >
                  <IconSymbol
                    size={24}
                    name={feature.icon}
                    color={feature.color}
                  />
                </View>
                <ThemedText style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <ThemedText style={styles.sectionTitle}>
            Quezon City Crime Map
          </ThemedText>
          <View
            style={[
              styles.mapContainer,
              {
                backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG,
                borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
              },
            ]}
          >
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              provider={PROVIDER_GOOGLE}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {/* QC Boundary */}
              <Polygon
                coordinates={qcBoundaryCoordinates}
                strokeColor={isDarkMode ? TealColors.primaryLight : TealColors.primary}
                strokeWidth={3}
                fillColor="transparent"
              />
            </MapView>
          </View>
        </View>

        {/* More Services Section */}
        <View style={styles.moreServicesSection}>
          <View style={styles.sectionTitleContainer}>
            <ThemedText style={styles.sectionTitle}>You May Also Like</ThemedText>
            <IconSymbol size={20} name="chevron.right" color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
          </View>
          <View style={styles.servicesGridCircle}>
            {moreServices.map((service, index) => (
              <Pressable
                key={index}
                style={styles.serviceIconOnly}
              >
                <View
                  style={[
                    styles.serviceIconCircle,
                    { backgroundColor: service.color },
                  ]}
                >
                  <IconSymbol
                    size={28}
                    name={service.icon}
                    color="#fff"
                  />
                </View>
                <ThemedText style={styles.serviceCardText}>
                  {service.title}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 16,
    opacity: 0.8,
  },
  featuresSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  featuresScroll: {
    flexGrow: 0,
  },
  featureCard: {
    width: 160,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginRight: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
  mapSection: {
    marginVertical: 16,
    marginBottom: 16,
  },
  mapContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: 550,
    borderRadius: 12,
  },
  sampleMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
    position: "absolute",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  moreServicesSection: {
    marginVertical: 16,
    marginBottom: 40,
  },
  servicesGridCircle: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  serviceIconOnly: {
    flex: 1,
    alignItems: "center",
  },
  serviceIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceCardText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
