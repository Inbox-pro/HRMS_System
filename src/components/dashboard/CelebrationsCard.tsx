import type { Celebration } from '../../types';
import { useToast } from '../common/Toast';

interface CelebrationsCardProps {
  celebrations: Celebration[];
  onSelectEmployee: (empId: string) => void;
}

export function CelebrationsCard({ celebrations, onSelectEmployee }: CelebrationsCardProps) {
  const { showToast } = useToast();

  const handleSendWish = (c: Celebration) => {
    const isBday = c.type === 'birthday';
    showToast({
      type: 'success',
      message: `Sent ${isBday ? 'birthday' : 'anniversary'} greeting to ${c.employee.name}`,
    });
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Birthdays & anniversaries
          </h3>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Upcoming next 7 days
          </p>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
          4 upcoming
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--border-subtle)] space-y-1.5 flex-1 overflow-y-auto">
        {celebrations.map((c) => {
          const isBirthday = c.type === 'birthday';

          return (
            <div
              key={c.id}
              className="pt-2 first:pt-0 flex items-center justify-between hover:bg-[var(--bg-surface-hover)] -mx-1 px-1.5 py-1 rounded transition-colors"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <button
                  type="button"
                  onClick={() => onSelectEmployee(c.employee.id)}
                  className="w-6 h-6 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[10px] font-semibold text-[var(--text-secondary)] flex items-center justify-center shrink-0 transition-colors"
                  title="View employee"
                >
                  {c.employee.initials}
                </button>
                <div className="truncate">
                  <button
                    type="button"
                    onClick={() => onSelectEmployee(c.employee.id)}
                    className="text-[12px] font-medium text-[var(--text-primary)] hover:underline truncate text-left block leading-tight"
                  >
                    {c.employee.name}
                  </button>
                  <div className="text-[11px] text-[var(--text-tertiary)] truncate leading-tight mt-0.5">
                    {isBirthday
                      ? `Birthday • ${c.dateStr}`
                      : `${c.yearsCount}y anniversary • ${c.dateStr}`}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSendWish(c)}
                className="px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-[4px] shrink-0 ml-2 transition-colors"
                title={`Send greetings to ${c.employee.name}`}
              >
                Wish
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[var(--border-subtle)] mt-2 text-[11px] text-[var(--text-tertiary)] flex items-center justify-between">
        <span>Workplace culture</span>
        <button
          onClick={() => alert('Opening celebrations calendar...')}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
        >
          View calendar
        </button>
      </div>
    </div>
  );
}
