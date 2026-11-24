import { CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHrms } from '../../context/HrmsContext';
import { cn } from '../../lib/utils';

interface ManagerHomeProps {
  onOpenDrawer: (empId: string) => void;
}

export function ManagerHome({ onOpenDrawer }: ManagerHomeProps) {
  const { showToast } = useToast();
  const { approvals, approveRequest, rejectRequest, employees } = useHrms();

  const handleApprove = (id: string, name: string, title: string) => {
    approveRequest(id);
    showToast({
      type: 'success',
      message: `Approved ${title} for ${name}. Ledger updated.`,
    });
  };

  const handleReject = (id: string, name: string, title: string) => {
    rejectRequest(id);
    showToast({
      type: 'info',
      message: `Rejected ${title} for ${name}.`,
    });
  };

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              MANAGER SCOPE
            </span>
            <span className="text-[12px] text-[var(--text-secondary)]">Risk & Quantitative Analytics Desk</span>
          </div>
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mt-1">
            Vikram Patel — Team Operations & Approvals
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            18 direct & indirect engineers and analysts across Mumbai & Pune
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[12px]">
          <span className="text-[var(--text-secondary)]">Team health today:</span>
          <span className="text-emerald-700 font-bold font-mono">17 / 18 Present</span>
          <span className="text-[var(--text-tertiary)]">(1 on planned leave)</span>
        </div>
      </div>

      {/* Row: Pending Team Approvals Queue */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <div>
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Needs Your Action — Team Approvals ({pendingApprovals.length})
            </h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Leave requests, expense reimbursement audits & biometric regularizations
            </p>
          </div>
          <span className="text-[11px] text-[var(--brand-primary)] font-semibold">SLA compliance 100% on-track</span>
        </div>

        <div className="space-y-3">
          {approvals.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg space-y-2 hover:border-[var(--border-default)] transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenDrawer(item.employee.id)}
                    className="font-bold text-[var(--text-primary)] hover:text-[var(--brand-primary)] hover:underline cursor-pointer"
                  >
                    {item.employee.name}
                  </button>
                  <span className="text-[11px] font-mono text-[var(--text-tertiary)]">{item.employee.employeeCode}</span>
                  <span className="text-[11px] text-[var(--brand-primary)] font-semibold capitalize">• {item.type}</span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-[var(--text-tertiary)]">
                  {item.submittedAt}
                </span>
              </div>

              <div className="text-[12px]">
                <div className="font-semibold text-[var(--text-primary)]">{item.title}</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.details.description}</div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                <span className="font-mono text-[var(--text-secondary)]">
                  Scope: <strong className="text-[var(--text-primary)]">{item.primaryMetric}</strong>
                </span>

                {item.status === 'pending' ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleApprove(item.id, item.employee.name, item.title)}
                      className="font-semibold text-[var(--brand-primary)] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(item.id, item.employee.name, item.title)}
                      className="font-semibold text-[var(--danger)] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span
                    className={cn(
                      'font-bold text-[11px] capitalize',
                      item.status === 'approved' ? 'text-emerald-700' : 'text-rose-600'
                    )}
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
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Direct & Indirect Reports (Risk & Quant Desk)
            </h3>
            <span className="text-[11px] text-[var(--text-tertiary)] font-mono">{employees.length} Members</span>
          </div>

          <div className="space-y-2 text-[12px]">
            {employees.slice(0, 5).map((emp) => (
              <div
                key={emp.id}
                onClick={() => onOpenDrawer(emp.id)}
                className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] rounded-lg flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">{emp.name}</span>
                  <div className="text-[11px] text-[var(--text-tertiary)]">{emp.role} • {emp.location}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 font-semibold block">Present (09:12 AM)</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-mono">{emp.employeeCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1-on-1s and Action Checklist (5 columns) */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-3 shadow-xs">
          <div className="border-b border-[var(--border-subtle)] pb-2.5">
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Manager Weekly Cadence
            </h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">Quarterly reviews and 1-on-1 alignments</p>
          </div>

          <div className="space-y-2.5 text-[12px]">
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
              <span className="font-semibold text-[var(--text-primary)] block">Ananya Iyer (1-on-1 Bi-weekly)</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Today at 03:30 PM • Research Pod BKC</span>
            </div>
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
              <span className="font-semibold text-[var(--text-primary)] block">Rohan Mehta (SEBI Filing Audit)</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Tomorrow at 11:00 AM • Zoom</span>
            </div>
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
              <span className="font-semibold text-[var(--text-primary)] block">Q4 Objective & Key Results (OKR) Sign-off</span>
              <span className="text-[11px] text-emerald-700 font-semibold">14 / 18 finalized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
