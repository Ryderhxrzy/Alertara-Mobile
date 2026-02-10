import {
  Colors,
  DARK_BACKGROUND,
  LIGHT_BACKGROUND,
  TealColors,
} from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OnboardingScreen1() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = Colors[isDarkMode ? "dark" : "light"];
  const bgColor = isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND;

  const handleNext = () => {
    router.push("/(onboarding)/slide2");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        {/* Centered Content */}
        <View style={styles.centeredContent}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image
              source={require("@/assets/images/index.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome to AlertaraQC
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Your Personal Safety Companion
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.description, { color: colors.icon }]}>
              Alertara is a comprehensive safety platform designed exclusively
              for QC citizens. Get access to real-time crime maps, community
              safety alerts, emergency reporting, and instant access to local
              authorities—all in one app.
            </Text>
          </View>
        </View>

        {/* Navigation - Fixed at Bottom */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: TealColors.primary }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>

          <View style={styles.dotsContainer}>
            <View
              style={[styles.dot, { backgroundColor: TealColors.primary }]}
            />
            <View style={[styles.dot, { backgroundColor: colors.icon }]} />
            <View style={[styles.dot, { backgroundColor: colors.icon }]} />
            <View style={[styles.dot, { backgroundColor: colors.icon }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
  },
  heroImage: {
    width: 390,
    height: 360,
    marginBottom: 24,
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
  },
  descriptionSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  navigationSection: {
    width: "100%",
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
