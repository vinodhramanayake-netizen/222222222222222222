import { describe, expect, it } from 'vitest';
import { generateDashboardData } from './generate';

// Frozen reference time so every assertion is deterministic.
// 2026-05-20 is a Wednesday, so the week runs Mon 18 May → Sun 24 May.
const FROZEN_NOW = new Date('2026-05-20T09:30:00.000Z');

describe('generateDashboardData — determinism', () => {
  it('produces identical output for the same seed and time', () => {
    const a = generateDashboardData(42, FROZEN_NOW);
    const b = generateDashboardData(42, FROZEN_NOW);
    expect(a).toEqual(b);
  });

  it('produces different output for different seeds', () => {
    const a = generateDashboardData(1, FROZEN_NOW);
    const b = generateDashboardData(2, FROZEN_NOW);
    expect(a).not.toEqual(b);
  });

  it('keeps numeric content stable across different generation times', () => {
    // Same week, different clock — numbers/series must not change, only the
    // generated-at timestamp does.
    const earlier = generateDashboardData(
      123,
      new Date('2026-05-20T08:00:00.000Z')
    );
    const later = generateDashboardData(
      123,
      new Date('2026-05-20T14:00:00.000Z')
    );
    expect(later.support.ticketsSeries).toEqual(earlier.support.ticketsSeries);
    expect(later.support.ticketsByTag).toEqual(earlier.support.ticketsByTag);
    expect(later.support.csatPercent).toBe(earlier.support.csatPercent);
    expect(later.product).toEqual(earlier.product);
    expect(later.generatedAtIso).not.toBe(earlier.generatedAtIso);
  });

  it('echoes the seed and records a generated-at timestamp', () => {
    const data = generateDashboardData(7, FROZEN_NOW);
    expect(data.seed).toBe(7);
    expect(data.generatedAtIso).toBe(FROZEN_NOW.toISOString());
  });
});

describe('generateDashboardData — week dates (Mon–Sun)', () => {
  const { weekDates } = generateDashboardData(99, FROZEN_NOW);

  it('returns exactly 7 days from Monday to Sunday', () => {
    expect(weekDates).toHaveLength(7);
    expect(weekDates[0]?.dayLabel).toBe('Mon');
    expect(weekDates[6]?.dayLabel).toBe('Sun');
  });

  it('computes the correct calendar week containing "now"', () => {
    expect(weekDates[0]?.isoDate).toBe('2026-05-18');
    expect(weekDates[6]?.isoDate).toBe('2026-05-24');
  });

  it('formats date labels like "22 May"', () => {
    expect(weekDates[0]?.dateLabel).toBe('18 May');
    for (const day of weekDates) {
      expect(day.dateLabel).toMatch(/^\d{1,2} [A-Z][a-z]{2}$/);
    }
  });
});

describe('generateDashboardData — tickets by tag', () => {
  const { support } = generateDashboardData(2024, FROZEN_NOW);

  it('returns 6–7 rows sorted by volume descending with positive counts', () => {
    const rows = support.ticketsByTag;
    expect(rows.length).toBeGreaterThanOrEqual(6);
    expect(rows.length).toBeLessThanOrEqual(7);
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i - 1]!.count).toBeGreaterThanOrEqual(rows[i]!.count);
    }
    for (const row of rows) {
      expect(row.count).toBeGreaterThan(0);
      expect(row.tag).toBeTruthy();
    }
  });

  it('uses distinct tags', () => {
    const tags = support.ticketsByTag.map((r) => r.tag);
    expect(new Set(tags).size).toBe(tags.length);
  });
});

