import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  DARK_BACKGROUND,
  DARK_BORDER,
  DARK_CARD_BG,
  DARK_ICON,
  LIGHT_BACKGROUND,
  LIGHT_BORDER,
  LIGHT_CARD_BG,
  LIGHT_ICON,
  TealColors,
} from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Animated, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useCallback, useRef, useState } from "react";

const SEARCH_PANEL_HEIGHT = 62;

export function Header() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const searchInputRef = useRef<TextInput>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const ICON_COLOR = isDarkMode ? DARK_ICON : LIGHT_ICON;
  const BORDER_COLOR = isDarkMode ? DARK_BORDER : LIGHT_BORDER;
  const BG_COLOR = isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  const INPUT_BG = isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG;

  const toggleSearch = useCallback(() => {
    const next = !isSearchOpen;
    setIsSearchOpen(next);
    Animated.timing(slideAnim, {
      toValue: next ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      if (next) {
        searchInputRef.current?.focus();
      }
    });
  }, [isSearchOpen, slideAnim]);

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: BG_COLOR, borderBottomColor: BORDER_COLOR },
      ]}
    >
      <View style={styles.headerMain}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/alertara.png")}
            style={styles.logo}
          />
          <ThemedText style={styles.logoText}>Alertara QC</ThemedText>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={[styles.circleButton, { backgroundColor: INPUT_BG }]}
            onPress={toggleSearch}
          >
            <IconSymbol size={20} name="search" color={ICON_COLOR} />
          </Pressable>

          <Pressable
            style={[styles.circleButton, { backgroundColor: INPUT_BG }]}
            onPress={() => router.push("/notification")}
          >
            <IconSymbol size={24} name="bell" color={ICON_COLOR} />
          </Pressable>
        </View>
      </View>

      <Animated.View
        pointerEvents={isSearchOpen ? "auto" : "none"}
        style={[
          styles.searchPanel,
          {
            backgroundColor: INPUT_BG,
            borderColor: BORDER_COLOR,
            height: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, SEARCH_PANEL_HEIGHT],
            }),
            opacity: slideAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-SEARCH_PANEL_HEIGHT, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.searchContent}>
          <IconSymbol size={18} name="magnifyingglass" color={ICON_COLOR} />
          <TextInput
            ref={searchInputRef}
            placeholder="Search services..."
            placeholderTextColor={isDarkMode ? "#b0b0b0" : "#7f7f7f"}
            style={[
              styles.searchInput,
              { color: isDarkMode ? "#fff" : "#111" },
            ]}
          />
          <Pressable onPress={toggleSearch} style={styles.closeButton}>
            <IconSymbol size={18} name="xmark" color={ICON_COLOR} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative",
    overflow: "visible",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 35,
    borderBottomWidth: 1,
  },
  headerMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: TealColors.primary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchPanel: {
    position: "absolute",
    left: 14,
    right: 14,
    top: "100%",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 30,
    zIndex: 10,
    overflow: "hidden",
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  closeButton: {
    padding: 6,
    borderRadius: 12,
  },
});
