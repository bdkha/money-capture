import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontNames } from '../../../shared/theme';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';

interface CalendarGridProps {
  activeDates: Set<string>;
  expenseCountByDate: Record<string, number>;
  month?: Date;
}

const CARD_PADDING = 16;
const GAP = 4;

export default function CalendarGrid({ activeDates, expenseCountByDate, month }: CalendarGridProps) {
  const colors = useColors();
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [currentMonth, setCurrentMonth] = useState(month ?? new Date());

  const DAY_HEADERS = [t.days.mon, t.days.tue, t.days.wed, t.days.thu, t.days.fri, t.days.sat, t.days.sun];

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const monthLabel = format(currentMonth, 'MM/yyyy');
  const isCurrentMonth = format(currentMonth, 'yyyy-MM') >= format(new Date(), 'yyyy-MM');

  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const gridStart = startOfWeek(firstDay, { weekStartsOn: 1 });
  const gridEnd = startOfWeek(lastDay, { weekStartsOn: 1 });

  const weeks: (string | null)[][] = [];
  let cursor = gridStart;
  while (cursor <= addDays(gridEnd, 6)) {
    const week: (string | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = format(cursor, 'yyyy-MM-dd');
      week.push(isSameMonth(cursor, currentMonth) ? dateStr : null);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }

  const availableWidth = width - Spacing.lg * 2 - CARD_PADDING * 2;
  const cellSize = Math.floor((availableWidth - GAP * 6) / 7);

  function getCellBg(dateStr: string, count: number, isFuture: boolean): string {
    if (isFuture) return colors.ink1;
    if (count === 0) return colors.ink2;
    if (count === 1) return 'rgba(255,107,53,0.25)';
    if (count <= 3) return 'rgba(255,107,53,0.55)';
    return colors.orange;
  }

  return (
    <View style={styles.card}>
      {/* Month navigation */}
      <View style={styles.monthHeader}>
        <TouchableOpacity
          onPress={() => setCurrentMonth((m) => subMonths(m, 1))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={18} color={colors.inkTextSecondary} />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{monthLabel}</Text>

        <TouchableOpacity
          onPress={() => setCurrentMonth((m) => addMonths(m, 1))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          disabled={isCurrentMonth}
        >
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isCurrentMonth ? colors.ink2 : colors.inkTextSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={styles.headerRow}>
        {DAY_HEADERS.map((day) => (
          <Text key={day} style={[styles.dayHeader, { width: cellSize }]}>
            {day}
          </Text>
        ))}
      </View>

      {/* Grid rows */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((dateStr, di) => {
            if (!dateStr) {
              return (
                <View
                  key={di}
                  style={{ width: cellSize, height: cellSize, margin: GAP / 2 }}
                />
              );
            }
            const isFuture = dateStr > todayStr;
            const isToday = dateStr === todayStr;
            const count = expenseCountByDate[dateStr] ?? 0;
            const bg = getCellBg(dateStr, count, isFuture);

            return (
              <View
                key={dateStr}
                style={[
                  styles.cell,
                  { backgroundColor: bg, width: cellSize, height: cellSize },
                  isToday && styles.todayCell,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.cardBg,
      borderRadius: 16,
      marginHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: c.ink2,
      padding: CARD_PADDING,
    },
    monthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    monthLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 14,
      color: c.inkTextPrimary,
    },
    headerRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    dayHeader: {
      textAlign: 'center',
      fontFamily: FontNames.body,
      fontSize: 11,
      color: c.inkTextSecondary,
    },
    weekRow: {
      flexDirection: 'row',
    },
    cell: {
      borderRadius: 6,
      margin: GAP / 2,
    },
    todayCell: {
      borderWidth: 2,
      borderColor: c.orange,
    },
  });
}
