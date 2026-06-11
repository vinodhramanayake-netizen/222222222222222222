'use client';

import { ChevronLeft, ChevronRight, ThumbsUp } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { Card, Text } from '@/components/primitives';
import { formatRelativeTime, type FeedbackItem } from '@/lib/data';
import styles from './CustomerFeedbackCarousel.module.css';

export interface CustomerFeedbackCarouselProps {
  /** Positive feedback items, most recent first. */
  items: FeedbackItem[];
  /** Reference time for relative timestamps; injectable for deterministic tests. */
  now?: Date;
}

/**
 * Customer feedback carousel. Shows one positive feedback item at a time with a
 * thumbs-up icon, the comment, and a relative timestamp. Fully keyboard
 * operable: focusable Prev/Next + dot controls, and Left/Right arrow navigation.
 * Navigation wraps around at both ends.
 */
export function CustomerFeedbackCarousel({
  items,
  now = new Date(),
}: CustomerFeedbackCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  if (count === 0) {
    return (
      <Card title="Customer Feedback">
        <Text variant="caption">No feedback yet.</Text>
      </Card>
    );
  }

  const safeIndex = Math.min(index, count - 1);
  const current = items[safeIndex] as FeedbackItem;

  const goTo = (next: number) => setIndex(((next % count) + count) % count);
  const goPrev = () => goTo(safeIndex - 1);
  const goNext = () => goTo(safeIndex + 1);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <Card title="Customer Feedback">
      {/*
        Region-level Left/Right arrow handling is the ARIA Authoring Practices
        carousel pattern; the rule's heuristic doesn't account for it, so it is
        disabled for this single, intentionally-keyboard-operable group.
      */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className={styles.carousel}
        role="group"
        aria-roledescription="carousel"
        aria-label="Customer feedback"
        onKeyDown={handleKeyDown}
      >
        <div className={styles.viewport} aria-live="polite">
          <blockquote className={styles.slide}>
            <ThumbsUp className={styles.thumb} size={20} aria-hidden="true" />
            <Text variant="body" as="p" className={styles.text}>
              {current.text}
            </Text>
            <Text variant="caption" as="footer">
              {formatRelativeTime(current.createdAtIso, now)}
            </Text>
          </blockquote>
          <span className={styles.srStatus} aria-live="polite">
            Showing feedback {safeIndex + 1} of {count}
          </span>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goPrev}
            aria-label="Previous feedback"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <div
            className={styles.dots}
            role="tablist"
            aria-label="Choose feedback"
          >
            {items.map((item, dotIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={styles.dot}
                aria-label={`Go to feedback ${dotIndex + 1} of ${count}`}
                aria-selected={dotIndex === safeIndex}
                data-active={dotIndex === safeIndex}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.navButton}
            onClick={goNext}
            aria-label="Next feedback"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </Card>
  );
}
