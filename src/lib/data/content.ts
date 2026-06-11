/**
 * Static content pools for the demo data generator. Kept here as typed
 * constants (rather than inline in the generator) so copy is easy to review
 * and extend without touching generation logic.
 */

/** Candidate support ticket tags; the generator samples 6–7 of these. */
export const SUPPORT_TAGS: readonly string[] = [
  'Billing',
  'Login',
  'Performance',
  'Bug',
  'Feature Request',
  'Integrations',
  'Onboarding',
  'Mobile App',
  'API',
  'Account',
] as const;

/**
 * Pool of positive customer feedback quotes. The carousel shows positive
 * feedback by default (per the story), so every entry here is upbeat.
 */
export const POSITIVE_FEEDBACK: readonly string[] = [
  'Support resolved my issue in minutes — incredible turnaround!',
  'The new dashboard is exactly what our team needed. Love it.',
  'Fast, friendly, and they actually fixed the root cause. Thank you!',
  'Onboarding was seamless and the docs are top notch.',
  'Best support experience I have had with any SaaS tool.',
  'Reports are clear and the export saved me hours this week.',
  'Your team went above and beyond to help us migrate. Amazing.',
  'The mobile experience has improved so much — really smooth now.',
  'Quick responses and genuinely helpful answers every time.',
  'We closed our quarterly review early thanks to these insights.',
  'Integrations just worked out of the box. Huge time saver.',
  'Super intuitive UI — my whole team picked it up instantly.',
] as const;
