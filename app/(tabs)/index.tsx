import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  Colors,
  DARK_BORDER,
  DARK_CARD_BG,
  DARK_ICON,
  DARK_TEXT,
  LIGHT_BORDER,
  LIGHT_CARD_BG,
  LIGHT_ICON,
  LIGHT_TEXT,
  TealColors,
} from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          styles.content,
          {
            backgroundColor: isDarkMode
              ? Colors.dark.background
              : Colors.light.background,
          },
        ]}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeTitleRow}>
            <ThemedText style={styles.welcomeText}>Welcome back!</ThemedText>
            <View
              style={[
                styles.welcomeIcon,
                { backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG },
              ]}
            >
              <IconSymbol size={32} name="house" color={TealColors.primary} />
            </View>
          </View>
          <ThemedText style={styles.subText}>
            Check our latest services and updates
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDarkMode ? DARK_CARD_BG : "#fff",
              borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
            },
          ]}
        >
          <TextInput
            style={[
              styles.searchInput,
              { color: isDarkMode ? DARK_TEXT : LIGHT_TEXT },
            ]}
            placeholder="Search for services..."
            placeholderTextColor={isDarkMode ? "#666" : "#999"}
          />
          <View style={styles.searchIconCircle}>
            <IconSymbol size={20} name="search" color="#fff" />
          </View>
        </View>

        {/* Quick Services Section */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionTitleContainer}>
            <ThemedText style={styles.sectionTitle}>Quick Services</ThemedText>
            <IconSymbol
              size={20}
              name="chevron.right"
              color={isDarkMode ? DARK_ICON : LIGHT_ICON}
            />
          </View>
          <View style={styles.servicesGrid}>
            <Pressable
              style={styles.serviceIconOnly}
              onPress={() => router.push("/crime-mapping")}
            >
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: "#E74C3C" },
                ]}
              >
                <IconSymbol size={28} name="location" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Crime Map</ThemedText>
            </Pressable>
            <Pressable
              style={styles.serviceIconOnly}
              onPress={() => router.push("/submit-tip")}
            >
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: "#3498DB" },
                ]}
              >
                <IconSymbol size={28} name="paperplane.fill" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Submit Tip</ThemedText>
            </Pressable>
            <Pressable style={styles.serviceIconOnly}>
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: TealColors.primary },
                ]}
              >
                <IconSymbol size={28} name="bell" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Alerts</ThemedText>
            </Pressable>
            <Pressable style={styles.serviceIconOnly}>
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: "#9B59B6" },
                ]}
              >
                <IconSymbol size={28} name="person" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Profile</ThemedText>
            </Pressable>
            <Pressable style={styles.serviceIconOnly}>
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: "#27AE60" },
                ]}
              >
                <IconSymbol size={28} name="info" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Info</ThemedText>
            </Pressable>
            <Pressable style={styles.serviceIconOnly}>
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: "#F39C12" },
                ]}
              >
                <IconSymbol size={28} name="gear" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Settings</ThemedText>
            </Pressable>
            <Pressable style={styles.serviceIconOnly}>
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: "#16A085" },
                ]}
              >
                <IconSymbol size={28} name="house" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Home</ThemedText>
            </Pressable>
            <Pressable style={styles.serviceIconOnly}>
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: "#8E44AD" },
                ]}
              >
                <IconSymbol size={28} name="send" color="#fff" />
              </View>
              <ThemedText style={styles.serviceCardText}>Share</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Announcements Section */}
        <View style={styles.announcementSection}>
          <View style={styles.sectionTitleContainer}>
            <ThemedText style={styles.sectionTitle}>
              Latest Announcements
            </ThemedText>
            <IconSymbol
              size={20}
              name="chevron.right"
              color={isDarkMode ? DARK_ICON : LIGHT_ICON}
            />
          </View>
          <View
            style={[
              styles.announcementCard,
              {
                backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG,
                borderColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
              },
            ]}
          >
            <View style={styles.announcementImageContainer}>
              <Image
                source={require("@/assets/images/partial-react-logo.png")}
                style={styles.announcementImage}
              />
            </View>
            <View style={styles.announcementContent}>
              <ThemedText style={styles.announcementTitle}>
                New Safety Features
              </ThemedText>
              <ThemedText style={styles.announcementDescription}>
                Check out our latest updates to keep you safer
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Featured Services Section */}
        <View style={styles.featuredSection}>
          <ThemedText style={styles.sectionTitle}>Featured</ThemedText>
          <Pressable
            style={[
              styles.featuredCard,
              { backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG },
            ]}
          >
            <View
              style={[
                styles.featuredIcon,
                { backgroundColor: isDarkMode ? DARK_CARD_BG : "#fff" },
              ]}
            >
              <IconSymbol size={24} name="bell" color={TealColors.primary} />
            </View>
            <View style={styles.featuredContent}>
              <ThemedText type="subtitle" style={styles.featuredTitle}>
                Emergency Alerts
              </ThemedText>
              <ThemedText style={styles.featuredDescription}>
                Real-time emergency notifications
              </ThemedText>
            </View>
          </Pressable>
          <Pressable
            style={[
              styles.featuredCard,
              { backgroundColor: isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG },
            ]}
          >
            <View
              style={[
                styles.featuredIcon,
                { backgroundColor: isDarkMode ? DARK_CARD_BG : "#fff" },
              ]}
            >
              <IconSymbol size={24} name="menu" color={TealColors.primary} />
            </View>
            <View style={styles.featuredContent}>
              <ThemedText type="subtitle" style={styles.featuredTitle}>
                Service Updates
              </ThemedText>
              <ThemedText style={styles.featuredDescription}>
                Latest updates and announcements
              </ThemedText>
            </View>
          </Pressable>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Message Button */}
      <Pressable style={styles.messageButton} onPress={() => {}}>
        <IconSymbol size={24} name="chatbubble" color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "700",
    color: TealColors.primary,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  subText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "400",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 28,
    gap: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  searchIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TealColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  servicesSection: {
    marginBottom: 28,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  serviceIconOnly: {
    width: "20%",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 4,
  },
  serviceIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: TealColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceCardText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  announcementSection: {
    marginBottom: 40,
  },
  announcementCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  announcementImageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  announcementImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  announcementContent: {
    padding: 16,
    gap: 6,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TealColors.primary,
  },
  announcementDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  featuredSection: {
    marginBottom: 24,
  },
  featuredCard: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
    gap: 12,
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: TealColors.primary,
  },
  featuredContent: {
    flex: 1,
    gap: 4,
  },
  featuredTitle: {
    color: TealColors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  featuredDescription: {
    fontSize: 13,
    color: "#999",
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
  messageButton: {
    position: "absolute",
    bottom: 20,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: TealColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
