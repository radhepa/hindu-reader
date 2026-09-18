// Reading-time DAO. Seconds are accrued per book per local day, so per-book
// totals and week/month aggregates are both cheap queries.

import { getDb } from './sqlite';
import type { BookId } from '@/types/scripture';

function todayLocalISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function addReadingSeconds(bookId: BookId, seconds: number): Promise<void> {
  const s = Math.round(seconds);
  if (s <= 0) return;
  const db = getDb();
  await db.runAsync(
    'INSERT INTO reading_time (book_id, date, seconds) VALUES (?, ?, ?) ON CONFLICT(book_id, date) DO UPDATE SET seconds = seconds + excluded.seconds',
    [bookId, todayLocalISO(), s]
  );
}

export async function getTotalReadingSeconds(bookId: BookId): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ s: number }>(
    'SELECT COALESCE(SUM(seconds), 0) AS s FROM reading_time WHERE book_id = ?',
    [bookId]
  );
  return row?.s ?? 0;
}
