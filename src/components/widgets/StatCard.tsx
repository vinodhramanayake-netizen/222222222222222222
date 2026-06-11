import type { LucideIcon } from 'lucide-react';
import { Card, Text } from '@/components/primitives';
import type { DeltaStat } from '@/lib/data';
import { DeltaBadge } from './DeltaBadge';
import styles from './StatCard.module.css';

export interface StatCardProps {
  title: string;
  stat: DeltaStat;
  /** Optional decorative icon shown in the card header. */
  icon?: LucideIcon;
  /** Comparison context for the delta; defaults to 'vs yesterday'. */
  comparisonLabel?: string;
}

/**
 * A product stat card: a large headline count with a delta badge. Used for New
 * Users and Reports Created, where growth (an increase) is the good outcome, so
 * positive deltas read as a green ▲.
 */
export function StatCard({
  title,
  stat,
  icon: Icon,
  comparisonLabel = 'vs yesterday',
}: StatCardProps) {
  return (
    <Card
      title={title}
      headerAction={
        Icon ? (
          <Icon size={18} className={styles.icon} aria-hidden="true" />
        ) : undefined
      }
    >
      <div className={styles.body}>
        <Text variant="kpi-value" as="span">
          {stat.count.toLocaleString('en-US')}
        </Text>
        <DeltaBadge
          deltaPct={stat.deltaPct}
          higherIsBetter
          comparisonLabel={comparisonLabel}
        />
      </div>
    </Card>
  );
}
