import type { ComplianceDeadline } from '../../types';
import { cn } from '../../lib/utils';
import { useToast } from '../common/Toast';

interface ComplianceAlertsProps {
  alerts: ComplianceDeadline[];
  onFileCompliance: (id: string) => void;
}

export function ComplianceAlerts({ alerts, onFileCompliance }: ComplianceAlertsProps) {
  const { showToast } = useToast();

  const sortedAlerts = [...alerts].sort((a, b) => a.daysRemaining - b.daysRemaining);

  const handleAction = (alert: ComplianceDeadline) => {
    onFileCompliance(alert.id);
    showToast({
      type: 'success',
      message: `Initiated verification workflow for ${alert.authority} deposit`,
    });
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-[var(--text-primary)]">
          Compliance & deadlines
        </h2>
        <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
          Sorted by urgency
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--border-subtle)] flex-1 overflow-y-auto">
        {sortedAlerts.map((item) => {
          const isImminent = item.daysRemaining <= 7;
          const isUpcoming = item.daysRemaining > 7 && item.daysRemaining <= 15;

          return (
            <div
              key={item.id}
              className="p-4 flex items-start justify-between hover:bg-[var(--bg-surface-hover)] transition-colors group"
            >
              <div className="space-y-1 pr-3 flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-[11px] text-[var(--text-tertiary)]">
                  <span className="font-mono font-medium text-[var(--text-secondary)]">
                    {item.authority}
                  </span>
                  <span>•</span>
                  <span>{item.filingType}</span>
                </div>

                <div className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                  {item.title}
                </div>

                <div className="text-[12px] text-[var(--text-secondary)] tabular-nums">
                  Est. liability: <span className="font-medium text-[var(--text-primary)]">{item.estimatedLiability}</span>
                  <span className="text-[var(--text-tertiary)] ml-1.5 font-mono">({item.affectedEmployees} employees)</span>
                </div>
              </div>

              {/* Right: Days remaining & Action (Clean tabular figures, NO colored oval pills) */}
              <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch space-y-2">
                <div className="tabular-nums text-right">
                  <div
                    className={cn(
                      'text-[12px] font-medium leading-none',
                      isImminent && 'text-[var(--danger-text)] font-semibold',
                      isUpcoming && 'text-[var(--warning-text)]',
                      !isImminent && !isUpcoming && 'text-[var(--text-secondary)]'
                    )}
                  >
                    {item.daysRemaining}d left
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-mono">
                    {item.dueDate}
                  </div>
                </div>

                <button
                  onClick={() => handleAction(item)}
                  className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  Review filing
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
        <span>Statutory calendar: FY 2026-27</span>
        <span className="font-mono text-[var(--text-secondary)]">100% On-time</span>
      </div>
    </div>
  );
}
