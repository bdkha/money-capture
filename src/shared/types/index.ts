export type Category = string;

export const CATEGORIES: Category[] = [
  'Cafe',
  'Ăn uống',
  'Mua sắm',
  'Đi lại',
  'Vui chơi',
  'Nhà',
];

export type CategoryKind = 'default' | 'custom';

export interface AppCategory {
  id: string;
  key: string;       // i18n key cho default (e.g. 'cafe'), display name cho custom
  kind: CategoryKind;
  emoji: string;
  color: string;
  sortOrder: number;
}

export type Mood = '😊' | '😋' | '😂' | '😤' | '😴';

export interface Expense {
  id: string;
  amount: number; // whole VND (đồng)
  category: Category;
  note: string;
  date: string;      // 'YYYY-MM-DD'
  photoUri: string;
  createdAt: string; // ISO timestamp
  mood?: Mood;
}

export interface MonthlySummary {
  month: string; // 'YYYY-MM'
  totalCents: number;
  byCategory: Record<Category, number>;
}

export interface CategoryBudget {
  category: Category;
  capCents: number;
}

export interface MonthBudget {
  month: string; // 'YYYY-MM'
  totalCapCents: number;
  categories: CategoryBudget[];
}
