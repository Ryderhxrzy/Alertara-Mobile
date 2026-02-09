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
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

export function Header() {
  const router = useRouter();
  const { toggleTheme, isDarkMode, theme } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const ICON_COLOR = isDarkMode ? DARK_ICON : LIGHT_ICON;
  const BORDER_COLOR = isDarkMode ? DARK_BORDER : LIGHT_BORDER;
  const BG_COLOR = isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  const BUTTON_BG = isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: isDarkMode ? 1 : 0,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: BG_COLOR, borderBottomColor: BORDER_COLOR },
      ]}
    >
      <View style={styles.leftSection}>
        <Pressable style={styles.menuButton}>
          <IconSymbol size={24} name={'menu' as any} color={ICON_COLOR} />
        </Pressable>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/alertara.png")}
            style={styles.logo}
          />
          <ThemedText style={styles.logoText}>lertara QC</ThemedText>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Animated.View
          style={{
            transform: [{ rotate: rotation }],
          }}
        >
          <Pressable
            style={[styles.iconButton, { backgroundColor: BUTTON_BG }]}
            onPress={handleThemeToggle}
          >
            <IconSymbol
              size={24}
              name={isDarkMode ? "sun" : "moon"}
              color={ICON_COLOR}
            />
          </Pressable>
        </Animated.View>
        <Pressable
          style={[styles.iconButton, { backgroundColor: BUTTON_BG }]}
          onPress={() => router.push("/(tabs)/me")}
        >
          <IconSymbol size={24} name="person" color={ICON_COLOR} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 35,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: -8,
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
  iconContainer: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    borderWidth: 0,

    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
