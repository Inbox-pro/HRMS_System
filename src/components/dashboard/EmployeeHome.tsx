import { useState, useEffect } from 'react';
import {
  Play,
  Square,
  FileText,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Award,
  Bell,
  Heart,
  ShieldCheck,
  Printer,
  X,
  Gift,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHrms } from '../../context/HrmsContext';
import { cn } from '../../lib/utils';

interface EmployeeHomeProps {
  onOpenDrawer: (empId: string) => void;
}

export function EmployeeHome({ onOpenDrawer }: EmployeeHomeProps) {
  const { showToast } = useToast();
  const {
    currentUser,
    clockedIn,
    clockInTime,
    workingMinutesToday,
    clockIn,
    clockOut,
    applyLeave,
    setActiveNav,
  } = useHrms();

  const [currentTime, setCurrentTime] = useState('');
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'casual' | 'sick' | 'earned'>('earned');
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

  const hours = Math.floor(workingMinutesToday / 60);
  const mins = workingMinutesToday % 60;
  const timerDisplay = `${hours}h ${mins.toString().padStart(2, '0')}m`;

  const handleTogglePunch = () => {
    if (clockedIn) {
      clockOut();
      showToast({
        type: 'info',
        message: `Web punch-out recorded. Shift duration logged: ${timerDisplay}.`,
      });
    } else {
      clockIn('BKC HQ - Main Turnstile 02');
      showToast({
        type: 'success',
        message: 'Web punch-in authenticated via registered terminal IP.',
      });
    }
  };

  const currentBalances = currentUser.leaveBalance || { casual: 4.5, earned: 12.0, sick: 6.0 };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    if (diffTime > currentBalances[leaveType]) {
      showToast({
        type: 'warning',
        message: `Insufficient ${leaveType.toUpperCase()} leave balance. Requested: ${diffTime} days, Available: ${currentBalances[leaveType]} days.`,
      });
      return;
    }

    applyLeave({
      leaveType,
      startDate,
      endDate,
      days: diffTime,
      reason: leaveReason || 'Personal / Planned leave',
    });

    setIsApplyLeaveOpen(false);
    showToast({
      type: 'success',
      message: `${leaveType.toUpperCase()} application (${diffTime} days) submitted to ${currentUser.reportingManager} for approval.`,
    });
  };

  // Weekly attendance punch data
  const weekPunches = [
    { day: 'Mon', date: '19 Nov', in: '09:08 AM', out: '06:20 PM', total: '9h 12m', status: 'On Time' },
    { day: 'Tue', date: '20 Nov', in: '09:18 AM', out: '07:10 PM', total: '9h 52m', status: 'On Time' },
    { day: 'Wed', date: '21 Nov', in: '09:05 AM', out: '06:30 PM', total: '9h 25m', status: 'On Time' },
    { day: 'Thu', date: '22 Nov', in: '09:12 AM', out: '06:45 PM', total: '9h 33m', status: 'On Time' },
    { day: 'Fri (Today)', date: '23 Nov', in: clockInTime || '09:12 AM', out: clockedIn ? 'Active' : '06:30 PM', total: timerDisplay, status: 'Present' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Employee Identity Banner */}
      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[var(--brand-primary)] border border-emerald-200 flex items-center justify-center font-bold text-[16px] shadow-2xs shrink-0">
            {currentUser.initials}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-[var(--brand-primary)] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                {currentUser.employeeCode}
              </span>
              <span className="text-[12px] text-[var(--text-secondary)] font-normal">Band L5 (Executive) • Investment Banking</span>
            </div>
            <h2 className="text-[19px] font-bold text-[var(--text-primary)] mt-1 tracking-tight">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-[12px] text-[var(--text-tertiary)]">
              Reporting to {currentUser.reportingManager} (Head of Research) • BKC HQ Campus, Mumbai
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenDrawer(currentUser.id)}
            className="px-3 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)] rounded-[6px] shadow-2xs transition-colors cursor-pointer"
          >
            My Profile & Statutory ID
          </button>
          <button
            onClick={() => setIsPayslipModalOpen(true)}
            className="px-3 py-1.5 text-[12px] font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-subtle)] rounded-[6px] shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <FileText size={13} className="text-[var(--brand-primary)]" />
            <span>November Payslip</span>
          </button>
          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="px-3.5 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.2} />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* 2. Top Row: Punch Clock Widget & Reconciled Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Punch Clock Widget (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Digital Attendance Terminal
              </span>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border tracking-wider uppercase',
                  clockedIn
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                )}
              >
                {clockedIn ? 'CLOCKED IN • ACTIVE' : 'CLOCKED OUT'}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-[34px] font-mono font-bold text-[var(--text-primary)] tabular-nums tracking-tight">
                {currentTime}
              </div>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                Indian Standard Time (IST) • Geofenced: BKC HQ Main Turnstile 02
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface-subtle)] rounded-lg border border-[var(--border-subtle)] space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">First In-Punch Today</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {clockedIn ? clockInTime || '09:12 AM' : '09:12 AM'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Working Duration Logged</span>
              <span className="font-mono font-bold text-emerald-700">
                {clockedIn ? timerDisplay : '8h 28m'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Grace Period Cutoff</span>
              <span className="font-mono text-[var(--text-tertiary)]">09:30 AM IST (Met)</span>
            </div>
          </div>

          <button
            onClick={handleTogglePunch}
            className={cn(
              'w-full py-2.5 rounded-[6px] font-semibold text-[13px] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs',
              clockedIn
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            )}
          >
            {clockedIn ? (
              <>
                <Square size={13} className="fill-rose-700 text-rose-700" />
                <span>Clock Out for Today</span>
              </>
            ) : (
              <>
                <Play size={13} className="fill-emerald-800 text-emerald-800" />
                <span>Clock In via Web Terminal</span>
              </>
            )}
          </button>
        </div>

        {/* Leave Balances Grid (7 cols) */}
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div>
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                  My Leave Balances (CY 2026)
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">Statutory leave entitlements reconciled up to 23 Nov 2026</p>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="text-[12px] font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
              >
                Apply Leave →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3.5 mt-4">
              <div className="p-4 border border-[var(--border-subtle)] rounded-lg text-center bg-[var(--bg-surface-subtle)] space-y-1">
                <span className="text-[11px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider block">Earned Leave (EL)</span>
                <span className="text-[26px] font-extrabold text-[var(--brand-primary)] font-mono block">
                  {currentBalances.earned}
                </span>
                <div className="w-full bg-[var(--border-subtle)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--brand-primary)] h-full" style={{ width: `${(currentBalances.earned / 21) * 100}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] block pt-1">Encashable (max 45d)</span>
              </div>

              <div className="p-4 border border-[var(--border-subtle)] rounded-lg text-center bg-[var(--bg-surface-subtle)] space-y-1">
                <span className="text-[11px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider block">Casual Leave (CL)</span>
                <span className="text-[26px] font-extrabold text-[var(--text-primary)] font-mono block">
                  {currentBalances.casual}
                </span>
                <div className="w-full bg-[var(--border-subtle)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${(currentBalances.casual / 7) * 100}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] block pt-1">Valid till 31 Dec 2026</span>
              </div>

              <div className="p-4 border border-[var(--border-subtle)] rounded-lg text-center bg-[var(--bg-surface-subtle)] space-y-1">
                <span className="text-[11px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider block">Sick Leave (SL)</span>
                <span className="text-[26px] font-extrabold text-[var(--text-primary)] font-mono block">
                  {currentBalances.sick}
                </span>
                <div className="w-full bg-[var(--border-subtle)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full" style={{ width: `${(currentBalances.sick / 7) * 100}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] block pt-1">Medical proof &gt; 2 days</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200 flex items-center justify-between text-[12px]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span className="text-emerald-900 font-medium">November 2026 Salary Disbursed via Kotak Bank</span>
            </div>
            <span className="font-mono font-bold text-emerald-800">₹1,94,400 Net</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Dock */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-xs">
        <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 px-1">
          Self-Service Quick Actions Dock
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-[12px]">
          <button
            onClick={() => setIsPayslipModalOpen(true)}
            className="p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] text-left transition-all cursor-pointer group"
          >
            <FileText size={18} className="text-[var(--brand-primary)] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[var(--text-primary)] block">Payslip View</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">Nov 2026 slip</span>
          </button>

          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] text-left transition-all cursor-pointer group"
          >
            <Calendar size={18} className="text-emerald-700 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[var(--text-primary)] block">Apply Leave</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">EL / CL / SL</span>
          </button>

          <button
            onClick={() => {
              setActiveNav('payroll');
              showToast({ type: 'info', message: 'Opened Tax Regime & Investment Declarations' });
            }}
            className="p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] text-left transition-all cursor-pointer group"
          >
            <ShieldCheck size={18} className="text-teal-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[var(--text-primary)] block">Tax Proofs</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">80C & HRA claim</span>
          </button>

          <button
            onClick={() => {
              setActiveNav('time_leave');
              showToast({ type: 'info', message: 'Opened Attendance Regularizations' });
            }}
            className="p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] text-left transition-all cursor-pointer group"
          >
            <Clock size={18} className="text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[var(--text-primary)] block">Regularize</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">Fix missed punch</span>
          </button>

          <button
            onClick={() => {
              setActiveNav('helpdesk');
              showToast({ type: 'info', message: 'Opened Service Desk Tickets' });
            }}
            className="p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] text-left transition-all cursor-pointer group"
          >
            <AlertCircle size={18} className="text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[var(--text-primary)] block">Raise Ticket</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">EPFO & IT query</span>
          </button>

          <button
            onClick={() => {
              setActiveNav('hiring');
              showToast({ type: 'info', message: 'Opened Internal Job Postings (IJP)' });
            }}
            className="p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] text-left transition-all cursor-pointer group"
          >
            <Award size={18} className="text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[var(--text-primary)] block">Refer a Peer</span>
            <span className="text-[10px] text-[var(--text-tertiary)]">₹50,000 bounty</span>
          </button>
        </div>
      </div>

      {/* 4. Split Grid: Left (7 Cols) and Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weekly Biometric Punch History Tracker */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div>
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                  Weekly Attendance & Biometric Streak
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">Current work week (19 Nov – 23 Nov 2026)</p>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold font-mono">Punctuality Score: 98.4%</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-[11px]">
              {weekPunches.map((wp, idx) => (
                <div key={idx} className="p-2.5 border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] rounded-lg text-center space-y-1">
                  <span className="font-bold text-[var(--text-primary)] block">{wp.day}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] block">{wp.date}</span>
                  <span className="font-mono text-[10px] text-[var(--brand-primary)] font-semibold block pt-1">{wp.in}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">{wp.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Active Requests & Lifecycle Tracker */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                My Active Requests & Approvals
              </h3>
              <span className="text-[11px] text-[var(--text-tertiary)] font-mono">3 In-Flight</span>
            </div>

            <div className="space-y-2.5 text-[12px]">
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Earned Leave (EL) — 5 Days</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">02 Dec – 06 Dec 2026 • Reporting Manager Approval</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Pending Approval
                </span>
              </div>

              <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">EPFO UAN Form 13 Transfer</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">Kotak Securities to Acme Fin EPFO account</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  In Progress (HR Desk)
                </span>
              </div>

              <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Client Equities Research Audit Expense</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">₹4,850 Travel Reimbursement • Tax Invoices Attached</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Approved & Disbursed
                </span>
              </div>
            </div>
          </div>

          {/* Q4 Goals & Objectives */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div>
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                  My Q4 Performance Goals & OKRs
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">CY 2026 Annual Review Cycle</p>
              </div>
              <span className="text-[11px] text-[var(--brand-primary)] font-semibold font-mono">82% Completed</span>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-[var(--text-primary)]">Institutional Derivatives Model Calibration</span>
                  <span className="font-mono text-[var(--brand-primary)] font-bold">85%</span>
                </div>
                <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--brand-primary)] h-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-[var(--text-primary)]">Risk Framework SEBI Regulatory Filing</span>
                  <span className="font-mono text-emerald-700 font-bold">100%</span>
                </div>
                <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-[var(--text-primary)]">Mentorship & Code Reviews for Junior Quant Analysts</span>
                  <span className="font-mono text-amber-600 font-bold">60%</span>
                </div>
                <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Company Announcements & Notice Board */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex items-center space-x-2">
                <Bell size={16} className="text-[var(--brand-primary)]" />
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                  Company Announcements
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Official</span>
            </div>

            <div className="space-y-3 text-[12px]">
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)] text-[12px]">FY27 Tax Proof Deadline: 31 Dec</span>
                  <span className="text-[10px] text-rose-600 font-semibold font-mono">Urgent</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  All employees on the Old Tax Regime must upload rent receipts and 80C statements to avoid TDS deduction in Jan payroll.
                </p>
              </div>

              <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)] text-[12px]">Annual Health & Wellness Camp</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">28 Nov</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Complimentary cardiac & health screenings conducted by Fortis Healthcare at the BKC HQ 12th Floor Wellness Centre.
                </p>
              </div>

              <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)] text-[12px]">Christmas Holiday Notice</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-mono">25 Dec</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Markets closed. Essential clearing and tech on-call shifts scheduled.
                </p>
              </div>
            </div>
          </div>

          {/* Team Celebrations & Birthdays */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex items-center space-x-2">
                <Heart size={16} className="text-rose-500" />
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                  Team Celebrations
                </h3>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">This Week</span>
            </div>

            <div className="space-y-2.5 text-[12px]">
              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg flex items-center justify-between bg-[var(--bg-surface-subtle)]">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Rohan Mehta</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">Birthday in 3 days (26 Nov)</span>
                </div>
                <button
                  onClick={() => showToast({ type: 'success', message: 'Sent birthday greeting to Rohan Mehta!' })}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-primary)] bg-[var(--brand-subtle)] rounded hover:bg-emerald-100 cursor-pointer"
                >
                  Send Wishes 🎂
                </button>
              </div>

              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg flex items-center justify-between bg-[var(--bg-surface-subtle)]">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Vikram Patel</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">4 Years at Acme (Anniversary)</span>
                </div>
                <button
                  onClick={() => showToast({ type: 'success', message: 'Sent congratulations to Vikram Patel!' })}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-primary)] bg-[var(--brand-subtle)] rounded hover:bg-emerald-100 cursor-pointer"
                >
                  Congrats 🎉
                </button>
              </div>
            </div>
          </div>

          {/* Reporting Manager Contact Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2">
              My Reporting Manager
            </div>
            <div className="flex items-center space-x-3 text-[12px]">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[13px]">
                VS
              </div>
              <div>
                <span className="font-bold text-[var(--text-primary)] block">{currentUser.reportingManager}</span>
                <span className="text-[11px] text-[var(--text-secondary)]">Head of Research & Executive VP</span>
                <span className="text-[10px] text-[var(--text-tertiary)] block font-mono">vikram.singhania@acmefin.in</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-[var(--text-tertiary)] flex justify-between items-center border-t border-[var(--border-subtle)]">
              <span>Next 1-on-1 Alignment:</span>
              <span className="font-semibold text-[var(--text-primary)]">Thu at 03:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyLeaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Apply for Planned Leave</h3>
              <button onClick={() => setIsApplyLeaveOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)]"
                >
                  <option value="earned">Earned Leave (EL) — {currentBalances.earned} days balance</option>
                  <option value="casual">Casual Leave (CL) — {currentBalances.casual} days balance</option>
                  <option value="sick">Sick Leave (SL) — {currentBalances.sick} days balance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Handover Plan & Justification</label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsApplyLeaveOpen(false)}
                  className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] rounded-[6px] cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* November Payslip Direct Modal */}
      {isPayslipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 text-[12px]">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Acme Financial Services — Payslip</h3>
                <span className="text-[11px] text-[var(--text-tertiary)] font-mono">Period: November 2026 • Value Date: 30 Nov 2026</span>
              </div>
              <button onClick={() => setIsPayslipModalOpen(false)} className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--bg-surface-subtle)] rounded-lg">
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Employee</span>
                <span className="font-bold text-[var(--text-primary)]">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Code & PAN</span>
                <span className="font-mono text-[var(--text-primary)]">{currentUser.employeeCode} • ABCPI8821K</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Gross Earnings</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">₹2,37,500</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold block">Deductions (TDS + PF)</span>
                <span className="font-mono font-bold text-[var(--danger)]">₹43,100</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">Net Take-Home Pay</span>
                <span className="text-[11px] text-emerald-800 dark:text-emerald-400">Credited to Kotak Bank •••• 9412</span>
              </div>
              <span className="text-[22px] font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">₹1,94,400</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setIsPayslipModalOpen(false)}
                className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] rounded-[6px] flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Printer size={14} />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
