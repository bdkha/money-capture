import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { subDays, format, isSameDay } from 'date-fns';
import { Expense } from '../../../shared/types';
import { Spacing, FontNames } from '../../../shared/theme';
import { formatVND } from '../../../shared/utils/currency';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';

interface DailyBarChartProps {
  expenses: Expense[];
}

interface DayData {
  x: string;
  amount: number;
  isToday: boolean;
}

export default function DailyBarChart({ expenses }: DailyBarChartProps) {
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { data, avgPerDay } = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 14 }, (_, i) => subDays(today, 13 - i));

    const dayDataList: DayData[] = days.map((day) => {
      const label = format(day, 'dd/MM');
      const total = expenses
        .filter((exp) => {
          const expDate = new Date(exp.date + 'T00:00:00');
          return isSameDay(expDate, day);
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      return {
        x: label,
        amount: total,
        isToday: isSameDay(day, today),
      };
    });

    const total14 = dayDataList.reduce((sum, d) => sum + d.amount, 0);
    const avg = Math.round(total14 / 14);

    return { data: dayDataList, avgPerDay: avg };
  }, [expenses]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.chartContainer}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={['amount']}
          domainPadding={{ left: 6, right: 6, top: 12 }}
          axisOptions={{
            font: null,
            labelColor: colors.inkTextSecondary,
            lineColor: colors.ink2,
            tickCount: { x: 7, y: 4 },
            labelOffset: { x: 4, y: 8 },
            formatXLabel: (val: string) => {
              const idx = data.findIndex((d) => d.x === val);
              return idx % 2 === 0 ? val : '';
            },
            formatYLabel: (val: number) => (val > 0 ? formatVND(val) : ''),
          }}
        >
          {({ points, chartBounds }: { points: { amount: { x: number; y: number | null }[] }; chartBounds: { left: number; right: number; top: number; bottom: number } }) =>
            points.amount.map((point, i) => (
              <Bar
                key={i}
                points={[point]}
                chartBounds={chartBounds}
                color={data[i]?.isToday ? colors.orange : colors.ink3}
                roundedCorners={{ topLeft: 3, topRight: 3 }}
              />
            ))
          }
        </CartesianChart>
      </View>
      <Text style={styles.avgLabel}>avg {formatVND(avgPerDay)}{t.stats.perDay}</Text>
    </View>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    wrapper: {
      paddingHorizontal: Spacing.lg,
    },
    chartContainer: {
      height: 200,
    },
    avgLabel: {
      fontFamily: FontNames.body,
      fontSize: 12,
      color: c.inkTextSecondary,
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
  });
}
