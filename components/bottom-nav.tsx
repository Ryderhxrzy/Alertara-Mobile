import { TealColors } from "@/constants/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EmergencyCallButton } from "./emergency-call-button";
import { IconSymbol } from "./ui/icon-symbol";

export function BottomNav({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const callIndex = state.routes.findIndex((r) => r.name === "call");
  const adjacentSpacing = 40; // spacing reserved on either side of call button
  const unreadNotifications = 3;

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        // we only show icons for visible tabs
        const label =
          route.name === "notification"
            ? "Notification"
            : options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // custom call button center - render first before checking if hidden
        if (route.name === "call") {
          return (
            <View key={route.key} style={styles.callButtonContainer}>
              <EmergencyCallButton onPress={onPress} />
            </View>
          );
        }

        // hide tabs that have custom tabBarButton function (not already handled like call)
        if (typeof options.tabBarButton === "function") {
          return null;
        }

        const iconName =
          route.name === "index"
            ? isFocused
              ? "house.fill"
              : "house"
            : route.name === "notification"
              ? isFocused
                ? "bell.fill"
                : "bell"
              : route.name === "map"
                ? isFocused
                  ? "map.fill"
                  : "map"
                : route.name === "me"
                  ? isFocused
                    ? "person.fill"
                    : "person"
                  : "circle";

        // add extra inner padding to tabs adjacent to the call button so they don't
        // overlap with the central floating call circle — use padding instead of
        // margin so the icon stays centered within its tab
        const extraStyle = {} as any;
        if (callIndex >= 0) {
          if (index === callIndex - 1) {
            extraStyle.paddingRight = adjacentSpacing;
          } else if (index === callIndex + 1) {
            extraStyle.paddingLeft = adjacentSpacing;
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[styles.tab, extraStyle]}
          >
            <View style={styles.tabContent}>
              <View style={styles.iconWrapper}>
                <IconSymbol
                  size={24}
                  name={iconName as any}
                  color={isFocused ? TealColors.primary : "#888"}
                />
                {route.name === "notification" && unreadNotifications > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadNotifications}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isFocused && { color: TealColors.primary },
                ]}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: Platform.OS === "ios" ? 80 : 60,
    borderTopWidth: 0,
    borderTopColor: "transparent",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    // explicitly stack icon above text
    flexDirection: "column",
  },
  iconWrapper: {
    position: "relative",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    color: "#888",
    // ensure multi-line labels are centered beneath the icon
    textAlign: "center",
  },
  callButtonContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 15 : 5,
    alignSelf: "center",
    zIndex: 10,
    marginHorizontal: 20,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    minWidth: 18,
    paddingHorizontal: 4,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  // styling for the legacy teal button is no longer used; handled inside EmergencyCallButton
});
