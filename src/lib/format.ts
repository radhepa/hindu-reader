// Compact duration for the per-book reading-time tracker: "0m", "<1m",
// "42m", "3h 12m".
export function formatReadingTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  if (m < 1) return totalSeconds > 0 ? '<1m' : '0m';
  const h = Math.floor(m / 60);
  if (h < 1) return `${m}m`;
  return `${h}h ${m % 60}m`;
}

export function relativeTime(ts: number, now = Date.now()): string {
  const diff = now - ts;
  if (diff < 0) return 'in the future';
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk} week${wk === 1 ? '' : 's'} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`;
  const yr = Math.floor(day / 365);
  return `${yr} year${yr === 1 ? '' : 's'} ago`;
}
