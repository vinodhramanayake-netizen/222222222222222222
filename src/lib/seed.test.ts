import { describe, expect, it } from 'vitest';
import { MAX_SEED, createRandomSeed, parseSeed } from './seed';

describe('parseSeed', () => {
  it('parses valid positive integer seeds', () => {
    expect(parseSeed('42')).toBe(42);
    expect(parseSeed('1')).toBe(1);
    expect(parseSeed(String(MAX_SEED))).toBe(MAX_SEED);
  });

  it('rejects missing, empty, or non-numeric values', () => {
    expect(parseSeed(null)).toBeNull();
    expect(parseSeed(undefined)).toBeNull();
    expect(parseSeed('')).toBeNull();
    expect(parseSeed('  ')).toBeNull();
    expect(parseSeed('abc')).toBeNull();
    expect(parseSeed('12.5')).toBeNull();
  });

  it('rejects out-of-range values', () => {
    expect(parseSeed('0')).toBeNull();
    expect(parseSeed('-5')).toBeNull();
    expect(parseSeed(String(MAX_SEED + 1))).toBeNull();
  });
});

describe('createRandomSeed', () => {
  it('always returns an in-range integer', () => {
    for (let i = 0; i < 1000; i += 1) {
      const seed = createRandomSeed();
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(1);
      expect(seed).toBeLessThanOrEqual(MAX_SEED);
    }
  });
});
