import { getDb } from './sqlite';
import type { BookId } from '@/types/scripture';

export interface CertificateRow {
  book_id: BookId;
  completed_at: number;
}

export async function recordCertificate(bookId: BookId): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'INSERT INTO certificates (book_id, completed_at) VALUES (?, ?) ON CONFLICT(book_id) DO NOTHING',
    [bookId, Date.now()]
  );
}

export async function listCertificates(): Promise<CertificateRow[]> {
  const db = getDb();
  return getDb().getAllAsync<CertificateRow>(
    'SELECT book_id, completed_at FROM certificates ORDER BY completed_at DESC'
  );
}
