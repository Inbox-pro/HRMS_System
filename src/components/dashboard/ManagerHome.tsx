import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface ManagerHomeProps {
  onOpenDrawer: (empId: string) => void;
}

interface TeamApproval {
  id: string;
  type: 'Leave' | 'Expense' | 'Shift Regularization';
  employeeName: string;
  employeeCode: string;
  empId: string;
  title: string;
  detail: string;
  amountOrDays: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const INITIAL_TEAM_APPROVALS: TeamApproval[] = [
  {
    id: 't-app-1',
    type: 'Leave',
    employeeName: 'Ananya Iyer',
    employeeCode: 'EMP-10482',
    empId: 'emp-10482',
    title: 'Earned Leave (EL) — 5 Days',
    detail: '02 Dec – 06 Dec 2026. Handover with Rohan Mehta for institutional research coverage.',
    amountOrDays: '5 days',
    submittedAt: 'Today, 09:40 AM',
    status: 'Pending',
  },
  {
    id: 't-app-2',
    type: 'Expense',
    employeeName: 'Rohan Mehta',
    employeeCode: 'EMP-10931',
    empId: 'emp-10931',
    title: 'SEBI Nariman Point Physical Audit Travel',
    detail: 'Uber for Business + Client lunch with SEBI inspection officer. Tax invoices attached.',
    amountOrDays: '₹4,850',
    submittedAt: 'Yesterday, 04:15 PM',
    status: 'Pending',
  },
  {
    id: 't-app-3',
    type: 'Shift Regularization',
    employeeName: 'Devendra Kothari',
    employeeCode: 'EMP-11512',
    empId: 'emp-11512',
    title: 'Biometric Scanner Timeout at BKC Gate B',
    detail: 'Regularization requested for in-punch at 09:05 AM instead of 10:14 AM.',
    amountOrDays: 'In-punch correction',
    submittedAt: 'Yesterday, 06:20 PM',
    status: 'Pending',
  },
];

export function ManagerHome({ onOpenDrawer }: ManagerHomeProps) {
  const { showToast } = useToast();
  const [approvals, setApprovals] = useState<TeamApproval[]>(INITIAL_TEAM_APPROVALS);

  const handleApprove = (id: string, name: string, title: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved' } : a))
    );
    showToast({
      type: 'success',
      message: `Approved ${title} for ${name}.`,
      undoAction: () => {
        setApprovals((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'Pending' } : a))
        );
      },
    });
  };

  const handleReject = (id: string, name: string, title: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Rejected' } : a))
    );
    showToast({
      type: 'info',
      message: `Rejected ${title} for ${name}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              MANAGER SCOPE
            </span>
            <span className="text-[12px] text-[var(--text-secondary)]">Risk & Quantitative Analytics Desk</span>
          </div>
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)] mt-1">
            Vikram Patel — Team Operations & Approvals
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            18 direct & indirect engineers and analysts across Mumbai & Pune
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[12px]">
          <span className="text-[var(--text-secondary)]">Team health today:</span>
          <span className="text-[var(--success-text)] font-semibold font-mono">17 / 18 Present</span>
          <span className="text-[var(--text-tertiary)]">(1 on planned leave)</span>
        </div>
      </div>

      {/* Row: Pending Team Approvals Queue */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Needs Your Action — Team Approvals ({approvals.filter((a) => a.status === 'Pending').length})
            </h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Leave requests, expense reimbursement audits & biometric regularizations
            </p>
          </div>
          <span className="text-[11px] text-[var(--brand-primary)] font-medium">All SLA compliance on-track</span>
        </div>

        <div className="space-y-3">
          {approvals.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg space-y-2 hover:border-[var(--border-default)] transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenDrawer(item.empId)}
                    className="font-semibold text-[var(--text-primary)] hover:underline"
                  >
                    {item.employeeName}
                  </button>
                  <span className="text-[11px] font-mono text-[var(--text-tertiary)]">{item.employeeCode}</span>
                  <span className="text-[11px] text-[var(--brand-primary)] font-medium">• {item.type}</span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-[var(--text-tertiary)]">
                  {item.submittedAt}
                </span>
              </div>

              <div className="text-[12px]">
                <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
                <div className="text-[11px] text-[var(--text-tertiary)]">{item.detail}</div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                <span className="font-mono text-[var(--text-secondary)] font-medium">
                  Impact: <strong className="text-[var(--text-primary)]">{item.amountOrDays}</strong>
                </span>

                {item.status === 'Pending' ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleApprove(item.id, item.employeeName, item.title)}
                      className="font-medium text-[var(--brand-primary)] hover:underline flex items-center space-x-1"
                    >
                      <CheckCircle2 size={12} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(item.id, item.employeeName, item.title)}
                      className="font-medium text-[var(--danger-text)] hover:underline flex items-center space-x-1"
                    >
                      <XCircle size={12} />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span
                    className={`font-medium ${
                      item.status === 'Approved' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'
                    }`}
                  >
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row: Team Members Roster and Scheduled 1-on-1s */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team Members Roster (7 columns) */}
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Direct & Indirect Reports (Risk & Quant Desk)
            </h3>
            <span className="text-[11px] text-[var(--text-tertiary)]">18 Members</span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex items-center justify-between">
              <div>
                <button
                  onClick={() => onOpenDrawer('emp-10482')}
                  className="font-semibold text-[var(--text-primary)] hover:underline"
                >
                  Ananya Iyer
                </button>
                <div className="text-[11px] text-[var(--text-tertiary)]">AVP, Equity Research • BKC HQ</div>
              </div>
              <span className="text-[11px] text-[var(--success-text)] font-medium">Present (In at 09:12 AM)</span>
            </div>

            <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex items-center justify-between">
              <div>
                <button
                  onClick={() => onOpenDrawer('emp-10931')}
                  className="font-semibold text-[var(--text-primary)] hover:underline"
                >
                  Rohan Mehta
                </button>
                <div className="text-[11px] text-[var(--text-tertiary)]">Lead Compliance Officer • Nariman Pt</div>
              </div>
              <span className="text-[11px] text-[var(--success-text)] font-medium">Present (In at 08:58 AM)</span>
            </div>

            <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex items-center justify-between">
              <div>
                <button
                  onClick={() => onOpenDrawer('emp-11309')}
                  className="font-semibold text-[var(--text-primary)] hover:underline"
                >
                  Amit Joshi
                </button>
                <div className="text-[11px] text-[var(--text-tertiary)]">Senior Backend Architect • Hinjawadi</div>
              </div>
              <span className="text-[11px] text-[var(--warning-text)] font-medium">Present (Late 09:42 AM)</span>
            </div>

            <div className="p-2.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded flex items-center justify-between">
              <div>
                <button
                  onClick={() => onOpenDrawer('emp-11512')}
                  className="font-semibold text-[var(--text-primary)] hover:underline"
                >
                  Devendra Kothari
                </button>
                <div className="text-[11px] text-[var(--text-tertiary)]">Quant Modeler • Bengaluru ORR</div>
              </div>
              <span className="text-[11px] text-[var(--text-tertiary)] font-medium">On Paternity Leave (to 05 Dec)</span>
            </div>
          </div>
        </div>

        {/* Scheduled 1-on-1s & OKRs (5 columns) */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
              Scheduled 1-on-1s & Reviews
            </h3>
            <span className="text-[11px] text-[var(--brand-primary)] font-medium">Q3 Cycle</span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">1-on-1: Ananya Iyer</span>
                <span className="font-mono text-[11px] text-[var(--brand-primary)]">Tomorrow, 11:30 AM</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Topic: Institutional client expansion coverage & Band L6 appraisal milestone.</p>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">1-on-1: Amit Joshi</span>
                <span className="font-mono text-[11px] text-[var(--brand-primary)]">26 Nov, 03:00 PM</span>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Topic: Hinjawadi cloud disaster recovery drill report & capacity planning.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
