import type { AttritionDeptPoint } from '../../types';
import { cn } from '../../lib/utils';

interface AttritionChartProps {
  data: AttritionDeptPoint[];
}

export function AttritionChart({ data }: AttritionChartProps) {
  const benchmark = 8.5;
  const maxRate = Math.max(...data.map((d) => d.rate), 16);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Attrition by department
          </h3>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Annualized • Avg 8.2%
          </p>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
          Target &lt;9.0%
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {data.map((entry) => {
          const isElevated = entry.rate > benchmark;
          const widthPct = Math.round((entry.rate / maxRate) * 100);

          return (
            <div key={entry.department} className="space-y-1">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)] truncate pr-2">
                  {entry.department}
                </span>
                <span
                  className={cn(
                    'font-mono tabular-nums font-medium shrink-0',
                    isElevated ? 'text-[var(--warning-text)]' : 'text-[var(--text-primary)]'
                  )}
                >
                  {entry.rate.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    isElevated ? 'bg-[var(--warning)]' : 'bg-[var(--brand-primary)]'
                  )}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] mt-4">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
          <span>Normal (&lt;8.5%)</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]" />
          <span>Elevated</span>
        </span>
      </div>
    </div>
  );
}
