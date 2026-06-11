/**
 * Typed mirror of the DS1 design system (design-system-ds1-tokens.json).
 *
 * Why this exists alongside `tokens.css`:
 * - CSS custom properties (see styles/tokens.css) drive all component styling.
 * - But some consumers need the raw values in JavaScript — most notably Recharts,
 *   which takes color strings as props (series strokes, gauge arc fills) and cannot
 *   read CSS variables for SVG attributes reliably across browsers.
 *
 * Keep this file in lockstep with tokens.css. Values are sourced from the DS1
 * dark theme (the dashboard's default surface treatment).
 */

/** Brand + semantic colors (DS1 dark theme). */
export const colors = {
  primary: {
    default: '#7c5cfc',
    hover: '#6b4df0',
    active: '#5a3de4',
    subtle: 'rgba(124,92,252,0.18)',
    contrast: '#ffffff',
  },
  surface: {
    page: '#0a0a0a',
    base: '#111111',
    card: '#1e1e1e',
    elevated: '#1a1a1a',
    sunken: '#0a0a0a',
  },
  text: {
    primary: '#f2f2f2',
    secondary: '#a0a0a0',
    disabled: '#666666',
    inverse: '#0a0a0a',
  },
  border: {
    default: '#2a2a2a',
    focus: '#7c5cfc',
  },
  semantic: {
    success: '#10b981',
    successContrast: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

/**
 * Chart-specific palette. Series colors are chosen to satisfy the story's
 * explicit requirements (Received = blue, Solved = amber) and to read clearly
 * against the dark card surface.
 */
export const chartColors = {
  received: '#3b82f6', // blue — tickets received
  solved: '#f59e0b', // amber/yellow — tickets solved
  bar: '#22d3ee', // cyan — tickets-by-tag volume bars
  gaugeHealthy: '#10b981', // green — CSAT "healthy" arc
  gaugeTrack: '#2a2a2a', // muted track behind gauge arcs
  gaugeRisk: '#ef4444', // red — churn high-risk arc
  needle: '#f2f2f2', // gauge needle
  grid: '#2a2a2a', // chart gridlines
  axis: '#a0a0a0', // axis ticks/labels
} as const;

/** Spacing scale in pixels (DS1 spacing tokens). */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

/** Border radii in pixels (DS1 radii tokens; `full` => 9999). */
export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

/** Responsive breakpoints in pixels (DS1 breakpoints). */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** The viewport width at which the dashboard switches to its 3-column grid. */
export const DESKTOP_GRID_MIN_WIDTH = breakpoints.xl;

/** Font family stacks (DS1 typography families). */
export const fontFamilies = {
  base: 'Inter, system-ui, -apple-system, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

export type ColorTokens = typeof colors;
export type ChartColorTokens = typeof chartColors;
