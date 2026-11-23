import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected network error occurred while contacting the HRMS server.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center bg-[var(--danger-subtle)] border border-[var(--danger-border)] rounded-lg',
        className
      )}
    >
      <div className="w-9 h-9 rounded-full bg-[var(--danger-subtle)] text-[var(--danger)] flex items-center justify-center mb-2.5">
        <AlertCircle size={18} strokeWidth={1.7} />
      </div>
      <h4 className="text-[14px] font-medium text-[var(--danger-text)] mb-1">{title}</h4>
      <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mb-3.5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] transition-colors shadow-xs"
        >
          <RefreshCw size={14} strokeWidth={1.7} />
          <span>Retry request</span>
        </button>
      )}
    </div>
  );
}
