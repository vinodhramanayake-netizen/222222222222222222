'use client';

import { AppShell, Card, Text } from '@/components/primitives';
import { SeedControls } from '@/components/SeedControls';
import { useSeededDashboard } from '@/hooks/useSeededDashboard';

/**
 * DashboardPage — the single route (`/`).
 *
 * Step 2 wires the deterministic seed lifecycle: data comes from one seed via
 * `useSeededDashboard`, the seed + "Last generated" time are shown, and
 * Regenerate picks a new seed (updating the `?seed=` URL). The persistent Demo
 * Data banner and full 3-column widget grid are composed in later steps; this
 * page already consumes the shared `data` object they will all read from.
 */
export default function DashboardPage() {
  const { data, regenerate } = useSeededDashboard();

  return (
    <AppShell
      header={
        <>
          <Text variant="page-title">InsightBoard</Text>
          <Text variant="caption">
            Support &amp; product analytics — deterministic demo data.
          </Text>
        </>
      }
    >
      {data ? (
        <>
          <Card ariaLabel="Seed controls">
            <SeedControls
              seed={data.seed}
              generatedAtIso={data.generatedAtIso}
              onRegenerate={regenerate}
            />
          </Card>
          <Card title="Data system ready">
            <Text variant="body">
              Generated a full dataset for the week of{' '}
              {data.weekDates[0]?.dateLabel} – {data.weekDates[6]?.dateLabel}:
              CSAT {data.support.csatPercent}%,{' '}
              {data.support.ticketsByTag.length} ticket tags,{' '}
              {data.support.feedback.length} feedback items. Widgets are added
              in the next steps.
            </Text>
          </Card>
        </>
      ) : (
        <Card>
          <Text variant="body">Generating demo data…</Text>
        </Card>
      )}
    </AppShell>
  );
}
