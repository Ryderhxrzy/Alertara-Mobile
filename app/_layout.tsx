import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/context/auth-context";
import { PreferencesProvider } from "@/context/preferences-context";
import { ThemeProvider as CustomThemeProvider } from "@/context/theme-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isLoading, userToken, onboardingCompleted } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // DEBUG: Log the current auth state
    console.log(
      "RootLayout - onboardingCompleted:",
      onboardingCompleted,
      "userToken:",
      userToken,
    );

    // Route based on auth state
    if (onboardingCompleted === false) {
      router.replace("/(onboarding)");
    } else if (onboardingCompleted === true && !userToken) {
      router.replace("/(auth)/login");
    } else if (onboardingCompleted === true && userToken) {
      router.replace("/(tabs)");
    }
  }, [isLoading, onboardingCompleted, userToken, router]);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {/* All routes are always registered */}
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack.Group>

        {/* Modal and other screens */}
        <Stack.Group>
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="safety-map"
            options={{
              presentation: "card",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="submit-tip"
            options={{
              presentation: "card",
              headerShown: false,
            }}
          />
        </Stack.Group>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <PreferencesProvider>
          <RootLayoutNav />
        </PreferencesProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
