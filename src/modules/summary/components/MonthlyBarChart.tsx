import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { MonthlySummary } from '../../../shared/types';
import { Colors, Spacing } from '../../../shared/theme';

interface MonthlyBarChartProps {
  summary: MonthlySummary;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MonthlyBarChart({ summary }: MonthlyBarChartProps) {
  const data = Object.entries(summary.byCategory)
    .filter(([, cents]) => cents > 0)
    .map(([category, cents]) => ({
      category: category.substring(0, 5), // abbreviated label
      amount: Math.round(cents / 100),
      color: Colors.categories[category as keyof typeof Colors.categories],
    }));

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No data this month</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CartesianChart
        data={data}
        xKey="category"
        yKeys={['amount']}
        domainPadding={{ left: 20, right: 20, top: 20 }}
        axisOptions={{
          font: null,
          labelColor: Colors.textSecondary,
          lineColor: Colors.border,
          tickCount: { x: data.length, y: 4 },
          labelOffset: { x: 4, y: 8 },
          formatXLabel: (val) => String(val),
          formatYLabel: (val) => `$${val}`,
        }}
      >
        {({ points, chartBounds }) =>
          points.amount.map((point, i) => (
            <Bar
              key={i}
              points={[point]}
              chartBounds={chartBounds}
              color={data[i]?.color ?? Colors.accent}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
            />
          ))
        }
      </CartesianChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginHorizontal: Spacing.lg,
  },
  empty: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
