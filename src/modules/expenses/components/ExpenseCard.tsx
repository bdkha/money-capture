import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Expense } from '../types';
import { Colors, Spacing, Radii } from '../theme';

interface ExpenseCardProps {
  expense: Expense;
  onDelete: () => void;
}

function formatAmount(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

export default function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  const color = Colors.categories[expense.category];

  return (
    <View style={styles.card}>
      <Image source={{ uri: expense.photoUri }} style={styles.thumbnail} resizeMode="cover" />
      <View style={[styles.categoryDot, { backgroundColor: color }]} />
      <View style={styles.info}>
        <Text style={styles.category}>{expense.category}</Text>
        {expense.note ? (
          <Text style={styles.note} numberOfLines={1}>
            {expense.note}
          </Text>
        ) : null}
      </View>
      <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton} hitSlop={8}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: Radii.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surfaceHigh,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  info: {
    flex: 1,
  },
  category: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  deleteText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
