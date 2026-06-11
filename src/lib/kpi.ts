/**
 * Typed KPI display configuration. Kept here (rather than inline in components)
 * so gauge scales and "healthy"/"high-risk" thresholds are easy to review and
 * tune without touching widget code.
 */

export interface GaugeScale {
  /** Lowest value shown on the gauge. */
  min: number;
  /** Highest value shown on the gauge. */
  max: number;
}

/**
 * CSAT gauge: shown on a 70–100 scale (matching the story). Scores at or above
 * `healthyFrom` fall in the green "healthy" arc segment.
 */
export const CSAT_SCALE: GaugeScale & { healthyFrom: number } = {
  min: 70,
  max: 100,
  healthyFrom: 85,
};

/**
 * Churn gauge: shown on a 0–50 scale. Values at or above `riskFrom` fall in the
 * red "high-risk" arc segment on the right of the gauge.
 */
export const CHURN_SCALE: GaugeScale & { riskFrom: number } = {
  min: 0,
  max: 50,
  riskFrom: 30,
};
