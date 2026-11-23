import type { KpiMetric } from '../../types';
import { cn } from '../../lib/utils';

interface KpiTileProps {
  metric: KpiMetric;
  isSelected?: boolean;
  onClick?: () => void;
}

export function KpiTile({ metric, isSelected, onClick }: KpiTileProps) {
  const isUp = metric.trend === 'positive';
  const isDown = metric.trend === 'negative';

  // Fine sparkline path
  const values = metric.sparkline;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 72;
  const height = 22;
  const padding = 1;

  const points = values
    .map((val, idx) => {
      const x = padding + (idx / (values.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group text-left w-full p-3.5 rounded-lg border transition-colors bg-[var(--bg-surface)]',
        'border-[var(--border-subtle)] hover:border-[var(--border-default)]',
        isSelected && 'ring-1 ring-[var(--brand-primary)] border-[var(--brand-primary)]'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[var(--text-secondary)]">
          {metric.label}
        </span>
        {/* Fine Sparkline in top right */}
        <div className="h-5 w-18 shrink-0" aria-hidden="true">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={isUp ? 'var(--brand-primary)' : 'var(--text-tertiary)'}
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      <div className="mt-2 text-[26px] font-semibold tracking-tight text-[var(--text-primary)] tabular-nums leading-none">
        {metric.value}
      </div>

      <div className="mt-2.5 flex items-center space-x-1.5 text-[12px]">
        <span
          className={cn(
            'font-medium tabular-nums',
            isUp && 'text-[var(--success-text)]',
            isDown && 'text-[var(--danger-text)]',
            !isUp && !isDown && 'text-[var(--text-secondary)]'
          )}
        >
          {metric.trendValue}
        </span>
        <span className="text-[var(--text-tertiary)]">•</span>
        <span className="text-[var(--text-tertiary)] truncate">{metric.comparisonLabel}</span>
      </div>
    </button>
  );
}
