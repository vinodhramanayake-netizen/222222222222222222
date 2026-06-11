import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeltaBadge } from './DeltaBadge';

describe('DeltaBadge', () => {
  it('shows a positive tone with an up arrow when growth is good', () => {
    const { container } = render(
      <DeltaBadge
        deltaPct={12.3}
        higherIsBetter
        comparisonLabel="vs yesterday"
      />
    );
    const badge = container.querySelector('[data-tone]');
    expect(badge).toHaveAttribute('data-tone', 'positive');
    expect(badge).toHaveAttribute('data-direction', 'up');
    expect(screen.getByText('+12.3%')).toBeInTheDocument();
    expect(screen.getByText('vs yesterday')).toBeInTheDocument();
  });

  it('treats a decrease as positive when lower is better (e.g. response time)', () => {
    const { container } = render(
      <DeltaBadge
        deltaPct={-8}
        higherIsBetter={false}
        comparisonLabel="vs prior week"
      />
    );
    const badge = container.querySelector('[data-tone]');
    expect(badge).toHaveAttribute('data-tone', 'positive');
    expect(badge).toHaveAttribute('data-direction', 'down');
  });

  it('treats an increase as negative when lower is better', () => {
    const { container } = render(
      <DeltaBadge
        deltaPct={5}
        higherIsBetter={false}
        comparisonLabel="vs prior week"
      />
    );
    expect(container.querySelector('[data-tone]')).toHaveAttribute(
      'data-tone',
      'negative'
    );
  });

  it('is neutral at zero change', () => {
    const { container } = render(
      <DeltaBadge deltaPct={0} higherIsBetter comparisonLabel="vs yesterday" />
    );
    expect(container.querySelector('[data-tone]')).toHaveAttribute(
      'data-tone',
      'neutral'
    );
  });
});
