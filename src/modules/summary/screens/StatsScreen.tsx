import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useExpenses } from '../../expenses/hooks/useExpenses';
import { useMonthlySummary } from '../hooks/useMonthlySummary';
import DonutChart from '../components/DonutChart';
import DailyBarChart from '../components/DailyBarChart';
import TrendCard from '../components/TrendCard';
import { Spacing, CATEGORY_META, FontNames } from '../../../shared/theme';
import { CATEGORIES, Category } from '../../../shared/types';
import { formatVND } from '../../../shared/utils/currency';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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

  const topCategories = useMemo(() => {
    return CATEGORIES
      .map((cat) => ({
        cat,
        amount: summary.byCategory[cat] ?? 0,
        pct: summary.totalCents > 0
          ? Math.round(((summary.byCategory[cat] ?? 0) / summary.totalCents) * 100)
          : 0,
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [summary]);

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

      {/* 2. Donut chart + top categories card */}
      <View style={styles.donutCard}>
        <DonutChart summary={summary} />
        <View style={styles.legendSection}>
          <Text style={styles.legendTitle}>{t.stats.topCategories}</Text>
          {topCategories.map(({ cat, pct }) => (
            <View key={cat} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: CATEGORY_META[cat].color }]} />
              <Text style={styles.legendCatName}>{CATEGORY_META[cat].emoji} {cat}</Text>
              <Text style={styles.legendPct}>{pct}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Daily bar chart - 14 days */}
      <DailyBarChart expenses={expenses} />

      {/* 4. Category breakdown */}
      <Text style={styles.sectionLabel}>{t.stats.byCategory}</Text>
      <View style={styles.categoryCard}>
        {CATEGORIES.map((cat, index) => {
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
              isLast={index === CATEGORIES.length - 1}
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
  isLast?: boolean;
}

function CategoryRow({ cat, amount, pct, isLast }: CategoryRowProps) {
  const colors = useColors();
  const { t } = useI18n();
  const catStyles = useMemo(() => makeCatStyles(colors), [colors]);
  const meta = CATEGORY_META[cat];

  return (
    <View style={[catStyles.row, !isLast && catStyles.rowBorder]}>
      {/* Emoji rounded square */}
      <View style={[catStyles.emojiBox, { backgroundColor: meta.color + '22' }]}>
        <Text style={catStyles.emoji}>{meta.emoji}</Text>
      </View>

      {/* Name + pct */}
      <View style={catStyles.textGroup}>
        <Text style={catStyles.catName}>{cat}</Text>
        <Text style={catStyles.catPct}>{pct}% {t.stats.ofTotal}</Text>
      </View>

      {/* Amount */}
      {amount > 0 && (
        <Text style={catStyles.catAmount}>{formatVND(amount)}</Text>
      )}
    </View>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.ink0,
    },
    content: {
      gap: Spacing.sm,
    },
    donutCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardBg,
      borderRadius: 20,
      marginHorizontal: Spacing.lg,
      padding: 20,
      shadowColor: '#281910',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 8,
    },
    legendSection: {
      flex: 1,
      marginLeft: 12,
    },
    legendTitle: {
      fontFamily: FontNames.body,
      fontSize: 12,
      color: c.inkTextSecondary,
      marginBottom: 6,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 5,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 2,
    },
    legendCatName: {
      flex: 1,
      fontFamily: FontNames.bodySemi,
      fontSize: 14,
      color: c.inkTextPrimary,
    },
    legendPct: {
      fontFamily: FontNames.amountReg,
      fontSize: 13,
      color: c.inkTextSecondary,
    },
    sectionLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 11,
      color: c.inkTextSecondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      paddingHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    categoryCard: {
      backgroundColor: c.cardBg,
      borderRadius: 20,
      marginHorizontal: Spacing.lg,
      paddingHorizontal: 4,
      paddingTop: 6,
      shadowColor: '#281910',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 8,
    },
  });
}

function makeCatStyles(c: ColorTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    rowBorder: {
      borderBottomWidth: 0.8,
      borderBottomColor: c.ink2,
    },
    emojiBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 18,
    },
    textGroup: {
      flex: 1,
      gap: 1,
    },
    catName: {
      fontFamily: FontNames.bodySemi,
      fontSize: 14,
      color: c.inkTextPrimary,
    },
    catPct: {
      fontFamily: FontNames.amountReg,
      fontSize: 12,
      color: c.inkTextSecondary,
    },
    catAmount: {
      fontFamily: FontNames.bodySemi,
      fontSize: 15,
      color: c.inkTextPrimary,
    },
  });
}
