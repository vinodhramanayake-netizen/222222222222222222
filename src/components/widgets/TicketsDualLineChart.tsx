'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/primitives';
import type { TicketsPoint } from '@/lib/data';
import { chartColors } from '@/lib/tokens';
import styles from './TicketsDualLineChart.module.css';

export interface TicketsDualLineChartProps {
  /** Mon–Sun received vs solved counts (date labels like '22 May'). */
  series: TicketsPoint[];
}

// The Y-axis is fixed 0–400 with ticks every 100, per the story requirements.
const Y_TICKS = [0, 100, 200, 300, 400];
const Y_MAX = 400;

/**
 * Mon–Sun dual-line tickets chart (Received vs Solved) rendered with Recharts.
 *
 * Accessibility: the SVG chart is decorative (`aria-hidden`); the same data is
 * exposed to assistive tech via a visually-hidden data table, and the whole
 * widget is a labelled figure. This keeps the chart fully described without
 * relying on Recharts' internal SVG semantics, and works under static export.
 */
export function TicketsDualLineChart({ series }: TicketsDualLineChartProps) {
  return (
    <Card title="Tickets — Received vs Solved">
      <figure
        className={styles.figure}
        aria-label="Tickets received versus solved for each day, Monday to Sunday"
      >
        <div className={styles.chart} aria-hidden="true">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={series}
              margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
            >
              <CartesianGrid
                stroke={chartColors.grid}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: chartColors.grid }}
              />
              <YAxis
                domain={[0, Y_MAX]}
                ticks={Y_TICKS}
                allowDecimals={false}
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: chartColors.grid }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                }}
                labelStyle={{ color: 'var(--text-secondary)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="received"
                name="Received"
                stroke={chartColors.received}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="solved"
                name="Solved"
                stroke={chartColors.solved}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Visually-hidden equivalent for assistive tech. */}
        <table className="visually-hidden">
          <caption>
            Tickets received and solved per day, Monday to Sunday
          </caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Received</th>
              <th scope="col">Solved</th>
            </tr>
          </thead>
          <tbody>
            {series.map((point) => (
              <tr key={point.dateLabel}>
                <th scope="row">{point.dateLabel}</th>
                <td>{point.received}</td>
                <td>{point.solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </Card>
  );
}
