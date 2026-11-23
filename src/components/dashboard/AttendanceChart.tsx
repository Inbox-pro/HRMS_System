import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { AttendanceDayPoint } from '../../types';

interface AttendanceChartProps {
  data: AttendanceDayPoint[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Attendance this week
          </h3>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Daily biometric & leave activity
          </p>
        </div>
        <div className="text-right">
          <span className="text-[16px] font-semibold text-[var(--text-primary)] tabular-nums">
            92.8%
          </span>
          <span className="text-[11px] text-[var(--text-tertiary)] block font-mono">
            Active today
          </span>
        </div>
      </div>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 10, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--border-subtle)" />
            <XAxis
              dataKey="day"
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as AttendanceDayPoint;
                  return (
                    <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs text-[11px]">
                      <div className="font-semibold text-[var(--text-primary)] mb-1">
                        {label} ({item.dateStr})
                      </div>
                      <div className="space-y-0.5 font-mono">
                        <div className="flex justify-between space-x-3 text-[var(--text-primary)]">
                          <span>Present:</span>
                          <span className="font-semibold tabular-nums">{item.present}</span>
                        </div>
                        <div className="flex justify-between space-x-3 text-[var(--warning-text)]">
                          <span>On leave:</span>
                          <span className="font-semibold tabular-nums">{item.onLeave}</span>
                        </div>
                        <div className="flex justify-between space-x-3 text-[var(--danger-text)]">
                          <span>Absent:</span>
                          <span className="font-semibold tabular-nums">{item.absent}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="present" stackId="a" fill="var(--brand-primary)" barSize={10} />
            <Bar dataKey="onLeave" stackId="a" fill="var(--warning)" />
            <Bar dataKey="absent" stackId="a" fill="var(--danger)" radius={[1, 1, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-subtle)] mt-1">
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
