import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatDeltaPct } from '@/lib/data';
import styles from './DeltaBadge.module.css';

export interface DeltaBadgeProps {
  /** Signed percentage change. */
  deltaPct: number;
  /**
   * Whether an increase is a good outcome. New users/reports → true; response
   * and resolution times → false (faster is better). This decides the color,
   * while the arrow always reflects the actual direction of change.
   */
  higherIsBetter: boolean;
  /** Comparison context, e.g. 'vs yesterday' or 'vs prior week'. */
  comparisonLabel: string;
}

type Tone = 'positive' | 'negative' | 'neutral';

function toneFor(deltaPct: number, higherIsBetter: boolean): Tone {
  if (deltaPct === 0) return 'neutral';
  const isIncrease = deltaPct > 0;
  return isIncrease === higherIsBetter ? 'positive' : 'negative';
}

/**
 * A delta indicator: a direction arrow plus the signed percentage, colored by
 * whether the change is good or bad, followed by the comparison label. The
 * arrow direction reflects the sign; the color reflects the outcome.
 */
export function DeltaBadge({
  deltaPct,
  higherIsBetter,
  comparisonLabel,
}: DeltaBadgeProps) {
  const direction = deltaPct >= 0 ? 'up' : 'down';
  const tone = toneFor(deltaPct, higherIsBetter);
  const Arrow = direction === 'up' ? ArrowUp : ArrowDown;
  const directionWord = direction === 'up' ? 'increased' : 'decreased';

  return (
    <span className={styles.badge} data-direction={direction} data-tone={tone}>
      <span
        className={styles.pill}
        aria-label={`${directionWord} ${formatDeltaPct(Math.abs(deltaPct))} ${comparisonLabel}`}
      >
        <Arrow size={14} aria-hidden="true" />
        {formatDeltaPct(deltaPct)}
      </span>
      <span className={styles.comparison} aria-hidden="true">
        {comparisonLabel}
      </span>
    </span>
  );
}
