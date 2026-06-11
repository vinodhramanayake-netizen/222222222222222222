'use client';

import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Text } from '@/components/primitives';
import styles from './SeedControls.module.css';

export interface SeedControlsProps {
  /** The active seed currently driving all widgets. */
  seed: number;
  /** ISO timestamp of the most recent generation. */
  generatedAtIso: string;
  /** Pick a new seed and regenerate all data. */
  onRegenerate: () => void;
}

/**
 * Formats the "Last generated" timestamp. Rendered after mount only (see
 * below) so locale-dependent output never differs between server markup and
 * client hydration.
 */
function formatGeneratedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short',
  });
}

/**
 * Displays the active seed and the "Last generated" time, and exposes a
 * Regenerate button that selects a new seed (also updating the `?seed=` URL).
 */
export function SeedControls({
  seed,
  generatedAtIso,
  onRegenerate,
}: SeedControlsProps) {
  // Defer locale formatting to the client to avoid hydration mismatches.
  const [generatedLabel, setGeneratedLabel] = useState<string>('');
  useEffect(() => {
    setGeneratedLabel(formatGeneratedAt(generatedAtIso));
  }, [generatedAtIso]);

  return (
    <div className={styles.controls}>
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <Text variant="overline">Seed</Text>
          <Text variant="body" className={styles.seedValue}>
            {seed}
          </Text>
        </div>
        <div className={styles.metaItem}>
          <Text variant="overline">Last generated</Text>
          <Text variant="body" className={styles.generatedValue}>
            {generatedLabel || '—'}
          </Text>
        </div>
      </div>
      <button
        type="button"
        className={styles.regenerate}
        onClick={onRegenerate}
      >
        <RefreshCw size={16} aria-hidden="true" />
        Regenerate
      </button>
    </div>
  );
}
