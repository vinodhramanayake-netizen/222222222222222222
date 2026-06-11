import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardGrid } from './DashboardGrid';

describe('DashboardGrid', () => {
  it('renders each column inside its labelled region', () => {
    render(
      <DashboardGrid
        left={<div>left-content</div>}
        center={<div>center-content</div>}
        right={<div>right-content</div>}
      />
    );

    const support = screen.getByRole('region', { name: 'Support KPIs' });
    const center = screen.getByRole('region', {
      name: 'Tickets and customer feedback',
    });
    const product = screen.getByRole('region', { name: 'Product metrics' });

    expect(within(support).getByText('left-content')).toBeInTheDocument();
    expect(within(center).getByText('center-content')).toBeInTheDocument();
    expect(within(product).getByText('right-content')).toBeInTheDocument();
  });

  it('exposes a focusable scroll region for the widgets', () => {
    render(<DashboardGrid left={null} center={null} right={null} />);
    const scroller = screen.getByRole('region', { name: 'Dashboard widgets' });
    expect(scroller).toHaveAttribute('tabindex', '0');
  });
});
