import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChurnGauge } from './ChurnGauge';
import { KpiPanelCard } from './KpiPanelCard';
import { LtvCard } from './LtvCard';
import { StatCard } from './StatCard';

describe('KpiPanelCard', () => {
  it('renders the CSAT gauge, value, and FRT/ART durations', () => {
    render(
      <KpiPanelCard
        support={{
          csatPercent: 92,
          frt: { valueMinutes: 72, display: '1h 12m', deltaPct: -8 },
          art: { valueMinutes: 240, display: '4h 0m', deltaPct: 3 },
        }}
      />
    );
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('1h 12m')).toBeInTheDocument();
    expect(screen.getByText('4h 0m')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /customer satisfaction 92%/i })
    ).toBeInTheDocument();
  });
});

describe('StatCard', () => {
  it('renders a formatted count and delta', () => {
    render(
      <StatCard title="New Users" stat={{ count: 1234, deltaPct: 5.5 }} />
    );
    expect(screen.getByText('New Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('+5.5%')).toBeInTheDocument();
  });
});

describe('ChurnGauge', () => {
  it('shows the value and a labelled gauge image', () => {
    render(<ChurnGauge churnPercent={12.5} />);
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /churn 12.5%/i })
    ).toBeInTheDocument();
  });

  it('flags the high-risk range above the threshold', () => {
    render(<ChurnGauge churnPercent={42} />);
    expect(screen.getByText('High-risk')).toBeInTheDocument();
  });
});

describe('LtvCard', () => {
  it('renders a progressbar with the correct aria values and target label', () => {
    render(<LtvCard ltv={{ valueUsd: 2500, targetUsd: 5000 }} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('$2,500')).toBeInTheDocument();
    expect(screen.getByText('$5,000 target')).toBeInTheDocument();
  });
});
