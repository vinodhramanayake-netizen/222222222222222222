import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CustomerFeedbackCarousel } from './CustomerFeedbackCarousel';

const NOW = new Date('2026-05-20T12:00:00.000Z');
const ITEMS = [
  {
    id: 'fb-1',
    text: 'Fantastic support, thank you!',
    createdAtIso: '2026-05-20T10:00:00.000Z', // 2h ago
  },
  {
    id: 'fb-2',
    text: 'The dashboard is beautiful.',
    createdAtIso: '2026-05-19T12:00:00.000Z', // 1d ago
  },
  {
    id: 'fb-3',
    text: 'Reports saved us hours.',
    createdAtIso: '2026-05-18T12:00:00.000Z', // 2d ago
  },
];

describe('CustomerFeedbackCarousel', () => {
  it('shows the first item with a relative timestamp by default', () => {
    render(<CustomerFeedbackCarousel items={ITEMS} now={NOW} />);
    expect(
      screen.getByText('Fantastic support, thank you!')
    ).toBeInTheDocument();
    expect(screen.getByText('2h ago')).toBeInTheDocument();
  });

  it('renders one dot per item for pagination', () => {
    render(<CustomerFeedbackCarousel items={ITEMS} now={NOW} />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('advances with the Next button', () => {
    render(<CustomerFeedbackCarousel items={ITEMS} now={NOW} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next feedback' }));
    expect(screen.getByText('The dashboard is beautiful.')).toBeInTheDocument();
  });

  it('wraps to the last item when going previous from the first', () => {
    render(<CustomerFeedbackCarousel items={ITEMS} now={NOW} />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous feedback' }));
    expect(screen.getByText('Reports saved us hours.')).toBeInTheDocument();
  });

  it('is navigable with the arrow keys', () => {
    render(<CustomerFeedbackCarousel items={ITEMS} now={NOW} />);
    const region = screen.getByRole('group', { name: 'Customer feedback' });
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(screen.getByText('The dashboard is beautiful.')).toBeInTheDocument();
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(
      screen.getByText('Fantastic support, thank you!')
    ).toBeInTheDocument();
  });

  it('jumps to a slide via its dot control', () => {
    render(<CustomerFeedbackCarousel items={ITEMS} now={NOW} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Go to feedback 3 of 3' }));
    expect(screen.getByText('Reports saved us hours.')).toBeInTheDocument();
  });
});
