import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('money-capture.db');

db.execSync(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    note TEXT DEFAULT '',
    date TEXT NOT NULL,
    photo_uri TEXT NOT NULL,
    created_at TEXT NOT NULL,
    mood TEXT
  )
`);

db.execSync(`
  CREATE TABLE IF NOT EXISTS budgets (
    month TEXT PRIMARY KEY,
    total_cap INTEGER NOT NULL,
    categories TEXT NOT NULL
  )
`);

db.execSync(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'custom',
    emoji TEXT NOT NULL,
    color TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )
`);

const _catCount = db.getFirstSync<{ c: number }>('SELECT COUNT(*) as c FROM categories');
if (!_catCount || _catCount.c === 0) {
  const _defaults: [string, string, string, string, number][] = [
    ['default-cafe',          'cafe',          '☕', '#A87248', 0],
    ['default-food',          'food',          '🍜', '#D86B2C', 1],
    ['default-shopping',      'shopping',      '🛍', '#B6498F', 2],
    ['default-transport',     'transport',     '🚖', '#4A78C8', 3],
    ['default-entertainment', 'entertainment', '🎉', '#8854B0', 4],
    ['default-home',          'home',          '🏠', '#2F8769', 5],
  ];
  for (const [id, key, emoji, color, order] of _defaults) {
    db.runSync(
      'INSERT INTO categories (id, key, kind, emoji, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [id, key, 'default', emoji, color, order],
    );
  }
}
