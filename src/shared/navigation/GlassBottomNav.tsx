import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontNames, Radii } from '../theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const TAB_BAR_HEIGHT = 64;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  label: string;
  icon: IoniconName;
  isCamera?: boolean;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  Feed:    { label: 'Lịch sử',  icon: 'receipt-outline' },
  Stats:   { label: 'Thống kê', icon: 'bar-chart-outline' },
  Camera:  { label: '',         icon: 'camera',            isCamera: true },
  Budget:  { label: 'Ngân quỹ', icon: 'wallet-outline' },
  Profile: { label: 'Hồ sơ',   icon: 'flame-outline' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlassBottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const barHeight = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <View style={[styles.container, { height: barHeight }]}>
      {/* Blur background — fallback is fine on Android API < 31 */}
      <BlurView
        tint="light"
        intensity={60}
        style={StyleSheet.absoluteFill}
      />

      {/* 1 px top border */}
      <View style={styles.topBorder} />

      {/* Tab items */}
      <View style={[styles.tabRow, { paddingBottom: insets.bottom }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config: TabConfig =
            TAB_CONFIG[route.name] ?? {
              label: route.name,
              icon: 'ellipse-outline' as IoniconName,
            };

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

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          // ── Camera hero tab ────────────────────────────────────────────────
          if (config.isCamera) {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.cameraTab}
              >
                <View style={styles.cameraCircle}>
                  <Ionicons name="camera" size={26} color="#FFF" />
                </View>
              </TouchableOpacity>
            );
          }

          // ── Regular tab ────────────────────────────────────────────────────
          const iconColor = isFocused
            ? Colors.inkTextPrimary
            : Colors.inkTextSecondary;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <Ionicons name={config.icon} size={22} color={iconColor} />
              {config.label.length > 0 && (
                <Text
                  style={[
                    styles.label,
                    { color: iconColor },
                    isFocused && styles.labelActive,
                  ]}
                  numberOfLines={1}
                >
                  {config.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(26,20,8,0.08)',
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 3,
    paddingTop: 4,
  },
  cameraTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  cameraCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    // Drop shadow — orange glow
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: FontNames.bodyMed,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: Colors.inkTextPrimary,
  },
});
