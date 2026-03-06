import { GoogleMap } from "@/components/google-map";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TealColors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { barangayWeatherPoints } from "@/data/barangay-weather-points";
import { evacuationLocations, type EvacuationLocation, floodProneBarangays } from "@/data/evacuation-locations";
import { LocationService } from "@/services/location/location-service";
import type { UserLocation } from "@/types/crime";
import { calculateDistance, formatDistance } from "@/utils/geo-utils";
import { getQCBoundaryCoordinates } from "@/utils/qc-boundary";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

const EMPTY_CRIME_DATA: never[] = [];

// API Key for OpenWeatherMap (Should be in .env)
const OWM_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

const WeatherIcons = {
  sunny: require("../assets/images/weather-forecast-animation/weather_sunny.gif"),
  broken_clouds: require("../assets/images/weather-forecast-animation/weather_broken_clouds.gif"),
  mist: require("../assets/images/weather-forecast-animation/weather_mist.gif"),
  rain: require("../assets/images/weather-forecast-animation/weather_rain.gif"),
  rainy: require("../assets/images/weather-forecast-animation/weather_rainy.gif"),
  heavy_rain: require("../assets/images/weather-forecast-animation/weather_heavy_rain.gif"),
  snow: require("../assets/images/weather-forecast-animation/weather_snow.gif"),
  thunder: require("../assets/images/weather-forecast-animation/weather_thunder.gif"),
  thunderstorm: require("../assets/images/weather-forecast-animation/weather_thunderstorm.gif"),
  clear_day: require("../assets/images/weather-forecast-animation/weather_clear_day.gif"),
  // weather_default.gif is 0 bytes and causes Metro to crash. Using sunny as default.
  default: require("../assets/images/weather-forecast-animation/weather_sunny.gif"),
};

interface WeatherMarkerData {
  id: string;
  barangay: string;
  latitude: number;
  longitude: number;
  temperatureC: number | null;
  weatherLabel: string;
  weatherIcon: any;
  forecastTimeLabel: string | null;
}

const WEATHER_REFRESH_MS = 10 * 60 * 1000;
const WEATHER_REQUEST_TIMEOUT_MS = 12000;
const WEATHER_REQUEST_RETRIES = 2;

/**
 * OpenWeatherMap Condition Codes Mapping
 * Ref: https://openweathermap.org/weather-conditions
 */
function owmCodeToLabel(code: number | null | undefined): string {
  if (code === null || code === undefined) return "Unavailable";
  
  if (code >= 200 && code <= 232) return "Thunderstorm";
  if (code >= 300 && code <= 321) return "Drizzle";
  if (code >= 500 && code <= 531) return "Rain";
  if (code >= 600 && code <= 622) return "Snow";
  if (code >= 701 && code <= 781) return "Mist/Fog";
  if (code === 800) return "Clear Sky";
  if (code === 801) return "Few Clouds";
  if (code === 802) return "Scattered Clouds";
  if (code >= 803 && code <= 804) return "Overcast";
  
  return "Unknown";
}

function owmCodeToIcon(code: number | null | undefined): any {
  if (code === null || code === undefined) return WeatherIcons.default;

  // Thunderstorm
  if (code >= 200 && code <= 232) return WeatherIcons.thunderstorm;
  
  // Drizzle / Rain
  if (code >= 300 && code <= 321) return WeatherIcons.rain;
  if (code >= 500 && code <= 504) return WeatherIcons.rainy; // Light to moderate rain
  if (code >= 511 && code <= 531) return WeatherIcons.heavy_rain; // Heavy rain or freezing rain
  
  // Snow
  if (code >= 600 && code <= 622) return WeatherIcons.snow;
  
  // Atmosphere (Mist, Smoke, Haze, etc.)
  if (code >= 701 && code <= 781) return WeatherIcons.mist;
  
  // Clear
  if (code === 800) return WeatherIcons.sunny;
  
  // Clouds
  if (code === 801 || code === 802) return WeatherIcons.broken_clouds; // Partly cloudy
  if (code >= 803 && code <= 804) return WeatherIcons.broken_clouds; // More clouds
  
  return WeatherIcons.default;
}

function toUnavailableWeather(point: (typeof barangayWeatherPoints)[number]): WeatherMarkerData {
  return {
    id: point.id,
    barangay: point.barangay,
    latitude: point.latitude,
    longitude: point.longitude,
    temperatureC: null,
    weatherLabel: "Unavailable",
    weatherIcon: WeatherIcons.default,
    forecastTimeLabel: null,
  };
}

function pickNearestForecastSlot(list: any[]): any | null {
  if (!Array.isArray(list) || list.length === 0) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return list.find((item) => typeof item?.dt === "number" && item.dt >= nowSeconds) ?? list[0];
}

