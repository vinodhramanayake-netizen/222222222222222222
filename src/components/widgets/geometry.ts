/**
 * Pure SVG geometry helpers for the semicircular gauges. Kept DOM-free so the
 * (fiddly) trigonometry can be unit-tested in isolation.
 *
 * Convention: a 180° gauge drawn across the upper half. The minimum value sits
 * at the left (180°), the maximum at the right (0°), with the midpoint at the
 * top (90°). Angles are in degrees, measured counter-clockwise from the +x axis.
 */

export interface Point {
  x: number;
  y: number;
}

/** Map a value within [min, max] to its gauge angle in degrees (180°→0°). */
export function valueToAngle(value: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) return 180;
  const fraction = Math.min(1, Math.max(0, (value - min) / span));
  return 180 - fraction * 180;
}

/** Convert a polar coordinate (angle in degrees) to SVG cartesian space. */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): Point {
  const angleRad = (angleDeg * Math.PI) / 180;
  // SVG's y-axis points down, so subtract the sin component.
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy - r * Math.sin(angleRad),
  };
}

/**
 * Build an SVG arc path `d` string from `startDeg` to `endDeg` along the upper
 * semicircle. Expects `startDeg > endDeg` (i.e. drawn left→right). The sweep
 * flag is 1 so the arc bows over the top in SVG's flipped-y coordinate space.
 */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArcFlag = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
  ].join(' ');
}
