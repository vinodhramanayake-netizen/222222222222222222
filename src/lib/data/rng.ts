/**
 * Deterministic seeded pseudo-random number generator and helpers.
 *
 * Uses mulberry32 — a tiny, fast, well-distributed 32-bit PRNG. Given the same
 * seed it always produces the same sequence, which is what guarantees identical
 * dashboard output for identical seeds. No `Math.random` is used here, so the
 * generator is fully reproducible and unit-testable.
 */

/** A function returning the next pseudo-random float in [0, 1). */
export type Rng = () => number;

/**
 * Create a deterministic RNG from a numeric seed. The seed is coerced to an
 * unsigned 32-bit integer so any finite number produces a stable sequence.
 */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random integer in the inclusive range [min, max]. */
export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Random float in [min, max), rounded to `decimals` places. */
export function randFloat(
  rng: Rng,
  min: number,
  max: number,
  decimals = 1
): number {
  const value = min + rng() * (max - min);
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Pick a single element from a non-empty array. */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('pick() requires a non-empty array');
  }
  const index = Math.floor(rng() * items.length);
  // `index` is always in-bounds; the assertion satisfies noUncheckedIndexedAccess.
  return items[index] as T;
}

/**
 * Deterministically sample `count` distinct elements from `items`, preserving a
 * stable order via a seeded Fisher–Yates shuffle. If `count` exceeds the array
 * length, the whole (shuffled) array is returned.
 */
export function sample<T>(rng: Rng, items: readonly T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const a = copy[i] as T;
    const b = copy[j] as T;
    copy[i] = b;
    copy[j] = a;
  }
  return copy.slice(0, Math.min(count, copy.length));
}
