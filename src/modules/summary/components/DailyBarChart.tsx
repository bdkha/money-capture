import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { subDays, format, isSameDay } from "date-fns";
import { Expense } from "../../../shared/types";
import { Spacing, FontNames } from "../../../shared/theme";
import { formatVND } from "../../../shared/utils/currency";
import { useColors, ColorTokens } from "../../../shared/theme/ThemeContext";
import { useI18n } from "../../../shared/i18n/I18nContext";

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

  const { data, avgPerDay, numDays } = useMemo(() => {
    const today = new Date();

    // Show only days from first expense to today (max 14) so bars center naturally
    let numDays = 1;
    if (expenses.length > 0) {
      const earliest = expenses.reduce<Date>((min, exp) => {
        const d = new Date(exp.date + "T00:00:00");
        return d < min ? d : min;
      }, today);
      const diff = Math.round(
        (today.getTime() - earliest.getTime()) / 86_400_000,
      );
      numDays = Math.max(1, Math.min(14, diff + 1));
    }

    const days = Array.from({ length: numDays }, (_, i) =>
      subDays(today, numDays - 1 - i),
    );

    const dayDataList: DayData[] = days.map((day) => {
      const label = format(day, "dd/MM");
      const total = expenses
        .filter((exp) => isSameDay(new Date(exp.date + "T00:00:00"), day))
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { x: label, amount: total, isToday: isSameDay(day, today) };
    });

    const totalAmt = dayDataList.reduce((sum, d) => sum + d.amount, 0);
    const avg = Math.round(totalAmt / numDays);

    return { data: dayDataList, avgPerDay: avg, numDays };
  }, [expenses]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.chartContainer}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["amount"]}
          domainPadding={{ left: 20, right: 20, top: 12 }}
          axisOptions={{
            font: null,
            labelColor: colors.inkTextSecondary,
            lineColor: colors.ink2,
            tickCount: { x: numDays <= 7 ? numDays : 7, y: 4 },
            labelOffset: { x: 4, y: 8 },
            formatXLabel: (val: string) => {
              if (numDays <= 7) return val;
              const idx = data.findIndex((d) => d.x === val);
              return idx % 2 === 0 ? val : "";
            },
            formatYLabel: (val: number) => (val > 0 ? formatVND(val) : ""),
          }}
        >
          {({ points, chartBounds }) =>
            points.amount.map((point, i) => (
              <Bar
                key={i}
                points={[point]}
                chartBounds={chartBounds}
                color={data[i]?.isToday ? colors.orange : colors.ink3}
                roundedCorners={{ topLeft: 3, topRight: 3 }}
                barWidth={12}
              />
            ))
          }
        </CartesianChart>
      </View>
      <Text style={styles.avgLabel}>
        avg {formatVND(avgPerDay)}
        {t.stats.perDay}
      </Text>
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
      textAlign: "center",
      marginTop: Spacing.sm,
    },
  });
}
