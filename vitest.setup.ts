import '@testing-library/jest-dom/vitest';

// jsdom has no ResizeObserver, which Recharts' ResponsiveContainer relies on.
// Provide a minimal no-op stub so chart components can render under test.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;
}
