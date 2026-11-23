import { useState } from 'react';
import { Download, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';

interface TimeLeavePageProps {
  onSelectEmployee: (empId: string) => void;
  role: UserRole;
}

interface BiometricPunch {
  id: string;
  empId: string;
  empName: string;
  empCode: string;
  terminal: string;
  inTime: string;
  outTime: string;
  workHours: string;
  overtimeHours: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Missed Punch';
  date?: string;
}

const PUNCH_LOGS: BiometricPunch[] = [
  {
    id: 'p-1',
    empId: 'emp-10482',
    empName: 'Ananya Iyer',
    empCode: 'EMP-10482',
    terminal: 'BKC HQ - Main Turnstile 02',
    inTime: '09:12 AM',
    outTime: '06:45 PM',
    workHours: '9h 33m',
    overtimeHours: '0h 33m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-2',
    empId: 'emp-10931',
    empName: 'Rohan Mehta',
    empCode: 'EMP-10931',
    terminal: 'Nariman Pt - Terminal 01',
    inTime: '08:58 AM',
    outTime: '06:15 PM',
    workHours: '9h 17m',
    overtimeHours: '0h 17m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-3',
    empId: 'emp-10214',
    empName: 'Vikram Patel',
    empCode: 'EMP-10214',
    terminal: 'Pune Hinjawadi - Gate A',
    inTime: '09:05 AM',
    outTime: '07:20 PM',
    workHours: '10h 15m',
    overtimeHours: '1h 15m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-4',
    empId: 'emp-11309',
    empName: 'Amit Joshi',
    empCode: 'EMP-11309',
    terminal: 'Pune Kalyani - Bio 03',
    inTime: '09:42 AM',
    outTime: '06:30 PM',
    workHours: '8h 48m',
    overtimeHours: '0h 00m',
    status: 'Late',
    date: '23 Nov 2026',
  },
  {
    id: 'p-5',
    empId: 'emp-11048',
    empName: 'Farah Sheikh',
    empCode: 'EMP-11048',
    terminal: 'BKC HQ - Fl 8 Turnstile A',
    inTime: '09:02 AM',
    outTime: '06:10 PM',
    workHours: '9h 08m',
    overtimeHours: '0h 08m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-6',
    empId: 'emp-10773',
    empName: 'Priya Nambiar',
    empCode: 'EMP-10773',
    terminal: 'Bengaluru ORR - Reception',
    inTime: '09:15 AM',
    outTime: '06:20 PM',
    workHours: '9h 05m',
    overtimeHours: '0h 05m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-7',
    empId: 'emp-11512',
    empName: 'Devendra Kothari',
    empCode: 'EMP-11512',
    terminal: 'Bengaluru ORR - Reception',
    inTime: '10:14 AM',
    outTime: '—',
    workHours: 'Pending',
    overtimeHours: '0h 00m',
    status: 'Late',
    date: '23 Nov 2026',
  },
  {
    id: 'p-8',
    empId: 'emp-11620',
    empName: 'Sanjay Deshpande',
    empCode: 'EMP-11620',
    terminal: 'BKC HQ - Main Turnstile 01',
    inTime: '—',
    outTime: '—',
    workHours: '0h 00m',
    overtimeHours: '0h 00m',
    status: 'Missed Punch',
    date: '23 Nov 2026',
  },
];

const ANANYA_PUNCH_HISTORY: BiometricPunch[] = [
  {
    id: 'ap-1',
    empId: 'emp-10482',
    empName: 'Ananya Iyer',
    empCode: 'EMP-10482',
    terminal: 'BKC HQ - Turnstile 02',
    inTime: '09:12 AM',
    outTime: '06:45 PM',
    workHours: '9h 33m',
    overtimeHours: '0h 33m',
    status: 'Present',
    date: '23 Nov 2026 (Today)',
  },
  {
    id: 'ap-2',
    empId: 'emp-10482',
    empName: 'Ananya Iyer',
    empCode: 'EMP-10482',
    terminal: 'BKC HQ - Turnstile 02',
    inTime: '09:05 AM',
    outTime: '06:30 PM',
    workHours: '9h 25m',
    overtimeHours: '0h 25m',
    status: 'Present',
    date: '22 Nov 2026 (Sun On-call)',
  },
  {
    id: 'ap-3',
    empId: 'emp-10482',
    empName: 'Ananya Iyer',
    empCode: 'EMP-10482',
    terminal: 'BKC HQ - Turnstile 01',
    inTime: '09:18 AM',
    outTime: '07:10 PM',
    workHours: '9h 52m',
    overtimeHours: '0h 52m',
    status: 'Present',
    date: '20 Nov 2026 (Fri)',
  },
  {
    id: 'ap-4',
    empId: 'emp-10482',
    empName: 'Ananya Iyer',
    empCode: 'EMP-10482',
    terminal: 'BKC HQ - Turnstile 02',
    inTime: '09:08 AM',
    outTime: '06:20 PM',
    workHours: '9h 12m',
    overtimeHours: '0h 12m',
    status: 'Present',
    date: '19 Nov 2026 (Thu)',
  },
];

interface RegularizationRequest {
  id: string;
  empId: string;
  empName: string;
  empCode: string;
  date: string;
  punchType: 'In Punch' | 'Out Punch' | 'Both Punches';
  originalTime: string;
  requestedTime: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const INITIAL_REGULARIZATIONS: RegularizationRequest[] = [
  {
    id: 'reg-01',
    empId: 'emp-11620',
    empName: 'Sanjay Deshpande',
    empCode: 'EMP-11620',
    date: '22 Nov 2026',
    punchType: 'Both Punches',
    originalTime: 'Missed',
    requestedTime: '09:15 AM – 06:30 PM',
    reason: 'Turnstile B biometric reader optical sensor failure at BKC Ground Floor entrance.',
    status: 'Pending',
  },
  {
    id: 'reg-02',
    empId: 'emp-11309',
    empName: 'Amit Joshi',
    empCode: 'EMP-11309',
    date: '21 Nov 2026',
    punchType: 'In Punch',
    originalTime: '09:42 AM',
    requestedTime: '09:00 AM',
    reason: 'Client technical discussion on-site at HDFC Bank IT Park, Hinjawadi Phase 1 before coming to office.',
    status: 'Pending',
  },
  {
    id: 'reg-03',
    empId: 'emp-11048',
    empName: 'Farah Sheikh',
    empCode: 'EMP-11048',
    date: '20 Nov 2026',
    punchType: 'Out Punch',
    originalTime: 'Missed',
    requestedTime: '07:15 PM',
    reason: 'Late trading session closure for US market opening derivatives surveillance.',
    status: 'Pending',
  },
];

interface ShiftRoster {
  id: string;
  shiftName: string;
  timings: string;
  headcount: number;
  coverage: string;
  leadSupervisor: string;
  activeStatus: string;
}

const SHIFT_ROSTER: ShiftRoster[] = [
  {
    id: 's-1',
    shiftName: 'Capital Markets Desk Shift',
    timings: '08:30 AM – 05:30 PM IST',
    headcount: 428,
    coverage: 'NSE / BSE Trading sessions, Algorithmic Execution',
    leadSupervisor: 'Vikramaditya Singhania',
    activeStatus: 'Active (Peak Trading)',
  },
  {
    id: 's-2',
    shiftName: 'General Corporate & Advisory',
    timings: '09:30 AM – 06:30 PM IST',
    headcount: 612,
    coverage: 'Wealth Management, Legal, Finance & People Ops',
    leadSupervisor: 'Pooja Agarwal (CFO)',
    activeStatus: 'Active',
  },
  {
    id: 's-3',
    shiftName: 'Technology Infrastructure & On-Call',
    timings: '01:00 PM – 10:00 PM IST',
    headcount: 184,
    coverage: 'Cloud Ops, SecOps, High-frequency data pipeline',
    leadSupervisor: 'Vikram Patel (VP)',
    activeStatus: 'Active (Evening Coverage)',
  },
  {
    id: 's-4',
    shiftName: 'Night Clearing & Depository Settlement',
    timings: '08:00 PM – 05:00 AM IST',
    headcount: 60,
    coverage: 'NSDL / CDSL Batch reconciliation, SEBI EOD dumps',
    leadSupervisor: 'Sunil Kulkarni',
    activeStatus: 'Scheduled',
  },
];

export function TimeLeavePage({ onSelectEmployee, role }: TimeLeavePageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(
    role === 'employee' ? 'my_punches' : role === 'manager' ? 'regularizations' : 'punches'
  );
  const [regularizations, setRegularizations] = useState<RegularizationRequest[]>(INITIAL_REGULARIZATIONS);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Earned Leave (EL)');

  const handleApproveReg = (id: string, empName: string) => {
    setRegularizations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    showToast({
      type: 'success',
      message: `Biometric attendance regularization approved for ${empName}. Timesheet updated.`,
    });
  };

  const handleRejectReg = (id: string, empName: string) => {
    setRegularizations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    showToast({
      type: 'info',
      message: `Regularization request for ${empName} rejected.`,
    });
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplyModalOpen(false);
    showToast({
      type: 'success',
      message: `Leave application for ${leaveType} submitted to Vikramaditya Singhania.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            {role === 'employee'
              ? 'My Time & Attendance'
              : role === 'manager'
              ? 'Team Attendance & Shift Schedule'
              : 'Time & Leave Management'}
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            {role === 'employee'
              ? 'Ananya Iyer (EMP-10482) • Biometric terminal logs & leave balance ledger'
              : role === 'manager'
              ? 'Risk & Quantitative Desk (18 members) • Attendance verification & regularizations'
              : 'Biometric sync (eSSL / Matrix COSEC) • 4 hubs • Shift rostering & statutory leave'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {role === 'employee' ? (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
            >
              <Plus size={13} strokeWidth={1.7} />
              <span>Apply for leave</span>
            </button>
          ) : (
            <button
              onClick={() => showToast({ type: 'info', message: 'Exporting raw biometric punch logs (.csv)' })}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px] transition-colors"
            >
              <Download size={13} strokeWidth={1.7} />
              <span>Biometric dump</span>
            </button>
          )}
        </div>
      </div>

      {/* Role-Specific Metric Tiles */}
      {role === 'employee' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">My monthly attendance</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              96.8%
            </div>
            <span className="text-[11px] text-[var(--success-text)] font-medium">21 / 22 working days</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Leave balance</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              14.5 Days
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">PL: 8.0, CL: 4.5, SL: 2.0</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Average in-punch time</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              09:12 AM
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Grace cutoff: 09:30 AM</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Comp-off earned</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              2.0 Days
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Valid for 60 days</span>
          </div>
        </div>
      ) : role === 'manager' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Team present today</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--success-text)] tabular-nums">
              17 / 18
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">94.4% active at desk</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Pending regularizations</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--warning-text)] tabular-nums">
              {regularizations.filter((r) => r.status === 'Pending').length}
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Requires your review</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">On approved leave</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              1 Member
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Devendra Kothari (Paternity)</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Team shift coverage</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              100%
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Peak trading staffed</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Biometric present</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              1,182
            </div>
            <span className="text-[11px] text-[var(--success-text)] font-medium">92.1% at physical offices</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Pending regularizations</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--warning-text)] tabular-nums">
              {regularizations.filter((r) => r.status === 'Pending').length}
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">Requires manager sign-off</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">On approved leave</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              54
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">38 Earned, 16 Sick/Casual</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Late punches today</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              28
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Within 15-min grace window</span>
          </div>
        </div>
      )}

      {/* Segmented Control Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px] overflow-x-auto">
        {role === 'employee' ? (
          <>
            <button
              onClick={() => setActiveTab('my_punches')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'my_punches'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              My punch history (November 2026)
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'balances'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              My leave balances & policy
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'holidays'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Maharashtra holiday calendar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('punches')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'punches'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {role === 'manager' ? 'Team biometric punch stream' : 'Live biometric punch stream'}
            </button>
            <button
              onClick={() => setActiveTab('regularizations')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'regularizations'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Attendance regularizations ({regularizations.filter((r) => r.status === 'Pending').length})
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'roster'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Shift rostering
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'balances'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Leave balances ledger
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'holidays'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Holiday calendar
            </button>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. EMPLOYEE PERSONAL PUNCH HISTORY */}
      {/* ============================================================== */}
      {activeTab === 'my_punches' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Date</th>
                  <th className="py-2.5 px-4 font-medium">Terminal / Reader</th>
                  <th className="py-2.5 px-4 font-medium">In punch</th>
                  <th className="py-2.5 px-4 font-medium">Out punch</th>
                  <th className="py-2.5 px-4 font-medium">Total hours</th>
                  <th className="py-2.5 px-4 font-medium">Overtime</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {ANANYA_PUNCH_HISTORY.map((punch) => (
                  <tr key={punch.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4 font-medium text-[var(--text-primary)]">{punch.date}</td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{punch.terminal}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.inTime}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.outTime}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.workHours}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-tertiary)]">{punch.overtimeHours}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-[11px] font-medium text-[var(--success-text)]">
                        {punch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. BIOMETRIC PUNCH STREAM (Manager / Admin) */}
      {/* ============================================================== */}
      {activeTab === 'punches' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Employee</th>
                  <th className="py-2.5 px-4 font-medium">Terminal / Reader</th>
                  <th className="py-2.5 px-4 font-medium">In punch</th>
                  <th className="py-2.5 px-4 font-medium">Out punch</th>
                  <th className="py-2.5 px-4 font-medium">Total hours</th>
                  <th className="py-2.5 px-4 font-medium">Overtime</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {PUNCH_LOGS.map((punch) => (
                  <tr key={punch.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => onSelectEmployee(punch.empId)}
                        className="font-medium text-[var(--text-primary)] hover:underline block text-left"
                      >
                        {punch.empName}
                      </button>
                      <span className="text-[11px] text-[var(--text-tertiary)] font-mono">{punch.empCode}</span>
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{punch.terminal}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.inTime}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.outTime}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.workHours}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-tertiary)]">{punch.overtimeHours}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span
                        className={`text-[11px] font-medium ${
                          punch.status === 'Present'
                            ? 'text-[var(--success-text)]'
                            : punch.status === 'Late'
                            ? 'text-[var(--warning-text)]'
                            : 'text-[var(--danger-text)]'
                        }`}
                      >
                        {punch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ATTENDANCE REGULARIZATIONS */}
      {/* ============================================================== */}
      {activeTab === 'regularizations' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Employee</th>
                  <th className="py-2.5 px-4 font-medium">Date</th>
                  <th className="py-2.5 px-4 font-medium">Punch type</th>
                  <th className="py-2.5 px-4 font-medium">Logged vs Requested</th>
                  <th className="py-2.5 px-4 font-medium">Reason for correction</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {regularizations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[var(--text-primary)]">{reg.empName}</div>
                      <div className="text-[11px] font-mono text-[var(--text-tertiary)]">{reg.empCode}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[var(--text-primary)]">{reg.date}</td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{reg.punchType}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">
                      <span className="text-[var(--danger-text)]">{reg.originalTime}</span>
                      <span className="text-[var(--text-tertiary)]"> → </span>
                      <span className="text-[var(--success-text)] font-semibold">{reg.requestedTime}</span>
                    </td>
                    <td className="py-2.5 px-4 max-w-sm text-[var(--text-secondary)] text-[11px]">
                      {reg.reason}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`text-[11px] font-medium ${
                          reg.status === 'Approved'
                            ? 'text-[var(--success-text)]'
                            : reg.status === 'Rejected'
                            ? 'text-[var(--danger-text)]'
                            : 'text-[var(--warning-text)]'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      {reg.status === 'Pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleApproveReg(reg.id, reg.empName)}
                            className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline flex items-center space-x-0.5"
                          >
                            <CheckCircle2 size={12} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectReg(reg.id, reg.empName)}
                            className="text-[11px] font-medium text-[var(--danger-text)] hover:underline flex items-center space-x-0.5"
                          >
                            <XCircle size={12} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--text-tertiary)]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. SHIFT ROSTERING */}
      {/* ============================================================== */}
      {activeTab === 'roster' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Shift nomenclature</th>
                  <th className="py-2.5 px-4 font-medium">Shift timings (IST)</th>
                  <th className="py-2.5 px-4 font-medium text-right">Headcount</th>
                  <th className="py-2.5 px-4 font-medium">Operations coverage</th>
                  <th className="py-2.5 px-4 font-medium">Lead supervisor</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {SHIFT_ROSTER.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">{s.shiftName}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{s.timings}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--brand-primary)] font-medium">
                      {s.headcount} employees
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{s.coverage}</td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{s.leadSupervisor}</td>
                    <td className="py-2.5 px-4 text-right text-[11px] text-[var(--text-secondary)] font-medium">
                      {s.activeStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. LEAVE BALANCES LEDGER */}
      {/* ============================================================== */}
      {activeTab === 'balances' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-3">
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            {role === 'employee' ? 'My Leave Entitlement & Rules (FY 2026-27)' : 'Annual Leave Accrual & Encashment Rules (FY 2026-27)'}
          </h3>
          <div className="space-y-2 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Paid Privilege Leave (PL / EL)</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">Accrues 1.75 days per month (21 days annual). Max 45 days accumulation. Encashable upon separation.</p>
              </div>
              <span className="font-mono text-[var(--brand-primary)] font-semibold">
                {role === 'employee' ? '8.0 days available' : '21 days / yr'}
              </span>
            </div>
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Casual & Sick Leave (CL / SL)</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">7 Casual + 7 Sick days. Lapses on 31 December. Non-encashable.</p>
              </div>
              <span className="font-mono text-[var(--text-primary)] font-semibold">
                {role === 'employee' ? '6.5 days available' : '14 days / yr'}
              </span>
            </div>
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Compensatory Off (Comp Off)</span>
                <p className="text-[11px] text-[var(--text-tertiary)]">For weekend BSE/NSE mock trading sessions or emergency DR drills. Valid for 60 days from accrual.</p>
              </div>
              <span className="font-mono text-[var(--text-primary)] font-semibold">
                {role === 'employee' ? '2.0 days available' : 'As earned'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. STATUTORY HOLIDAY CALENDAR */}
      {/* ============================================================== */}
      {activeTab === 'holidays' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-3">
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
            State of Maharashtra & RBI Negotiable Instruments Act Holidays (2026)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
            <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded">
              <span className="font-mono text-[11px] text-[var(--brand-primary)]">25 Dec 2026 (Friday)</span>
              <div className="font-semibold text-[var(--text-primary)]">Christmas Day</div>
              <span className="text-[11px] text-[var(--text-tertiary)]">Mandatory Public Holiday</span>
            </div>
            <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded">
              <span className="font-mono text-[11px] text-[var(--brand-primary)]">26 Jan 2027 (Tuesday)</span>
              <div className="font-semibold text-[var(--text-primary)]">Republic Day</div>
              <span className="text-[11px] text-[var(--text-tertiary)]">National Holiday</span>
            </div>
            <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded">
              <span className="font-mono text-[11px] text-[var(--brand-primary)]">03 Mar 2027 (Wednesday)</span>
              <div className="font-semibold text-[var(--text-primary)]">Holi (Rangapanchami)</div>
              <span className="text-[11px] text-[var(--text-tertiary)]">State of Maharashtra Holiday</span>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Apply for Leave</h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">✕</button>
            </div>
            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Leave type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)]"
                >
                  <option value="Earned Leave (EL)">Earned Leave (EL) — 8.0 days balance</option>
                  <option value="Casual Leave (CL)">Casual Leave (CL) — 4.5 days balance</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL) — 2.0 days balance</option>
                  <option value="Compensatory Off">Compensatory Off — 2.0 days balance</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">From</label>
                  <input type="date" required defaultValue="2026-12-02" className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] font-mono" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">To</label>
                  <input type="date" required defaultValue="2026-12-06" className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Reason</label>
                <textarea rows={3} required placeholder="State reason and handover colleague..." className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
                <button type="button" onClick={() => setIsApplyModalOpen(false)} className="px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px]">Cancel</button>
                <button type="submit" className="px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px]">Submit application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
