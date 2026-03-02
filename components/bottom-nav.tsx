import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { IconSymbol } from './ui/icon-symbol';
import { TealColors } from '@/constants/theme';

export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const callIndex = state.routes.findIndex(r => r.name === 'call');
  const adjacentSpacing = 40; // spacing reserved on either side of call button

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        // we only show icons for visible tabs
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // custom call button center - render first before checking if hidden
        if (route.name === 'call') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.callButtonContainer}
              activeOpacity={0.7}
            >
              <View style={styles.callButton}>
                <IconSymbol name="phone" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        // hide tabs that have custom tabBarButton function (not already handled like call)
        if (typeof options.tabBarButton === 'function') {
          return null;
        }

        const iconName =
          route.name === 'index'
            ? 'house'
            : route.name === 'notification'
            ? 'bell'
            : route.name === 'map'
            ? 'map'
            : route.name === 'me'
            ? 'person'
            : 'circle';

        // add extra margin to tabs adjacent to the call button so they don't
        // overlap with the central floating call circle
        const extraStyle = {} as any;
        if (callIndex >= 0) {
          if (index === callIndex - 1) {
            extraStyle.marginRight = adjacentSpacing;
          } else if (index === callIndex + 1) {
            extraStyle.marginLeft = adjacentSpacing;
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
              <IconSymbol
                size={24}
                name={iconName as any}
                color={isFocused ? TealColors.primary : '#888'}
              />
              <Text style={[styles.label, isFocused && { color: TealColors.primary }]}> 
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
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 80 : 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    color: '#888',
  },
  callButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 15 : 5,
    alignSelf: 'center',
    zIndex: 10,
    marginHorizontal: 20,
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: TealColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});