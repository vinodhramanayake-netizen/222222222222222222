import type { ReactNode } from 'react';
import { chartColors } from '@/lib/tokens';
import { describeArc, polarToCartesian, valueToAngle } from './geometry';
import styles from './Gauge.module.css';

/** A colored band on the gauge, expressed in value space. */
export interface GaugeSegment {
  from: number;
  to: number;
  color: string;
}

export interface GaugeProps {
  value: number;
  min: number;
  max: number;
  /** Highlighted bands (e.g. healthy/high-risk) drawn over the muted track. */
  segments?: GaugeSegment[];
  /** Accessible description of the gauge, e.g. 'CSAT 92% on a 70–100 scale'. */
  ariaLabel: string;
  /** Optional content rendered centered within the dial (e.g. the % value). */
  centerContent?: ReactNode;
}

// Fixed SVG geometry. viewBox is 200×118: dial centered at (100,100), r=80,
// leaving headroom above the arc and a little below the hub.
const VIEW_W = 200;
const VIEW_H = 118;
const CX = 100;
const CY = 100;
const R = 80;
const NEEDLE_LEN = R * 0.82;
const TRACK_WIDTH = 14;

/**
 * Reusable semicircular gauge with a needle. The track spans the full range;
 * `segments` paint healthy/risk bands on top; the needle points at `value`.
 * Rendered as a single labelled image for assistive tech.
 */
export function Gauge({
  value,
  min,
  max,
  segments = [],
  ariaLabel,
  centerContent,
}: GaugeProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const needle = polarToCartesian(
    CX,
    CY,
    NEEDLE_LEN,
    valueToAngle(clamped, min, max)
  );

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Base track across the whole range. */}
        <path
          d={describeArc(CX, CY, R, 180, 0)}
          fill="none"
          stroke={chartColors.gaugeTrack}
          strokeWidth={TRACK_WIDTH}
          strokeLinecap="round"
        />
        {/* Highlighted bands (healthy / high-risk). */}
        {segments.map((segment, index) => (
          <path
            key={`${segment.from}-${segment.to}-${index}`}
            d={describeArc(
              CX,
              CY,
              R,
              valueToAngle(segment.from, min, max),
              valueToAngle(segment.to, min, max)
            )}
            fill="none"
            stroke={segment.color}
            strokeWidth={TRACK_WIDTH}
            strokeLinecap="round"
          />
        ))}
        {/* Needle + hub. */}
        <line
          x1={CX}
          y1={CY}
          x2={needle.x}
          y2={needle.y}
          stroke={chartColors.needle}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={6} fill={chartColors.needle} />
        {/* Scale end labels. */}
        <text x={CX - R} y={CY + 16} className={styles.scaleLabel}>
          {min}
        </text>
        <text x={CX + R} y={CY + 16} className={styles.scaleLabel}>
          {max}
        </text>
      </svg>
      {centerContent && <div className={styles.center}>{centerContent}</div>}
    </div>
  );
}
