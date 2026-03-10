/**
 * Time Filter Component
 * Allows users to filter crime data by time range
 */

import { ThemedText } from '@/components/themed-text';
import {
  TealColors,
  DARK_CARD_BG,
  LIGHT_CARD_BG,
  DARK_BORDER,
  LIGHT_BORDER,
} from '@/constants/theme';
import { useTheme } from '@/context/theme-context';
import { TimeFilterOption } from '@/types/crime';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface TimeFilterProps {
  selectedFilter: TimeFilterOption;
  onFilterChange: (filter: TimeFilterOption) => void;
}

export function TimeFilter({ selectedFilter, onFilterChange }: TimeFilterProps) {
  const { isDarkMode } = useTheme();

  const filters: { label: string; value: TimeFilterOption }[] = [
    { label: 'All Time', value: 'alltime' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'week' },
    { label: 'Last 30 Days', value: 'month' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map((filter) => (
        <Pressable
          key={filter.value}
          style={[
            styles.button,
            {
              backgroundColor:
                selectedFilter === filter.value
                  ? TealColors.primary
                  : isDarkMode
                  ? DARK_CARD_BG
                  : LIGHT_CARD_BG,
              borderColor:
                selectedFilter === filter.value
                  ? TealColors.primary
                  : isDarkMode
                  ? DARK_BORDER
                  : LIGHT_BORDER,
            },
          ]}
          onPress={() => onFilterChange(filter.value)}
        >
          <ThemedText
            style={[
              styles.buttonText,
              {
                color: selectedFilter === filter.value ? '#fff' : undefined,
              },
            ]}
          >
            {filter.label}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
