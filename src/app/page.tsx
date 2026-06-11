'use client';

import { FileText, UserPlus } from 'lucide-react';
import { AppShell, Card, Text } from '@/components/primitives';
import { DashboardGrid } from '@/components/DashboardGrid';
import { DemoDataBanner } from '@/components/DemoDataBanner';
import { SeedControls } from '@/components/SeedControls';
import {
  ChurnGauge,
  CustomerFeedbackCarousel,
  KpiPanelCard,
  LtvCard,
  StatCard,
  TicketsByTagList,
  TicketsDualLineChart,
} from '@/components/widgets';
import { useSeededDashboard } from '@/hooks/useSeededDashboard';

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
            <TicketsByTagList tags={support.ticketsByTag} />
            <CustomerFeedbackCarousel items={support.feedback} />
            <TicketsDualLineChart series={support.ticketsSeries} />
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
