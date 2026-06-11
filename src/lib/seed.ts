/**
 * Seed parsing and generation utilities for the seed lifecycle.
 *
 * `createRandomSeed` uses Math.random and is only ever called at runtime in the
 * browser to choose a default seed — it is never used by the deterministic data
 * generator, which is driven exclusively by an explicit numeric seed.
 */

/** Upper bound for auto-generated seeds — friendly, shareable integers. */
export const MAX_SEED = 999_999;

/**
 * Parse a seed from a raw URL query value. Returns a positive integer in
 * [1, MAX_SEED], or `null` if the value is missing or invalid.
 */
export function parseSeed(raw: string | null | undefined): number | null {
  if (raw == null || raw.trim() === '') return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > MAX_SEED) {
    return null;
  }
  return value;
}

/** Generate a random default seed in [1, MAX_SEED] (runtime-only). */
export function createRandomSeed(): number {
  return Math.floor(Math.random() * MAX_SEED) + 1;
}
