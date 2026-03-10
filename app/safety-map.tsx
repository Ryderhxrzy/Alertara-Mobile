import { GoogleMap } from "@/components/google-map";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TealColors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { barangayWeatherPoints } from "@/data/barangay-weather-points";
import { evacuationLocations, type EvacuationLocation } from "@/data/evacuation-locations";
import { LocationService } from "@/services/location/location-service";
import type { UserLocation } from "@/types/crime";
import { calculateDistance, formatDistance } from "@/utils/geo-utils";
import { getQCBoundaryCoordinates } from "@/utils/qc-boundary";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

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
  weatherIconUrl?: string | null;
  forecastTimeLabel: string | null;
  weeklyForecast: DailyForecast[];
}

interface DailyForecast {
  date: number;
  label: string;
  high: number;
  low: number;
  weatherLabel: string;
  weatherIcon: any;
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

  if (code >= 200 && code <= 232) return WeatherIcons.thunderstorm;
  if (code >= 300 && code <= 321) return WeatherIcons.rain;
  if (code >= 500 && code <= 504) return WeatherIcons.rainy;
  if (code >= 511 && code <= 531) return WeatherIcons.heavy_rain;
  if (code >= 600 && code <= 622) return WeatherIcons.snow;
  if (code >= 701 && code <= 781) return WeatherIcons.mist;
  if (code === 800) return WeatherIcons.sunny;
  if (code === 801 || code === 802) return WeatherIcons.broken_clouds;
  if (code >= 803 && code <= 804) return WeatherIcons.broken_clouds;

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
    weatherIconUrl: null,
    forecastTimeLabel: null,
    weeklyForecast: [],
  };
}

