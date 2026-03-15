import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { Colors, TealColors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { Header } from "@/components/header";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

type LatLng = {
  latitude: number;
  longitude: number;
};

const formatCoordsDescription = (coords: LatLng) =>
  `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`;

const formatAddress = (address: Location.LocationGeocodedAddress) => {
  return [
    address.name,
    address.street,
    address.district,
    address.city,
    address.subregion,
    address.region,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

export default function ReportScreen() {
  const { isDarkMode } = useTheme();
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High">("Medium");
  const [locationNote, setLocationNote] = useState("Detecting location...");
  const [showDetails, setShowDetails] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [locationCoords, setLocationCoords] = useState<LatLng>({
    latitude: 14.654459,
    longitude: 121.072997,
  });
  const [manualLock, setManualLock] = useState(false);
  const [locationWarning, setLocationWarning] = useState("");

  const background = isDarkMode ? Colors.dark.background : Colors.light.background;
  const cardBackground = isDarkMode ? "#152126" : "#ffffff";
  const borderColor = isDarkMode ? "#1f2b32" : "#e6e6e6";
  const accent = TealColors.primary;

  const refreshAddress = useCallback(
    async (coords: LatLng) => {
      try {
        const addresses = await Location.reverseGeocodeAsync(coords);
        if (addresses.length) {
          setLocationNote(formatAddress(addresses[0]));
          setLocationWarning("");
          return;
        }
      } catch {
        setLocationWarning("Precise address unavailable");
      }

      setLocationNote(formatCoordsDescription(coords));
    },
    []
  );

  const applyManualCoords = async (coords: LatLng) => {
    setLocationCoords(coords);
    await refreshAddress(coords);
  };

  const incidentTypes = [
    { id: "fire", label: "Fire", icon: "flame", color: "#f0543c" },
    { id: "medical", label: "Medical", icon: "bandage", color: "#8f44fd" },
    { id: "crime", label: "Crime", icon: "shield", color: "#e77a3e" },
    { id: "accident", label: "Accident", icon: "car-sport", color: "#2d98da" },
    { id: "flood", label: "Flood", icon: "drop", color: "#3a86ff" },
  ];
  const [selectedType, setSelectedType] = useState(incidentTypes[0].id);
  const quickPresets = [
    { label: "Report Fire Now", type: "fire", severity: "High" },
    { label: "Medical Alert", type: "medical", severity: "High" },
  ];

  const handlePreset = (preset: typeof quickPresets[number]) => {
    setSelectedType(preset.type);
    setSeverity(preset.severity as "Low" | "Medium" | "High");
    setSummary(`${preset.label} – urgent`);
    setDetails("Auto-filled template; add location notes if needed.");
  };

  const handleLocationToggle = () => {
    setManualLock((prev) => !prev);
  };

  const handleSubmit = () => {
    setConfirmation("Report sent to dispatch. Responders notified.");
    setShowDetails(false);
  };

  useEffect(() => {
    let subscribed = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (subscribed) {
          setLocationWarning("Location permission denied");
          setLocationNote("Enable location services to auto-fill");
        }
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      if (subscribed) {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocationCoords(coords);
        await refreshAddress(coords);
      }
    })();
    return () => {
      subscribed = false;
    };
    }, [refreshAddress]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <IconSymbol size={36} name="exclamationmark.triangle" color={TealColors.primary} />
          <View style={styles.heroText}>
            <ThemedText type="title" style={styles.title}>
              Report an Incident
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Details go straight to dispatch plus a confirmation summary.
            </ThemedText>
          </View>
        </View>
        <View style={styles.quickRow}>
          {quickPresets.map((preset) => (
            <Pressable
              key={preset.label}
              style={[styles.quickButton, { borderColor }]}
              onPress={() => handlePreset(preset)}
            >
              <ThemedText style={styles.quickText}>{preset.label}</ThemedText>
            </Pressable>
          ))}
        </View>
        <View style={[styles.sectionCard, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText style={styles.sectionTitle}>Incident Type</ThemedText>
          <View style={styles.typeRow}>
            {incidentTypes.map((type) => {
              const active = selectedType === type.id;
              return (
                <Pressable
                  key={type.id}
                  style={[
                    styles.typePill,
                    {
                      borderColor: active ? type.color : "#c4c8d5",
                      backgroundColor: active ? `${type.color}22` : "transparent",
                    },
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <IconSymbol name={type.icon} size={20} color={active ? type.color : "#555"} />
                  <ThemedText style={[styles.typeLabel, active && { color: type.color }]}>{type.label}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText style={styles.sectionTitle}>Location</ThemedText>
          <View style={styles.locationRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.locationLabel}>Current location</ThemedText>
              <ThemedText style={styles.locationValue}>{locationNote}</ThemedText>
            </View>
          </View>
          <MapView
            style={styles.mapPreview}
            region={{
              latitude: locationCoords.latitude,
              longitude: locationCoords.longitude,
              latitudeDelta: 0.004,
              longitudeDelta: 0.004,
            }}
            showsUserLocation
            onPress={(event) => {
              if (manualLock) {
                const coords = event.nativeEvent.coordinate;
                void applyManualCoords(coords);
              }
            }}
          >
            <Marker
              coordinate={locationCoords}
              pinColor={accent}
              draggable={manualLock}
              onDragEnd={(event) => {
                const coords = event.nativeEvent.coordinate;
                void applyManualCoords(coords);
              }}
            />
          </MapView>
          {locationWarning ? (
            <Text style={styles.locationWarning}>{locationWarning}</Text>
          ) : null}
          <Pressable style={[styles.lockButton, { borderColor }]} onPress={handleLocationToggle}>
            <IconSymbol name={manualLock ? "lock.open" : "lock"} size={16} color={accent} />
            <Text style={styles.lockText}>{manualLock ? "Manual pin" : "Auto GPS"}</Text>
          </Pressable>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText style={styles.sectionTitle}>Severity</ThemedText>
          <View style={styles.severityRow}>
            {["Low", "Medium", "High"].map((level) => {
              const active = severity === level;
              const color = level === "High" ? "#e53935" : level === "Medium" ? "#ff9800" : "#4caf50";
              return (
                <Pressable
                  key={level}
                  onPress={() => setSeverity(level as "Low" | "Medium" | "High")}
                  style={[
                    styles.severityPill,
                    { borderColor: color, backgroundColor: active ? `${color}22` : "transparent" },
                  ]}
                >
                  <ThemedText style={[styles.severityText, active && { color }]}>{level}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText style={styles.sectionTitle}>Add Details</ThemedText>
          <TextInput
            style={[styles.input, { color: isDarkMode ? "#fff" : "#111" }]}
            value={summary}
            onChangeText={setSummary}
            placeholder="Short summary"
            placeholderTextColor={isDarkMode ? "#6c6c70" : "#999"}
          />
          <TextInput
            style={[styles.input, styles.detailsInput, { color: isDarkMode ? "#fff" : "#111" }]}
            value={details}
            onChangeText={setDetails}
            placeholder="Optional notes"
            placeholderTextColor={isDarkMode ? "#6c6c70" : "#999"}
            multiline
          />
          <Pressable style={[styles.attachButton, { borderColor }]} onPress={() => setShowDetails((prev) => !prev)}>
            <IconSymbol name="camera" size={18} color={isDarkMode ? "#fff" : "#111"} />
            <Text style={styles.attachText}>{showDetails ? "Hide media" : "Attach photo / video"}</Text>
          </Pressable>
          {showDetails && (
            <ThemedText style={styles.noteText}>Camera ready · files stored locally until submit</ThemedText>
          )}
        </View>

        {confirmation ? (
          <ThemedText style={styles.confirmationText}>{confirmation}</ThemedText>
        ) : null}

      </ScrollView>
      <Pressable
        style={[styles.floatingButton, { backgroundColor: "#e53935" }]}
        onPress={handleSubmit}
      >
        <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#fff" />
        <Text style={styles.floatingText}>Submit Report</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    marginTop: 12,
  },
  heroText: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: "#7a7a7a",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  severityRow: {
    flexDirection: "row",
    gap: 12,
  },
  severityPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  severityText: {
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#d0d4db",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  detailsInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  attachText: {
    fontSize: 14,
    fontWeight: "600",
  },
  noteText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },
  confirmationText: {
    marginTop: 8,
    fontSize: 13,
    color: "#4caf50",
  },
  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  quickButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  quickText: {
    fontSize: 13,
    fontWeight: "600",
  },
  locationWarning: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 8,
  },
  lockButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  lockText: {
    fontSize: 12,
    fontWeight: "600",
  },
  mapPreview: {
    height: 140,
    borderRadius: 16,
    marginTop: 12,
    overflow: "hidden",
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 10,
  },
  floatingText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
