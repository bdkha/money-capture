import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { Colors, Spacing, FontNames } from '../../../shared/theme';

interface CalendarGridProps {
  activeDates: Set<string>;
  expenseCountByDate: Record<string, number>;
}

const DAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const WEEKS = 9;
const TOTAL_DAYS = WEEKS * 7;

function getCellBg(
  dateStr: string,
  todayStr: string,
  count: number,
  isFuture: boolean,
): string {
  if (isFuture) return Colors.ink1;
  if (count === 0) return Colors.ink2;
  if (count === 1) return 'rgba(255,107,53,0.25)';
  if (count <= 3) return 'rgba(255,107,53,0.55)';
  return Colors.orange;
}

export default function CalendarGrid({ activeDates, expenseCountByDate }: CalendarGridProps) {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Start from 9 weeks ago Monday
  const gridStart = startOfWeek(subDays(today, TOTAL_DAYS - 1), { weekStartsOn: 1 });

  // Build 9 weeks × 7 days grid
  const weeks: string[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(gridStart, w * 7 + d);
      week.push(format(date, 'yyyy-MM-dd'));
    }
    weeks.push(week);
  }

  return (
    <View style={styles.container}>
      {/* Day headers */}
      <View style={styles.headerRow}>
        {DAY_HEADERS.map((day) => (
          <Text key={day} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
      </View>

      {/* Grid rows — one per week */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((dateStr) => {
            const isFuture = dateStr > todayStr;
            const isToday = dateStr === todayStr;
            const count = expenseCountByDate[dateStr] ?? 0;
            const bg = getCellBg(dateStr, todayStr, count, isFuture);

            return (
              <View
                key={dateStr}
                style={[
                  styles.cell,
                  { backgroundColor: bg },
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayHeader: {
    width: 34,
    textAlign: 'center',
    fontFamily: FontNames.body,
    fontSize: 11,
    color: Colors.inkTextSecondary,
  },
  weekRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    borderRadius: 6,
    margin: 2,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: Colors.orange,
  },
});
