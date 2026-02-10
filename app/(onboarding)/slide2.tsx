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

export default function OnboardingScreen2() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = Colors[isDarkMode ? "dark" : "light"];
  const bgColor = isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND;

  const handleNext = () => {
    router.push("/(onboarding)/slide3");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        {/* Centered Content */}
        <View style={styles.centeredContent}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image
              source={require("@/assets/images/tab2.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: colors.text }]}>
              Key Features
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Explore What Alertara Offers
            </Text>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.description, { color: colors.icon }]}>
              Alertara empowers QC citizens with essential tools to stay
              informed and protected. Access real-time crime data, receive
              instant safety alerts, check community safety scores, and much
              more to make informed decisions about your surroundings.
            </Text>
          </View>
        </View>

        {/* Navigation - Fixed at Bottom */}
        <View style={styles.navigationSection}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { borderColor: TealColors.primary },
              ]}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: TealColors.primary },
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: TealColors.primary },
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dotsContainer}>
            <View style={[styles.dot, { backgroundColor: colors.icon }]} />
            <View
              style={[styles.dot, { backgroundColor: TealColors.primary }]}
            />
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
  descriptionSection: {
    marginTop: 8,
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
  iconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 40,
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
  imageSection: {
    alignItems: "center",
  },
  featureImage: {
    width: 390,
    height: 360,
    marginBottom: 24,
  },
  featuresSection: {
    gap: 14,
    maxWidth: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 153, 136, 0.08)",
  },
  featureIcon: {
    fontSize: 28,
    marginTop: 4,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
