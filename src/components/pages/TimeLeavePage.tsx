import { useState } from 'react';
import { Download, CheckCircle2, XCircle, Plus, X } from 'lucide-react';
import { useToast } from '../common/Toast';
import { AttendanceCalendar } from '../common/AttendanceCalendar';
import { useHrms } from '../../context/HrmsContext';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface TimeLeavePageProps {
  onSelectEmployee: (empId: string) => void;
  role: UserRole;
}

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
    reason: 'Client technical discussion on-site at HDFC Bank IT Park before coming to office.',
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
    reason: 'Late production deployment window for US client SaaS release.',
    status: 'Pending',
  },
];

const SHIFT_ROSTER = [
  {
    id: 's-1',
    shiftName: 'Core Engineering & Product Shift',
    timings: '09:00 AM – 06:00 PM IST',
    headcount: 428,
    coverage: 'Core SaaS Platform, Cloud Infrastructure & APIs',
    leadSupervisor: 'Vikramaditya Singhania',
    activeStatus: 'Active (Peak Sprint)',
  },
  {
    id: 's-2',
    shiftName: 'General Corporate & Delivery',
    timings: '09:30 AM – 06:30 PM IST',
    headcount: 612,
    coverage: 'Enterprise Solutions, Legal, Finance & People Ops',
    leadSupervisor: 'Pooja Agarwal (CFO)',
    activeStatus: 'Active',
  },
  {
    id: 's-3',
    shiftName: 'Cloud SRE & US Overlap On-Call',
    timings: '01:00 PM – 10:00 PM IST',
    headcount: 184,
    coverage: 'Cloud Ops, SecOps, High-availability microservices',
    leadSupervisor: 'Vikram Patel (VP)',
    activeStatus: 'Active (Evening Coverage)',
  },
  {
    id: 's-4',
    shiftName: 'Nightly Batch & Cloud Backup Ops',
    timings: '08:00 PM – 05:00 AM IST',
    headcount: 60,
    coverage: 'ETL Pipeline Monitoring, Automated DB Backups & SRE',
    leadSupervisor: 'Sunil Kulkarni',
    activeStatus: 'Scheduled',
  },
];

