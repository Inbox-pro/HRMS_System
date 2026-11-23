import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { AttritionDeptPoint } from '../../types';

interface AttritionChartProps {
  data: AttritionDeptPoint[];
}

export function AttritionChart({ data }: AttritionChartProps) {
  const benchmark = 8.5;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Attrition by department
          </h3>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Annualized turnover • Org avg: 8.2%
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
            Target &lt; 9.0%
          </span>
        </div>
      </div>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 16]}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="department"
              axisLine={false}
              tickLine={false}
              width={105}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as AttritionDeptPoint;
                  return (
                    <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs text-[11px]">
                      <div className="font-semibold text-[var(--text-primary)] mb-0.5">
                        {item.department}
                      </div>
                      <div className="text-[var(--text-secondary)]">
                        Attrition: <span className="font-semibold text-[var(--text-primary)] tabular-nums">{item.rate}%</span>
                      </div>
                      <div className="text-[var(--text-tertiary)] font-mono mt-0.5">
                        {item.exits} exits / {item.headcount} team
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="rate" radius={[0, 2, 2, 0]} barSize={8}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.rate > benchmark ? 'var(--warning)' : 'var(--brand-primary)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-subtle)] mt-1">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
          <span>Normal (&lt;8.5%)</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]" />
          <span>Elevated watch</span>
        </span>
      </div>
    </div>
  );
}
