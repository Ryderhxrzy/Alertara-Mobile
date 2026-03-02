import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomNav } from '@/components/bottom-nav';
import { Colors, LIGHT_BORDER, DARK_BORDER, LIGHT_BACKGROUND, DARK_BACKGROUND } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[isDarkMode ? 'dark' : 'light'].tint,
        tabBarInactiveTintColor: Colors[isDarkMode ? 'dark' : 'light'].icon,
        tabBarStyle: {
          backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? DARK_BORDER : LIGHT_BORDER,
        },
        headerShown: false,
        sceneStyle: { paddingBottom: Platform.OS === 'ios' ? 90 : 70 },
      }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house" color={color} />,
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell" color={color} />,
        }}
      />

      <Tabs.Screen
        name="call"
        options={{
          title: 'Call',
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map" color={color} />,
        }}
      />
    </Tabs>
  );
}
