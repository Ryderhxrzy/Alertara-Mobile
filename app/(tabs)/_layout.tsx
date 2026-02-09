import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
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
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notification',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
