import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Category } from '../../../shared/types';

const STORAGE_KEY = '@money_capture:expenses';
const MIGRATION_KEY = '@chopp:migrated_v2';

const CATEGORY_MAP: Record<string, Category> = {
  Food: 'Ăn uống',
  Transport: 'Đi lại',
  Shopping: 'Mua sắm',
  Bills: 'Nhà',
  Entertainment: 'Vui chơi',
  Health: 'Nhà',
  Other: 'Ăn uống',
};

export async function migrateExpensesIfNeeded(): Promise<void> {
  const done = await AsyncStorage.getItem(MIGRATION_KEY);
  if (done) return;
  const expenses = await loadExpenses();
  const migrated = expenses.map((e) => ({
    ...e,
    category: (CATEGORY_MAP[e.category as string] ?? e.category) as Category,
  }));
  await saveExpenses(migrated);
  await AsyncStorage.setItem(MIGRATION_KEY, '1');
}

export async function loadExpenses(): Promise<Expense[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

async function saveExpenses(expenses: Expense[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export async function addExpense(expense: Expense): Promise<Expense[]> {
  const existing = await loadExpenses();
  const updated = [expense, ...existing];
  await saveExpenses(updated);
  return updated;
}

export async function deleteExpense(id: string): Promise<Expense[]> {
  const existing = await loadExpenses();
  const updated = existing.filter((e) => e.id !== id);
  await saveExpenses(updated);
  return updated;
}
