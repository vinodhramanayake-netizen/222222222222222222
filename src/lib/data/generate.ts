import { POSITIVE_FEEDBACK, SUPPORT_TAGS } from './content';
import { formatDuration } from './format';
import { createRng, randFloat, randInt, sample, type Rng } from './rng';
import type {
  DemoDashboardData,
  FeedbackItem,
  ProductData,
  SupportData,
  TagCount,
  TicketsPoint,
  WeekDate,
} from './types';
import { getWeekDates } from './week';

/**
 * Weekday volume profile for the tickets chart, Mon→Sun. Encodes a realistic
 * mid-week peak (Wed/Thu highest) and weekend drop (Sat/Sun lowest). Multiplied
 * by a seeded daily base and lightly jittered to stay deterministic yet varied.
 */
const WEEKDAY_PROFILE = [0.72, 0.86, 1.0, 0.95, 0.8, 0.42, 0.3] as const;

/** The fixed Y-axis ceiling for the tickets chart (axis runs 0–400). */
const TICKETS_MAX = 400;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Mon–Sun received vs solved counts.
 * Derived: daily base × weekday profile + small jitter for "received"; "solved"
 * is a seeded 82–100% of received (you rarely solve everything same-day). Both
 * are clamped to the chart's 0–400 range.
 */
function buildTicketsSeries(rng: Rng, weekDates: WeekDate[]): TicketsPoint[] {
  const dailyBase = randInt(rng, 260, 340);
  return weekDates.map((day, index) => {
    const weight = WEEKDAY_PROFILE[index] ?? 0.5;
    const received = clamp(
      Math.round(dailyBase * weight + randInt(rng, -12, 12)),
      0,
      TICKETS_MAX
    );
    const solved = clamp(
      Math.round(received * randFloat(rng, 0.82, 1.0, 2)),
      0,
      TICKETS_MAX
    );
    return { dateLabel: day.dateLabel, received, solved };
  });
}

/**
 * Tickets grouped by tag. Derived: sample 6–7 tags, assign each a seeded volume,
 * then sort by count descending so the bar list reads largest-first.
 */
function buildTicketsByTag(rng: Rng): TagCount[] {
  const tagCount = randInt(rng, 6, 7);
  const tags = sample(rng, SUPPORT_TAGS, tagCount);
  return tags
    .map((tag) => ({ tag, count: randInt(rng, 20, 180) }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Recent positive customer feedback. Derived: sample 5–6 quotes and stamp each
 * with a created time in the last ~2 days, then sort most-recent-first so the
 * carousel opens on the freshest item.
 */
function buildFeedback(rng: Rng, seed: number, now: Date): FeedbackItem[] {
  const itemCount = randInt(rng, 5, 6);
  const quotes = sample(rng, POSITIVE_FEEDBACK, itemCount);
  return quotes
    .map((text, index) => {
      const minutesAgo = randInt(rng, 5, 2 * 24 * 60);
      const createdAt = new Date(now.getTime() - minutesAgo * 60_000);
      return {
        id: `fb-${seed}-${index}`,
        text,
        createdAtIso: createdAt.toISOString(),
      };
    })
    .sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
}

/** Support-team metrics (left + center columns). */
function buildSupport(
  rng: Rng,
  seed: number,
  now: Date,
  weekDates: WeekDate[]
): SupportData {
  // CSAT %: kept in a healthy 78–97 band, comfortably inside the 70–100 gauge.
  const csatPercent = randFloat(rng, 78, 97, 1);

  // First Response Time: minutes → '1h 12m' style; delta can improve or regress.
  const frtMinutes = randInt(rng, 18, 95);
  const frt = {
    valueMinutes: frtMinutes,
    display: formatDuration(frtMinutes),
    deltaPct: randFloat(rng, -22, 14, 1),
  };

  // Average Resolution Time: longer (hours), same display + delta shape as FRT.
  const artMinutes = randInt(rng, 150, 470);
  const art = {
    valueMinutes: artMinutes,
    display: formatDuration(artMinutes),
    deltaPct: randFloat(rng, -18, 16, 1),
  };

  return {
    csatPercent,
    frt,
    art,
    ticketsByTag: buildTicketsByTag(rng),
    feedback: buildFeedback(rng, seed, now),
    ticketsSeries: buildTicketsSeries(rng, weekDates),
  };
}

/** Product metrics (right column). */
function buildProduct(rng: Rng): ProductData {
  // New users & reports: both trend up in the demo (story shows green ▲ deltas).
  const newUsers = {
    count: randInt(rng, 120, 480),
    deltaPct: randFloat(rng, 2, 38, 1),
  };
  const reportsCreated = {
    count: randInt(rng, 60, 320),
    deltaPct: randFloat(rng, 1.5, 30, 1),
  };

  // Churn %: low-risk demo band (2–28), inside the 0–50 gauge scale.
  const churnPercent = randFloat(rng, 2, 28, 1);

  // LTV: value always below target so the progress bar reads partially filled.
  const targetUsd = randInt(rng, 40, 60) * 100;
  const valueUsd = randInt(
    rng,
    Math.round(targetUsd * 0.45),
    Math.round(targetUsd * 0.92)
  );

  return {
    newUsers,
    reportsCreated,
    churnPercent,
    ltv: { valueUsd, targetUsd },
  };
}

/**
 * Build the complete dashboard dataset from a single seed.
 *
 * All numeric content is derived solely from `seed`, so the same seed always
 * yields the same numbers and chart series. Only time-dependent fields — the
 * current week's dates, feedback timestamps, and `generatedAtIso` — depend on
 * `now`, which is injectable so tests can freeze it.
 */
export function generateDashboardData(
  seed: number,
  now: Date = new Date()
): DemoDashboardData {
  const rng = createRng(seed);
  const weekDates = getWeekDates(now);

  return {
    seed,
    generatedAtIso: now.toISOString(),
    weekDates,
    support: buildSupport(rng, seed, now, weekDates),
    product: buildProduct(rng),
  };
}
