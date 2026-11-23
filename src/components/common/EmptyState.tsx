import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-subtle)] flex items-center justify-center mb-3 text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
        <Icon size={18} strokeWidth={1.7} />
      </div>
      <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-1">{title}</h4>
      <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-3 py-1.5 text-[13px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
