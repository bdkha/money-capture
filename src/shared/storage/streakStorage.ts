import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, subDays } from 'date-fns';

const STREAK_KEY = '@streak';

export type StreakData = {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  previous_streak: number;
};

const DEFAULT: StreakData = {
  current_streak: 0,
  longest_streak: 0,
  last_active_date: null,
  previous_streak: 0,
};

export async function getStreak(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  if (!raw) return { ...DEFAULT };
  return JSON.parse(raw) as StreakData;
}

export async function updateStreak(): Promise<void> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const data = await getStreak();

  if (data.last_active_date === today) return;

  let updated: StreakData;
  if (data.last_active_date === yesterday) {
    const next = data.current_streak + 1;
    updated = {
      current_streak: next,
      longest_streak: Math.max(next, data.longest_streak),
      last_active_date: today,
      previous_streak: data.previous_streak,
    };
  } else {
    updated = {
      current_streak: 1,
      longest_streak: Math.max(data.current_streak, data.longest_streak),
      last_active_date: today,
      previous_streak: data.current_streak,
    };
  }

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));
}
