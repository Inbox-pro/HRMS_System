import type { HiringFunnelStage } from '../../types';

interface HiringFunnelProps {
  stages: HiringFunnelStage[];
}

export function HiringFunnel({ stages }: HiringFunnelProps) {
  const maxCount = Math.max(...stages.map((s) => s.count)) || 1;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Hiring funnel
          </h3>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            24 active requisitions • 482 applicants
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
            19d avg to offer
          </span>
        </div>
      </div>

      {/* Funnel Stages */}
      <div className="space-y-2.5 my-auto py-1">
        {stages.map((stage, idx) => {
          const widthPct = Math.max(10, Math.round((stage.count / maxCount) * 100));

          return (
            <div key={stage.stage} className="space-y-1">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)] font-medium">{stage.stage}</span>
                <div className="flex items-center space-x-2 tabular-nums">
                  <span className="font-semibold text-[var(--text-primary)]">{stage.count}</span>
                  {idx > 0 && (
                    <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                      {stage.conversionPct}%
                    </span>
                  )}
                </div>
              </div>

              {/* Minimal bar track */}
              <div className="h-1.5 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-[var(--brand-primary)] rounded-full transition-all duration-300"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] mt-2">
        <span>Acceptance rate: 82%</span>
        <button
          onClick={() => alert('Navigating to Candidate Pipeline...')}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
        >
          View pipeline
        </button>
      </div>
    </div>
  );
}
