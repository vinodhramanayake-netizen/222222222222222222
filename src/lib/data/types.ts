/**
 * Canonical data model for the dashboard. Every widget reads from a single
 * `DemoDashboardData` object produced deterministically from one numeric seed.
 * These types mirror the story's data-model contract exactly.
 */

/** One day of the displayed week (always Mon–Sun). */
export interface WeekDate {
  /** Short weekday label, e.g. 'Mon'. */
  dayLabel: string;
  /** Short date label, e.g. '22 May'. */
  dateLabel: string;
  /** ISO calendar date, e.g. '2026-05-22'. */
  isoDate: string;
}

/** A duration metric with a headline display and week-over-week delta. */
export interface DurationMetric {
  /** Raw value in minutes (source of truth for the metric). */
  valueMinutes: number;
  /** Human-friendly headline, e.g. '1h 12m'. */
  display: string;
  /** Signed percentage change vs the prior week (negative = faster/better). */
  deltaPct: number;
}

/** A support ticket tag and its volume for the week. */
export interface TagCount {
  tag: string;
  count: number;
}

/** A single positive customer-feedback entry. */
export interface FeedbackItem {
  id: string;
  text: string;
  /** ISO timestamp the feedback was left (used for relative '2h ago' labels). */
  createdAtIso: string;
}

/** One point on the Mon–Sun tickets line chart. */
export interface TicketsPoint {
  /** Matches the corresponding `WeekDate.dateLabel`, e.g. '22 May'. */
  dateLabel: string;
  received: number;
  solved: number;
}

/** A simple count metric with a signed delta vs the prior period. */
export interface DeltaStat {
  count: number;
  deltaPct: number;
}

/** Lifetime-value metric with progress toward a target. */
export interface LtvMetric {
  valueUsd: number;
  targetUsd: number;
}

/** Support-team metrics (left + center columns). */
export interface SupportData {
  /** Customer satisfaction %, on the 70–100 gauge scale. */
  csatPercent: number;
  /** First Response Time. */
  frt: DurationMetric;
  /** Average Resolution Time. */
  art: DurationMetric;
  /** Tickets grouped by tag, sorted by volume descending. */
  ticketsByTag: TagCount[];
  /** Recent positive customer feedback. */
  feedback: FeedbackItem[];
  /** Mon–Sun received vs solved ticket counts. */
  ticketsSeries: TicketsPoint[];
}

/** Product metrics (right column). */
export interface ProductData {
  newUsers: DeltaStat;
  reportsCreated: DeltaStat;
  /** Churn %, on the 0–50 gauge scale. */
  churnPercent: number;
  ltv: LtvMetric;
}

/** The complete, deterministic dashboard dataset for a single seed. */
export interface DemoDashboardData {
  seed: number;
  /** ISO timestamp of when this dataset was generated ('Last generated'). */
  generatedAtIso: string;
  /** The displayed week, always Monday→Sunday. */
  weekDates: WeekDate[];
  support: SupportData;
  product: ProductData;
}
