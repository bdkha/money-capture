import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('money-capture.db');

const SCHEMA_VERSION = 1;

const currentVersion = (db.getFirstSync<{ user_version: number }>('PRAGMA user_version') ?? { user_version: 0 }).user_version;

if (currentVersion < SCHEMA_VERSION) {
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

  const catCount = (db.getFirstSync<{ c: number }>('SELECT COUNT(*) as c FROM categories') ?? { c: 0 }).c;
  if (catCount === 0) {
    const defaults: [string, string, string, string, number][] = [
      ['default-cafe',          'cafe',          '☕', '#A87248', 0],
      ['default-food',          'food',          '🍜', '#D86B2C', 1],
      ['default-shopping',      'shopping',      '🛍', '#B6498F', 2],
      ['default-transport',     'transport',     '🚖', '#4A78C8', 3],
      ['default-entertainment', 'entertainment', '🎉', '#8854B0', 4],
      ['default-home',          'home',          '🏠', '#2F8769', 5],
    ];
    for (const [id, key, emoji, color, order] of defaults) {
      db.runSync(
        'INSERT INTO categories (id, key, kind, emoji, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [id, key, 'default', emoji, color, order],
      );
    }
  }

  db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}
