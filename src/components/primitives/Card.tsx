import type { ReactNode } from 'react';
import { Text } from './Typography';
import styles from './Card.module.css';

export interface CardProps {
  /** Optional heading rendered at the top of the card. */
  title?: ReactNode;
  /** Optional element rendered on the right of the header (e.g. an icon or badge). */
  headerAction?: ReactNode;
  /**
   * Accessible label for the card region. Defaults to the title when that is a
   * plain string. Each card is exposed as a labelled `section` landmark.
   */
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

/**
 * DS1 "card" surface primitive: elevated background, border, radius and shadow.
 * Rendered as a labelled <section> so each widget is a discrete landmark for
 * assistive technology.
 */
export function Card({
  title,
  headerAction,
  ariaLabel,
  className,
  children,
}: CardProps) {
  const label = ariaLabel ?? (typeof title === 'string' ? title : undefined);
  const classes = [styles.card, className].filter(Boolean).join(' ');

  return (
    <section className={classes} aria-label={label}>
      {(title || headerAction) && (
        <header className={styles.header}>
          {title ? (
            <Text variant="card-title" as="h2">
              {title}
            </Text>
          ) : (
            <span />
          )}
          {headerAction}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
