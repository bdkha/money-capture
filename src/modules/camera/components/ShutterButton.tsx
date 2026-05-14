import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

interface ShutterButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function ShutterButton({ onPress, disabled }: ShutterButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 30 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.outer, { transform: [{ scale }], opacity: disabled ? 0.4 : 1 }]}>
        <View style={styles.inner} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
});
