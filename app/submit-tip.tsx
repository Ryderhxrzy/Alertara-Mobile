/**
 * Submit Tip Screen
 * Allows users to submit anonymous crime tips
 */

import { Header } from "@/components/header";
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
import { apiClient } from "@/services/api/api-config";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function SubmitTipScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const [crimeType, setCrimeType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());

  // Refs for date picker scrolling
  const dateMonthScrollRef = useRef<ScrollView>(null);
  const dateDayScrollRef = useRef<ScrollView>(null);
  const dateYearScrollRef = useRef<ScrollView>(null);

  // Refs for time picker scrolling
  const timeHourScrollRef = useRef<ScrollView>(null);
  const timeMinuteScrollRef = useRef<ScrollView>(null);
  const timeSecondScrollRef = useRef<ScrollView>(null);


  const handleDatePicker = () => {
    // Use modal for both Android and iOS
    setTempDate(selectedDate || new Date());
    setShowDateModal(true);
  };

  const handleTimePicker = () => {
    // Use modal for both Android and iOS
    setTempTime(selectedTime || new Date());
    setShowTimeModal(true);
  };

  const handleDateConfirm = () => {
    setSelectedDate(tempDate);
    setShowDateModal(false);
  };

  const handleTimeConfirm = () => {
    setSelectedTime(tempTime);
    setShowTimeModal(false);
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!crimeType.trim()) {
      Alert.alert("Missing Information", "Please enter crime type");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Missing Information", "Please enter location");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Missing Information", "Please enter details");
      return;
    }

    setIsSubmitting(true);
    try {
      // Format date and time
      let dateOfCrime: string | null = null;
      if (selectedDate) {
        const dateObj = new Date(selectedDate);
        if (selectedTime) {
          const timeObj = new Date(selectedTime);
          dateObj.setHours(timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds());
        }
        dateOfCrime = dateObj.toISOString().slice(0, 16);
      }

      const payload: any = {
        crime_type: crimeType.trim(),
        location: location.trim(),
        date_of_crime: dateOfCrime,
        details: description.trim(),
      };

      // Use configured API client for request
      const response = await apiClient.post("/submit-tip", payload);

      if (response.status === 200 || response.status === 201) {
        // Reset form on success
        setCrimeType("");
        setLocation("");
        setDescription("");
        setSelectedDate(null);
        setSelectedTime(null);

        Alert.alert(
          "Thank You",
          "Your anonymous tip has been submitted successfully. We appreciate your help in keeping our community safe.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        );
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit tip";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCrimeType("");
    setLocation("");
    setDescription("");
    setSelectedDate(null);
    setSelectedTime(null);
  };



  // Auto-scroll date picker to selected values
  useEffect(() => {
    if (showDateModal) {
      const ITEM_HEIGHT = 48; // paddingVertical 12 + paddingVertical 12 + estimated text height

      const monthOffset = tempDate.getMonth() * ITEM_HEIGHT;
      const dayOffset = (tempDate.getDate() - 1) * ITEM_HEIGHT;
      const yearOffset = (tempDate.getFullYear() - 2024) * ITEM_HEIGHT;

      // Scroll to selected items with a small delay to ensure modal is rendered
      setTimeout(() => {
        dateMonthScrollRef.current?.scrollTo({ y: monthOffset, animated: false });
        dateDayScrollRef.current?.scrollTo({ y: dayOffset, animated: false });
        dateYearScrollRef.current?.scrollTo({ y: yearOffset, animated: false });
      }, 100);
    }
  }, [showDateModal, tempDate]);

  // Auto-scroll time picker to selected values
  useEffect(() => {
    if (showTimeModal) {
      const ITEM_HEIGHT = 48; // paddingVertical 12 + paddingVertical 12 + estimated text height

      const hourOffset = tempTime.getHours() * ITEM_HEIGHT;
      const minuteOffset = tempTime.getMinutes() * ITEM_HEIGHT;
      const secondOffset = tempTime.getSeconds() * ITEM_HEIGHT;

      // Scroll to selected items with a small delay to ensure modal is rendered
      setTimeout(() => {
        timeHourScrollRef.current?.scrollTo({ y: hourOffset, animated: false });
        timeMinuteScrollRef.current?.scrollTo({ y: minuteOffset, animated: false });
        timeSecondScrollRef.current?.scrollTo({ y: secondOffset, animated: false });
      }, 100);
    }
  }, [showTimeModal, tempTime]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <ThemedView style={styles.container}>
        <Header />
        <Pressable
          onPress={() => router.back()}
          style={styles.backButtonContainer}
        >
          <IconSymbol name="arrow.left" size={24} color={TealColors.primary} />
          <ThemedText style={styles.backButtonText}>Back</ThemedText>
        </Pressable>

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
            <ThemedText style={styles.heroTitle}>
              Report a Crime Safely
            </ThemedText>
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

            {/* Date */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Date</ThemedText>
              <Pressable
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                  },
                ]}
                onPress={handleDatePicker}
                disabled={isSubmitting}
              >
                <ThemedText
                  style={{
                    fontSize: 14,
                    color: selectedDate ? (isDarkMode ? "#fff" : "#000") : "#999",
                  }}
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Select date..."}
                </ThemedText>
              </Pressable>
              <ThemedText style={styles.hint}>
                When did this incident occur?
              </ThemedText>
            </View>

            {/* Time */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Time</ThemedText>
              <Pressable
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
                  },
                ]}
                onPress={handleTimePicker}
                disabled={isSubmitting}
              >
                <ThemedText
                  style={{
                    fontSize: 14,
                    color: selectedTime ? (isDarkMode ? "#fff" : "#000") : "#999",
                  }}
                >
                  {selectedTime
                    ? selectedTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Select time..."}
                </ThemedText>
              </Pressable>
              <ThemedText style={styles.hint}>
                What time did it occur? (Optional)
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
            <IconSymbol
              name="info.circle"
              size={20}
              color={TealColors.primary}
            />
            <ThemedText style={styles.infoText}>
              Your submission is completely anonymous. Do not include personal
              information.
            </ThemedText>
          </View>

          {/* Security Notice */}
          <View
            style={[
              styles.securityNoticeBox,
              {
                backgroundColor: isDarkMode
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(59, 130, 246, 0.05)",
                borderColor: TealColors.primary,
              },
            ]}
          >
            <View style={styles.securityHeader}>
              <IconSymbol
                name="lock.fill"
                size={20}
                color={TealColors.primary}
              />
              <ThemedText style={styles.securityTitle}>
                Security Protection
              </ThemedText>
            </View>
            <View style={styles.securityList}>
              <View style={styles.securityItem}>
                <ThemedText style={styles.securityBullet}>•</ThemedText>
                <ThemedText style={styles.securityItemText}>
                  HTTPS encryption for data transmission
                </ThemedText>
              </View>
              <View style={styles.securityItem}>
                <ThemedText style={styles.securityBullet}>•</ThemedText>
                <ThemedText style={styles.securityItemText}>
                  Backend validation and verification
                </ThemedText>
              </View>
              <View style={styles.securityItem}>
                <ThemedText style={styles.securityBullet}>•</ThemedText>
                <ThemedText style={styles.securityItemText}>
                  Rate limiting to prevent spam
                </ThemedText>
              </View>
              <View style={styles.securityItem}>
                <ThemedText style={styles.securityBullet}>•</ThemedText>
                <ThemedText style={styles.securityItemText}>
                  Fraud detection and prevention
                </ThemedText>
              </View>
            </View>
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
              style={[styles.submitButton, { opacity: isSubmitting ? 0.6 : 1 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <IconSymbol name="paperplane.fill" size={18} color="#fff" />
              <ThemedText style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit Tip"}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>

        {/* Date Picker Modal */}
        <Modal
            visible={showDateModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDateModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Pressable onPress={() => setShowDateModal(false)}>
                    <ThemedText style={styles.modalButton}>Cancel</ThemedText>
                  </Pressable>
                  <ThemedText style={styles.modalTitle}>Select Date</ThemedText>
                  <Pressable onPress={handleDateConfirm}>
                    <ThemedText
                      style={[
                        styles.modalButton,
                        { color: TealColors.primary, fontWeight: "600" },
                      ]}
                    >
                      Done
                    </ThemedText>
                  </Pressable>
                </View>
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerColumn}>
                    <ThemedText style={styles.pickerLabel}>Month</ThemedText>
                    <ScrollView ref={dateMonthScrollRef} style={styles.pickerScroll}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <Pressable
                          key={i}
                          style={[
                            styles.pickerItem,
                            tempDate.getMonth() === i && styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            const newDate = new Date(tempDate);
                            newDate.setMonth(i);
                            setTempDate(newDate);
                          }}
                        >
                          <ThemedText
                            style={[
                              styles.pickerItemText,
                              tempDate.getMonth() === i && styles.pickerItemTextSelected,
                            ]}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.pickerColumn}>
                    <ThemedText style={styles.pickerLabel}>Day</ThemedText>
                    <ScrollView ref={dateDayScrollRef} style={styles.pickerScroll}>
                      {Array.from({ length: 31 }, (_, i) => (
                        <Pressable
                          key={i}
                          style={[
                            styles.pickerItem,
                            tempDate.getDate() === i + 1 && styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            const newDate = new Date(tempDate);
                            newDate.setDate(i + 1);
                            setTempDate(newDate);
                          }}
                        >
                          <ThemedText
                            style={[
                              styles.pickerItemText,
                              tempDate.getDate() === i + 1 && styles.pickerItemTextSelected,
                            ]}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.pickerColumn}>
                    <ThemedText style={styles.pickerLabel}>Year</ThemedText>
                    <ScrollView ref={dateYearScrollRef} style={styles.pickerScroll}>
                      {Array.from({ length: 50 }, (_, i) => {
                        const year = 2024 + i;
                        return (
                          <Pressable
                            key={year}
                            style={[
                              styles.pickerItem,
                              tempDate.getFullYear() === year && styles.pickerItemSelected,
                            ]}
                            onPress={() => {
                              const newDate = new Date(tempDate);
                              newDate.setFullYear(year);
                              setTempDate(newDate);
                            }}
                          >
                            <ThemedText
                              style={[
                                styles.pickerItemText,
                                tempDate.getFullYear() === year && styles.pickerItemTextSelected,
                              ]}
                            >
                              {year}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

        {/* Time Picker Modal */}
        <Modal
            visible={showTimeModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowTimeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Pressable onPress={() => setShowTimeModal(false)}>
                    <ThemedText style={styles.modalButton}>Cancel</ThemedText>
                  </Pressable>
                  <ThemedText style={styles.modalTitle}>Select Time</ThemedText>
                  <Pressable onPress={handleTimeConfirm}>
                    <ThemedText
                      style={[
                        styles.modalButton,
                        { color: TealColors.primary, fontWeight: "600" },
                      ]}
                    >
                      Done
                    </ThemedText>
                  </Pressable>
                </View>
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerColumn}>
                    <ThemedText style={styles.pickerLabel}>Hour</ThemedText>
                    <ScrollView ref={timeHourScrollRef} style={styles.pickerScroll}>
                      {Array.from({ length: 24 }, (_, i) => (
                        <Pressable
                          key={i}
                          style={[
                            styles.pickerItem,
                            tempTime.getHours() === i && styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            const newTime = new Date(tempTime);
                            newTime.setHours(i);
                            setTempTime(newTime);
                          }}
                        >
                          <ThemedText
                            style={[
                              styles.pickerItemText,
                              tempTime.getHours() === i && styles.pickerItemTextSelected,
                            ]}
                          >
                            {String(i).padStart(2, "0")}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.pickerColumn}>
                    <ThemedText style={styles.pickerLabel}>Minute</ThemedText>
                    <ScrollView ref={timeMinuteScrollRef} style={styles.pickerScroll}>
                      {Array.from({ length: 60 }, (_, i) => (
                        <Pressable
                          key={i}
                          style={[
                            styles.pickerItem,
                            tempTime.getMinutes() === i && styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            const newTime = new Date(tempTime);
                            newTime.setMinutes(i);
                            setTempTime(newTime);
                          }}
                        >
                          <ThemedText
                            style={[
                              styles.pickerItemText,
                              tempTime.getMinutes() === i && styles.pickerItemTextSelected,
                            ]}
                          >
                            {String(i).padStart(2, "0")}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.pickerColumn}>
                    <ThemedText style={styles.pickerLabel}>Second</ThemedText>
                    <ScrollView ref={timeSecondScrollRef} style={styles.pickerScroll}>
                      {Array.from({ length: 60 }, (_, i) => (
                        <Pressable
                          key={i}
                          style={[
                            styles.pickerItem,
                            tempTime.getSeconds() === i && styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            const newTime = new Date(tempTime);
                            newTime.setSeconds(i);
                            setTempTime(newTime);
                          }}
                        >
                          <ThemedText
                            style={[
                              styles.pickerItemText,
                              tempTime.getSeconds() === i && styles.pickerItemTextSelected,
                            ]}
                          >
                            {String(i).padStart(2, "0")}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </View>
          </Modal>


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
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: LIGHT_CARD_BG,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_BORDER,
  },
  modalButton: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  datePickerContainer: {
    paddingVertical: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  pickerColumn: {
    flex: 1,
    height: 200,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.7,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  pickerItemSelected: {
    backgroundColor: `${TealColors.primary}20`,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  pickerItemTextSelected: {
    fontWeight: "700",
    color: TealColors.primary,
  },
  captchaContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  captchaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  captchaTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  captchaWebViewInline: {
    height: 100,
    borderRadius: 0,
    marginTop: 8,
    marginBottom: 12,
  },
  captchaLoadingInline: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 0,
    marginTop: 8,
    marginBottom: 12,
  },
  captchaLoadingTextInline: {
    fontSize: 12,
    opacity: 0.6,
  },
  captchaVerifiedContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  captchaVerifiedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  securityNoticeBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  securityList: {
    gap: 6,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  securityBullet: {
    fontSize: 14,
    fontWeight: "600",
    color: TealColors.primary,
    lineHeight: 16,
  },
  securityItemText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
    opacity: 0.8,
  },
});
