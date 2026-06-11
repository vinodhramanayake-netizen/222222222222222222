import { AppShell, Card, Text } from '@/components/primitives';

/**
 * Placeholder DashboardPage scaffold.
 *
 * This establishes the single route (`/`) and exercises the AppShell, Card and
 * Typography primitives so the static export is verifiable from Step 1. The
 * real 3-column dashboard, Demo Data banner, seed controls and widgets are
 * composed here in later steps.
 */
export default function DashboardPage() {
  return (
    <AppShell
      header={
        <>
          <Text variant="page-title">InsightBoard</Text>
          <Text variant="caption">
            Support &amp; product analytics — scaffold in progress.
          </Text>
        </>
      }
    >
      <Card title="Scaffold ready">
        <Text variant="body">
          Project scaffolding, design tokens, primitives and tooling are in
          place. Dashboard widgets are added in subsequent steps.
        </Text>
      </Card>
    </AppShell>
  );
}
