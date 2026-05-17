import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../../expenses/hooks/useExpenses';
import { useStreak } from '../hooks/useStreak';
import StreakCard from '../components/StreakCard';
import CalendarGrid from '../components/CalendarGrid';
import { Spacing, FontNames, Radii } from '../../../shared/theme';
import { useColors, useTheme, ColorTokens, ThemeMode } from '../../../shared/theme/ThemeContext';
import { useI18n } from '../../../shared/i18n/I18nContext';
import { Language } from '../../../shared/i18n/translations';

// Stub friends data
const STUB_FRIENDS = [
  { id: '1', name: 'Minh Anh', streak: 12 },
  { id: '2', name: 'Tuấn', streak: 7 },
  { id: '3', name: 'Linh', streak: 3 },
];

const AVATAR_COLORS = ['#FF6B35', '#4A78C8', '#8854B0', '#2F8769', '#D86B2C'];

function avatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const { t, language, setLanguage } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { expenses, refresh } = useExpenses();
  const streak = useStreak(expenses);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const expenseCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const exp of expenses) {
      map[exp.date] = (map[exp.date] ?? 0) + 1;
    }
    return map;
  }, [expenses]);

  const photoByDate = useMemo(() => {
    const map: Record<string, string> = {};
    for (const exp of expenses) {
      if (!map[exp.date]) map[exp.date] = exp.photoUri;
    }
    return map;
  }, [expenses]);

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
        <Text style={styles.title}>{t.profile.title}</Text>
      </View>

      {/* Streak card */}
      <StreakCard
        currentStreak={streak.currentStreak}
        longestStreak={streak.longestStreak}
      />

      {/* Calendar section */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
        {t.profile.calendar}
      </Text>
      <CalendarGrid
        activeDates={streak.activeDates}
        expenseCountByDate={expenseCountByDate}
        photoByDate={photoByDate}
      />

      {/* Friends section */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
        {t.profile.friends}
      </Text>

      <View style={styles.friendsCard}>
        {STUB_FRIENDS.map((friend, index) => (
          <View
            key={friend.id}
            style={[
              styles.friendRow,
              index === STUB_FRIENDS.length - 1 && styles.friendRowLast,
            ]}
          >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: avatarColor(friend.name) }]}>
              <Text style={styles.avatarInitial}>{friend.name.charAt(0)}</Text>
            </View>

            {/* Info */}
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendSub}>{t.profile.friendSub}</Text>
            </View>

            {/* Flame pill */}
            <View style={styles.flamePill}>
              <Text style={styles.flamePillText}>🔥 {friend.streak + ' ' + t.profile.streakDays}</Text>
            </View>
          </View>
        ))}

        {/* Invite row */}
        <View style={styles.inviteRow}>
          <View style={styles.addCircle}>
            <Ionicons name="add" size={20} color={colors.inkTextSecondary} />
          </View>
          <Text style={styles.inviteText}>{t.profile.invite}</Text>
        </View>
      </View>

      {/* Settings section */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
        {t.profile.settings}
      </Text>
      <View style={styles.settingsCard}>
        {/* Theme row */}
        <View style={styles.settingsRow}>
          <View style={styles.settingsRowLeft}>
            <Ionicons name="contrast-outline" size={20} color={colors.inkTextSecondary} />
            <Text style={styles.settingsLabel}>{t.profile.theme}</Text>
          </View>
          <View style={styles.segmented}>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.segment, mode === m && styles.segmentActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, mode === m && styles.segmentTextActive]}>
                  {m === 'light' ? t.profile.themeLight : m === 'dark' ? t.profile.themeDark : t.profile.themeSystem}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Language row */}
        <View style={styles.settingsRow}>
          <View style={styles.settingsRowLeft}>
            <Ionicons name="globe-outline" size={20} color={colors.inkTextSecondary} />
            <Text style={styles.settingsLabel}>{t.profile.language}</Text>
          </View>
          <View style={styles.segmented}>
            {(['vi', 'en'] as Language[]).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.segment, language === lang && styles.segmentActive]}
                onPress={() => setLanguage(lang)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, language === lang && styles.segmentTextActive]}>
                  {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    },
    title: {
      fontFamily: FontNames.title,
      fontSize: 22,
      color: c.inkTextPrimary,
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
    friendsCard: {
      backgroundColor: c.cardBg,
      borderRadius: 16,
      marginHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: c.ink2,
      overflow: 'hidden',
    },
    friendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.ink2,
    },
    friendRowLast: {
      borderBottomWidth: 1,
      borderBottomColor: c.ink2,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitial: {
      fontFamily: FontNames.title,
      fontSize: 18,
      color: '#FFFFFF',
    },
    friendInfo: {
      flex: 1,
      marginLeft: 12,
    },
    friendName: {
      fontFamily: FontNames.bodySemi,
      fontSize: 15,
      color: c.inkTextPrimary,
    },
    friendSub: {
      fontFamily: FontNames.body,
      fontSize: 12,
      color: c.inkTextSecondary,
    },
    flamePill: {
      backgroundColor: c.ink1,
      borderRadius: Radii.full,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    flamePillText: {
      fontFamily: FontNames.body,
      fontSize: 12,
      color: c.inkTextSecondary,
    },
    inviteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      gap: 8,
    },
    addCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.ink1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: c.ink3,
      borderStyle: 'dashed',
    },
    inviteText: {
      fontFamily: FontNames.bodySemi,
      fontSize: 15,
      color: c.orange,
    },
    settingsCard: {
      backgroundColor: c.cardBg,
      borderRadius: 16,
      marginHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: c.ink2,
      overflow: 'hidden',
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: 14,
    },
    settingsRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    settingsLabel: {
      fontFamily: FontNames.bodySemi,
      fontSize: 15,
      color: c.inkTextPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: c.ink2,
      marginHorizontal: Spacing.lg,
    },
    segmented: {
      flexDirection: 'row',
      backgroundColor: c.ink1,
      borderRadius: Radii.md,
      padding: 2,
      gap: 2,
    },
    segment: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: Radii.sm,
    },
    segmentActive: {
      backgroundColor: c.cardBg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    segmentText: {
      fontFamily: FontNames.bodyMed,
      fontSize: 12,
      color: c.inkTextSecondary,
    },
    segmentTextActive: {
      color: c.inkTextPrimary,
    },
  });
}
