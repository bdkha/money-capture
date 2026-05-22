import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { format, getDaysInMonth, getDate } from 'date-fns';
import { useExpenses } from '../../expenses/hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import BudgetCard from '../components/BudgetCard';
import CategoryBudgetRow from '../components/CategoryBudgetRow';
import { Spacing, FontNames } from '../../../shared/theme';
import { CATEGORIES, Category } from '../../../shared/types';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';

const currentMonth = format(new Date(), 'yyyy-MM');
const monthNum = format(new Date(), 'M');

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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

  const totalCap = useMemo(
    () => budget?.categories.reduce((sum, c) => sum + c.capCents, 0) ?? 3_000_000,
    [budget],
  );

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
        <Text style={styles.title}>{t.budget.titlePrefix + monthNum}</Text>
        <Text style={styles.subtitle}>{daysLeft + ' ' + t.budget.daysLeft}</Text>
      </View>

      {/* Hero budget card */}
      <BudgetCard
        totalCap={totalCap}
        totalSpent={totalSpent}
        month={currentMonth}
      />

      {/* Section label */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
        {t.budget.details}
      </Text>

      {/* Category rows card */}
      <View style={styles.categoryList}>
        {CATEGORIES.map((cat) => {
          const catBudget = budget?.categories.find((c: { category: Category }) => c.category === cat);
          const capCents = catBudget?.capCents ?? 500_000;
          const spentCents = spentByCategory[cat] ?? 0;
          return (
            <CategoryBudgetRow
              key={cat}
              category={cat}
              spentCents={spentCents}
              capCents={capCents}
              onUpdateCap={(newCap) => updateCap(cat, newCap)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.ink0,
    },
    content: {
      gap: 0,
    },
    header: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: FontNames.title,
      fontSize: 22,
      color: c.inkTextPrimary,
    },
    subtitle: {
      fontFamily: FontNames.body,
      fontSize: 13,
      color: c.inkTextSecondary,
      marginTop: 2,
    },
    sectionLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 11,
      color: c.inkTextSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    categoryList: {
      paddingHorizontal: Spacing.lg,
      gap: Spacing.sm,
    },
  });
}
