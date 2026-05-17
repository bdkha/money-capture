import { useState, useEffect } from 'react';
import { Expense } from '../../../shared/types';
import { format, subDays } from 'date-fns';
import { getStreak } from '../../../shared/storage/streakStorage';

export function useStreak(expenses: Expense[]) {
  const activeDates = new Set(expenses.map((e) => e.date));

  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isStreakLost, setIsStreakLost] = useState(false);
  const [previousStreak, setPreviousStreak] = useState(0);

  useEffect(() => {
    getStreak().then((data) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      const isActive = data.last_active_date === today || data.last_active_date === yesterday;
      setCurrentStreak(isActive ? data.current_streak : 0);
      setLongestStreak(data.longest_streak);
      setIsStreakLost(!isActive && data.previous_streak > 0);
      setPreviousStreak(data.previous_streak);
    });
  }, [expenses]);

  return { currentStreak, longestStreak, activeDates, isStreakLost, previousStreak };
}
