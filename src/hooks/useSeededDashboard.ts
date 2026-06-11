'use client';

import { useCallback, useEffect, useState } from 'react';
import { generateDashboardData, type DemoDashboardData } from '@/lib/data';
import { createRandomSeed, parseSeed } from '@/lib/seed';

export interface SeededDashboard {
  /** The current dataset, or `null` until the seed is resolved on the client. */
  data: DemoDashboardData | null;
  /** Pick a fresh random seed, regenerate, and sync the URL. */
  regenerate: () => void;
}

/** Reflect the active seed into the `?seed=` URL query without adding history. */
function syncSeedToUrl(seed: number): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('seed', String(seed));
  window.history.replaceState(null, '', url);
}

/**
 * Owns the seed lifecycle and is the single source of truth for widget data:
 *
 * - On first client render: read `?seed=` from the URL; if absent/invalid,
 *   choose a random default seed once for this load. The chosen seed is written
 *   back to the URL so the view is always shareable/reproducible.
 * - `regenerate()` picks a new random seed, regenerates the dataset with a fresh
 *   "Last generated" time, and updates the URL.
 *
 * Generation runs inside an effect (never during render) so the static-exported
 * markup and the first client paint match — avoiding hydration mismatches from
 * reading `window` or the clock.
 */
export function useSeededDashboard(): SeededDashboard {
  const [data, setData] = useState<DemoDashboardData | null>(null);

  useEffect(() => {
    const fromUrl = parseSeed(
      new URLSearchParams(window.location.search).get('seed')
    );
    const seed = fromUrl ?? createRandomSeed();
    syncSeedToUrl(seed);
    setData(generateDashboardData(seed, new Date()));
  }, []);

  const regenerate = useCallback(() => {
    const seed = createRandomSeed();
    syncSeedToUrl(seed);
    setData(generateDashboardData(seed, new Date()));
  }, []);

  return { data, regenerate };
}
