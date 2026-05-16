import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../../expenses/hooks/useExpenses';
import { useStreak } from '../hooks/useStreak';
import StreakCard from '../components/StreakCard';
import CalendarGrid from '../components/CalendarGrid';
import { Colors, Spacing, FontNames, Radii } from '../../../shared/theme';

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
        <Text style={styles.title}>Ho so cua toi</Text>
      </View>

      {/* Streak card */}
      <StreakCard
        currentStreak={streak.currentStreak}
        longestStreak={streak.longestStreak}
      />

      {/* Calendar section */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
        Lich chop
      </Text>
      <CalendarGrid
        activeDates={streak.activeDates}
        expenseCountByDate={expenseCountByDate}
      />

      {/* Friends section */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
        Ban be
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
              <Text style={styles.friendSub}>Ban be</Text>
            </View>

            {/* Flame pill */}
            <View style={styles.flamePill}>
              <Text style={styles.flamePillText}>🔥 {friend.streak} ngay</Text>
            </View>
          </View>
        ))}

        {/* Invite row */}
        <View style={styles.inviteRow}>
          <View style={styles.addCircle}>
            <Ionicons name="add" size={20} color={Colors.inkTextSecondary} />
          </View>
          <Text style={styles.inviteText}>Moi ban be</Text>
        </View>
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
  sectionLabel: {
    fontFamily: FontNames.bodySemi,
    fontSize: 11,
    color: Colors.inkTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  friendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.ink2,
    overflow: 'hidden',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink2,
  },
  friendRowLast: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink2,
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
    color: Colors.inkTextPrimary,
  },
  friendSub: {
    fontFamily: FontNames.body,
    fontSize: 12,
    color: Colors.inkTextSecondary,
  },
  flamePill: {
    backgroundColor: Colors.ink1,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  flamePillText: {
    fontFamily: FontNames.body,
    fontSize: 12,
    color: Colors.inkTextSecondary,
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
    backgroundColor: Colors.ink1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.ink3,
    borderStyle: 'dashed',
  },
  inviteText: {
    fontFamily: FontNames.bodySemi,
    fontSize: 15,
    color: Colors.orange,
  },
});
