import { Card, Text } from '@/components/primitives';
import type { TagCount } from '@/lib/data';
import styles from './TicketsByTagList.module.css';

export interface TicketsByTagListProps {
  /** Tags with counts, already sorted by volume descending by the generator. */
  tags: TagCount[];
}

/**
 * Tickets-by-tag breakdown: one row per tag with a cyan bar sized in proportion
 * to volume and a right-aligned count. Rows arrive pre-sorted descending, so the
 * first row is the busiest tag and defines the full-width bar.
 */
export function TicketsByTagList({ tags }: TicketsByTagListProps) {
  // Bar widths are relative to the largest tag (the first row when sorted desc).
  const maxCount = tags.reduce((max, t) => Math.max(max, t.count), 0);

  return (
    <Card title="Tickets by Tag">
      <ol className={styles.list}>
        {tags.map(({ tag, count }) => {
          const widthPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <li key={tag} className={styles.row}>
              <Text variant="body" as="span" className={styles.tag}>
                {tag}
              </Text>
              <div className={styles.barTrack} aria-hidden="true">
                <div
                  className={styles.barFill}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <Text variant="body" as="span" className={styles.count}>
                {count}
              </Text>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
