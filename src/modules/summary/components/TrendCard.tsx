import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Colors, Spacing, Radii, FontNames } from '../../../shared/theme';

interface TrendCardProps {
  month: string; // 'YYYY-MM'
  onPrev: () => void;
  onNext: () => void;
  isCurrentMonth: boolean;
  prevMonthTotal: number;
  currentMonthTotal: number;
}

export default function TrendCard({
  month,
  onPrev,
  onNext,
  isCurrentMonth,
  prevMonthTotal,
  currentMonthTotal,
}: TrendCardProps) {
  const date = parseISO(month + '-01');
  const monthNum = format(date, 'M');
  const year = format(date, 'yyyy');
  const monthLabel = `Tháng ${monthNum} năm ${year}`;

  // Compute trend pill info
  let pillBg: string | null = null;
  let pillTextColor = Colors.inkTextSecondary;
  let pillText = '';
  let showPill = false;

  if (prevMonthTotal > 0) {
    showPill = true;
    const pct = ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;

    if (pct < 0) {
      pillBg = '#D9EFE3';
      pillTextColor = Colors.success;
      pillText = `↓ ${Math.abs(pct).toFixed(0)}% so với tháng trước`;
    } else if (pct > 0) {
      pillBg = '#FFE8E8';
      pillTextColor = Colors.danger;
      pillText = `↑ ${pct.toFixed(0)}% so với tháng trước`;
    } else {
      pillBg = Colors.ink1;
      pillTextColor = Colors.inkTextSecondary;
      pillText = 'Bằng tháng trước';
    }
  }

  return (
    <View style={styles.container}>
      {/* Month navigation row */}
      <View style={styles.monthRow}>
        <TouchableOpacity
          onPress={onPrev}
          style={styles.arrowButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.inkTextPrimary} />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{monthLabel}</Text>

        <TouchableOpacity
          onPress={onNext}
          style={[styles.arrowButton, isCurrentMonth && styles.arrowDisabled]}
          disabled={isCurrentMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={isCurrentMonth ? Colors.ink3 : Colors.inkTextPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Trend pill */}
      {showPill && pillBg !== null && (
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: pillBg }]}>
            <Text style={[styles.pillText, { color: pillTextColor }]}>
              {pillText}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    padding: Spacing.xs,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  monthLabel: {
    fontFamily: FontNames.title,
    fontSize: 17,
    color: Colors.inkTextPrimary,
    flex: 1,
    textAlign: 'center',
  },
  pillRow: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  pill: {
    borderRadius: Radii.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontFamily: FontNames.body,
    fontSize: 12,
  },
});
