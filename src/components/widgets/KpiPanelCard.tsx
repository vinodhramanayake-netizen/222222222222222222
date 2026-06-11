import { Card, Text } from '@/components/primitives';
import type { DurationMetric, SupportData } from '@/lib/data';
import { CSAT_SCALE } from '@/lib/kpi';
import { chartColors } from '@/lib/tokens';
import { DeltaBadge } from './DeltaBadge';
import { Gauge } from './Gauge';
import styles from './KpiPanelCard.module.css';

export interface KpiPanelCardProps {
  support: Pick<SupportData, 'csatPercent' | 'frt' | 'art'>;
}

/** A labelled duration headline (FRT/ART) with its week-over-week delta badge. */
function MetricRow({
  label,
  metric,
}: {
  label: string;
  metric: DurationMetric;
}) {
  return (
    <div className={styles.metric}>
      <Text variant="kpi-label" as="span">
        {label}
      </Text>
      <div className={styles.metricValue}>
        <Text variant="kpi-value" as="span">
          {metric.display}
        </Text>
        {/* Response/resolution times: faster (a decrease) is the good outcome. */}
        <DeltaBadge
          deltaPct={metric.deltaPct}
          higherIsBetter={false}
          comparisonLabel="vs prior week"
        />
      </div>
    </div>
  );
}

/**
 * Left-column KPI panel: CSAT radial gauge plus First Response Time and Average
 * Resolution Time, stacked vertically.
 *
 * - CSAT (`support.csatPercent`) is plotted on a 70–100 gauge with a green
 *   "healthy" arc from 85% upward and the value shown large in the dial.
 * - FRT/ART headline their `display` duration with a direction-colored delta.
 */
export function KpiPanelCard({ support }: KpiPanelCardProps) {
  const { csatPercent, frt, art } = support;
  const isHealthy = csatPercent >= CSAT_SCALE.healthyFrom;

  return (
    <Card title="Support KPIs">
      <div className={styles.csat}>
        <Gauge
          value={csatPercent}
          min={CSAT_SCALE.min}
          max={CSAT_SCALE.max}
          segments={[
            {
              from: CSAT_SCALE.healthyFrom,
              to: CSAT_SCALE.max,
              color: chartColors.gaugeHealthy,
            },
          ]}
          ariaLabel={`Customer satisfaction ${csatPercent}%, ${
            isHealthy ? 'healthy' : 'below healthy threshold'
          }, on a ${CSAT_SCALE.min} to ${CSAT_SCALE.max} percent scale`}
          centerContent={
            <>
              <Text variant="kpi-value" as="span">
                {csatPercent}%
              </Text>
              <Text variant="overline" as="span">
                CSAT
              </Text>
            </>
          }
        />
      </div>

      <div className={styles.metrics}>
        <MetricRow label="First Response Time" metric={frt} />
        <MetricRow label="Avg Resolution Time" metric={art} />
      </div>
    </Card>
  );
}
