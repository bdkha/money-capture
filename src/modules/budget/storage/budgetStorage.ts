import { db } from '../../../shared/database/db';
import { MonthBudget, CATEGORIES, Category } from '../../../shared/types';

const DEFAULT_CAP_PER_CATEGORY = 500_000;
const DEFAULT_TOTAL_CAP = 3_000_000;

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
  const row = db.getFirstSync<any>('SELECT * FROM budgets WHERE month = ?', [month]);
  if (!row) return defaultBudget(month);
  return {
    month: row.month,
    totalCapCents: row.total_cap,
    categories: JSON.parse(row.categories),
  };
}

export async function saveBudget(budget: MonthBudget): Promise<void> {
  db.runSync(
    'INSERT OR REPLACE INTO budgets (month, total_cap, categories) VALUES (?, ?, ?)',
    [budget.month, budget.totalCapCents, JSON.stringify(budget.categories)],
  );
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
