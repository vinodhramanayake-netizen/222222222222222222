import { FlaskConical, LayoutDashboard } from 'lucide-react';
import type { ReactNode } from 'react';
import { Text } from '@/components/primitives';
import styles from './DemoDataBanner.module.css';

export interface DemoDataBannerProps {
  /** Optional global controls rendered on the right (e.g. SeedControls). */
  controls?: ReactNode;
}

/**
 * Persistent, always-visible top bar that brands the app and unmistakably
 * labels the entire page as Demo Data. Rendered in the AppShell's sticky banner
 * slot so it stays on screen during both vertical and horizontal scrolling.
 *
 * Uses only bundled lucide icons and token-driven styles — no images or runtime
 * network requests.
 */
export function DemoDataBanner({ controls }: DemoDataBannerProps) {
  return (
    <header className={styles.banner}>
      <div className={styles.brand}>
        <LayoutDashboard
          className={styles.brandIcon}
          size={22}
          aria-hidden="true"
        />
        <Text variant="card-title" as="h1">
          InsightBoard
        </Text>
        <span
          className={styles.demoBadge}
          role="status"
          aria-label="Demo data — all metrics shown are synthetic and not live operational data"
        >
          <FlaskConical size={14} aria-hidden="true" />
          Demo Data
        </span>
      </div>
      {controls && <div className={styles.controls}>{controls}</div>}
    </header>
  );
}
