import React, { useRef } from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { IconSymbol } from "./ui/icon-symbol";

const BUTTON_SIZE = 70;

interface EmergencyCallButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
}

export function EmergencyCallButton({ onPress }: EmergencyCallButtonProps) {
  const fillProgress = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const hasTriggeredNavigation = useRef(false);

  // Watch for when fillProgress reaches 1 (red takes over)
  useAnimatedReaction(
    () => fillProgress.value,
    (value) => {
      if (
        value >= 0.99 &&
        !hasTriggeredNavigation.current &&
        isAnimating.value
      ) {
        hasTriggeredNavigation.current = true;
        // Trigger navigation callback
        if (onPress) {
          runOnJS(onPress)({} as GestureResponderEvent);
        }
      }
    },
  );

  const startAnimation = () => {
    hasTriggeredNavigation.current = false;
    isAnimating.value = true;

    // Continuous loop: fill expands (0->1) then resets for next cycle
    fillProgress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        }),
      ),
      -1, // repeat indefinitely
      true, // reverse
    );

    // Continuous icon shake animation
    iconRotation.value = withRepeat(
      withSequence(
        withTiming(15, {
          duration: 100,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(-15, {
          duration: 100,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: 100,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      false,
    );
  };

  const stopAnimation = () => {
    isAnimating.value = false;
    fillProgress.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
    iconRotation.value = 0;
  };

  const fillStyle = useAnimatedStyle(() => {
    const scale = fillProgress.value;
    const opacity = 1 - fillProgress.value * 0.3;

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconRotation.value}deg` }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={startAnimation}
      onPressOut={stopAnimation}
      style={styles.container}
    >
      {/* Base green button */}
      <Animated.View style={[styles.button, styles.baseButton]} />

      {/* Orange to Red radial fill (center) */}
      <Animated.View style={[styles.fillLayer, styles.orangeFill, fillStyle]} />

      {/* Red radial fill (middle) */}
      <Animated.View style={[styles.fillLayer, styles.redFill, fillStyle]} />

      {/* Icon with ringing animation */}
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <IconSymbol name="phone" size={28} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  baseButton: {
    position: "absolute",
    backgroundColor: "#4CAF50",
  },
  fillLayer: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  orangeFill: {
    backgroundColor: "#FF9800",
  },
  redFill: {
    backgroundColor: "#F44336",
  },
  iconContainer: {
    position: "absolute",
    zIndex: 10,
  },
});