function compileWeeklyForecast(list?: any[]): DailyForecast[] {
  if (!Array.isArray(list)) return [];
  const days: Record<string, { item: any; targetHoursDiff: number }> = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split("T")[0];
    const targetHour = 12;
    const diff = Math.abs(date.getHours() - targetHour);
    const previous = days[dayKey];
    if (!previous || diff < previous.targetHoursDiff) {
      days[dayKey] = { item, targetHoursDiff: diff };
    }
  });

  return Object.values(days)
    .sort((a, b) => a.item.dt - b.item.dt)
    .slice(0, 7)
    .map(({ item }) => {
      const weatherCode = item?.weather?.[0]?.id;
      return {
        date: item.dt * 1000,
        label: new Date(item.dt * 1000).toLocaleDateString(undefined, {
          weekday: "short",
        }),
        high: Math.round(item?.main?.temp_max ?? item?.main?.temp ?? 0),
        low: Math.round(item?.main?.temp_min ?? item?.main?.temp ?? 0),
        weatherLabel: owmCodeToLabel(weatherCode),
        weatherIcon: owmCodeToIcon(weatherCode),
      } as DailyForecast;
    });
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
  const [showLegend, setShowLegend] = useState(false);
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
  const [weeklyForecast, setWeeklyForecast] = useState<DailyForecast[]>([]);
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

  const quickActionsDynamicStyle = useMemo(
    () => ({ bottom: showInfoPanel ? 170 : 86 }),
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

  const selectedMarkerMessage = useMemo(() => {
    if (selectedMarkerData?.type === "evacuation") {
      return `Selected evacuation center: ${selectedMarkerData.data.name}`;
    }

    if (selectedMarkerData?.type === "crime") {
      return "Reported alert near this point. Stay cautious.";
    }

    if (selectedMarkerData?.type === "weather") {
      return `${selectedMarkerData.data.barangay} weather snapshot`;
    }

    if (selectedMarkerData?.type === "user") {
      return "Your current location is shown on the map.";
    }

    return "Tap a marker to surface localized area information.";
  }, [selectedMarkerData]);

  useEffect(() => {
    if (selectedMarkerData?.type === "weather") {
      const weekly =
        selectedMarkerData.data?.weeklyForecast ??
        selectedMarkerData?.weeklyForecast ??
        [];
      if (weekly.length > 0) {
        setWeeklyForecast(weekly);
        return;
      }
    }

    const fallback =
      activeWeatherMarkers.find((marker) => marker.weeklyForecast.length > 0)
        ?.weeklyForecast ?? [];
    setWeeklyForecast(fallback);
  }, [selectedMarkerData, activeWeatherMarkers]);

  const selectedEvacuationDistanceLabel = useMemo(() => {
    if (selectedMarkerData?.type !== "evacuation") return null;
    if (!userLocation) return null;
    const { latitude, longitude } = selectedMarkerData.data;
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      latitude,
      longitude
    );
    return formatDistance(distance);
  }, [selectedMarkerData, userLocation]);

  const selectedCrimeDistanceLabel = useMemo(() => {
    if (selectedMarkerData?.type !== "crime") return null;
    if (!userLocation) return null;
    const { lat, lng } = selectedMarkerData.data;
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      lat,
      lng
    );
    return formatDistance(distance);
  }, [selectedMarkerData, userLocation]);

  const selectedCrimeDateLabel = useMemo(() => {
    if (selectedMarkerData?.type !== "crime") return null;
    const dateValue = selectedMarkerData.data?.date;
    if (!dateValue) return null;
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [selectedMarkerData]);

  const showWeatherSummary =
    !selectedMarkerData || selectedMarkerData?.type === "weather";

  const areaWeatherSummary = useMemo(() => {
    if (selectedMarkerData?.type === "weather") {
      return selectedMarkerData.data;
    }

    return activeWeatherMarkers[0] ?? null;
  }, [selectedMarkerData, activeWeatherMarkers]);

  const weatherTemperatureLabel =
    typeof areaWeatherSummary?.temperatureC === "number"
      ? `${areaWeatherSummary.temperatureC}\u00B0C`
      : "--\u00B0C";

  const weatherDescription =
    areaWeatherSummary?.weatherLabel ?? "Weather unavailable";

  const weatherDetailLine =
    areaWeatherSummary?.forecastTimeLabel
      ? `Forecast slot: ${areaWeatherSummary.forecastTimeLabel}`
      : "Weather updates every 10 minutes.";

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
              weatherIconUrl: null,
              forecastTimeLabel: null,
              weeklyForecast: [],
            }))
          );
        }

      try {
        const nextWeatherResults = await Promise.allSettled(
          barangayWeatherPoints.map(async (point) => {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${point.latitude}&lon=${point.longitude}&units=metric&appid=${OWM_API_KEY}`;
        const data = await fetchForecastWithRetry(url, point.barangay);
        const nearestSlot = pickNearestForecastSlot(data?.list);
        const weeklyData = compileWeeklyForecast(data?.list);
            const temp = nearestSlot?.main?.temp;
            const weatherCode = nearestSlot?.weather?.[0]?.id;
            const forecastTimeLabel = formatForecastTimeLabel(nearestSlot?.dt);

            const iconCode = nearestSlot?.weather?.[0]?.icon;
            const iconUrl = iconCode
              ? `https://openweathermap.org/img/wn/${iconCode}@4x.png`
              : null;

            return {
              id: point.id,
              barangay: point.barangay,
              latitude: point.latitude,
              longitude: point.longitude,
              temperatureC: typeof temp === "number" ? Math.round(temp) : null,
              weatherLabel: owmCodeToLabel(weatherCode),
              weatherIcon: owmCodeToIcon(weatherCode),
              weatherIconUrl: iconUrl,
              forecastTimeLabel,
              weeklyForecast: weeklyData,
            };
          })
        );

        if (mounted) {
            const markers = nextWeatherResults.map((result, index) => {
              if (result.status === "fulfilled") {
                return result.value;
              }

              const point = barangayWeatherPoints[index];
              console.error(`Failed to fetch forecast for ${point.barangay}:`, result.reason);
              return toUnavailableWeather(point);
            });
            setWeatherMarkers(markers);
            const fallbackWeekly =
              markers.find((marker) => marker.weeklyForecast.length > 0)?.weeklyForecast ?? [];
            setWeeklyForecast(fallbackWeekly);
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
              <IconSymbol name="location" size={20} color={TealColors.primary} />
              <ThemedText style={styles.infoPanelTitle}>
                Area Information
              </ThemedText>
            </View>
            <Pressable onPress={() => setShowInfoPanel(false)}>
              <IconSymbol
                name="xmark"
                size={16}
                color={isDarkMode ? "#e2e8f0" : "#4a5568"}
              />
            </Pressable>
          </View>

          <ThemedText style={styles.infoPanelSubtitle}>
            {selectedMarkerMessage}
          </ThemedText>

          {selectedMarkerData?.type === "evacuation" && (
            <View
              style={[
                styles.markerDetailCard,
                {
                  backgroundColor: isDarkMode ? "#0f172a" : "#e0f2fe",
                },
              ]}
            >
              <ThemedText style={styles.markerDetailLabel}>
                Evacuation center
              </ThemedText>
              <ThemedText
                style={[
                  styles.markerDetailValue,
                  { color: isDarkMode ? "#e0f2fe" : "#0f172a" },
                ]}
              >
                {selectedMarkerData.data.name}
              </ThemedText>
              <ThemedText
                style={[
                  styles.markerDetailMeta,
                  { color: isDarkMode ? "#cbd5f5" : "#0f172a" },
                ]}
              >
                {selectedMarkerData.data.district}
                {selectedEvacuationDistanceLabel
                  ? ` • ${selectedEvacuationDistanceLabel} away`
                  : ""}
              </ThemedText>
            </View>
          )}

          {selectedMarkerData?.type === "crime" && (
            <View
              style={[
                styles.markerDetailCard,
                {
                  backgroundColor: isDarkMode ? "#3b0d0d" : "#fee2e2",
                },
              ]}
            >
              <ThemedText style={styles.markerDetailLabel}>
                Incident alert
              </ThemedText>
              <ThemedText
                style={[
                  styles.markerDetailValue,
                  { color: isDarkMode ? "#fee2e2" : "#0f172a" },
                ]}
              >
                {selectedCrimeDateLabel ?? "Recent report"}
              </ThemedText>
              <ThemedText style={styles.markerDetailMeta}>
                {selectedCrimeDistanceLabel
                  ? `${selectedCrimeDistanceLabel} from you`
                  : "Tap marker to reposition the map"}
              </ThemedText>
            </View>
          )}

          {showWeatherSummary && (
            <View style={styles.weatherSummary}>
              <View style={styles.weatherIconWrap}>
                <Image
                  source={areaWeatherSummary?.weatherIcon ?? WeatherIcons.default}
                  style={styles.weatherSummaryIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.weatherSummaryText}>
                <ThemedText style={styles.weatherSummaryLocation}>
                  {areaWeatherSummary?.barangay ?? "Talayan"}
                </ThemedText>
                <View style={styles.weatherSummaryRow}>
                  <ThemedText style={styles.weatherSummaryTemp}>
                    {weatherTemperatureLabel}
                  </ThemedText>
                  <View style={styles.weatherSummaryDot} />
                  <ThemedText style={styles.weatherSummaryLabel}>
                    {weatherDescription}
                  </ThemedText>
                </View>
                <ThemedText style={styles.weatherSummaryDetail}>
                  {weatherDetailLine}
                </ThemedText>
              </View>
            </View>
          )}

          <View style={styles.floodHeaderRow}>
            <ThemedText style={styles.sectionLabel}>
              7-day weather outlook
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Predictions based on the current forecast
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forecastRow}
          >
            {weeklyForecast.length > 0 ? (
              weeklyForecast.map((day) => (
                <View
                  key={day.date}
                  style={[
                    styles.forecastCard,
                    {
                      backgroundColor: isDarkMode ? "#1e293b" : "#fff",
                      borderColor: isDarkMode ? "#334155" : "#e0e7ff",
                    },
                  ]}
                >
                  <Image
                    source={day.weatherIcon}
                    style={styles.forecastIcon}
                    resizeMode="contain"
                  />
                  <ThemedText style={styles.forecastDay}>{day.label}</ThemedText>
                  <ThemedText style={styles.forecastLabel}>
                    {day.weatherLabel}
                  </ThemedText>
                  <View style={styles.forecastTempRow}>
                    <ThemedText style={styles.forecastTempHigh}>
                      {day.high}°C
                    </ThemedText>
                    <ThemedText style={styles.forecastTempLow}>
                      {day.low}°C
                    </ThemedText>
                  </View>
                </View>
              ))
            ) : (
              <View
                style={[
                  styles.forecastCard,
                  {
                    backgroundColor: isDarkMode ? "#1e293b" : "#fff",
                    borderColor: isDarkMode ? "#334155" : "#e0e7ff",
                  },
                ]}
              >
                <ThemedText style={styles.forecastDay}>Forecast unavailable</ThemedText>
              </View>
            )}
          </ScrollView>
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
    paddingTop: 12,
    paddingBottom: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  infoPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoPanelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoPanelTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  infoPanelSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 6,
  },
  weatherSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  weatherIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  weatherSummaryIcon: {
    width: 42,
    height: 42,
  },
  weatherSummaryText: {
    flex: 1,
  },
  weatherSummaryLocation: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  weatherSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  weatherSummaryTemp: {
    fontSize: 24,
    fontWeight: "700",
    color: TealColors.primary,
  },
  weatherSummaryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5f5",
  },
  weatherSummaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    textTransform: "capitalize",
    marginLeft: 8,
  },
  weatherSummaryDetail: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 6,
  },
  markerDetailCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  markerDetailLabel: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "700",
    textTransform: "uppercase",
    color: TealColors.primary,
    marginBottom: 4,
  },
  markerDetailValue: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  markerDetailMeta: {
    fontSize: 11,
    opacity: 0.8,
  },
  floodHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 11,
    color: "#94a3b8",
  },
  forecastRow: {
    paddingVertical: 6,
  },
  forecastCard: {
    width: 100,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  forecastIcon: {
    width: 46,
    height: 46,
    marginBottom: 6,
  },
  forecastDay: {
    fontSize: 12,
    fontWeight: "600",
  },
  forecastLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },
  forecastTempRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  forecastTempHigh: {
    fontSize: 14,
    fontWeight: "700",
    color: TealColors.primary,
    marginRight: 6,
  },
  forecastTempLow: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
});
