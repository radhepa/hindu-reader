import { getDb } from './sqlite';
import type { BookId } from '@/types/scripture';

export async function setLastPosition(bookId: BookId, verseId: string): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'INSERT INTO last_position (book_id, verse_id, updated_at) VALUES (?, ?, ?) ON CONFLICT(book_id) DO UPDATE SET verse_id = excluded.verse_id, updated_at = excluded.updated_at',
    [bookId, verseId, Date.now()]
  );
}

export async function getLastPosition(
  bookId: BookId
): Promise<{ verseId: string; updatedAt: number } | null> {
  const db = getDb();
  const row = await db.getFirstAsync<{ verse_id: string; updated_at: number }>(
    'SELECT verse_id, updated_at FROM last_position WHERE book_id = ?',
    [bookId]
  );
  return row ? { verseId: row.verse_id, updatedAt: row.updated_at } : null;
}
