import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DemoDataBanner } from './DemoDataBanner';

describe('DemoDataBanner', () => {
  it('always shows the brand and a Demo Data indicator', () => {
    render(<DemoDataBanner />);
    expect(screen.getByText('InsightBoard')).toBeInTheDocument();
    expect(screen.getByText('Demo Data')).toBeInTheDocument();
  });

  it('exposes the brand as the page-level h1 heading', () => {
    render(<DemoDataBanner />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'InsightBoard' })
    ).toBeInTheDocument();
  });

  it('exposes the Demo Data label as an accessible status', () => {
    render(<DemoDataBanner />);
    const status = screen.getByRole('status');
    expect(status).toHaveAccessibleName(/synthetic/i);
  });

  it('renders the optional controls slot', () => {
    render(
      <DemoDataBanner controls={<button type="button">Regenerate</button>} />
    );
    expect(
      screen.getByRole('button', { name: 'Regenerate' })
    ).toBeInTheDocument();
  });
});
