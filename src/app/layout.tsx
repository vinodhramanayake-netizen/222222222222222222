import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

/**
 * Inter is fetched at BUILD time by next/font and self-hosted in the static
 * export — there is no runtime request to a font CDN, satisfying the
 * "no runtime network calls" constraint. The DS1 fallback stack is preserved.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'InsightBoard — Support Analytics (Demo Data)',
  description:
    'A fully static, single-page support and product analytics demo dashboard. All metrics are deterministically generated demo data — not live operational data.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
