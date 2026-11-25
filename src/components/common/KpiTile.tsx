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

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group text-left w-full p-4 rounded-xl border transition-colors duration-150 bg-[var(--bg-surface)] cursor-pointer',
        'border-[var(--border-subtle)] hover:border-[var(--border-default)]',
        isSelected && 'ring-1 ring-[var(--brand-primary)] border-[var(--brand-primary)]'
      )}
    >
      <div className="text-[12px] font-medium text-[var(--text-secondary)]">
        {metric.label}
      </div>

      <div className="mt-2 text-[28px] font-medium tracking-tight text-[var(--text-primary)] tabular-nums leading-none">
        {metric.value}
      </div>

      <div className="mt-3 flex items-center space-x-1.5 text-[12px]">
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
