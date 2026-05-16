import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Spacing, Radii, FontNames } from '../../../shared/theme';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';

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
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const date = parseISO(month + '-01');
  const m = format(date, 'M');
  const y = format(date, 'yyyy');
  const monthLabel = t.stats.month + ' ' + m + ' ' + t.stats.year + ' ' + y;

  // Compute trend pill info
  let pillBg: string | null = null;
  let pillTextColor = colors.inkTextSecondary;
  let pillText = '';
  let showPill = false;

  if (prevMonthTotal > 0) {
    showPill = true;
    const pct = ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;

    if (pct < 0) {
      pillBg = '#D9EFE3';
      pillTextColor = colors.success;
      pillText = `↓${Math.abs(pct).toFixed(0)}% ` + t.trend.decrease + ' ' + t.stats.vsLastMonth;
    } else if (pct > 0) {
      pillBg = '#FFE8E8';
      pillTextColor = colors.danger;
      pillText = `↑${pct.toFixed(0)}% ` + t.trend.increase + ' ' + t.stats.vsLastMonth;
    } else {
      pillBg = colors.ink1;
      pillTextColor = colors.inkTextSecondary;
      pillText = t.stats.vsLastMonth;
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
          <Ionicons name="chevron-back" size={22} color={colors.inkTextPrimary} />
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
            color={isCurrentMonth ? colors.ink3 : colors.inkTextPrimary}
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

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
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
      color: c.inkTextPrimary,
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
}
