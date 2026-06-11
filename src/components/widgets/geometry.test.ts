import { describe, expect, it } from 'vitest';
import { describeArc, polarToCartesian, valueToAngle } from './geometry';

describe('valueToAngle', () => {
  it('maps min to 180°, max to 0°, midpoint to 90°', () => {
    expect(valueToAngle(70, 70, 100)).toBe(180);
    expect(valueToAngle(100, 70, 100)).toBe(0);
    expect(valueToAngle(85, 70, 100)).toBe(90);
  });

  it('clamps values outside the range', () => {
    expect(valueToAngle(50, 70, 100)).toBe(180);
    expect(valueToAngle(120, 70, 100)).toBe(0);
  });

  it('handles a zero-width range safely', () => {
    expect(valueToAngle(5, 5, 5)).toBe(180);
  });
});

describe('polarToCartesian', () => {
  it('places 180° at the left and 0° at the right of the dial', () => {
    const left = polarToCartesian(100, 100, 80, 180);
    const right = polarToCartesian(100, 100, 80, 0);
    expect(left.x).toBeCloseTo(20);
    expect(left.y).toBeCloseTo(100);
    expect(right.x).toBeCloseTo(180);
    expect(right.y).toBeCloseTo(100);
  });

  it('places 90° at the top (smaller y)', () => {
    const top = polarToCartesian(100, 100, 80, 90);
    expect(top.x).toBeCloseTo(100);
    expect(top.y).toBeCloseTo(20);
  });
});

describe('describeArc', () => {
  it('produces a move-then-arc path string', () => {
    const d = describeArc(100, 100, 80, 180, 0);
    expect(d.startsWith('M ')).toBe(true);
    expect(d).toContain(' A 80 80 0 ');
  });
});
