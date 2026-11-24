import { useState, useEffect } from 'react';
import { Search, ArrowRight, ShieldCheck, DollarSign, Calendar, Users, FileText } from 'lucide-react';
import { useHrms } from '../../context/HrmsContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmployee: (empId: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectEmployee }: CommandPaletteProps) {
  const { employees, setActiveNav } = useHrms();
  const [query, setQuery] = useState('');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'act-1',
      title: 'Navigate to People Directory',
      category: 'Directory',
      icon: Users,
      action: () => {
        setActiveNav('people');
        onClose();
      },
    },
    {
      id: 'act-2',
      title: 'View Time & Biometric Punches',
      category: 'Attendance',
      icon: Calendar,
      action: () => {
        setActiveNav('time_leave');
        onClose();
      },
    },
    {
      id: 'act-3',
      title: 'Open Monthly Payroll & Tax Ledger',
      category: 'Payroll',
      icon: DollarSign,
      action: () => {
        setActiveNav('payroll');
        onClose();
      },
    },
    {
      id: 'act-4',
      title: 'Inspect Hiring ATS & Candidates',
      category: 'Hiring',
      icon: ShieldCheck,
      action: () => {
        setActiveNav('hiring');
        onClose();
      },
    },
    {
      id: 'act-5',
      title: 'View Service Desk & Tickets',
      category: 'Helpdesk',
      icon: FileText,
      action: () => {
        setActiveNav('helpdesk');
        onClose();
      },
    },
  ];

  const filteredEmployees = query
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.role.toLowerCase().includes(query.toLowerCase()) ||
          e.employeeCode.toLowerCase().includes(query.toLowerCase()) ||
          e.department.toLowerCase().includes(query.toLowerCase())
      )
    : employees.slice(0, 4);

  const filteredActions = query
    ? quickActions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
    : quickActions;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Box */}
      <div
        role="dialog"
        aria-label="Command search"
        className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <Search size={18} strokeWidth={1.8} className="text-[var(--text-tertiary)] shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workforce members, pages, payroll, or press Esc..."
            autoFocus
            className="w-full h-12 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          />
          <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
          {/* Quick Actions */}
          <div className="py-1">
            <div className="px-3 py-1 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Navigation & Actions
            </div>
            {filteredActions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={act.action}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-[var(--bg-surface-subtle)] text-left text-[13px] group transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon size={15} className="text-[var(--brand-primary)]" />
                    <span className="font-medium text-[var(--text-primary)]">{act.title}</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]">
                    {act.category} →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Employees */}
          <div className="py-1">
            <div className="px-3 py-1 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Workforce Directory ({filteredEmployees.length})
            </div>
            {filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => {
                  onSelectEmployee(emp.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-[var(--bg-surface-subtle)] text-left text-[13px] group transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-[10px]">
                    {emp.initials}
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text-primary)] block leading-tight">{emp.name}</span>
                    <span className="text-[11px] text-[var(--text-tertiary)] block leading-tight">
                      {emp.role} • {emp.department}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-mono text-[var(--text-tertiary)]">
                  <span>{emp.employeeCode}</span>
                  <ArrowRight size={13} className="text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)]" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
