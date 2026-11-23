import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HeadcountTrendPoint } from '../../types';

interface HeadcountTrendChartProps {
  data: HeadcountTrendPoint[];
}

export function HeadcountTrendChart({ data }: HeadcountTrendChartProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Headcount trend
          </h3>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Dec 2025 to Nov 2026 • 12 months
          </p>
        </div>
        <div className="text-right">
          <span className="text-[16px] font-semibold text-[var(--text-primary)] tabular-nums">
            1,284
          </span>
          <span className="text-[11px] text-[var(--success-text)] block font-medium">
            +12.6% YoY
          </span>
        </div>
      </div>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--border-subtle)" />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            />
            <YAxis
              domain={['dataMin - 30', 'dataMax + 20']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as HeadcountTrendPoint;
                  return (
                    <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs text-[11px]">
                      <div className="font-semibold text-[var(--text-primary)] mb-0.5">{label}</div>
                      <div className="text-[var(--text-secondary)]">
                        Headcount: <span className="font-semibold text-[var(--text-primary)] tabular-nums">{item.total}</span>
                      </div>
                      <div className="text-[var(--text-tertiary)] font-mono mt-0.5">
                        +{item.hires} hires / -{item.exits} exits
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--brand-primary)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3.5, stroke: 'var(--bg-surface)', strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-subtle)] mt-1">
        <span>Joiners avg: 21 / mo</span>
        <span>Attrition avg: 8 / mo</span>
      </div>
    </div>
  );
}
