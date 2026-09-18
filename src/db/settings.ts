// Settings DAO. Settings table is a key/value store — values are JSON-stringified
// so we can round-trip non-string types (numbers, booleans).

import { getDb } from './sqlite';
import { DEFAULT_SETTINGS, type AppSettings } from '@/types/settings';

export async function loadSettings(): Promise<AppSettings> {
  const db = getDb();
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM settings'
  );
  const loaded: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      loaded[r.key] = JSON.parse(r.value);
    } catch {
      loaded[r.key] = r.value;
    }
  }
  return { ...DEFAULT_SETTINGS, ...(loaded as Partial<AppSettings>) };
}

export async function saveSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key as string, JSON.stringify(value)]
  );
}
