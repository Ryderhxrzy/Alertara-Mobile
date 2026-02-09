import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Header } from '@/components/header';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';

export default function SettingsScreen() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.containerStyle, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
      <Header />
      <ScrollView style={[styles.content, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">App Settings</ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">General</ThemedText>
          <ThemedText style={styles.description}>
            • App Notifications{'\n'}
            • Language & Region{'\n'}
            • Display Options
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Privacy & Security</ThemedText>
          <ThemedText style={styles.description}>
            • Privacy Settings{'\n'}
            • Data Management{'\n'}
            • Security Options
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  titleContainer: {
    gap: 8,
    marginBottom: 16,
  },
  section: {
    gap: 8,
    marginBottom: 16,
  },
  description: {
    lineHeight: 20,
    color: '#666',
  },
});
