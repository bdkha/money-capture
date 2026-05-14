import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PolarChart, Pie } from 'victory-native';
import { MonthlySummary, CATEGORIES } from '../types';
import { Colors, Spacing, Radii } from '../theme';

interface CategoryPieChartProps {
  summary: MonthlySummary;
}

export default function CategoryPieChart({ summary }: CategoryPieChartProps) {
  const slices = CATEGORIES.filter((cat) => summary.byCategory[cat] > 0).map((cat) => ({
    label: cat,
    value: summary.byCategory[cat],
    color: Colors.categories[cat],
  }));

  if (slices.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <PolarChart
          data={slices}
          colorKey="color"
          valueKey="value"
          labelKey="label"
        >
          <Pie.Chart innerRadius="50%">
            {() => <Pie.Slice />}
          </Pie.Chart>
        </PolarChart>
      </View>
      <View style={styles.legend}>
        {slices.map((slice) => (
          <View key={slice.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
            <Text style={styles.legendLabel}>{slice.label}</Text>
            <Text style={styles.legendAmount}>
              ${(slice.value / 100).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  chart: {
    height: 200,
  },
  legend: {
    gap: Spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: Radii.full,
  },
  legendLabel: {
    color: Colors.text,
    fontSize: 14,
    flex: 1,
  },
  legendAmount: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
