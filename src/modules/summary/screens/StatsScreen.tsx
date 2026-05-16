import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format, subMonths, addMonths, parseISO, getDaysInMonth } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useExpenses } from '../../expenses/hooks/useExpenses';
import { useMonthlySummary } from '../hooks/useMonthlySummary';
import DonutChart from '../components/DonutChart';
import DailyBarChart from '../components/DailyBarChart';
import TrendCard from '../components/TrendCard';
import { Colors, Spacing, CATEGORY_META, FontNames, Radii } from '../../../shared/theme';
import { CATEGORIES, Category } from '../../../shared/types';
import { formatVND } from '../../../shared/utils/currency';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const { expenses, refresh } = useExpenses();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const summary = useMonthlySummary(expenses, currentMonth);

  const prevMonthStr = format(
    subMonths(parseISO(currentMonth + '-01'), 1),
    'yyyy-MM',
  );
  const prevSummary = useMonthlySummary(expenses, prevMonthStr);

  const isCurrentMonth = currentMonth === format(new Date(), 'yyyy-MM');

  const goPrev = () => {
    const d = parseISO(currentMonth + '-01');
    setCurrentMonth(format(subMonths(d, 1), 'yyyy-MM'));
  };

  const goNext = () => {
    if (isCurrentMonth) return;
    const d = parseISO(currentMonth + '-01');
    const next = addMonths(d, 1);
    if (next <= new Date()) {
      setCurrentMonth(format(next, 'yyyy-MM'));
    }
  };

  // Average spend per day for current month
  const daysInMonth = getDaysInMonth(parseISO(currentMonth + '-01'));
  const avgPerDay =
    summary.totalCents > 0
      ? formatVND(Math.round(summary.totalCents / daysInMonth))
      : '0đ';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.md,
          paddingBottom: insets.bottom + 80,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Month nav + trend */}
      <TrendCard
        month={currentMonth}
        onPrev={goPrev}
        onNext={goNext}
        isCurrentMonth={isCurrentMonth}
        prevMonthTotal={prevSummary.totalCents}
        currentMonthTotal={summary.totalCents}
      />

      {/* 2. Donut chart centered */}
      <View style={styles.donutSection}>
        <DonutChart summary={summary} />
        <Text style={styles.avgDayLabel}>{avgPerDay}/ngày</Text>
      </View>

      {/* 3. Daily bar chart - 14 days */}
      <Text style={styles.sectionLabel}>14 NGÀY GẦN NHẤT</Text>
      <DailyBarChart expenses={expenses} />

      {/* 4. Category breakdown */}
      <Text style={styles.sectionLabel}>THEO DANH MỤC</Text>
      <View style={styles.categoryList}>
        {CATEGORIES.map((cat) => {
          const amount = summary.byCategory[cat] ?? 0;
          const pct =
            summary.totalCents > 0
              ? Math.round((amount / summary.totalCents) * 100)
              : 0;
          return (
            <CategoryRow
              key={cat}
              cat={cat}
              amount={amount}
              pct={pct}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

interface CategoryRowProps {
  cat: Category;
  amount: number;
  pct: number;
}

function CategoryRow({ cat, amount, pct }: CategoryRowProps) {
  const meta = CATEGORY_META[cat];

  return (
    <View style={catStyles.row}>
      {/* Emoji circle */}
      <View
        style={[
          catStyles.emojiCircle,
          { backgroundColor: meta.color + '22' },
        ]}
      >
        <Text style={catStyles.emoji}>{meta.emoji}</Text>
      </View>

      {/* Label + amount */}
      <View style={catStyles.textGroup}>
        <Text style={catStyles.catName}>{cat}</Text>
        {amount > 0 && (
          <Text style={catStyles.catAmount}>{formatVND(amount)}</Text>
        )}
      </View>

      {/* Mini progress bar */}
      <View style={catStyles.barTrack}>
        <View
          style={[
            catStyles.barFill,
            {
              width: `${pct}%` as `${number}%`,
              backgroundColor: meta.color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ink0,
  },
  content: {
    gap: Spacing.sm,
  },
  donutSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  avgDayLabel: {
    fontFamily: FontNames.body,
    fontSize: 13,
    color: Colors.inkTextSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  sectionLabel: {
    fontFamily: FontNames.bodySemi,
    fontSize: 11,
    color: Colors.inkTextSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  categoryList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
});

const catStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  textGroup: {
    width: 100,
    gap: 1,
  },
  catName: {
    fontFamily: FontNames.bodySemi,
    fontSize: 14,
    color: Colors.inkTextPrimary,
  },
  catAmount: {
    fontFamily: FontNames.amountMed,
    fontSize: 14,
    color: Colors.orange,
  },
  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: Radii.sm,
    backgroundColor: Colors.ink2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: Radii.sm,
  },
});
