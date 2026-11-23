import { useState, useEffect } from 'react';
import { Search, ArrowRight, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmployee: (empId: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectEmployee }: CommandPaletteProps) {
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
    { id: 'act-1', title: 'Initiate TDS 24Q Monthly Challan', category: 'Compliance', icon: ShieldCheck },
    { id: 'act-2', title: 'Freeze Attendance for Nov Payroll', category: 'Payroll', icon: DollarSign },
    { id: 'act-3', title: 'Approve All Pending Casual Leaves', category: 'Time & Leave', icon: Calendar },
    { id: 'act-4', title: 'Download FY 2026-27 Gratuity Actuarial Report', category: 'Reports', icon: ShieldCheck },
  ];

  const employees = [
    { id: 'emp-10482', name: 'Ananya Iyer', role: 'AVP, Equity Research', dept: 'Investment Banking', code: 'EMP-10482' },
    { id: 'emp-10931', name: 'Rohan Mehta', role: 'Lead Compliance Officer', dept: 'Legal & Regulatory', code: 'EMP-10931' },
    { id: 'emp-cand-402', name: 'Farah Sheikh', role: 'Senior Quantitative Modeler', dept: 'Risk & Quant', code: 'CAND-0402' },
    { id: 'emp-10214', name: 'Vikram Patel', role: 'VP, Infrastructure & SecOps', dept: 'Technology', code: 'EMP-10214' },
    { id: 'emp-10884', name: 'Neha Sharma', role: 'Director, Private Wealth', dept: 'Wealth Management', code: 'EMP-10884' },
    { id: 'emp-11309', name: 'Amit Joshi', role: 'Senior Backend Engineer', dept: 'Technology Core', code: 'EMP-11309' },
  ];

  const filteredEmployees = query
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.role.toLowerCase().includes(query.toLowerCase()) ||
          e.code.toLowerCase().includes(query.toLowerCase()) ||
          e.dept.toLowerCase().includes(query.toLowerCase())
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
          <Search size={18} strokeWidth={1.7} className="text-[var(--text-tertiary)] shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees, payroll actions, policies, or press Esc..."
            autoFocus
            className="w-full h-12 bg-transparent text-[14px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none"
          />
          <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
          {/* Quick Actions */}
          <div className="py-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Quick Actions
            </div>
            {filteredActions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    alert(`Action executed: ${act.title}`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left rounded-[6px] hover:bg-[var(--bg-surface-subtle)] text-[13px] text-[var(--text-primary)] transition-colors group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon size={16} strokeWidth={1.7} className="text-[var(--brand-primary)]" />
                    <span>{act.title}</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] flex items-center">
                    {act.category}
                    <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Employees */}
          <div className="pt-2 pb-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Employees & Candidates
            </div>
            {filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => {
                  onSelectEmployee(emp.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left rounded-[6px] hover:bg-[var(--bg-surface-subtle)] text-[13px] text-[var(--text-primary)] transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-[var(--brand-subtle)] text-[var(--brand-primary)] flex items-center justify-center font-medium text-[11px]">
                    {emp.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-medium text-[var(--text-primary)] mr-2">{emp.name}</span>
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)]">({emp.code})</span>
                  </div>
                </div>
                <div className="text-[12px] text-[var(--text-secondary)] text-right">
                  <span>{emp.role}</span>
                  <span className="text-[var(--text-tertiary)] ml-1.5">• {emp.dept}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
          <span>Navigate with ↑ ↓ and press Enter</span>
          <span>Acme Financial Services — HRMS v2.4</span>
        </div>
      </div>
    </div>
  );
}
