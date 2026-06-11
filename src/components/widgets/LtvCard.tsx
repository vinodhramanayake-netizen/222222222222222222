import { Card, Text } from '@/components/primitives';
import { formatUsd, type LtvMetric } from '@/lib/data';
import styles from './LtvCard.module.css';

export interface LtvCardProps {
  ltv: LtvMetric;
}

/**
 * Lifetime Value card: a large $ headline plus a horizontal progress bar toward
 * a target, with the target labelled at the far right. Progress is the value as
 * a fraction of the target (clamped to 100%).
 */
export function LtvCard({ ltv }: LtvCardProps) {
  const { valueUsd, targetUsd } = ltv;
  const pct = targetUsd > 0 ? Math.min(100, (valueUsd / targetUsd) * 100) : 0;
  const roundedPct = Math.round(pct);

  return (
    <Card title="Lifetime Value">
      <Text variant="kpi-value" as="span">
        {formatUsd(valueUsd)}
      </Text>

      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={roundedPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Lifetime value ${formatUsd(valueUsd)} of ${formatUsd(
          targetUsd
        )} target (${roundedPct}%)`}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>

      <div className={styles.scale}>
        <Text variant="caption" as="span">
          {roundedPct}% of target
        </Text>
        <Text variant="caption" as="span">
          {formatUsd(targetUsd)} target
        </Text>
      </div>
    </Card>
  );
}
