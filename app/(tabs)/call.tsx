import React from 'react';
import { View, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/theme-context';
import { TealColors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CallScreen() {
  const { isDarkMode } = useTheme();

  const handleEmergencyCall = () => {
    const phone = '911'; // change to appropriate emergency number
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to initiate call');
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#fff' },
      ]}
    >
      <Header />
      <View style={styles.content}>
        <ThemedText style={styles.heading}>Emergency Call</ThemedText>
        <Pressable style={styles.button} onPress={handleEmergencyCall}>
          <IconSymbol size={32} name="phone" color="#fff" />
          <ThemedText style={styles.buttonText}>Call Now</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 32,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});