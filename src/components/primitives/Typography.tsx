import type { ElementType, ReactNode } from 'react';
import styles from './Typography.module.css';

/** DS1 typography styles (see `typography.styles` in the tokens file). */
export type TypographyVariant =
  | 'display'
  | 'page-title'
  | 'section-heading'
  | 'card-title'
  | 'body'
  | 'caption'
  | 'overline'
  | 'mono'
  | 'kpi-value'
  | 'kpi-label';

const variantClass: Record<TypographyVariant, string | undefined> = {
  display: styles.display,
  'page-title': styles.pageTitle,
  'section-heading': styles.sectionHeading,
  'card-title': styles.cardTitle,
  body: styles.body,
  caption: styles.caption,
  overline: styles.overline,
  mono: styles.mono,
  'kpi-value': styles.kpiValue,
  'kpi-label': styles.kpiLabel,
};

export interface TextProps {
  variant?: TypographyVariant;
  /** Render as a specific element (defaults to a sensible tag per variant). */
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}

const defaultElement: Record<TypographyVariant, ElementType> = {
  display: 'h1',
  'page-title': 'h1',
  'section-heading': 'h2',
  'card-title': 'h3',
  body: 'p',
  caption: 'span',
  overline: 'span',
  mono: 'span',
  'kpi-value': 'span',
  'kpi-label': 'span',
};

/**
 * Typography helper that maps a DS1 type style to consistent CSS.
 * Keeps font size/weight/line-height decisions out of feature components.
 */
export function Text({
  variant = 'body',
  as,
  className,
  id,
  children,
}: TextProps) {
  const Component = as ?? defaultElement[variant];
  const classes = [variantClass[variant], className].filter(Boolean).join(' ');
  return (
    <Component id={id} className={classes}>
      {children}
    </Component>
  );
}
