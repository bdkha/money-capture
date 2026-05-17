import { db } from '../../../shared/database/db';
import { Expense } from '../../../shared/types';
import { updateStreak } from '../../../shared/storage/streakStorage';

export async function loadExpenses(): Promise<Expense[]> {
  const rows = db.getAllSync<any>('SELECT * FROM expenses ORDER BY created_at DESC');
  return rows.map((r) => ({
    id: r.id,
    amount: r.amount,
    category: r.category,
    note: r.note,
    date: r.date,
    photoUri: r.photo_uri,
    createdAt: r.created_at,
    mood: r.mood ?? undefined,
  }));
}

export async function addExpense(expense: Expense): Promise<Expense[]> {
  db.runSync(
    'INSERT INTO expenses (id, amount, category, note, date, photo_uri, created_at, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [expense.id, expense.amount, expense.category, expense.note, expense.date, expense.photoUri, expense.createdAt, expense.mood ?? null],
  );
  await updateStreak();
  return loadExpenses();
}

export async function deleteExpense(id: string): Promise<Expense[]> {
  db.runSync('DELETE FROM expenses WHERE id = ?', [id]);
  return loadExpenses();
}
