import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../../../shared/types';

const STORAGE_KEY = '@money_capture:expenses';

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
