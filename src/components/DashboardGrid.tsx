import type { ReactNode } from 'react';
import styles from './DashboardGrid.module.css';

export interface DashboardGridProps {
  /** Left column — support KPI panel. */
  left: ReactNode;
  /** Center column — tickets list, feedback carousel, tickets chart. */
  center: ReactNode;
  /** Right column — product stat cards, churn gauge, LTV. */
  right: ReactNode;
}

/**
 * The dashboard's responsive 3-column layout.
 *
 * - At ≥1280px the three columns are fluid and fill the container, so no
 *   horizontal scrollbar is needed (see DashboardGrid.module.css).
 * - Below 1280px the grid is pinned to a minimum width, so the surrounding
 *   container scrolls horizontally rather than stacking or squashing the
 *   columns — content stays readable and never overlaps.
 *
 * The scroll area is an explicitly labelled, focusable region so keyboard and
 * screen-reader users can reach and pan it.
 */
export function DashboardGrid({ left, center, right }: DashboardGridProps) {
  return (
    <div
      className={styles.scroller}
      role="region"
      aria-label="Dashboard widgets"
      tabIndex={0}
    >
      <div className={styles.grid}>
        <section className={styles.column} aria-label="Support KPIs">
          {left}
        </section>
        <section
          className={styles.column}
          aria-label="Tickets and customer feedback"
        >
          {center}
        </section>
        <section className={styles.column} aria-label="Product metrics">
          {right}
        </section>
      </div>
    </div>
  );
}