function formatForecastTimeLabel(dtSeconds: number | undefined): string | null {
  if (typeof dtSeconds !== "number") return null;

  const date = new Date(dtSeconds * 1000);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchForecastWithRetry(
  url: string,
  barangay: string,
  retries = WEATHER_REQUEST_RETRIES
): Promise<any> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEATHER_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Weather API 401: Key invalid or not yet activated. (It can take up to 2 hours for new OWM keys).");
        } else {
          console.error(`Weather API error: ${response.status} for ${barangay}`);
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      const isLastAttempt = attempt === retries;
      if (!isLastAttempt) {
        // Small backoff for transient mobile network failures.
        await delay(450 * (attempt + 1));
      }
    }
  }

  throw lastError ?? new Error(`Forecast fetch failed for ${barangay}`);
}

export default function SafetyMapScreen() {
  const { isDarkMode } = useTheme();
  const [showLegend, setShowLegend] = useState(true);
  const [layerVisibility, setLayerVisibility] = useState({
    alert: true,
    weather: true,
    evac: true,
  });
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
  const [weatherMarkers, setWeatherMarkers] = useState<WeatherMarkerData[]>([]);
  const isFetchingWeatherRef = useRef(false);
  const hasLoadedWeatherRef = useRef(false);
  const qcBoundaryCoordinates = useMemo(() => getQCBoundaryCoordinates(), []);

  const toggleLayer = useCallback((layer: "alert" | "weather" | "evac") => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  }, []);

  const activeEvacuationLocations = useMemo(
    () => (layerVisibility.evac ? evacuationLocations : []),
    [layerVisibility.evac]
  );

  const activeWeatherMarkers = useMemo(
    () => (layerVisibility.weather ? weatherMarkers : []),
    [layerVisibility.weather, weatherMarkers]
  );

  const floodProneText = useMemo(
    () => floodProneBarangays.join(", "),
    []
  );

  const quickActionsDynamicStyle = useMemo(
    () => ({ bottom: showInfoPanel ? 220 : 86 }),
    [showInfoPanel]
  );

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

  useEffect(() => {
    let mounted = true;
    let refreshTimer: ReturnType<typeof setInterval> | null = null;

    const fetchWeather = async ({ showLoadingState }: { showLoadingState: boolean }) => {
      if (!layerVisibility.weather || isFetchingWeatherRef.current) return;

      if (!OWM_API_KEY) {
        console.warn(
          "OpenWeatherMap API Key (EXPO_PUBLIC_OPENWEATHER_API_KEY) is missing in .env. Current OWM_API_KEY:",
          OWM_API_KEY
        );
        if (mounted) {
          setWeatherMarkers(barangayWeatherPoints.map(toUnavailableWeather));
          hasLoadedWeatherRef.current = true;
        }
        return;
      }

      isFetchingWeatherRef.current = true;

      if (mounted && showLoadingState) {
        setWeatherMarkers(
          barangayWeatherPoints.map((point) => ({
            id: point.id,
            barangay: point.barangay,
            latitude: point.latitude,
            longitude: point.longitude,
            temperatureC: null,
            weatherLabel: "Loading...",
            weatherIcon: WeatherIcons.default,
            forecastTimeLabel: null,
          }))
        );
      }

      try {
        const nextWeatherResults = await Promise.allSettled(
          barangayWeatherPoints.map(async (point) => {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${point.latitude}&lon=${point.longitude}&units=metric&appid=${OWM_API_KEY}`;
            const data = await fetchForecastWithRetry(url, point.barangay);
            const nearestSlot = pickNearestForecastSlot(data?.list);
            const temp = nearestSlot?.main?.temp;
            const weatherCode = nearestSlot?.weather?.[0]?.id;
            const forecastTimeLabel = formatForecastTimeLabel(nearestSlot?.dt);

            return {
              id: point.id,
              barangay: point.barangay,
              latitude: point.latitude,
              longitude: point.longitude,
              temperatureC: typeof temp === "number" ? Math.round(temp) : null,
              weatherLabel: owmCodeToLabel(weatherCode),
              weatherIcon: owmCodeToIcon(weatherCode),
              forecastTimeLabel,
            };
          })
        );

        if (mounted) {
          setWeatherMarkers(
            nextWeatherResults.map((result, index) => {
              if (result.status === "fulfilled") {
                return result.value;
              }

              const point = barangayWeatherPoints[index];
              console.error(`Failed to fetch forecast for ${point.barangay}:`, result.reason);
              return toUnavailableWeather(point);
            })
          );
          hasLoadedWeatherRef.current = true;
        }
      } catch (error) {
        console.error("Failed to fetch barangay forecasts:", error);
        if (mounted) {
          setWeatherMarkers(barangayWeatherPoints.map(toUnavailableWeather));
          hasLoadedWeatherRef.current = true;
        }
      } finally {
        isFetchingWeatherRef.current = false;
      }
    };

    fetchWeather({ showLoadingState: !hasLoadedWeatherRef.current });

    if (layerVisibility.weather) {
      refreshTimer = setInterval(() => {
        fetchWeather({ showLoadingState: false });
      }, WEATHER_REFRESH_MS);
    }

    return () => {
      mounted = false;
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [layerVisibility.weather]);

  const handleMapPress = useCallback(() => {
    setShowInfoPanel(true);
  }, []);

  const handleMarkerPress = useCallback((marker: any) => {
    setSelectedMarkerData(marker);
    setShowInfoPanel(true);
  }, []);

  const handleFindMe = useCallback(() => {
    if (!userLocation) return;

    setFocusTarget({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      zoomDelta: 0.02,
      key: `find-me-${Date.now()}`,
    });
    setShowInfoPanel(true);
  }, [userLocation]);

  const handleNearestEvac = useCallback(() => {
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
  }, [nearestEvacuation]);

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
            crimeData={layerVisibility.alert ? EMPTY_CRIME_DATA : EMPTY_CRIME_DATA}
            evacuationLocations={activeEvacuationLocations}
            weatherMarkers={activeWeatherMarkers}
            nearestEvacuationId={nearestEvacuation?.site.id ?? null}
            isLoadingCrimeData={false}
            onMapPress={handleMapPress}
            onMarkerPress={handleMarkerPress}
            focusTarget={focusTarget}
          />
        )}

      </View>

      {/* Quick Actions */}
      <View
        style={[
          styles.quickActions,
          quickActionsDynamicStyle,
        ]}
      >
        <Pressable
          style={[
            styles.quickActionButton,
            { backgroundColor: isDarkMode ? "#2d3748" : "#ffffff" },
          ]}
          onPress={handleFindMe}
        >
          <IconSymbol name="person.fill" size={16} color="#0E74FF" />
          <ThemedText style={styles.quickActionText}>Find Me</ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.quickActionButton,
            { backgroundColor: isDarkMode ? "#2d3748" : "#ffffff" },
          ]}
          onPress={handleNearestEvac}
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
          {showLegend ? "Hide" : "Show"} Layers & Legend
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

          <View style={styles.legendDivider} />
          <ThemedText style={styles.legendSectionTitle}>Map Layers</ThemedText>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => toggleLayer("alert")}
          >
            <View
              style={[
                styles.checkbox,
                layerVisibility.alert && styles.checkboxChecked,
              ]}
            >
              {layerVisibility.alert && (
                <IconSymbol name="checkmark" size={12} color="#ffffff" />
              )}
            </View>
            <ThemedText style={styles.checkboxLabel}>Alert</ThemedText>
          </Pressable>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => toggleLayer("weather")}
          >
            <View
              style={[
                styles.checkbox,
                layerVisibility.weather && styles.checkboxChecked,
              ]}
            >
              {layerVisibility.weather && (
                <IconSymbol name="checkmark" size={12} color="#ffffff" />
              )}
            </View>
            <ThemedText style={styles.checkboxLabel}>Weather Forecast</ThemedText>
          </Pressable>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => toggleLayer("evac")}
          >
            <View
              style={[
                styles.checkbox,
                layerVisibility.evac && styles.checkboxChecked,
              ]}
            >
              {layerVisibility.evac && (
                <IconSymbol name="checkmark" size={12} color="#ffffff" />
              )}
            </View>
            <ThemedText style={styles.checkboxLabel}>Evac Area</ThemedText>
          </Pressable>
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
              : selectedMarkerData?.type === "weather"
              ? `${selectedMarkerData.data.barangay}: ${selectedMarkerData.data.weatherLabel}${
                  selectedMarkerData.data.forecastTimeLabel
                    ? ` at ${selectedMarkerData.data.forecastTimeLabel}`
                    : ""
                }${
                  selectedMarkerData.data.temperatureC !== null
                    ? `, ${selectedMarkerData.data.temperatureC}\u00B0C`
                    : ""
                }`
              : selectedMarkerData?.type === "user"
              ? "Your current location"
              : "Tap on map to view details"}
          </ThemedText>

          {selectedMarkerData?.type === "weather" &&
            selectedMarkerData?.data?.weatherIcon && (
              <View style={styles.weatherPreviewContainer}>
                <Image
                  source={selectedMarkerData.data.weatherIcon}
                  style={styles.weatherPreviewImage}
                  contentFit="contain"
                />
              </View>
            )}

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
            Flood-prone barangays: {floodProneText}
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
  legendDivider: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.35)",
    marginVertical: 10,
  },
  legendSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: TealColors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: TealColors.primary,
  },
  checkboxLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  quickActions: {
    position: "absolute",
    right: 16,
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
  weatherPreviewContainer: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  weatherPreviewImage: {
    width: 120,
    height: 120,
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

