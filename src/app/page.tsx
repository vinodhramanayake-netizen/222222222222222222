'use client';

import { FileText, UserPlus } from 'lucide-react';
import { AppShell, Card, Text } from '@/components/primitives';
import { DashboardGrid } from '@/components/DashboardGrid';
import { DemoDataBanner } from '@/components/DemoDataBanner';
import { SeedControls } from '@/components/SeedControls';
import {
  ChurnGauge,
  KpiPanelCard,
  LtvCard,
  StatCard,
} from '@/components/widgets';
import { useSeededDashboard } from '@/hooks/useSeededDashboard';

/**
 * Placeholder surface for a center-column widget wired up in Step 5. Keeps the
 * layout complete while the tickets list, feedback carousel and chart are built.
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

  const { support, product } = data;

  return (
    <AppShell banner={banner}>
      <DashboardGrid
        left={<KpiPanelCard support={support} />}
        center={
          <>
            <WidgetPlaceholder title="Tickets by Tag" />
            <WidgetPlaceholder title="Customer Feedback" />
            <WidgetPlaceholder title="Tickets — Received vs Solved" />
          </>
        }
        right={
          <>
            <StatCard
              title="New Users"
              stat={product.newUsers}
              icon={UserPlus}
            />
            <StatCard
              title="Reports Created"
              stat={product.reportsCreated}
              icon={FileText}
            />
            <ChurnGauge churnPercent={product.churnPercent} />
            <LtvCard ltv={product.ltv} />
          </>
        }
      />
    </AppShell>
  );
}
