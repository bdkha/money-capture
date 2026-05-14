import React, { useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isToday, isYesterday, format, parseISO } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseCard from '../components/ExpenseCard';
import { Expense } from '../../../shared/types';
import { Colors, Spacing } from '../../../shared/theme';

function sectionTitle(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
}

function formatTotal(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { expenses, loading, refresh, remove } = useExpenses();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const sections = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const exp of expenses) {
      const list = map.get(exp.date) ?? [];
      list.push(exp);
      map.set(exp.date, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, data]) => ({
        title: sectionTitle(date),
        total: data.reduce((sum, e) => sum + e.amount, 0),
        data,
      }));
  }, [expenses]);

  const handleDelete = (expense: Expense) => {
    Alert.alert('Delete Expense', 'Remove this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => remove(expense.id, expense.photoUri),
      },
    ]);
  };

  if (!loading && expenses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Ionicons name="camera-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>No expenses yet</Text>
        <Text style={styles.emptyText}>Capture your first receipt with the camera tab.</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + Spacing.xl }}
      stickySectionHeadersEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refresh}
          tintColor={Colors.accent}
        />
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionTotal}>{formatTotal(section.total)}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <ExpenseCard expense={item} onDelete={() => handleDelete(item)} />
      )}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionTotal: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
