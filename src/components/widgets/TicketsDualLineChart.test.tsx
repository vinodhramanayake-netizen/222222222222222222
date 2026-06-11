import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TicketsDualLineChart } from './TicketsDualLineChart';

const SERIES = [
  { dateLabel: '18 May', received: 210, solved: 190 },
  { dateLabel: '19 May', received: 250, solved: 220 },
  { dateLabel: '20 May', received: 300, solved: 260 },
  { dateLabel: '21 May', received: 285, solved: 250 },
  { dateLabel: '22 May', received: 240, solved: 210 },
  { dateLabel: '23 May', received: 120, solved: 110 },
  { dateLabel: '24 May', received: 90, solved: 85 },
];

describe('TicketsDualLineChart', () => {
  it('exposes the chart as a labelled figure', () => {
    render(<TicketsDualLineChart series={SERIES} />);
    expect(
      screen.getByRole('figure', { name: /received versus solved/i })
    ).toBeInTheDocument();
  });

  it('provides an accessible data table mirroring the series', () => {
    render(<TicketsDualLineChart series={SERIES} />);
    const table = screen.getByRole('table', {
      name: /received and solved per day/i,
    });
    // 7 day rows in the body.
    const rows = within(table).getAllByRole('row');
    // 1 header row + 7 data rows.
    expect(rows).toHaveLength(8);
    expect(within(table).getByText('18 May')).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: 'Received' })
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: 'Solved' })
    ).toBeInTheDocument();
  });
});
