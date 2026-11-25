import type { AttendanceDayPoint } from '../../types';

interface AttendanceChartProps {
  data: AttendanceDayPoint[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Attendance this week
          </h3>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Biometric &amp; leave activity
          </p>
        </div>
        <div className="text-right">
          <span className="text-[16px] font-medium text-[var(--text-primary)] tabular-nums">
            92.8%
          </span>
          <span className="text-[11px] text-[var(--text-tertiary)] block font-mono">
            Active today
          </span>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {data.map((item) => {
          const total = item.present + item.onLeave + item.absent || 1;
          const presentPct = Math.round((item.present / total) * 100);
          const leavePct = Math.round((item.onLeave / total) * 100);
          const absentPct = Math.max(0, 100 - presentPct - leavePct);

          return (
            <div key={item.dateStr} className="space-y-1">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)]">
                  {item.day} <span className="font-mono text-[11px] text-[var(--text-tertiary)]">{item.dateStr}</span>
                </span>
                <span className="font-mono tabular-nums text-[var(--text-primary)] font-medium">
                  {item.present.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--brand-primary)]" style={{ width: `${presentPct}%` }} />
                <div className="h-full bg-[var(--warning)]" style={{ width: `${leavePct}%` }} />
                <div className="h-full bg-[var(--danger)]" style={{ width: `${absentPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-subtle)] mt-4">
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
          <span>Present</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]" />
          <span>Leave</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)]" />
          <span>Absent</span>
        </span>
      </div>
    </div>
  );
}
