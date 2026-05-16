import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, getDaysInMonth, getDate, parseISO } from 'date-fns';
import { formatVND } from '../../../shared/utils/currency';
import { Colors, Spacing, Radii, FontNames } from '../../../shared/theme';

interface BudgetCardProps {
  totalCap: number;
  totalSpent: number;
  month: string; // 'YYYY-MM'
}

export default function BudgetCard({ totalCap, totalSpent, month }: BudgetCardProps) {
  const remaining = totalCap - totalSpent;
  const pct = totalCap > 0 ? Math.min(Math.max(totalSpent / totalCap, 0), 1) : 0;

  const monthDate = parseISO(month + '-01');
  const monthNum = format(monthDate, 'M');
  const lastDay = getDaysInMonth(monthDate);

  return (
    <LinearGradient
      colors={[Colors.budgetHeroStart, Colors.budgetHeroEnd]}
      style={styles.card}
    >
      <Text style={styles.label}>Còn lại</Text>
      <Text style={styles.remaining}>{formatVND(remaining)}</Text>
      <Text style={styles.spent}>
        Đã chi {formatVND(totalSpent)} / {formatVND(totalCap)}
      </Text>

      {/* Progress bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct * 100}%` as any }]}>
          <LinearGradient
            colors={[Colors.orangeMuted, Colors.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.barGradient}
          />
        </View>
      </View>

      {/* Date markers */}
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>1/{monthNum}</Text>
        <Text style={styles.dateLabelToday}>Hôm nay</Text>
        <Text style={styles.dateLabel}>{lastDay}/{monthNum}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  label: {
    fontFamily: FontNames.bodyMed,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  remaining: {
    fontFamily: FontNames.amount,
    fontSize: 40,
    color: '#FFFFFF',
    lineHeight: 48,
  },
  spent: {
    fontFamily: FontNames.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 16,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barGradient: {
    flex: 1,
    borderRadius: 3,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateLabel: {
    fontFamily: FontNames.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  dateLabelToday: {
    fontFamily: FontNames.bodySemi,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
});
