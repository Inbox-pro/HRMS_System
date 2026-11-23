import { useState, useEffect } from 'react';
import {
  Clock,
  Download,
  Plus,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface EmployeeHomeProps {
  onOpenDrawer: (empId: string) => void;
}

export function EmployeeHome({ onOpenDrawer }: EmployeeHomeProps) {
  const { showToast } = useToast();
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchInTime] = useState('09:14 AM IST');
  const [currentTime, setCurrentTime] = useState('');
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Earned Leave (EL)');
  const [startDate, setStartDate] = useState('2026-12-02');
  const [endDate, setEndDate] = useState('2026-12-06');
  const [leaveReason, setLeaveReason] = useState('Annual scheduled family vacation.');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePunch = () => {
    if (isPunchedIn) {
      setIsPunchedIn(false);
      showToast({
        type: 'info',
        message: 'Web punch-out recorded. Total shift duration logged: 8h 28m.',
      });
    } else {
      setIsPunchedIn(true);
      showToast({
        type: 'success',
        message: 'Web punch-in authenticated via registered terminal IP.',
      });
    }
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplyLeaveOpen(false);
    showToast({
      type: 'success',
      message: `${leaveType} application submitted to Vikramaditya Singhania for approval.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              EMP-10482
            </span>
            <span className="text-[12px] text-[var(--text-secondary)]">Band L5 • Fixed Income & Research</span>
          </div>
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)] mt-1">
            Ananya Iyer — Employee Self-Service (ESS)
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Reporting to Vikramaditya Singhania (Head of Research) • BKC HQ, Mumbai
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenDrawer('emp-10482')}
            className="px-3 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px] transition-colors"
          >
            My statutory profile & PAN
          </button>
          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors flex items-center space-x-1"
          >
            <Plus size={13} />
            <span>Apply leave</span>
          </button>
        </div>
      </div>

      {/* Row 1: Attendance Clock & Quick Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Punch Clock Widget (5 columns) */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                TODAY'S BIOMETRIC WEB CLOCK
              </span>
              <span className="text-[11px] font-mono tabular-nums text-[var(--text-tertiary)]">
                {currentTime || '05:42:15 PM'}
              </span>
            </div>

            <div className="mt-4 p-4 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg text-center space-y-2">
              <div className="text-[11px] text-[var(--text-tertiary)]">Today's working duration</div>
              <div className="text-[28px] font-bold font-mono text-[var(--brand-primary)] tracking-tight">
                08h 28m 42s
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] flex items-center justify-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] inline-block" />
                <span>Punched In at {punchInTime} • BKC Turnstile 02</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleTogglePunch}
              className={`w-full py-2.5 px-4 rounded-[6px] font-medium text-[13px] transition-colors flex items-center justify-center space-x-2 ${
                isPunchedIn
                  ? 'bg-[var(--danger)]/10 text-[var(--danger-text)] border border-[var(--danger)]/30 hover:bg-[var(--danger)]/20'
                  : 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]'
              }`}
            >
              <Clock size={15} />
              <span>{isPunchedIn ? 'Punch Out for the Day' : 'Punch In (Web Terminal)'}</span>
            </button>
            <span className="text-[10px] text-[var(--text-tertiary)] block text-center">
              Geofence verified: Equinox BKC Campus IP Gateway
            </span>
          </div>
        </div>

        {/* Right: Leave Balances & Status (7 columns) */}
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                My Leave Entitlement & Balances (FY 2026-27)
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Annual carry-forward limit: 10 days to calendar year 2027
              </p>
            </div>
            <span className="text-[11px] font-mono text-[var(--brand-primary)] font-semibold">
              14.5 Total Days Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Earned / Privilege</span>
              <strong className="text-[20px] font-semibold text-[var(--text-primary)] font-mono">8.0</strong>
              <span className="text-[10px] text-[var(--text-tertiary)] block mt-1">Encashable</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Casual Leave</span>
              <strong className="text-[20px] font-semibold text-[var(--text-primary)] font-mono">4.5</strong>
              <span className="text-[10px] text-[var(--warning-text)] block mt-1">Lapses 31 Dec</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Sick / Medical</span>
              <strong className="text-[20px] font-semibold text-[var(--text-primary)] font-mono">2.0</strong>
              <span className="text-[10px] text-[var(--text-tertiary)] block mt-1">Lapses 31 Dec</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg">
              <span className="text-[11px] text-[var(--text-tertiary)] block">Compensatory Off</span>
              <strong className="text-[20px] font-semibold text-[var(--brand-primary)] font-mono">2.0</strong>
              <span className="text-[10px] text-[var(--text-secondary)] block mt-1">Valid 60 days</span>
            </div>
          </div>

          <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-secondary)]">
              Upcoming approved leave: <strong>02 Dec – 06 Dec 2026 (5 days Annual Vacation)</strong>
            </span>
            <span className="text-[var(--success-text)] font-medium">Approved by Vikramaditya Singhania</span>
          </div>
        </div>
      </div>

      {/* Row 2: Payslips & Recent Service Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Latest Payslip & Tax Summary (6 columns) */}
        <div className="lg:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Latest Payslips & Tax Statement
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Disbursed via Kotak Mahindra Bank • Old Tax Regime elected
              </p>
            </div>
            <button
              onClick={() => showToast({ type: 'success', message: 'Downloading November 2026 Encrypted Payslip PDF' })}
              className="text-[11px] text-[var(--brand-primary)] hover:underline font-medium flex items-center space-x-1"
            >
              <Download size={12} />
              <span>Nov 2026 PDF</span>
            </button>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">November 2026 (Value Date: 30 Nov)</span>
                <div className="text-[11px] text-[var(--text-tertiary)]">Gross: ₹2,37,500 • Deductions: ₹43,100 (PF + TDS)</div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[14px] text-[var(--brand-primary)]">₹1,94,400</span>
                <span className="text-[10px] text-[var(--success-text)] block font-medium">Ready for payout</span>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">October 2026</span>
                <div className="text-[11px] text-[var(--text-tertiary)]">Gross: ₹2,37,500 • TDS: ₹28,650</div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[14px] text-[var(--text-primary)]">₹1,94,400</span>
                <span className="text-[10px] text-[var(--text-tertiary)] block">Disbursed 31 Oct</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Service Tickets & Claims (6 columns) */}
        <div className="lg:col-span-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                My Service Requests & Reimbursements
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                EPFO Form 13 transfer & client entertainment expense claim
              </p>
            </div>
            <span className="text-[11px] text-[var(--brand-primary)] font-medium">2 Active items</span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] text-[var(--brand-primary)]">HD-8491</span>
                  <span className="font-semibold text-[var(--text-primary)]">UAN Form 13 Transfer</span>
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">Kotak Securities to Acme EPFO trust • SLA: 6h left</div>
              </div>
              <span className="text-[11px] font-medium text-[var(--warning-text)]">In Progress</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] text-[var(--text-primary)]">EXP-4910</span>
                  <span className="font-semibold text-[var(--text-primary)]">Institutional Client Dinner (Trident BKC)</span>
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">GST invoice submitted • Finance audit</div>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-[var(--text-primary)]">₹14,850</span>
                <span className="text-[10px] text-[var(--text-secondary)] block">Under Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyLeaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Apply for Leave
              </h3>
              <button
                onClick={() => setIsApplyLeaveOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-[13px]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Leave category
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)]"
                >
                  <option value="Earned Leave (EL)">Earned Leave (EL) — 8.0 days available</option>
                  <option value="Casual Leave (CL)">Casual Leave (CL) — 4.5 days available</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL) — 2.0 days available</option>
                  <option value="Compensatory Off">Compensatory Off — 2.0 days available</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                    Start date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                    End date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Reason & handover coverage
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsApplyLeaveOpen(false)}
                  className="px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px]"
                >
                  Submit application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
