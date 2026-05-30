import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isToday, isYesterday, format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import { useExpenses } from '../hooks/useExpenses';
import { useStreak } from '../../profile/hooks/useStreak';
import FeedCard from '../components/FeedCard';
import { Expense } from '../../../shared/types';
import { Spacing, Radii, FontNames } from '../../../shared/theme';
import { formatVND } from '../../../shared/utils/currency';
import { useColors, ColorTokens } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';
import { Strings } from '../../../shared/i18n/translations';

function sectionTitle(dateStr: string, t: Strings): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return t.feed.today;
  if (isYesterday(d)) return t.feed.yesterday;
  return format(d, "d 'tháng' M", { locale: vi });
}

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { expenses, loading, refresh, remove } = useExpenses();
  const { currentStreak } = useStreak(expenses);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthNum = format(new Date(), 'M');

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(currentMonth)),
    [expenses, currentMonth]
  );

  const totalMonthAmount = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthExpenses]
  );

  const sections = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const exp of monthExpenses) {
      const list = map.get(exp.date) ?? [];
      list.push(exp);
      map.set(exp.date, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, data]) => ({
        title: sectionTitle(date, t),
        data,
      }));
  }, [monthExpenses, t]);

  const handleDelete = (expense: Expense) => {
    Alert.alert(t.feed.deleteTitle, t.feed.deleteMessage, [
      { text: t.feed.deleteCancel, style: 'cancel' },
      {
        text: t.feed.deleteConfirm,
        style: 'destructive',
        onPress: () => remove(expense.id, expense.photoUri),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.titleText}>{t.feed.title} {currentMonthNum}</Text>
            <Text style={styles.totalText}>{formatVND(totalMonthAmount)}</Text>
          </View>
          <View style={styles.headerRight}>
            {/* Flame streak pill */}
            <View style={styles.flamePill}>
              <Text style={styles.flameText}>🔥 {currentStreak} {t.feed.streakDays}</Text>
            </View>
            {/* Sort icon */}
            <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
              <Ionicons name="funnel-outline" size={20} color={colors.inkTextSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.orange}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            {section.data.map((expense) => (
              <FeedCard
                key={expense.id}
                expense={expense}
                onDelete={() => handleDelete(expense)}
              />
            ))}
          </View>
        ))}

        {/* Empty state */}
        {!loading && expenses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="camera-outline" size={64} color={colors.ink3} />
            <Text style={styles.emptyTitle}>{t.feed.emptyTitle}</Text>
            <Text style={styles.emptyBody}>{t.feed.emptyBody}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function makeStyles(c: ColorTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.ink0,
    },
    header: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleText: {
      fontFamily: FontNames.title,
      fontSize: 22,
      color: c.inkTextPrimary,
    },
    totalText: {
      fontFamily: FontNames.amount,
      fontSize: 28,
      color: c.orange,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    flamePill: {
      backgroundColor: c.ink1,
      borderRadius: Radii.full,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    flameText: {
      fontFamily: FontNames.body,
      fontSize: 12,
      lineHeight: 17,
      color: c.inkTextSecondary,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
    },
    sectionLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 13,
      color: c.inkTextSecondary,
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      gap: Spacing.md,
    },
    emptyTitle: {
      fontFamily: FontNames.title,
      fontSize: 22,
      color: c.inkTextPrimary,
      textAlign: 'center',
    },
    emptyBody: {
      fontFamily: FontNames.body,
      fontSize: 15,
      lineHeight: 22,
      color: c.inkTextSecondary,
      textAlign: 'center',
    },
  });
}
