import React from 'react';
import { Layers, RefreshCw, AlertCircle, Inbox, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export type DemoState = 'normal' | 'loading' | 'empty' | 'error';

interface StateControllerProps {
  currentState: DemoState;
  onStateChange: (state: DemoState) => void;
  onResetData: () => void;
}

export function StateController({
  currentState,
  onStateChange,
  onResetData,
}: StateControllerProps) {
  const states: { id: DemoState; label: string; icon: React.ElementType }[] = [
    { id: 'normal', label: 'Live Data', icon: CheckCircle2 },
    { id: 'loading', label: 'Loading Skeletons', icon: RefreshCw },
    { id: 'empty', label: 'Empty State', icon: Inbox },
    { id: 'error', label: 'Error & Retry', icon: AlertCircle },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[12px] shadow-xs mb-6">
      <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
        <Layers size={15} strokeWidth={1.7} className="text-[var(--brand-primary)]" />
        <span className="font-semibold text-[var(--text-primary)]">Widget State Inspector:</span>
        <span className="hidden sm:inline text-[var(--text-tertiary)]">
          Inspect UI states for enterprise reliability testing
        </span>
      </div>

      <div className="flex items-center space-x-1.5">
        <div className="inline-flex p-0.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
          {states.map((s) => {
            const Icon = s.icon;
            const isActive = currentState === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onStateChange(s.id)}
                className={cn(
                  'inline-flex items-center space-x-1 px-2.5 py-1 rounded-[4px] font-medium transition-all',
                  isActive
                    ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                <Icon
                  size={12}
                  strokeWidth={2}
                  className={isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}
                />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onResetData}
          className="px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-[4px] transition-colors"
          title="Reset approvals and metrics to default seed"
        >
          Reset data
        </button>
      </div>
    </div>
  );
}
