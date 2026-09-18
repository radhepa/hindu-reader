import { getDb } from './sqlite';

function todayLocalISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function recordReadingDay(versesRead: number, goalMet: boolean): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'INSERT INTO streak (date, verses_read, goal_met) VALUES (?, ?, ?) ON CONFLICT(date) DO UPDATE SET verses_read = excluded.verses_read, goal_met = excluded.goal_met',
    [todayLocalISO(), versesRead, goalMet ? 1 : 0]
  );
}

export async function getCurrentStreak(): Promise<number> {
  const db = getDb();
  const rows = await db.getAllAsync<{ date: string; goal_met: number }>(
    'SELECT date FROM streak WHERE goal_met = 1'
  );
  const met = new Set(rows.map((r) => r.date));
  let streak = 0;
  const cursor = new Date();
  // Today counts once the goal is met; an unmet today doesn't break the chain
  // yet — the streak stays alive from yesterday until the day actually ends.
  if (met.has(todayLocalISO(cursor))) streak += 1;
  cursor.setDate(cursor.getDate() - 1);
  while (met.has(todayLocalISO(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function countVersesReadToday(): Promise<number> {
  const db = getDb();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const row = await db.getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) AS n FROM progress WHERE read_at >= ?',
    [startOfToday.getTime()]
  );
  return row?.n ?? 0;
}

// Recompute today's streak row from the progress table. Called after the
// Reader marks verses read so Home's goal ring and streak stay current.
export async function updateTodayStreak(dailyGoal: number): Promise<number> {
  const read = await countVersesReadToday();
  await recordReadingDay(read, read >= dailyGoal);
  return read;
}

export async function getWeeklyConsistency(): Promise<boolean[]> {
  // Returns array of 7 booleans, oldest -> newest, for the past 7 local days.
  const db = getDb();
  const today = new Date();
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(todayLocalISO(d));
  }
  const placeholders = dates.map(() => '?').join(',');
  const rows = await db.getAllAsync<{ date: string; goal_met: number }>(
    `SELECT date, goal_met FROM streak WHERE date IN (${placeholders})`,
    dates
  );
  const hit = new Map(rows.map((r) => [r.date, r.goal_met === 1]));
  return dates.map((d) => hit.get(d) ?? false);
}
