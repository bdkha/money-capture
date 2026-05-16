import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontNames } from '../../../shared/theme';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

const DOTS_COUNT = 30;

export default function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <LinearGradient
      colors={[Colors.streakStart, Colors.streakEnd]}
      style={styles.card}
    >
      {/* Background flame decoration */}
      <Text style={styles.bgFlame}>🔥</Text>

      {/* Header label */}
      <Text style={styles.headerLabel}>Streak chộp</Text>

      {/* Streak number row */}
      <View style={styles.numberRow}>
        <Text style={styles.streakNumber}>{currentStreak}</Text>
        <Text style={styles.streakUnit}> ngày</Text>
      </View>

      {/* Longest record */}
      <Text style={styles.record}>Kỷ lục: {longestStreak} ngày</Text>

      {/* Progress dots */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: DOTS_COUNT }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i < currentStreak ? '#FFFFFF' : 'rgba(255,255,255,0.2)' },
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    overflow: 'hidden',
    minHeight: 160,
  },
  bgFlame: {
    position: 'absolute',
    fontSize: 180,
    opacity: 0.12,
    bottom: -20,
    right: -20,
  },
  headerLabel: {
    fontFamily: FontNames.bodySemi,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  streakNumber: {
    fontFamily: FontNames.amount,
    fontSize: 64,
    color: '#FFFFFF',
    lineHeight: 72,
  },
  streakUnit: {
    fontFamily: FontNames.subtitle,
    fontSize: 24,
    color: 'rgba(255,255,255,0.8)',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  record: {
    fontFamily: FontNames.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
