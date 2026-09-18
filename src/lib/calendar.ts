import type { CalendarFile, Holiday } from '@/types/scripture';

let cache: CalendarFile | null = null;

function load(): CalendarFile {
  if (cache) return cache;
  cache = require('../../assets/data/calendar.json') as CalendarFile;
  return cache;
}

export function getHolidaysForYear(): Holiday[] {
  return load().holidays;
}

export function getUpcomingHolidays(limit = 10, now = new Date()): Holiday[] {
  const today = now.toISOString().slice(0, 10);
  return load()
    .holidays.filter((h) => h.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function getNextHolidayWithin(days: number, now = new Date()): Holiday | null {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);
  return (
    load().holidays
      .filter((h) => h.date >= today && h.date <= cutoffStr)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
  );
}

export function daysUntil(dateStr: string, now = new Date()): number {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