describe('generateDashboardData — tickets series realism', () => {
  // Check the realism constraints hold across a range of seeds, not just one.
  const seeds = [1, 7, 42, 123, 999, 50_000];

  it('has 7 points within the 0–400 axis range', () => {
    for (const seed of seeds) {
      const series = generateDashboardData(seed, FROZEN_NOW).support
        .ticketsSeries;
      expect(series).toHaveLength(7);
      for (const point of series) {
        expect(point.received).toBeGreaterThanOrEqual(0);
        expect(point.received).toBeLessThanOrEqual(400);
        expect(point.solved).toBeGreaterThanOrEqual(0);
        expect(point.solved).toBeLessThanOrEqual(400);
      }
    }
  });

  it('peaks mid-week (Wed/Thu) and drops on the weekend', () => {
    for (const seed of seeds) {
      const series = generateDashboardData(seed, FROZEN_NOW).support
        .ticketsSeries;
      const received = series.map((p) => p.received);

      // Peak is on Wednesday (index 2) or Thursday (index 3).
      const peakIndex = received.indexOf(Math.max(...received));
      expect([2, 3]).toContain(peakIndex);

      // Weekend (Sat+Sun) average is below the weekday (Mon–Fri) average.
      const weekdayAvg = received.slice(0, 5).reduce((s, v) => s + v, 0) / 5;
      const weekendAvg = received.slice(5).reduce((s, v) => s + v, 0) / 2;
      expect(weekendAvg).toBeLessThan(weekdayAvg);
    }
  });

  it('aligns series date labels with the week dates', () => {
    const data = generateDashboardData(321, FROZEN_NOW);
    const labels = data.support.ticketsSeries.map((p) => p.dateLabel);
    expect(labels).toEqual(data.weekDates.map((d) => d.dateLabel));
  });
});

describe('generateDashboardData — metric ranges and formats', () => {
  const seeds = [3, 17, 88, 256, 777, 123_456];

  it('keeps CSAT within the 70–100 gauge scale', () => {
    for (const seed of seeds) {
      const { csatPercent } = generateDashboardData(seed, FROZEN_NOW).support;
      expect(csatPercent).toBeGreaterThanOrEqual(70);
      expect(csatPercent).toBeLessThanOrEqual(100);
    }
  });

  it('keeps churn within the 0–50 gauge scale', () => {
    for (const seed of seeds) {
      const { churnPercent } = generateDashboardData(seed, FROZEN_NOW).product;
      expect(churnPercent).toBeGreaterThanOrEqual(0);
      expect(churnPercent).toBeLessThanOrEqual(50);
    }
  });

  it('formats FRT and ART durations like "1h 12m" or "45m"', () => {
    for (const seed of seeds) {
      const { frt, art } = generateDashboardData(seed, FROZEN_NOW).support;
      expect(frt.display).toMatch(/^(\d+h )?\d+m$/);
      expect(art.display).toMatch(/^(\d+h )?\d+m$/);
      expect(frt.valueMinutes).toBeGreaterThan(0);
      expect(art.valueMinutes).toBeGreaterThan(frt.valueMinutes);
    }
  });

  it('reports positive deltas for new users and reports created', () => {
    for (const seed of seeds) {
      const { newUsers, reportsCreated } = generateDashboardData(
        seed,
        FROZEN_NOW
      ).product;
      expect(newUsers.deltaPct).toBeGreaterThan(0);
      expect(reportsCreated.deltaPct).toBeGreaterThan(0);
      expect(newUsers.count).toBeGreaterThan(0);
      expect(reportsCreated.count).toBeGreaterThan(0);
    }
  });

  it('keeps LTV value below its target so the progress bar is partial', () => {
    for (const seed of seeds) {
      const { ltv } = generateDashboardData(seed, FROZEN_NOW).product;
      expect(ltv.valueUsd).toBeGreaterThan(0);
      expect(ltv.valueUsd).toBeLessThan(ltv.targetUsd);
    }
  });
});

describe('generateDashboardData — feedback', () => {
  const { support } = generateDashboardData(555, FROZEN_NOW);

  it('returns 5–6 positive items, most recent first, with valid timestamps', () => {
    const items = support.feedback;
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items.length).toBeLessThanOrEqual(6);
    for (const item of items) {
      expect(item.id).toMatch(/^fb-555-\d+$/);
      expect(item.text.length).toBeGreaterThan(0);
      expect(Number.isNaN(Date.parse(item.createdAtIso))).toBe(false);
      // All feedback is in the past relative to "now".
      expect(new Date(item.createdAtIso).getTime()).toBeLessThanOrEqual(
        FROZEN_NOW.getTime()
      );
    }
    // Sorted most-recent-first.
    for (let i = 1; i < items.length; i += 1) {
      expect(items[i - 1]!.createdAtIso >= items[i]!.createdAtIso).toBe(true);
    }
  });
});
