import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ShutterButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShutterButton({ onPress, disabled = false }: ShutterButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.4 : 1,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.88, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
      accessibilityRole="button"
      accessibilityLabel="Chụp ảnh"
    >
      <Animated.View style={[styles.outerRing, animatedStyle]}>
        <LinearGradient
          colors={['#7FB77E', '#4E8C5C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.innerGradient}
        />
      </Animated.View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: 'rgba(78,140,92,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
