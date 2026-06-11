import { describe, expect, it } from 'vitest';
import {
  formatDeltaPct,
  formatDuration,
  formatRelativeTime,
  formatUsd,
} from './format';

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(72)).toBe('1h 12m');
    expect(formatDuration(120)).toBe('2h 0m');
  });

  it('formats sub-hour durations as minutes only', () => {
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(0)).toBe('0m');
  });

  it('clamps negatives to zero', () => {
    expect(formatDuration(-10)).toBe('0m');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-05-20T12:00:00.000Z');

  it('labels recent times', () => {
    expect(formatRelativeTime('2026-05-20T11:59:30.000Z', now)).toBe(
      'just now'
    );
    expect(formatRelativeTime('2026-05-20T11:55:00.000Z', now)).toBe('5m ago');
    expect(formatRelativeTime('2026-05-20T10:00:00.000Z', now)).toBe('2h ago');
    expect(formatRelativeTime('2026-05-17T12:00:00.000Z', now)).toBe('3d ago');
  });
});

describe('formatUsd', () => {
  it('formats whole dollars with thousands separators', () => {
    expect(formatUsd(1234)).toBe('$1,234');
    expect(formatUsd(5000)).toBe('$5,000');
  });
});

describe('formatDeltaPct', () => {
  it('prefixes positive values with a plus sign', () => {
    expect(formatDeltaPct(4.2)).toBe('+4.2%');
    expect(formatDeltaPct(-3)).toBe('-3%');
    expect(formatDeltaPct(0)).toBe('0%');
  });
});
