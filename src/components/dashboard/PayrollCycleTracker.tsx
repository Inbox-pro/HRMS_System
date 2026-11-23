import type { PayrollStep } from '../../types';
import { cn } from '../../lib/utils';
import { useToast } from '../common/Toast';

interface PayrollCycleTrackerProps {
  steps: PayrollStep[];
}

export function PayrollCycleTracker({ steps }: PayrollCycleTrackerProps) {
  const { showToast } = useToast();

  const handleRunVerification = () => {
    showToast({
      type: 'info',
      message: 'Running pre-disbursal TDS deduction & bank validation checks...',
    });
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Payroll cycle progress
            </h3>
            <span className="text-[12px] font-mono text-[var(--text-tertiary)]">
              Nov 2026
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
            Disbursal scheduled for 30 Nov (7 days remaining)
          </p>
        </div>

        <button
          onClick={handleRunVerification}
          className="px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[4px] transition-colors"
        >
          Verify batch sheet
        </button>
      </div>

      {/* Sleek Stepped Timeline */}
      <div className="grid grid-cols-5 gap-2 my-auto py-2">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';

          return (
            <div key={step.step} className="flex flex-col space-y-1.5 text-left">
              {/* Progress bar line above step */}
              <div
                className={cn(
                  'h-1 rounded-full transition-colors',
                  isDone && 'bg-[var(--brand-primary)]',
                  isInProgress && 'bg-[var(--brand-primary)]',
                  !isDone && !isInProgress && 'bg-[var(--border-subtle)]'
                )}
              />

              <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] font-mono">
                <span>0{step.step}</span>
                <span>{step.date.split(' ').slice(0, 2).join(' ')}</span>
              </div>

              <div
                className={cn(
                  'text-[12px] font-medium truncate leading-tight',
                  isInProgress ? 'text-[var(--brand-primary)] font-semibold' : 'text-[var(--text-primary)]'
                )}
              >
                {step.shortName}
              </div>

              <div className="text-[11px] text-[var(--text-tertiary)] line-clamp-2 leading-tight">
                {step.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] mt-2">
        <span className="text-[var(--text-secondary)]">
          Total gross salary: <strong className="text-[var(--text-primary)] font-medium tabular-nums font-mono">₹4,82,40,000</strong>
        </span>
        <span className="text-[var(--text-secondary)]">
          Statutory deductions: <strong className="text-[var(--text-primary)] font-medium tabular-nums font-mono">₹64,25,000</strong>
        </span>
      </div>
    </div>
  );
}
