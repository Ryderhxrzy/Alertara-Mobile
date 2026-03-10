import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';
import { Animated, Easing, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const alerts = [
  {
    id: 'earthquake',
    category: 'EARTHQUAKE',
    title: '[MOCK] CRITICAL EARTHQUAKE ALERT',
    type: 'Emergency Bulletin',
    alertType: 'Type: Earthquake Emergency',
    severity: 'HIGH',
    timestamp: '2026-02-25 03:47:51',
    description:
      'Critical earthquake activity detected. This is an emergency safety broadcast to all citizens.',
    actions: [
      'DROP, COVER, and HOLD.',
      'Move away from glass, shelves, and power lines.',
      'Evacuate damaged structures after shaking stops.',
      'Wait for LGU and rescue advisories.',
    ],
    source: 'phivolcs',
  },
  {
    id: 'weather',
    category: 'WEATHER',
    title: '[MOCK] CRITICAL WEATHER ALERT',
    type: 'Emergency Bulletin',
    alertType: 'Type: Severe Weather Emergency',
    severity: 'HIGH',
    timestamp: '2026-02-25 03:43:02',
    description: 'Heavy rainfall and gale-force winds are expected within the next hour.',
    actions: [
      'Move away from windows and electrical panels.',
      'Secure loose items outside and park vehicles indoors.',
      'Monitor official advisories for flash flood notices.',
    ],
    source: 'dost-ph',
  },
];

const severityColors: Record<string, string> = {
  HIGH: '#df4338',
  MEDIUM: '#f0a43f',
  LOW: '#2f9d63',
};

const categoryTabs = ['General', 'Alert', 'Announcement', 'Reminder', 'Emergency Broadcast'];
const timeFilters = ['Now', 'Yesterday', 'A Week Ago', 'A Month Ago', 'A Year Ago'];

export default function NotificationScreen() {
  const { isDarkMode } = useTheme();
  const screenBackground = isDarkMode ? '#0f1c1f' : '#f2efe8';
  const cardBackground = isDarkMode ? '#18252a' : '#ffffff';
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const highlightColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const [selectedCategory, setSelectedCategory] = useState(categoryTabs[0]);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(timeFilters[0]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [260, 0],
  });
  const overlayTextColor = Colors.light.text;

  useEffect(() => {
    if (filterVisible) {
      setMenuMounted(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => finished && setMenuMounted(false));
    }
  }, [filterVisible, slideAnim]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenBackground }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: screenBackground, paddingTop: 4 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerStack}>
          <View style={styles.headerRow}>
            <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>
              Notifications
            </ThemedText>
            <Pressable
              style={({ pressed }) => [
                styles.filterButton,
                {
                  borderColor: isDarkMode ? '#24303a' : '#dfe3e8',
                  backgroundColor: pressed
                    ? '#d9e5e1'
                    : isDarkMode
                      ? '#1f2d31'
                      : '#ffffff',
                },
              ]}
              onPress={() => setFilterVisible(prev => !prev)}
            >
              <IconSymbol name="filter" size={22} color={highlightColor} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabs}
          >
            {categoryTabs.map(option => (
              <Pressable
                key={option}
                style={[
                  styles.filterTab,
                  {
                    borderColor: isDarkMode ? '#2f3b42' : '#c1c5cc',
                    backgroundColor: selectedCategory === option ? `${highlightColor}20` : cardBackground,
                  },
                  selectedCategory === option && {
                    borderColor: highlightColor,
                  },
                ]}
                onPress={() => setSelectedCategory(option)}
              >
                <ThemedText
                  style={[
                    styles.filterTabText,
                    { color: textColor },
                    selectedCategory === option && { fontWeight: '700' },
                  ]}
                >
                  {option}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          {menuMounted && (
            <Animated.View
              style={[
                styles.filterMenu,
                {
                  backgroundColor: '#ffffff',
                  borderColor: '#dfe3e8',
                  transform: [{ translateX }],
                  opacity: slideAnim,
                },
              ]}
            >
              {timeFilters.map(option => (
                <Pressable
                  key={`menu-${option}`}
                  style={[
                    styles.filterOption,
                    {
                      borderColor: isDarkMode ? '#2f3b42' : '#c1c5cc',
                    },
                    selectedTimeFilter === option && {
                      borderColor: highlightColor,
                      backgroundColor: `${highlightColor}20`,
                    },
                  ]}
                  onPress={() => {
                    setSelectedTimeFilter(option);
                    setFilterVisible(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.filterOptionText,
                      { color: overlayTextColor },
                      selectedTimeFilter === option && { fontWeight: '700' },
                    ]}
                  >
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </Animated.View>
          )}
        </View>

        {alerts.map(alert => {
          const severityColor = severityColors[alert.severity] ?? '#999';
          return (
            <View key={alert.id} style={[styles.card, { backgroundColor: cardBackground }]}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryRow}>
                  <IconSymbol name="flame" size={18} color={severityColor} />
                  <ThemedText style={[styles.categoryText, { color: textColor }]}>
                    {alert.category} · {alert.type}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.severityPill,
                    { borderColor: severityColor, backgroundColor: `${severityColor}15` },
                  ]}
                >
                  <ThemedText style={[styles.severityText, { color: severityColor }]}>
                    {alert.severity}
                  </ThemedText>
                </View>
              </View>

              <ThemedText type="subtitle" style={[styles.titleText, { color: textColor }]}>
                {alert.title}
              </ThemedText>

              <ThemedText style={[styles.typeLabel, { color: textColor }]}>{alert.alertType}</ThemedText>

              <ThemedText style={[styles.description, { color: textColor }]}>
                {alert.description}
              </ThemedText>

              <View style={styles.actionsContainer}>
                <ThemedText style={[styles.actionsLabel, { color: textColor }]}>Action steps:</ThemedText>
                {alert.actions.map(action => (
                  <View key={action} style={styles.actionRow}>
                    <View style={[styles.bullet, { backgroundColor: severityColor }]} />
                    <ThemedText style={[styles.actionText, { color: textColor }]}>{action}</ThemedText>
                  </View>
                ))}
              </View>

              <View style={styles.footerRow}>
                <ThemedText style={[styles.timestamp, { color: textColor }]}>
                  Timestamp: {alert.timestamp}
                </ThemedText>
                <ThemedText style={[styles.source, { color: textColor }]}>
                  Source: {alert.source}
                </ThemedText>
              </View>

              <Pressable style={[styles.primaryButton, { borderColor: severityColor }]}>
                <ThemedText style={[styles.buttonText, { color: severityColor }]}>
                  I received this alert
                </ThemedText>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerStack: {
    position: 'relative',
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dfe3e8',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    paddingTop: 6,
  },
  filterTab: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  filterTabText: {
    fontSize: 13,
  },
  filterMenu: {
    position: 'absolute',
    top: 80,
    right: 0,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 6,
    width: 240,
    zIndex: 20,
    elevation: 10,
  },
  filterOption: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  filterOptionText: {
    fontSize: 13,
  },
  card: {
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  severityPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  titleText: {
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
    marginBottom: 12,
    fontSize: 14,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 2,
  },
  source: {
    fontSize: 12,
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 28,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
