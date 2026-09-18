// Progress DAO — tracks which verses a user has read.
// Re-reading the same verse doesn't double-count per FEATURES.md §4.

import { getDb } from './sqlite';
import type { BookId } from '@/types/scripture';

export async function markVerseRead(bookId: BookId, verseId: string): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'INSERT INTO progress (book_id, verse_id, read_at) VALUES (?, ?, ?) ON CONFLICT(book_id, verse_id) DO NOTHING',
    [bookId, verseId, Date.now()]
  );
}

export async function countVersesRead(bookId: BookId): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) AS n FROM progress WHERE book_id = ?',
    [bookId]
  );
  return row?.n ?? 0;
}

export async function getReadVerseIds(bookId: BookId): Promise<Set<string>> {
  const db = getDb();
  const rows = await db.getAllAsync<{ verse_id: string }>(
    'SELECT verse_id FROM progress WHERE book_id = ?',
    [bookId]
  );
  return new Set(rows.map((r) => r.verse_id));
}
