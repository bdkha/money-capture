import { useState, useCallback, useEffect } from 'react';
import { MonthBudget, Category } from '../../../shared/types';
import { loadBudget, updateCategoryBudget } from '../storage/budgetStorage';

export function useBudget(month: string) {
  const [budget, setBudget] = useState<MonthBudget | null>(null);

  const load = useCallback(async () => {
    const b = await loadBudget(month);
    setBudget(b);
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  const updateCap = useCallback(
    async (category: Category, capCents: number) => {
      const updated = await updateCategoryBudget(month, category, capCents);
      setBudget(updated);
    },
    [month],
  );

  return { budget, updateCap, reload: load };
}
