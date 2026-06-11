import type { WeekDate } from './types';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Two-digit zero-padded number (for ISO dates). */
function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Build the seven days of the week containing `now`, always Monday→Sunday
 * regardless of locale. Pure given `now`, so callers can freeze time in tests.
 *
 * - `dayLabel`: 'Mon'…'Sun'
 * - `dateLabel`: e.g. '22 May'
 * - `isoDate`:  e.g. '2026-05-22'
 */
export function getWeekDates(now: Date): WeekDate[] {
  // Days since Monday (JS getDay: 0=Sun..6=Sat → Monday-based offset).
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - mondayOffset
  );

  return DAY_LABELS.map((dayLabel, index) => {
    const date = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + index
    );
    const day = date.getDate();
    const month = date.getMonth();
    return {
      dayLabel,
      dateLabel: `${day} ${MONTH_LABELS[month]}`,
      isoDate: `${date.getFullYear()}-${pad2(month + 1)}-${pad2(day)}`,
    };
  });
}
