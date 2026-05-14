export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
];

export interface Expense {
  id: string;
  amount: number; // stored in cents (integer)
  category: Category;
  note: string;
  date: string; // 'YYYY-MM-DD'
  photoUri: string; // permanent path in FileSystem.documentDirectory
  createdAt: string; // ISO timestamp for sorting
}

export interface MonthlySummary {
  month: string; // 'YYYY-MM'
  totalCents: number;
  byCategory: Record<Category, number>; // cents per category
}
