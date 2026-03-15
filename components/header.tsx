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
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export function Header() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const ICON_COLOR = isDarkMode ? DARK_ICON : LIGHT_ICON;
  const BORDER_COLOR = isDarkMode ? DARK_BORDER : LIGHT_BORDER;
  const BG_COLOR = isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  const INPUT_BG = isDarkMode ? DARK_CARD_BG : LIGHT_CARD_BG;

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: BG_COLOR, borderBottomColor: BORDER_COLOR },
      ]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/alertara.png")}
          style={styles.logo}
        />
        <ThemedText style={styles.logoText}>Alertara QC</ThemedText>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: INPUT_BG, borderColor: BORDER_COLOR },
        ]}
      >
        <IconSymbol size={18} name="search" color={ICON_COLOR} />
        <TextInput
          placeholder="Search services"
          placeholderTextColor={isDarkMode ? "#b0b0b0" : "#7f7f7f"}
          style={[styles.searchInput, { color: isDarkMode ? "#fff" : "#111" }]}
        />
      </View>

      <Pressable
        style={[styles.iconButton, { backgroundColor: INPUT_BG }]}
        onPress={() => router.push("/(tabs)/notification")}
      >
        <IconSymbol size={24} name="bell" color={ICON_COLOR} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 35,
    borderBottomWidth: 1,
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
