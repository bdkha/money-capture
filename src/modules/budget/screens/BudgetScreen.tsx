import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { format, getDaysInMonth, getDate } from 'date-fns';
import { useExpenses } from '../../expenses/hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import BudgetCard from '../components/BudgetCard';
import CategoryBudgetRow from '../components/CategoryBudgetRow';
import { Colors, Spacing, FontNames } from '../../../shared/theme';
import { CATEGORIES, Category } from '../../../shared/types';

const currentMonth = format(new Date(), 'yyyy-MM');
const monthNum = format(new Date(), 'M');

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const { expenses, refresh } = useExpenses();
  const { budget, updateCap } = useBudget(currentMonth);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const daysLeft = getDaysInMonth(new Date()) - getDate(new Date());

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      map[cat] = 0;
    }
    for (const exp of expenses) {
      if (exp.date.startsWith(currentMonth)) {
        map[exp.category] = (map[exp.category] ?? 0) + exp.amount;
      }
    }
    return map as Record<Category, number>;
  }, [expenses]);

  const totalSpent = useMemo(
    () =>
      expenses
        .filter((e: { date: string }) => e.date.startsWith(currentMonth))
        .reduce((s: number, e: { amount: number }) => s + e.amount, 0),
    [expenses],
  );

  const totalCap = budget?.totalCapCents ?? 3_000_000;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ngân quỹ T{monthNum}</Text>
        <Text style={styles.subtitle}>{daysLeft} ngày còn lại</Text>
      </View>

      {/* Hero budget card */}
      <BudgetCard
        totalCap={totalCap}
        totalSpent={totalSpent}
        month={currentMonth}
      />

      {/* Section label */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
        Chi tiết danh mục
      </Text>

      {/* Category rows card */}
      <View style={styles.categoryCard}>
        {CATEGORIES.map((cat, index) => {
          const catBudget = budget?.categories.find((c: { category: Category }) => c.category === cat);
          const capCents = catBudget?.capCents ?? 500_000;
          const spentCents = spentByCategory[cat] ?? 0;
          return (
            <View
              key={cat}
              style={index === CATEGORIES.length - 1 ? styles.lastRow : undefined}
            >
              <CategoryBudgetRow
                category={cat}
                spentCents={spentCents}
                capCents={capCents}
                onUpdateCap={(newCap) => updateCap(cat, newCap)}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ink0,
  },
  content: {
    gap: 0,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontNames.title,
    fontSize: 22,
    color: Colors.inkTextPrimary,
  },
  subtitle: {
    fontFamily: FontNames.body,
    fontSize: 13,
    color: Colors.inkTextSecondary,
    marginTop: 2,
  },
  sectionLabel: {
    fontFamily: FontNames.bodySemi,
    fontSize: 11,
    color: Colors.inkTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.ink2,
    overflow: 'hidden',
  },
  lastRow: {
    overflow: 'hidden',
  },
});
