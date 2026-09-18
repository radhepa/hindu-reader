import { getDb } from './sqlite';
import type { BookId } from '@/types/scripture';

export interface BookmarkRow {
  verse_id: string;
  book_id: BookId;
  created_at: number;
}

export async function toggleBookmark(bookId: BookId, verseId: string): Promise<boolean> {
  const db = getDb();
  const existing = await db.getFirstAsync<{ verse_id: string }>(
    'SELECT verse_id FROM bookmarks WHERE verse_id = ?',
    [verseId]
  );
  if (existing) {
    await db.runAsync('DELETE FROM bookmarks WHERE verse_id = ?', [verseId]);
    return false;
  }
  await db.runAsync(
    'INSERT INTO bookmarks (verse_id, book_id, created_at) VALUES (?, ?, ?)',
    [verseId, bookId, Date.now()]
  );
  return true;
}

export async function listBookmarks(): Promise<BookmarkRow[]> {
  const db = getDb();
  return db.getAllAsync<BookmarkRow>(
    'SELECT verse_id, book_id, created_at FROM bookmarks ORDER BY created_at DESC'
  );
}

export async function getBookmarkedVerseIds(bookId: BookId): Promise<Set<string>> {
  const db = getDb();
  const rows = await db.getAllAsync<{ verse_id: string }>(
    'SELECT verse_id FROM bookmarks WHERE book_id = ?',
    [bookId]
  );
  return new Set(rows.map((r) => r.verse_id));
}
