import { TealColors } from "@/constants/theme";
import type { CrimeDataPoint, UserLocation } from "@/types/crime";
import React, { useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { ThemedText } from "./themed-text";

interface GoogleMapProps {
  coordinates: { latitude: number; longitude: number }[];
  borderColor?: string;
  userLocation?: UserLocation | null;
  crimeData?: CrimeDataPoint[];
  isLoadingCrimeData?: boolean;
  onMapReady?: () => void;
  onMarkerPress?: (marker: any) => void;
}

export function GoogleMap({
  coordinates,
  borderColor = TealColors.primary,
  userLocation,
  crimeData = [],
  isLoadingCrimeData = false,
  onMapReady,
  onMarkerPress,
}: GoogleMapProps) {
  const mapRef = useRef<MapView>(null);

  // Center on Quezon City
  const initialRegion = {
    latitude: 14.628,
    longitude: 121.044,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  const handleMapReady = () => {
    onMapReady?.();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
        zoomEnabled
        scrollEnabled
        pitchEnabled
        rotateEnabled
      >
        {/* QC Boundary Polygon */}
        {coordinates.length > 0 && (
          <Polygon
            coordinates={coordinates}
            strokeColor={borderColor}
            strokeWidth={2}
            fillColor="rgba(58, 118, 117, 0.1)"
            lineDashPattern={[]}
          />
        )}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="Current position"
            pinColor="blue"
            onPress={() =>
              onMarkerPress?.({ type: "user", data: userLocation })
            }
          />
        )}

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
});
