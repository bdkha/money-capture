import { useState, useCallback, useEffect } from 'react';
import { Expense } from '../../../shared/types';
import { loadExpenses, deleteExpense, migrateExpensesIfNeeded } from '../storage/expenseStorage';
import { deletePhoto } from '../../camera/storage/photoStorage';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    await migrateExpensesIfNeeded();
    const data = await loadExpenses();
    setExpenses(data.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string, photoUri: string) => {
    const updated = await deleteExpense(id);
    await deletePhoto(photoUri);
    setExpenses(updated.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);

  return { expenses, loading, refresh, remove };
}
