import { useEffect } from 'react';
import { X, Mail, MapPin, Briefcase } from 'lucide-react';
import { MOCK_EMPLOYEE_PROFILES } from '../../data/mockData';

interface EmployeeDrawerProps {
  employeeId: string | null;
  onClose: () => void;
}

export function EmployeeDrawer({ employeeId, onClose }: EmployeeDrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (employeeId) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [employeeId, onClose]);

  if (!employeeId) return null;

  const profile = MOCK_EMPLOYEE_PROFILES[employeeId] || {
    id: employeeId,
    name: 'Ananya Iyer',
    employeeCode: 'EMP-10482',
    role: 'AVP, Equity Research',
    department: 'Investment Banking & Research',
    location: 'Mumbai (BKC HQ)',
    email: 'ananya.iyer@acmefin.in',
    phone: '+91 98201 44521',
    joiningDate: '14 Jan 2022',
    reportingManager: 'Vikramaditya Singhania',
    directReportsCount: 4,
    status: 'Confirmed' as const,
    salaryBand: 'Band L5 (Executive)',
    panNumber: 'ABCPI8821K',
    uanNumber: '101482910482',
    esicNumber: 'N/A',
    leaveBalance: { casual: 4.5, earned: 12.0, sick: 6.0 },
    attendanceSummary: { ytdPresentPct: 96.8, averageCheckin: '09:12 AM IST', remoteDaysThisMonth: 3 },
    recentActions: [
      { date: '23 Nov 2026', action: 'Applied for Earned Leave (5 days)', status: 'Pending Approval' },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={`Employee profile for ${profile.name}`}
        className="relative w-full max-w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] h-full overflow-y-auto shadow-2xl z-10 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-start justify-between bg-[var(--bg-surface-hover)]">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-semibold text-[16px] shrink-0">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{profile.name}</h3>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {profile.employeeCode}
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{profile.role}</p>
              <div className="flex items-center space-x-3 text-[12px] text-[var(--text-tertiary)] mt-1.5">
                <span className="flex items-center space-x-1">
                  <MapPin size={12} strokeWidth={1.7} />
                  <span>{profile.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Briefcase size={12} strokeWidth={1.7} />
                  <span>{profile.department}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
            aria-label="Close drawer"
          >
            <X size={18} strokeWidth={1.7} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 flex-1 text-[13px]">
          {/* Quick Contact & Status */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Email</span>
              <a
                href={`mailto:${profile.email}`}
                className="font-medium text-[var(--brand-primary)] truncate block hover:underline"
              >
                {profile.email}
              </a>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Phone</span>
              <span className="font-medium text-[var(--text-primary)] block tabular-nums">
                {profile.phone}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Employment Status</span>
              <span className="inline-flex items-center text-[12px] font-medium text-[var(--success-text)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mr-1.5" />
                {profile.status}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Joining Date</span>
              <span className="font-medium text-[var(--text-primary)] block">{profile.joiningDate}</span>
            </div>
          </div>

          {/* Org Structure */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Organization & Hierarchy
            </h4>
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Reporting Manager</span>
                <span className="font-medium text-[var(--text-primary)]">{profile.reportingManager}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Direct Reports</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">
                  {profile.directReportsCount} team members
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Compensation Band</span>
                <span className="font-medium text-[var(--text-primary)]">{profile.salaryBand}</span>
              </div>
            </div>
          </div>

          {/* Statutory Identifiers (Indian Payroll) */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Statutory Details (India Compliance)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
                <span className="text-[11px] text-[var(--text-tertiary)] block">PAN Number</span>
                <span className="font-mono text-[12px] font-medium text-[var(--text-primary)] mt-0.5 block">
                  {profile.panNumber}
                </span>
              </div>
              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
                <span className="text-[11px] text-[var(--text-tertiary)] block">EPFO UAN</span>
                <span className="font-mono text-[12px] font-medium text-[var(--text-primary)] mt-0.5 block">
                  {profile.uanNumber}
                </span>
              </div>
              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
                <span className="text-[11px] text-[var(--text-tertiary)] block">ESIC No.</span>
                <span className="text-[12px] font-medium text-[var(--text-secondary)] mt-0.5 block">
                  {profile.esicNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Leave Balances */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Leave Balances (CY 2026)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg text-center">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Casual (CL)</span>
                <span className="text-[18px] font-semibold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                  {profile.leaveBalance.casual}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">days left</span>
              </div>
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg text-center">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Earned (EL)</span>
                <span className="text-[18px] font-semibold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                  {profile.leaveBalance.earned}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">days left</span>
              </div>
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg text-center">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Sick (SL)</span>
                <span className="text-[18px] font-semibold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                  {profile.leaveBalance.sick}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">days left</span>
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Attendance & Work Metrics
            </h4>
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">YTD Attendance Record</span>
                <span className="font-semibold text-[var(--success-text)] tabular-nums">
                  {profile.attendanceSummary.ytdPresentPct}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Avg. Daily Biometric Punch</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">
                  {profile.attendanceSummary.averageCheckin}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Approved WFH This Month</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">
                  {profile.attendanceSummary.remoteDaysThisMonth} days
                </span>
              </div>
            </div>
          </div>

          {/* Recent Timeline */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Recent HR Lifecycle Activity
            </h4>
            <div className="border border-[var(--border-subtle)] rounded-lg divide-y divide-[var(--border-subtle)]">
              {profile.recentActions.map((item, idx) => (
                <div key={idx} className="p-3 text-[12px] flex items-center justify-between">
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block">{item.action}</span>
                    <span className="text-[11px] text-[var(--text-tertiary)]">{item.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] flex items-center justify-between">
          <button
            onClick={() => window.open(`mailto:${profile.email}`)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] transition-colors"
          >
            <Mail size={14} strokeWidth={1.7} />
            <span>Send email</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[13px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] transition-colors"
          >
            Close profile
          </button>
        </div>
      </div>
    </div>
  );
}
