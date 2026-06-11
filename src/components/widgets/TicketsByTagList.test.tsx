import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TicketsByTagList } from './TicketsByTagList';

const TAGS = [
  { tag: 'Billing', count: 140 },
  { tag: 'Login', count: 70 },
  { tag: 'Performance', count: 35 },
];

describe('TicketsByTagList', () => {
  it('renders a row per tag with its name and count', () => {
    render(<TicketsByTagList tags={TAGS} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(within(items[0]!).getByText('Billing')).toBeInTheDocument();
    expect(within(items[0]!).getByText('140')).toBeInTheDocument();
    expect(within(items[2]!).getByText('35')).toBeInTheDocument();
  });

  it('renders rows in the provided (volume-descending) order', () => {
    render(<TicketsByTagList tags={TAGS} />);
    const names = screen.getAllByRole('listitem').map((li) => {
      // First text node is the tag name.
      return li.textContent ?? '';
    });
    expect(names[0]).toContain('Billing');
    expect(names[1]).toContain('Login');
    expect(names[2]).toContain('Performance');
  });
});
