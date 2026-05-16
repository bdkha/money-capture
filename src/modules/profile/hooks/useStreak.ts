import { useMemo } from 'react';
import { Expense } from '../../../shared/types';
import { format, subDays, parseISO } from 'date-fns';

export function useStreak(expenses: Expense[]) {
  return useMemo(() => {
    // Build set of dates with at least 1 expense
    const activeDates = new Set(expenses.map((e) => e.date));

    // Compute current streak: consecutive days ending today or yesterday
    let currentStreak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    // Start checking from today or yesterday
    const startDay = activeDates.has(today)
      ? today
      : activeDates.has(yesterday)
        ? yesterday
        : null;

    if (startDay) {
      let checkDate = startDay;
      while (activeDates.has(checkDate)) {
        currentStreak++;
        checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
      }
    }

    // Compute longest streak
    const sortedDates = Array.from(activeDates).sort();
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: string | null = null;

    for (const dateStr of sortedDates) {
      if (prevDate) {
        const prev = parseISO(prevDate);
        const curr = parseISO(dateStr);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = dateStr;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak, activeDates };
  }, [expenses]);
}
