import { TealColors } from "@/constants/theme";
import type { EvacuationLocation } from "@/data/evacuation-locations";
import type { CrimeDataPoint, UserLocation } from "@/types/crime";
import React, { useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { IconSymbol } from "./ui/icon-symbol";
import { ThemedText } from "./themed-text";

interface GoogleMapProps {
  coordinates: { latitude: number; longitude: number }[];
  borderColor?: string;
  userLocation?: UserLocation | null;
  crimeData?: CrimeDataPoint[];
  evacuationLocations?: EvacuationLocation[];
  nearestEvacuationId?: string | null;
  isLoadingCrimeData?: boolean;
  onMapReady?: () => void;
  onMapPress?: () => void;
  onMarkerPress?: (marker: any) => void;
  focusTarget?: {
    latitude: number;
    longitude: number;
    zoomDelta?: number;
    key: string;
  } | null;
}

export function GoogleMap({
  coordinates,
  borderColor = "#60A5FA",
  userLocation,
  crimeData = [],
  evacuationLocations = [],
  nearestEvacuationId = null,
  isLoadingCrimeData = false,
  onMapReady,
  onMapPress,
  onMarkerPress,
  focusTarget,
}: GoogleMapProps) {
  const mapRef = useRef<MapView>(null);
  const boundaryPath = useMemo(() => {
    if (coordinates.length === 0) return [];
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    const isClosed =
      first.latitude === last.latitude && first.longitude === last.longitude;

    return isClosed ? coordinates : [...coordinates, first];
  }, [coordinates]);

  // Center on Quezon City
  const initialRegion = {
    latitude: 14.628,
    longitude: 121.044,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  const handleMapReady = () => {
    // Keep the full QC coverage boundary in view for reliable context.
    if (coordinates.length > 0) {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
        animated: false,
      });
    }

    onMapReady?.();
  };

  useEffect(() => {
    if (!focusTarget || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: focusTarget.latitude,
        longitude: focusTarget.longitude,
        latitudeDelta: focusTarget.zoomDelta ?? 0.03,
        longitudeDelta: focusTarget.zoomDelta ?? 0.03,
      },
      700
    );
  }, [focusTarget]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
        onPress={onMapPress}
        zoomEnabled
        scrollEnabled
        pitchEnabled
        rotateEnabled
      >
        {/* QC Boundary Polygon */}
        {coordinates.length > 0 && (
          <Polygon
            coordinates={coordinates}
            strokeColor="rgba(0,0,0,0)"
            strokeWidth={0}
            fillColor="rgba(96, 165, 250, 0.12)"
            lineDashPattern={[]}
          />
        )}

        {/* Dedicated QC border outline for strong visibility on all map styles */}
        {boundaryPath.length > 1 && (
          <Polyline
            coordinates={boundaryPath}
            strokeColor={borderColor}
            strokeWidth={4}
            geodesic
          />
        )}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
            description="Current position"
            onPress={() =>
              onMarkerPress?.({ type: "user", data: userLocation })
            }
          >
            <View style={styles.userMarkerWrap}>
              <View style={styles.userMarkerInner}>
                <IconSymbol name="person.fill" size={16} color="#ffffff" />
              </View>
            </View>
          </Marker>
        )}

        {/* Evacuation Site Markers */}
        {evacuationLocations.map((site) => {
          const isNearest = nearestEvacuationId === site.id;
          return (
            <Marker
              key={site.id}
              coordinate={{
                latitude: site.latitude,
                longitude: site.longitude,
              }}
              title={site.name}
              description={`${site.district} evacuation site`}
              onPress={() =>
                onMarkerPress?.({ type: "evacuation", data: site })
              }
            >
              <View
                style={[
                  styles.evacMarkerWrap,
                  isNearest ? styles.evacMarkerWrapNearest : null,
                ]}
              >
                <IconSymbol
                  name="building"
                  size={16}
                  color={isNearest ? "#ffffff" : "#7C2D12"}
                />
              </View>
            </Marker>
          );
        })}

        {/* Crime Data Markers */}
        {crimeData.map((crime, index) => (
          <Marker
            key={`crime-${index}`}
            coordinate={{ latitude: crime.lat, longitude: crime.lng }}
            title={`Crime Report ${index + 1}`}
            description={crime.date || "Recent incident"}
            pinColor="red"
            onPress={() => onMarkerPress?.({ type: "crime", data: crime })}
          />
        ))}
      </MapView>

      {/* Loading Overlay */}
      {isLoadingCrimeData && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={TealColors.primary} />
          <ThemedText style={styles.loadingText}>
            Loading crime data...
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  userMarkerWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(14, 116, 255, 0.24)",
    justifyContent: "center",
    alignItems: "center",
  },
  userMarkerInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0E74FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  evacMarkerWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FDBA74",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#9A3412",
  },
  evacMarkerWrapNearest: {
    backgroundColor: "#059669",
    borderColor: "#065F46",
  },
});
