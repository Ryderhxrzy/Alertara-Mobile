import { GoogleMap } from "@/components/google-map";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TealColors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { evacuationLocations, type EvacuationLocation, floodProneBarangays } from "@/data/evacuation-locations";
import { LocationService } from "@/services/location/location-service";
import type { UserLocation } from "@/types/crime";
import { calculateDistance, formatDistance } from "@/utils/geo-utils";
import { getQCBoundaryCoordinates } from "@/utils/qc-boundary";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

export default function SafetyMapScreen() {
  const { isDarkMode } = useTheme();
  const [showLegend, setShowLegend] = useState(true);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState<any>(null);
  const [focusTarget, setFocusTarget] = useState<{
    latitude: number;
    longitude: number;
    zoomDelta?: number;
    key: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const qcBoundaryCoordinates = getQCBoundaryCoordinates();

  const nearestEvacuation = useMemo(() => {
    if (!userLocation) return null;

    let nearest: EvacuationLocation | null = null;
    let minDistance = Infinity;

    for (const site of evacuationLocations) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        site.latitude,
        site.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = site;
      }
    }

    if (!nearest || minDistance === Infinity) return null;
    return { site: nearest, distanceKm: minDistance };
  }, [userLocation]);

  // Fetch user location on mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await LocationService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          console.log("User location:", location);
        }
      } catch (error) {
        console.error("Failed to get location:", error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Map Area */}
      <View style={styles.mapContainer}>
        {isLoadingLocation ? (
          <ActivityIndicator size="large" color={TealColors.primary} />
        ) : (
          <GoogleMap
            coordinates={qcBoundaryCoordinates}
            borderColor="#60A5FA"
            userLocation={userLocation}
            crimeData={[]}
            evacuationLocations={evacuationLocations}
            nearestEvacuationId={nearestEvacuation?.site.id ?? null}
            isLoadingCrimeData={false}
            onMapPress={() => setShowInfoPanel(true)}
            onMarkerPress={(marker) => {
              setSelectedMarkerData(marker);
              setShowInfoPanel(true);
            }}
            focusTarget={focusTarget}
          />
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable
          style={[
            styles.quickActionButton,
            { backgroundColor: isDarkMode ? "#2d3748" : "#ffffff" },
          ]}
          onPress={() => {
            if (!userLocation) return;

            setFocusTarget({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              zoomDelta: 0.02,
              key: `find-me-${Date.now()}`,
            });
            setShowInfoPanel(true);
          }}
        >
          <IconSymbol name="person.fill" size={16} color="#0E74FF" />
          <ThemedText style={styles.quickActionText}>Find Me</ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.quickActionButton,
            { backgroundColor: isDarkMode ? "#2d3748" : "#ffffff" },
          ]}
          onPress={() => {
            if (!nearestEvacuation) return;

            setFocusTarget({
              latitude: nearestEvacuation.site.latitude,
              longitude: nearestEvacuation.site.longitude,
              zoomDelta: 0.025,
              key: `nearest-evac-${Date.now()}`,
            });
            setSelectedMarkerData({
              type: "evacuation",
              data: nearestEvacuation.site,
            });
            setShowInfoPanel(true);
          }}
        >
          <IconSymbol name="building" size={16} color="#B45309" />
          <ThemedText style={styles.quickActionText}>Nearest Evac</ThemedText>
        </Pressable>
      </View>

      {/* Legend Toggle Button */}
      <Pressable
        style={[
          styles.legendToggle,
          { backgroundColor: isDarkMode ? "#2d3748" : "#ffffff" },
        ]}
        onPress={() => setShowLegend(!showLegend)}
      >
        <IconSymbol
          name={showLegend ? "chevron.right" : "chevron.left"}
          size={20}
          color={TealColors.primary}
        />
        <ThemedText style={styles.legendToggleText}>
          {showLegend ? "Hide" : "Show"} Legend
        </ThemedText>
      </Pressable>

      {/* Legend Panel */}
      {showLegend && (
        <View
          style={[
            styles.legendPanel,
            { backgroundColor: isDarkMode ? "#1a202c" : "#f7fafc" },
          ]}
        >
          <ThemedText style={styles.legendTitle}>Crime Density</ThemedText>

          {/* Color Scale */}
          <View style={styles.colorScale}>
            <View style={[styles.colorBox, { backgroundColor: "#0000ff" }]} />
            <View style={[styles.colorBox, { backgroundColor: "#00ff00" }]} />
            <View style={[styles.colorBox, { backgroundColor: "#ffff00" }]} />
            <View style={[styles.colorBox, { backgroundColor: "#ff8800" }]} />
            <View style={[styles.colorBox, { backgroundColor: "#ff0000" }]} />
          </View>

          {/* Labels */}
          <View style={styles.legendLabels}>
            <ThemedText style={styles.legendLabel}>Low</ThemedText>
            <ThemedText style={styles.legendLabel}>High</ThemedText>
          </View>

          {/* Guide */}
          <ThemedText style={styles.legendGuide}>
            Blue = Low density | Red = High density
          </ThemedText>
        </View>
      )}

      {!showInfoPanel && (
        <View
          style={[
            styles.infoHint,
            { backgroundColor: isDarkMode ? "#2d3748" : "#ffffff" },
          ]}
        >
          <ThemedText style={styles.infoHintText}>
            Tap map or marker to show area information
          </ThemedText>
        </View>
      )}

      {/* Bottom Info Panel */}
      {showInfoPanel && (
        <View
          style={[
            styles.infoPanel,
            { backgroundColor: isDarkMode ? "#2d3748" : "#ffffff" },
          ]}
        >
          <View style={styles.infoPanelHeader}>
            <View style={styles.infoPanelTitleRow}>
              <IconSymbol name="location" size={24} color={TealColors.primary} />
              <ThemedText style={styles.infoPanelTitle}>
                Area Information
              </ThemedText>
            </View>
            <Pressable onPress={() => setShowInfoPanel(false)}>
              <IconSymbol
                name="xmark"
                size={18}
                color={isDarkMode ? "#e2e8f0" : "#4a5568"}
              />
            </Pressable>
          </View>

          <ThemedText style={styles.infoPanelSubtitle}>
            {selectedMarkerData?.type === "evacuation"
              ? `Selected Evac: ${selectedMarkerData.data.name}`
              : selectedMarkerData?.type === "user"
              ? "Your current location"
              : "Tap on map to view details"}
          </ThemedText>

          <View style={styles.infoPanelStats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Nearest Evac</ThemedText>
              <ThemedText style={styles.statValueSmall}>
                {nearestEvacuation ? nearestEvacuation.site.name : "--"}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Distance</ThemedText>
              <ThemedText style={styles.statValue}>
                {nearestEvacuation
                  ? formatDistance(nearestEvacuation.distanceKm)
                  : "--"}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.floodNote}>
            Flood-prone barangays: {floodProneBarangays.join(", ")}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  legendToggle: {
    position: "absolute",
    top: 20,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  legendToggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  legendPanel: {
    position: "absolute",
    top: 80,
    right: 16,
    width: 180,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  colorScale: {
    flexDirection: "row",
    height: 24,
    marginBottom: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  colorBox: {
    flex: 1,
  },
  legendLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  legendGuide: {
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.8,
  },
  quickActions: {
    position: "absolute",
    top: 20,
    left: 16,
    gap: 10,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoHint: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  infoHintText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.85,
  },
  infoPanel: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  infoPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoPanelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoPanelSubtitle: {
    fontSize: 13,
    marginBottom: 12,
    opacity: 0.7,
  },
  infoPanelStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: TealColors.primary,
  },
  statValueSmall: {
    fontSize: 12,
    fontWeight: "600",
    color: TealColors.primary,
    textAlign: "center",
  },
  floodNote: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.7,
  },
});
