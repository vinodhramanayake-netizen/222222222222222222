/**
 * Pure formatting helpers shared by widgets. Kept side-effect-free so they are
 * trivially unit-testable and safe for static export.
 */

/**
 * Format a duration in minutes as a compact headline, e.g.:
 *   72  -> '1h 12m'
 *   45  -> '45m'
 *   120 -> '2h 0m'
 * Negative inputs are clamped to zero.
 */
export function formatDuration(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Format an ISO timestamp relative to `now`, e.g. 'just now', '5m ago',
 * '2h ago', '3d ago'. Future timestamps are treated as 'just now'.
 */
export function formatRelativeTime(iso: string, now: Date): string {
  const then = new Date(iso).getTime();
  const diff = now.getTime() - then;

  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  return `${Math.floor(diff / DAY)}d ago`;
}

/** Format a whole-dollar amount, e.g. 1234 -> '$1,234'. */
export function formatUsd(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

/** Format a signed percentage, e.g. 4.2 -> '+4.2%', -3 -> '-3%'. */
export function formatDeltaPct(deltaPct: number): string {
  const sign = deltaPct > 0 ? '+' : '';
  return `${sign}${deltaPct}%`;
}
