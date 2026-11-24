import { useEffect, useState } from 'react';
import { X, Mail, MapPin, Briefcase, Edit2, Check } from 'lucide-react';
import { useHrms, type DirectoryEmployee } from '../../context/HrmsContext';
import { useToast } from './Toast';

interface EmployeeDrawerProps {
  employeeId: string | null;
  onClose: () => void;
}

export function EmployeeDrawer({ employeeId, onClose }: EmployeeDrawerProps) {
  const { employees, updateEmployee, deleteEmployee, role } = useHrms();
  const { showToast } = useToast();

  const targetEmp = employees.find((e) => e.id === employeeId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DirectoryEmployee>>({});

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

  const startEditing = () => {
    if (targetEmp) {
      setFormData({
        role: targetEmp.role,
        department: targetEmp.department,
        location: targetEmp.location,
        phone: targetEmp.phone,
        reportingManager: targetEmp.reportingManager,
        status: targetEmp.status,
        salaryBand: targetEmp.salaryBand,
        annualCTC: targetEmp.annualCTC || '₹28,00,000',
      });
      setIsEditing(true);
    }
  };

  if (!employeeId || !targetEmp) return null;

  const handleSave = () => {
    updateEmployee(targetEmp.id, formData);
    setIsEditing(false);
    showToast({
      type: 'success',
      message: `Updated profile details for ${targetEmp.name}.`,
    });
  };

  const leaveBalance = targetEmp.leaveBalance || { casual: 5, earned: 12, sick: 6 };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={`Employee profile for ${targetEmp.name}`}
        className="relative w-full max-w-[500px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] h-full overflow-y-auto shadow-2xl z-10 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-start justify-between bg-[var(--bg-surface-hover)]">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-[16px] shrink-0 shadow-xs">
              {targetEmp.initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{targetEmp.name}</h3>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {targetEmp.employeeCode}
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{targetEmp.role}</p>
              <div className="flex items-center space-x-3 text-[12px] text-[var(--text-tertiary)] mt-1.5">
                <span className="flex items-center space-x-1">
                  <MapPin size={12} strokeWidth={1.8} />
                  <span>{targetEmp.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Briefcase size={12} strokeWidth={1.8} />
                  <span>{targetEmp.department}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {role === 'hr_admin' && !isEditing && (
              <button
                onClick={startEditing}
                className="p-1.5 rounded-[6px] text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
                title="Edit Employee Details"
              >
                <Edit2 size={16} strokeWidth={1.8} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-[6px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 flex-1 text-[13px]">
          {isEditing ? (
            <div className="p-4 border border-[var(--brand-border)] bg-[var(--brand-subtle)] rounded-lg space-y-3">
              <h4 className="text-[12px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">
                Edit Professional Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)] font-medium block mb-1">Designation Role</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)] font-medium block mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)] font-medium block mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)] font-medium block mb-1">Status</label>
                  <select
                    value={formData.status || 'Confirmed'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Probation">Probation</option>
                    <option value="Notice Period">Notice Period</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)] font-medium block mb-1">Reporting Manager</label>
                  <input
                    type="text"
                    value={formData.reportingManager || ''}
                    onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)] font-medium block mb-1">Annual CTC</label>
                  <input
                    type="text"
                    value={formData.annualCTC || ''}
                    onChange={(e) => setFormData({ ...formData, annualCTC: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Check size={13} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            /* Quick Contact & Status */
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
              <div className="space-y-1">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Official Email</span>
                <a
                  href={`mailto:${targetEmp.email}`}
                  className="font-medium text-[var(--brand-primary)] truncate block hover:underline"
                >
                  {targetEmp.email}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Direct Phone</span>
                <span className="font-medium text-[var(--text-primary)] block tabular-nums">
                  {targetEmp.phone}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Employment Status</span>
                <span className="inline-flex items-center text-[12px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  {targetEmp.status}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Date of Joining</span>
                <span className="font-medium text-[var(--text-primary)] block">{targetEmp.joiningDate}</span>
              </div>
            </div>
          )}

          {/* Org Structure */}
          <div>
            <h4 className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Organization & Compensation
            </h4>
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Reporting Manager</span>
                <span className="font-medium text-[var(--text-primary)]">{targetEmp.reportingManager}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Direct Reports</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">
                  {targetEmp.directReportsCount ?? 0} team members
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Compensation Band</span>
                <span className="font-medium text-[var(--text-primary)]">{targetEmp.salaryBand}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Annual Base Package (CTC)</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                  {targetEmp.annualCTC || '₹28,50,000'}
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Identifiers (Indian Payroll) */}
          <div>
            <h4 className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Statutory Details (India Regulatory)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
                <span className="text-[10px] text-[var(--text-tertiary)] block">Income Tax PAN</span>
                <span className="font-mono text-[11px] font-semibold text-[var(--text-primary)] mt-0.5 block">
                  {targetEmp.panNumber || 'ABCPI8821K'}
                </span>
              </div>
              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
                <span className="text-[10px] text-[var(--text-tertiary)] block">EPFO UAN</span>
                <span className="font-mono text-[11px] font-semibold text-[var(--text-primary)] mt-0.5 block">
                  {targetEmp.uanNumber || '101482910482'}
                </span>
              </div>
              <div className="p-2.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-subtle)]">
                <span className="text-[10px] text-[var(--text-tertiary)] block">ESIC Category</span>
                <span className="text-[11px] font-medium text-[var(--text-secondary)] mt-0.5 block">
                  Exempt (&gt; ₹21k)
                </span>
              </div>
            </div>
          </div>

          {/* Leave Balances */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Live Leave Balances (CY 2026)
              </h4>
              <span className="text-[10px] text-emerald-700 font-medium">Reconciled</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg text-center bg-[var(--bg-surface)]">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Casual (CL)</span>
                <span className="text-[18px] font-bold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                  {leaveBalance.casual}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">days left</span>
              </div>
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg text-center bg-[var(--bg-surface)]">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Earned (EL)</span>
                <span className="text-[18px] font-bold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                  {leaveBalance.earned}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">days left</span>
              </div>
              <div className="p-3 border border-[var(--border-subtle)] rounded-lg text-center bg-[var(--bg-surface)]">
                <span className="text-[11px] text-[var(--text-tertiary)] block">Sick (SL)</span>
                <span className="text-[18px] font-bold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                  {leaveBalance.sick}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">days left</span>
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div>
            <h4 className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Attendance & Work Metrics
            </h4>
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">YTD Attendance Record</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {targetEmp.ytdAttendancePct}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Avg. Daily Biometric Punch</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums font-mono">
                  09:12 AM IST
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Assigned Biometric Terminal</span>
                <span className="font-medium text-[var(--text-primary)] text-[12px]">
                  BKC HQ - Main Turnstile 02
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(`mailto:${targetEmp.email}`)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] transition-colors cursor-pointer"
            >
              <Mail size={13} strokeWidth={1.8} />
              <span>Email</span>
            </button>
            {role === 'hr_admin' && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to offboard/archive ${targetEmp.name}?`)) {
                    deleteEmployee(targetEmp.id);
                    onClose();
                    showToast({
                      type: 'warning',
                      message: `Archived ${targetEmp.name} from active directory.`,
                    });
                  }
                }}
                className="px-2.5 py-1.5 text-[12px] font-medium text-[var(--danger)] hover:bg-[var(--danger-subtle)] rounded-[6px] transition-colors cursor-pointer"
              >
                Offboard
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