export function TimeLeavePage({ onSelectEmployee, role }: TimeLeavePageProps) {
  const { showToast } = useToast();
  const { punches, currentUser, applyLeave } = useHrms();

  const [activeTab, setActiveTab] = useState<string>(
    role === 'employee' ? 'my_calendar' : role === 'manager' ? 'regularizations' : 'punches'
  );
  const [regularizations, setRegularizations] = useState<RegularizationRequest[]>(INITIAL_REGULARIZATIONS);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState<'casual' | 'sick' | 'earned'>('earned');
  const [fromDate, setFromDate] = useState('2026-12-02');
  const [toDate, setToDate] = useState('2026-12-04');
  const [reason, setReason] = useState('');

  const currentBalances = currentUser.leaveBalance || { casual: 4.5, earned: 12.0, sick: 6.0 };

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

  const handleExportBiometricCSV = () => {
    const headers = ['Punch ID', 'Employee Code', 'Employee Name', 'Terminal', 'Date', 'In Time', 'Out Time', 'Duration', 'Status'];
    const rows = punches.map((p) => [
      `"${p.id}"`,
      `"${p.empCode}"`,
      `"${p.empName}"`,
      `"${p.terminal}"`,
      `"${p.date}"`,
      `"${p.inTime}"`,
      `"${p.outTime}"`,
      `"${p.workHours}"`,
      `"${p.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inbox_infotech_biometric_punches_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      message: `Exported ${punches.length} biometric punch logs to CSV.`,
    });
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate approximate days
    const start = new Date(fromDate);
    const end = new Date(toDate);
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
      startDate: fromDate,
      endDate: toDate,
      days: diffTime,
      reason: reason || 'Personal / Planned leave',
    });

    setIsApplyModalOpen(false);
    setReason('');
    showToast({
      type: 'success',
      message: `Applied for ${diffTime} days ${leaveType.toUpperCase()} leave. Routed for approval.`,
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
              : 'Time & Leave Operations'}
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            {role === 'employee'
              ? `${currentUser.name} (${currentUser.employeeCode}) • Live biometric logs & reconciled leave balances`
              : role === 'manager'
              ? 'Platform & Cloud Desk (18 members) • Attendance verification & regularizations'
              : 'Biometric gateway active • BKC HQ, Nariman Pt, Hinjawadi & ORR Hubs'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {role === 'employee' ? (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} strokeWidth={2} />
              <span>Apply for Leave</span>
            </button>
          ) : (
            <button
              onClick={handleExportBiometricCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-subtle)] rounded-[6px] shadow-xs transition-colors cursor-pointer"
            >
              <Download size={14} strokeWidth={1.8} />
              <span>Export Biometric CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Role-Specific Metric Tiles */}
      {role === 'employee' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">My Monthly Attendance</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              96.8%
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">21 / 22 working days</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Total Leave Balance</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--brand-primary)] tabular-nums">
              {(currentBalances.casual + currentBalances.earned + currentBalances.sick).toFixed(1)} Days
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">
              EL: {currentBalances.earned}, CL: {currentBalances.casual}, SL: {currentBalances.sick}
            </span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Average In-Punch Time</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums font-mono">
              09:12 AM
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Cutoff grace: 09:30 AM</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Approved Remote / WFH</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              3 Days
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">This calendar month</span>
          </div>
        </div>
      ) : role === 'manager' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Team Present Today</span>
            <div className="mt-1 text-[22px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              17 / 18
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">94.4% active at desk</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Pending Regularizations</span>
            <div className="mt-1 text-[22px] font-bold text-amber-600 tabular-nums">
              {regularizations.filter((r) => r.status === 'Pending').length}
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Requires manager sign-off</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">On Approved Leave</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              1 Member
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Devendra Kothari (Paternity)</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Shift Coverage</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--brand-primary)] tabular-nums">
              100%
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Core hours staffed</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Biometric Attendance</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              1,192 / 1,284
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">92.8% workforce active</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Pending Regularizations</span>
            <div className="mt-1 text-[22px] font-bold text-amber-600 tabular-nums">
              {regularizations.filter((r) => r.status === 'Pending').length}
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">Requires supervisor sign-off</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">On Approved Leave</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--brand-primary)] tabular-nums">
              48 Members
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">32 Earned, 16 Sick/Casual</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Remote Work (WFH)</span>
            <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              44 Members
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Pre-approved VPN active</span>
          </div>
        </div>
      )}

      {/* Segmented Control Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px] overflow-x-auto">
        {role === 'employee' ? (
          <>
            <button
              onClick={() => setActiveTab('my_calendar')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'my_calendar'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Attendance Calendar
            </button>
            <button
              onClick={() => setActiveTab('my_punches')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'my_punches'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              My Punch Logs Table
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'balances'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              My Leave Balances & Policy
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'holidays'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Maharashtra Holiday Calendar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('punches')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'punches'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              {role === 'manager' ? 'Team Biometric Punch Stream' : 'Live Biometric Punch Stream'}
            </button>
            <button
              onClick={() => setActiveTab('regularizations')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'regularizations'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Attendance Regularizations ({regularizations.filter((r) => r.status === 'Pending').length})
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'roster'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Shift Rostering
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'balances'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Leave Balances Ledger
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={cn(
                'px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                activeTab === 'holidays'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              Holiday Calendar
            </button>
          </>
        )}
      </div>

      {/* 0. EMPLOYEE MONTHLY ATTENDANCE CALENDAR */}
      {activeTab === 'my_calendar' && (
        <AttendanceCalendar onApplyLeave={() => setIsApplyModalOpen(true)} />
      )}

      {/* 1. EMPLOYEE PERSONAL PUNCH HISTORY */}
      {activeTab === 'my_punches' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-medium">Date</th>
                  <th className="py-2.5 px-4 font-medium">Terminal / Reader</th>
                  <th className="py-2.5 px-4 font-medium">In Punch</th>
                  <th className="py-2.5 px-4 font-medium">Out Punch</th>
                  <th className="py-2.5 px-4 font-medium">Total Hours</th>
                  <th className="py-2.5 px-4 font-medium">Overtime</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {punches
                  .filter((p) => p.empId === currentUser.id)
                  .map((punch) => (
                    <tr key={punch.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                      <td className="py-2.5 px-4 font-medium text-[var(--text-primary)]">{punch.date}</td>
                      <td className="py-2.5 px-4 text-[var(--text-secondary)]">{punch.terminal}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.inTime}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.outTime}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{punch.workHours}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-tertiary)]">{punch.overtimeHours}</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
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

      {/* 2. BIOMETRIC PUNCH STREAM */}
      {activeTab === 'punches' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-medium">Employee</th>
                  <th className="py-2.5 px-4 font-medium">Terminal / Reader</th>
                  <th className="py-2.5 px-4 font-medium">In Punch</th>
                  <th className="py-2.5 px-4 font-medium">Out Punch</th>
                  <th className="py-2.5 px-4 font-medium">Total Hours</th>
                  <th className="py-2.5 px-4 font-medium">Overtime</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {punches.map((punch) => (
                  <tr key={punch.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => onSelectEmployee(punch.empId)}
                        className="font-semibold text-[var(--text-primary)] hover:text-[var(--brand-primary)] hover:underline block text-left cursor-pointer"
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
                        className={cn(
                          'text-[11px] font-semibold',
                          punch.status === 'Present'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : punch.status === 'Late'
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        )}
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

      {/* 3. ATTENDANCE REGULARIZATIONS */}
      {activeTab === 'regularizations' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-medium">Employee</th>
                  <th className="py-2.5 px-4 font-medium">Date</th>
                  <th className="py-2.5 px-4 font-medium">Punch Type</th>
                  <th className="py-2.5 px-4 font-medium">Logged vs Requested</th>
                  <th className="py-2.5 px-4 font-medium">Reason for Correction</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {regularizations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[var(--text-primary)]">{reg.empName}</div>
                      <div className="text-[11px] font-mono text-[var(--text-tertiary)]">{reg.empCode}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[var(--text-primary)]">{reg.date}</td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{reg.punchType}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">
                      <span className="text-[var(--danger)]">{reg.originalTime}</span>
                      <span className="text-[var(--text-tertiary)]"> → </span>
                      <span className="text-emerald-700 font-semibold">{reg.requestedTime}</span>
                    </td>
                    <td className="py-2.5 px-4 max-w-sm text-[var(--text-secondary)] text-[11px]">
                      {reg.reason}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={cn(
                          'text-[11px] font-semibold',
                          reg.status === 'Approved'
                            ? 'text-emerald-700'
                            : reg.status === 'Rejected'
                            ? 'text-[var(--danger)]'
                            : 'text-amber-600'
                        )}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      {reg.status === 'Pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleApproveReg(reg.id, reg.empName)}
                            className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline flex items-center space-x-0.5 cursor-pointer"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectReg(reg.id, reg.empName)}
                            className="text-[11px] font-semibold text-[var(--danger)] hover:underline flex items-center space-x-0.5 cursor-pointer"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--text-tertiary)]">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SHIFT ROSTERING */}
      {activeTab === 'roster' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-medium">Shift Nomenclature</th>
                  <th className="py-2.5 px-4 font-medium">Timings (IST)</th>
                  <th className="py-2.5 px-4 font-medium text-right">Headcount</th>
                  <th className="py-2.5 px-4 font-medium">Coverage</th>
                  <th className="py-2.5 px-4 font-medium">Lead Supervisor</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {SHIFT_ROSTER.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">{s.shiftName}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">{s.timings}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--brand-primary)] font-semibold">
                      {s.headcount} employees
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{s.coverage}</td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{s.leadSupervisor}</td>
                    <td className="py-2.5 px-4 text-right text-[11px] text-emerald-700 font-medium">
                      {s.activeStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. LEAVE BALANCES LEDGER */}
      {activeTab === 'balances' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4 shadow-xs">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            {role === 'employee' ? 'My Leave Entitlement & Rules (FY 2026-27)' : 'Annual Leave Accrual & Encashment Rules (FY 2026-27)'}
          </h3>
          <div className="space-y-3 text-[12px]">
            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Paid Privilege Leave (PL / EL)</span>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Accrues 1.75 days per month (21 days annual). Max 45 days accumulation. Encashable upon separation.</p>
              </div>
              <span className="font-mono text-[var(--brand-primary)] font-bold text-[14px]">
                {role === 'employee' ? `${currentBalances.earned} days available` : '21 days / yr'}
              </span>
            </div>
            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Casual & Sick Leave (CL / SL)</span>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">7 Casual + 7 Sick days. Lapses on 31 December. Non-encashable.</p>
              </div>
              <span className="font-mono text-[var(--text-primary)] font-bold text-[14px]">
                {role === 'employee' ? `${currentBalances.casual + currentBalances.sick} days available` : '14 days / yr'}
              </span>
            </div>
            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg flex justify-between items-center">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Compensatory Off (Comp Off)</span>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">For weekend production deployments or emergency DR drills. Valid for 60 days from accrual.</p>
              </div>
              <span className="font-mono text-[var(--text-primary)] font-bold text-[14px]">
                2.0 days available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. STATUTORY HOLIDAY CALENDAR */}
      {activeTab === 'holidays' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4 shadow-xs">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            State of Maharashtra & RBI Negotiable Instruments Act Holidays (2026-27)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg">
              <span className="font-mono text-[11px] text-[var(--brand-primary)] font-semibold">25 Dec 2026 (Friday)</span>
              <div className="font-semibold text-[var(--text-primary)] mt-1">Christmas Day</div>
              <span className="text-[11px] text-[var(--text-tertiary)]">Mandatory Public Holiday</span>
            </div>
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg">
              <span className="font-mono text-[11px] text-[var(--brand-primary)] font-semibold">26 Jan 2027 (Tuesday)</span>
              <div className="font-semibold text-[var(--text-primary)] mt-1">Republic Day</div>
              <span className="text-[11px] text-[var(--text-tertiary)]">National Holiday</span>
            </div>
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg">
              <span className="font-mono text-[11px] text-[var(--brand-primary)] font-semibold">03 Mar 2027 (Wednesday)</span>
              <div className="font-semibold text-[var(--text-primary)] mt-1">Holi (Rangapanchami)</div>
              <span className="text-[11px] text-[var(--text-tertiary)]">State of Maharashtra Holiday</span>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-subtle)]">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Apply for Planned Leave</h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Approving Manager: {currentUser.reportingManager}
                </p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="p-5 space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                >
                  <option value="earned">Earned / Privilege Leave (EL) — {currentBalances.earned} days balance</option>
                  <option value="casual">Casual Leave (CL) — {currentBalances.casual} days balance</option>
                  <option value="sick">Sick Leave (SL) — {currentBalances.sick} days balance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">From Date *</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">To Date *</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Reason & Work Handover Colleague *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail justification and who is covering urgent desk items..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-end space-x-2.5 pt-3 -mx-5 -mb-5 bg-[var(--bg-surface-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
