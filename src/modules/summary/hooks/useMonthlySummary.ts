import { useMemo } from 'react';
import { Expense, Category, MonthlySummary, CATEGORIES } from '../types';

export function useMonthlySummary(expenses: Expense[], month: string): MonthlySummary {
  return useMemo(() => {
    const byCategory = Object.fromEntries(
      CATEGORIES.map((cat) => [cat, 0])
    ) as Record<Category, number>;

    let totalCents = 0;

    for (const exp of expenses) {
      if (exp.date.startsWith(month)) {
        byCategory[exp.category] += exp.amount;
        totalCents += exp.amount;
      }
    }

    return { month, totalCents, byCategory };
  }, [expenses, month]);
}
