import { Card, Text } from '@/components/primitives';
import { CHURN_SCALE } from '@/lib/kpi';
import { chartColors } from '@/lib/tokens';
import { Gauge } from './Gauge';
import styles from './ChurnGauge.module.css';

export interface ChurnGaugeProps {
  /** Churn percentage (derived from product.churnPercent). */
  churnPercent: number;
}

/**
 * Churn gauge: a compact 0–50% semicircular gauge with a needle and a red
 * "high-risk" arc on the right (30%+). The numeric value is shown below.
 */
export function ChurnGauge({ churnPercent }: ChurnGaugeProps) {
  const atRisk = churnPercent >= CHURN_SCALE.riskFrom;

  return (
    <Card title="Churn">
      <Gauge
        value={churnPercent}
        min={CHURN_SCALE.min}
        max={CHURN_SCALE.max}
        segments={[
          {
            from: CHURN_SCALE.riskFrom,
            to: CHURN_SCALE.max,
            color: chartColors.gaugeRisk,
          },
        ]}
        ariaLabel={`Churn ${churnPercent}%, ${
          atRisk ? 'in the high-risk range' : 'within a healthy range'
        }, on a ${CHURN_SCALE.min} to ${CHURN_SCALE.max} percent scale`}
      />
      <div className={styles.value}>
        <Text variant="kpi-value" as="span">
          {churnPercent}%
        </Text>
        <Text variant="caption" as="span">
          {atRisk ? 'High-risk' : 'Healthy'}
        </Text>
      </div>
    </Card>
  );
}
