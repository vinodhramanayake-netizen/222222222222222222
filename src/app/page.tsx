'use client';

import { AppShell, Card, Text } from '@/components/primitives';
import { DashboardGrid } from '@/components/DashboardGrid';
import { DemoDataBanner } from '@/components/DemoDataBanner';
import { SeedControls } from '@/components/SeedControls';
import { useSeededDashboard } from '@/hooks/useSeededDashboard';

/**
 * Placeholder surface for a widget that is wired up in a later step. Keeps the
 * 3-column layout and column ordering verifiable now; Steps 4–5 replace each
 * placeholder with the real widget without changing the page structure.
 */
function WidgetPlaceholder({ title }: { title: string }) {
  return (
    <Card title={title}>
      <Text variant="caption">Coming in a later step.</Text>
    </Card>
  );
}

/**
 * DashboardPage — the single route (`/`).
 *
 * Composes the persistent Demo Data banner (with seed controls) and the
 * responsive 3-column grid. All widgets read from the single seed-derived
 * `data` object resolved by `useSeededDashboard`.
 */
export default function DashboardPage() {
  const { data, regenerate } = useSeededDashboard();

  const banner = (
    <DemoDataBanner
      controls={
        data ? (
          <SeedControls
            seed={data.seed}
            generatedAtIso={data.generatedAtIso}
            onRegenerate={regenerate}
          />
        ) : null
      }
    />
  );

  if (!data) {
    return (
      <AppShell banner={banner}>
        <Card>
          <Text variant="body">Generating demo data…</Text>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell banner={banner}>
      <DashboardGrid
        left={
          <>
            <WidgetPlaceholder title="CSAT" />
            <WidgetPlaceholder title="First Response Time" />
            <WidgetPlaceholder title="Avg Resolution Time" />
          </>
        }
        center={
          <>
            <WidgetPlaceholder title="Tickets by Tag" />
            <WidgetPlaceholder title="Customer Feedback" />
            <WidgetPlaceholder title="Tickets — Received vs Solved" />
          </>
        }
        right={
          <>
            <WidgetPlaceholder title="New Users" />
            <WidgetPlaceholder title="Reports Created" />
            <WidgetPlaceholder title="Churn" />
            <WidgetPlaceholder title="Lifetime Value" />
          </>
        }
      />
    </AppShell>
  );
}
