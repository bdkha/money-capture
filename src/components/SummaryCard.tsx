import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii } from '../theme';

interface SummaryCardProps {
  totalCents: number;
  month: string;
}

function formatAmount(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

export default function SummaryCard({ totalCents, month }: SummaryCardProps) {
  const [year, mon] = month.split('-');
  const label = new Date(Number(year), Number(mon) - 1, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <Text style={styles.monthLabel}>{label}</Text>
      <Text style={styles.total}>{formatAmount(totalCents)}</Text>
      <Text style={styles.subtitle}>total spent</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  monthLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  total: {
    color: Colors.accent,
    fontSize: 44,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: Spacing.xs,
  },
});
