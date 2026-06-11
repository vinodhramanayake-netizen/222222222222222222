import { describe, expect, it } from 'vitest';
import {
  DESKTOP_GRID_MIN_WIDTH,
  breakpoints,
  chartColors,
  colors,
} from './tokens';

/**
 * Smoke tests for the typed token mirror. These guard the values that the rest
 * of the app (and Recharts) depend on, and confirm the test runner is wired up.
 */
describe('design tokens', () => {
  it('switches to the 3-column grid at the DS1 xl breakpoint (1280px)', () => {
    expect(DESKTOP_GRID_MIN_WIDTH).toBe(1280);
    expect(breakpoints.xl).toBe(1280);
  });

  it('uses blue for received and amber for solved ticket series', () => {
    expect(chartColors.received).toBe('#3b82f6');
    expect(chartColors.solved).toBe('#f59e0b');
  });

  it('exposes the DS1 brand primary color', () => {
    expect(colors.primary.default).toBe('#7c5cfc');
  });
});
