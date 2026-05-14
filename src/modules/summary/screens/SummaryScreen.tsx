import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useExpenses } from '../hooks/useExpenses';
import { useMonthlySummary } from '../hooks/useMonthlySummary';
import SummaryCard from '../components/SummaryCard';
import MonthlyBarChart from '../components/MonthlyBarChart';
import CategoryPieChart from '../components/CategoryPieChart';
import { Colors, Spacing } from '../theme';

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const { expenses, refresh } = useExpenses();
  const summary = useMonthlySummary(expenses, currentMonth);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const goPrev = () => {
    const d = parseISO(currentMonth + '-01');
    setCurrentMonth(format(subMonths(d, 1), 'yyyy-MM'));
  };

  const goNext = () => {
    const d = parseISO(currentMonth + '-01');
    const next = addMonths(d, 1);
    if (next <= new Date()) {
      setCurrentMonth(format(next, 'yyyy-MM'));
    }
  };

  const monthLabel = format(parseISO(currentMonth + '-01'), 'MMMM yyyy');
  const isCurrentMonth = currentMonth === format(new Date(), 'yyyy-MM');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      {/* Month selector */}
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={goPrev} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity
          onPress={goNext}
          style={[styles.arrowButton, isCurrentMonth && styles.arrowDisabled]}
          disabled={isCurrentMonth}
        >
          <Ionicons name="chevron-forward" size={22} color={isCurrentMonth ? Colors.border : Colors.text} />
        </TouchableOpacity>
      </View>

      <SummaryCard totalCents={summary.totalCents} month={currentMonth} />

      {summary.totalCents > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Spending by Category</Text>
          <MonthlyBarChart summary={summary} />

          <Text style={styles.sectionLabel}>Breakdown</Text>
          <CategoryPieChart summary={summary} />
        </>
      ) : (
        <View style={styles.noData}>
          <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.noDataText}>No expenses recorded for this month.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    gap: Spacing.lg,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  arrowButton: {
    padding: Spacing.sm,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  monthLabel: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: Spacing.lg,
    marginBottom: -Spacing.sm,
  },
  noData: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  noDataText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
