import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonthBudget, CATEGORIES, Category } from '../../../shared/types';

const BUDGET_KEY = '@chopp:budgets';

const DEFAULT_CAP_PER_CATEGORY = 500_000; // 500k VND
const DEFAULT_TOTAL_CAP = 3_000_000; // 3tr VND

function defaultBudget(month: string): MonthBudget {
  return {
    month,
    totalCapCents: DEFAULT_TOTAL_CAP,
    categories: CATEGORIES.map((cat) => ({
      category: cat,
      capCents: DEFAULT_CAP_PER_CATEGORY,
    })),
  };
}

export async function loadBudget(month: string): Promise<MonthBudget> {
  try {
    const raw = await AsyncStorage.getItem(BUDGET_KEY);
    if (!raw) return defaultBudget(month);
    const all = JSON.parse(raw) as Record<string, MonthBudget>;
    return all[month] ?? defaultBudget(month);
  } catch {
    return defaultBudget(month);
  }
}

export async function saveBudget(budget: MonthBudget): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(BUDGET_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, MonthBudget>) : {};
    all[budget.month] = budget;
    await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify(all));
  } catch {}
}

export async function updateCategoryBudget(
  month: string,
  category: Category,
  capCents: number,
): Promise<MonthBudget> {
  const budget = await loadBudget(month);
  const updated: MonthBudget = {
    ...budget,
    categories: budget.categories.map((c) =>
      c.category === category ? { ...c, capCents } : c,
    ),
  };
  await saveBudget(updated);
  return updated;
}
