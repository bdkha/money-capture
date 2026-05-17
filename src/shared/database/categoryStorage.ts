import { db } from './db';
import { AppCategory } from '../types';

function rowToCategory(r: any): AppCategory {
  return {
    id: r.id,
    key: r.key,
    kind: r.kind,
    emoji: r.emoji,
    color: r.color,
    sortOrder: r.sort_order,
  };
}

export function loadCategories(): AppCategory[] {
  const rows = db.getAllSync<any>('SELECT * FROM categories ORDER BY sort_order ASC');
  return rows.map(rowToCategory);
}

export async function addCategory(input: {
  key: string;
  emoji: string;
  color: string;
}): Promise<AppCategory[]> {
  const id = `custom-${Date.now()}`;
  const maxRow = db.getFirstSync<{ m: number }>('SELECT MAX(sort_order) as m FROM categories');
  const nextOrder = (maxRow?.m ?? -1) + 1;
  db.runSync(
    'INSERT INTO categories (id, key, kind, emoji, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    [id, input.key, 'custom', input.emoji, input.color, nextOrder],
  );
  return loadCategories();
}

export async function deleteCategory(id: string): Promise<AppCategory[]> {
  db.runSync('DELETE FROM categories WHERE id = ? AND kind = ?', [id, 'custom']);
  return loadCategories();
}

export async function updateCategoryName(id: string, name: string): Promise<AppCategory[]> {
  db.runSync('UPDATE categories SET key = ? WHERE id = ? AND kind = ?', [name, id, 'custom']);
  return loadCategories();
}
