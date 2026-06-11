import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

export interface AppShellProps {
  /** Persistent top banner slot (e.g. the Demo Data indicator + seed controls). */
  banner?: ReactNode;
  /** Optional page header slot (title / subtitle). */
  header?: ReactNode;
  children: ReactNode;
}

/**
 * Top-level page scaffold: full-height page background, a sticky banner region,
 * an optional header, and a main content area. The banner is rendered outside
 * <main> and stays visible so the Demo Data label is always present.
 */
export function AppShell({ banner, header, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      {banner && <div className={styles.banner}>{banner}</div>}
      <main className={styles.main}>
        {header && <div className={styles.header}>{header}</div>}
        {children}
      </main>
    </div>
  );
}
