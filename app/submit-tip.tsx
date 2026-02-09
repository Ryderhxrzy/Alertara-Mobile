/**
 * Submit Tip Screen
 * Allows users to submit anonymous crime tips
 */

import { useState } from "react";
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
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function SubmitTipScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const [crimeType, setCrimeType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!crimeType.trim() || !location.trim() || !description.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API endpoint
      // For now, just simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        "Thank You",
        "Your anonymous tip has been submitted successfully. We appreciate your help in keeping our community safe.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit tip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCrimeType("");
    setLocation("");
    setDescription("");
    setDate("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol
              name="arrow.left"
              size={24}
              color={isDarkMode ? "#60A5FA" : "#3B82F6"}
            />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Submit Anonymous Tip</ThemedText>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View
              style={[
                styles.heroIcon,
                { backgroundColor: "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <IconSymbol size={48} name="info" color="#3B82F6" />
            </View>
            <ThemedText style={styles.heroTitle}>Report a Crime Safely</ThemedText>
            <ThemedText style={styles.heroDescription}>
              Your anonymity is protected. Help us keep your community safe by
              reporting crime information.
            </ThemedText>
          </View>

          {/* Form Section */}
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG,
                borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
              },
            ]}
          >
            {/* Crime Type */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Crime Type <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                    color: isDarkMode ? "#fff" : "#000",
                  },
                ]}
                placeholder="e.g., Robbery, Theft, Assault..."
                placeholderTextColor={isDarkMode ? "#999" : "#999"}
                value={crimeType}
                onChangeText={setCrimeType}
                editable={!isSubmitting}
              />
              <ThemedText style={styles.hint}>
                What type of crime did you witness or learn about?
              </ThemedText>
            </View>

            {/* Location */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Location <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                    color: isDarkMode ? "#fff" : "#000",
                  },
                ]}
                placeholder="e.g., Barangay name, Street, Area..."
                placeholderTextColor={isDarkMode ? "#999" : "#999"}
                value={location}
                onChangeText={setLocation}
                editable={!isSubmitting}
              />
              <ThemedText style={styles.hint}>
                Where did this incident occur?
              </ThemedText>
            </View>

            {/* Date/Time */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Date & Time</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                    color: isDarkMode ? "#fff" : "#000",
                  },
                ]}
                placeholder="e.g., Today at 10:30 PM"
                placeholderTextColor={isDarkMode ? "#999" : "#999"}
                value={date}
                onChangeText={setDate}
                editable={!isSubmitting}
              />
              <ThemedText style={styles.hint}>
                When did this occur? (Optional)
              </ThemedText>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Details <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                    color: isDarkMode ? "#fff" : "#000",
                  },
                ]}
                placeholder="Describe what happened in detail. Include any information that might help (suspect description, vehicle details, etc.)"
                placeholderTextColor={isDarkMode ? "#999" : "#999"}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
              <ThemedText style={styles.hint}>
                Provide as much detail as possible to help authorities
              </ThemedText>
            </View>
          </View>

          {/* Info Box */}
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: isDarkMode
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(59, 130, 246, 0.05)",
                borderColor: TealColors.primary,
              },
            ]}
          >
            <IconSymbol name="info.circle" size={20} color={TealColors.primary} />
            <ThemedText style={styles.infoText}>
              Your submission is completely anonymous. Do not include personal
              information.
            </ThemedText>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.cancelButton,
                {
                  backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG,
                  borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                },
              ]}
              onPress={handleReset}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.cancelButtonText}>Clear</ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.submitButton,
                { opacity: isSubmitting ? 0.6 : 1 },
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <IconSymbol
                name="paperplane.fill"
                size={18}
                color="#fff"
              />
              <ThemedText style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit Tip"}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  formCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 6,
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 120,
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
  },
  infoBox: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: TealColors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
