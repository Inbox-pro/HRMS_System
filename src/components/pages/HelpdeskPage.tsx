import { useState } from 'react';
import {
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';

interface HelpdeskPageProps {
  role: UserRole;
}

export interface HelpdeskTicket {
  id: string;
  ticketNumber: string;
  employeeName: string;
  employeeCode: string;
  category: 'Payroll & Tax' | 'Provident Fund (EPFO)' | 'Insurance & Mediclaim' | 'Letters & Verifications' | 'IT & Assets';
  subject: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Awaiting Employee' | 'Resolved';
  slaHoursLeft: number;
  assignedTo: string;
  createdAt: string;
}

const INITIAL_TICKETS: HelpdeskTicket[] = [
  {
    id: 'tkt-01',
    ticketNumber: 'HD-8491',
    employeeName: 'Ananya Iyer',
    employeeCode: 'EMP-10482',
    category: 'Provident Fund (EPFO)',
    subject: 'Form 13 UAN transfer from previous employer (Kotak Securities)',
    description: 'Submitted physical Annexure K and digital transfer request on Member e-Sewa portal. Need Acme Financial Services EPFO digital signature approval.',
    priority: 'High',
    status: 'In Progress',
    slaHoursLeft: 6,
    assignedTo: 'Sunil Rao (HR Operations)',
    createdAt: '22 Nov 2026, 11:20 AM',
  },
  {
    id: 'tkt-02',
    ticketNumber: 'HD-8488',
    employeeName: 'Rohan Mehta',
    employeeCode: 'EMP-10931',
    category: 'Payroll & Tax',
    subject: 'Update Home Loan interest Sec 24(b) certificate for provisional tax deduction',
    description: 'Uploaded provisional interest certificate from HDFC Bank for FY 2026-27 (₹2,00,000 deduction). Please reflect in November payroll run.',
    priority: 'Medium',
    status: 'Open',
    slaHoursLeft: 18,
    assignedTo: 'Kavita Sharma (Payroll Specialist)',
    createdAt: '22 Nov 2026, 04:45 PM',
  },
  {
    id: 'tkt-03',
    ticketNumber: 'HD-8475',
    employeeName: 'Farah Sheikh',
    employeeCode: 'EMP-11048',
    category: 'Insurance & Mediclaim',
    subject: 'Cashless e-card generation for newborn dependent under Star Health Group policy',
    description: 'Baby born on 12 Nov 2026. Submitted hospital birth certificate for corporate health insurance endorsement.',
    priority: 'High',
    status: 'In Progress',
    slaHoursLeft: 4,
    assignedTo: 'Sunil Rao (HR Operations)',
    createdAt: '21 Nov 2026, 02:15 PM',
  },
  {
    id: 'tkt-04',
    ticketNumber: 'HD-8462',
    employeeName: 'Amit Joshi',
    employeeCode: 'EMP-11204',
    category: 'Letters & Verifications',
    subject: 'Bonafide employment & salary verification letter for UK Visa appointment',
    description: 'Attending London Quant Finance Summit in Jan 2027. Need official letter on Acme Financial Services letterhead with seal.',
    priority: 'Medium',
    status: 'Resolved',
    slaHoursLeft: 0,
    assignedTo: 'Pooja Bhatt (People Partner)',
    createdAt: '20 Nov 2026, 10:00 AM',
  },
  {
    id: 'tkt-05',
    ticketNumber: 'HD-8459',
    employeeName: 'Priya Nambiar',
    employeeCode: 'EMP-10773',
    category: 'IT & Assets',
    subject: 'YubiKey 5C NFC hardware token replacement for trading floor multi-factor auth',
    description: 'Token physical casing damaged during commute. Biometric login currently defaulting to SMS backup.',
    priority: 'Low',
    status: 'Awaiting Employee',
    slaHoursLeft: 32,
    assignedTo: 'Rajesh Varma (IT Desktop)',
    createdAt: '19 Nov 2026, 05:30 PM',
  },
  {
    id: 'tkt-06',
    ticketNumber: 'HD-8450',
    employeeName: 'Devendra Kothari',
    employeeCode: 'EMP-11512',
    category: 'Payroll & Tax',
    subject: 'Form 16 Part B tax discrepancy query for Assessment Year 2026-27',
    description: 'Discrepancy noted between Form 26AS AIS/TIS portal and TRACES download for Q2 TDS credit.',
    priority: 'Medium',
    status: 'Open',
    slaHoursLeft: 22,
    assignedTo: 'Kavita Sharma (Payroll Specialist)',
    createdAt: '23 Nov 2026, 08:30 AM',
  },
];

export function HelpdeskPage({ role }: HelpdeskPageProps) {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(
    role === 'employee'
      ? INITIAL_TICKETS.filter((t) => t.employeeName === 'Ananya Iyer')
      : INITIAL_TICKETS
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<HelpdeskTicket['category']>('Payroll & Tax');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<HelpdeskTicket['priority']>('Medium');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || t.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const newTkt: HelpdeskTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `HD-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: 'Ananya Iyer',
      employeeCode: 'EMP-10482',
      category: newCategory,
      subject: newSubject,
      description: newDesc || 'No additional details provided.',
      priority: newPriority,
      status: 'Open',
      slaHoursLeft: newPriority === 'High' ? 8 : 24,
      assignedTo: 'HR Service Desk Queue',
      createdAt: 'Just now',
    };

    setTickets([newTkt, ...tickets]);
    setIsNewModalOpen(false);
    setNewSubject('');
    setNewDesc('');
    showToast({
      type: 'success',
      message: `Ticket ${newTkt.ticketNumber} created successfully. SLA target: ${newTkt.slaHoursLeft}h.`,
    });
  };

  const handleResolveTicket = (id: string, tktNum: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved', slaHoursLeft: 0 } : t))
    );
    showToast({
      type: 'success',
      message: `Ticket ${tktNum} marked as Resolved.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            {role === 'employee' ? 'My Helpdesk & Service Tickets' : 'Employee Helpdesk & Service Requests'}
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            {role === 'employee'
              ? 'Ananya Iyer (EMP-10482) • Track EPFO Form 13 transfers, Form 16 & IT queries'
              : 'Statutory queries, PF Form 13 transfers, Form 16, insurance endorsements & IT asset support'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {role === 'hr_admin' && (
            <button
              onClick={() => showToast({ type: 'info', message: 'Exporting Helpdesk SLA resolution report (.xlsx)' })}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px] transition-colors"
            >
              <Download size={13} strokeWidth={1.7} />
              <span>SLA export</span>
            </button>
          )}
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
          >
            <Plus size={13} strokeWidth={1.7} />
            <span>Raise service ticket</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
            {role === 'employee' ? 'My active tickets' : 'Total active tickets'}
          </span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
            {tickets.filter((t) => t.status !== 'Resolved').length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {role === 'employee' ? 'Under HR Operations review' : 'Across 1,284 workforce'}
          </span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">First-response SLA compliance</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--success-text)] tabular-nums">
            98.2%
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">Average response: 42 mins</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">SLA critical (&lt; 8h left)</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--warning-text)] tabular-nums">
            {tickets.filter((t) => t.status !== 'Resolved' && t.slaHoursLeft > 0 && t.slaHoursLeft <= 8).length}
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">Priority escalation active</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
            {role === 'employee' ? 'My resolved requests' : 'Resolved this month'}
          </span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
            {role === 'employee' ? '1 Ticket' : '184'}
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">CSAT rating 4.8 / 5.0</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search ticket #, employee, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <div className="flex items-center space-x-1 text-[var(--text-secondary)]">
            <Filter size={13} />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1 text-[12px] bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] focus:outline-none"
          >
            <option value="all">All categories</option>
            <option value="Payroll & Tax">Payroll & Tax</option>
            <option value="Provident Fund (EPFO)">Provident Fund (EPFO)</option>
            <option value="Insurance & Mediclaim">Insurance & Mediclaim</option>
            <option value="Letters & Verifications">Letters & Verifications</option>
            <option value="IT & Assets">IT & Assets</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2 py-1 text-[12px] bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Employee">Awaiting Employee</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                <th className="py-2.5 px-4 font-medium">Ticket #</th>
                <th className="py-2.5 px-4 font-medium">Employee</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">Subject & description</th>
                <th className="py-2.5 px-4 font-medium">Priority</th>
                <th className="py-2.5 px-4 font-medium">SLA remaining</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium">Assignee</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                  <td className="py-2.5 px-4 font-mono font-medium text-[var(--brand-primary)]">
                    {t.ticketNumber}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-[var(--text-primary)]">{t.employeeName}</div>
                    <div className="text-[11px] font-mono text-[var(--text-tertiary)]">{t.employeeCode}</div>
                  </td>
                  <td className="py-2.5 px-4 text-[var(--text-secondary)]">
                    {t.category}
                  </td>
                  <td className="py-2.5 px-4 max-w-xs">
                    <div className="font-medium text-[var(--text-primary)] truncate">{t.subject}</div>
                    <div className="text-[11px] text-[var(--text-tertiary)] truncate">{t.description}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`text-[11px] font-medium ${
                        t.priority === 'High'
                          ? 'text-[var(--danger-text)]'
                          : t.priority === 'Medium'
                          ? 'text-[var(--warning-text)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">
                    {t.status === 'Resolved' ? (
                      <span className="text-[var(--text-tertiary)] text-[11px]">Completed</span>
                    ) : t.slaHoursLeft <= 6 ? (
                      <span className="text-[var(--danger-text)] font-semibold flex items-center space-x-1 text-[11px]">
                        <Clock size={12} />
                        <span>{t.slaHoursLeft}h left</span>
                      </span>
                    ) : (
                      <span className="text-[var(--text-secondary)] text-[11px] flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{t.slaHoursLeft}h left</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`text-[11px] font-medium flex items-center space-x-1 ${
                        t.status === 'Resolved'
                          ? 'text-[var(--success-text)]'
                          : t.status === 'In Progress'
                          ? 'text-[var(--brand-primary)]'
                          : t.status === 'Awaiting Employee'
                          ? 'text-[var(--warning-text)]'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {t.status === 'Resolved' && <CheckCircle2 size={12} />}
                      {t.status === 'Open' && <AlertCircle size={12} />}
                      <span>{t.status}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[var(--text-secondary)] text-[11px]">
                    {t.assignedTo}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {t.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleResolveTicket(t.id, t.ticketNumber)}
                        className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] text-[var(--text-tertiary)]">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Raise HR Service Ticket
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-[13px]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Query category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as HelpdeskTicket['category'])}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)]"
                >
                  <option value="Payroll & Tax">Payroll & Tax (Form 16, HRA, Sec 80C)</option>
                  <option value="Provident Fund (EPFO)">Provident Fund (EPFO Form 13, UAN, Passbook)</option>
                  <option value="Insurance & Mediclaim">Insurance & Mediclaim (Dependent endorsement, e-Card)</option>
                  <option value="Letters & Verifications">Letters & Verifications (Visa, Bonafide, Salary)</option>
                  <option value="IT & Assets">IT & Assets (YubiKey, Laptop, Access Card)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as HelpdeskTicket['priority'])}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)]"
                >
                  <option value="High">High (Impacting payroll / urgent travel / hospital admission)</option>
                  <option value="Medium">Medium (General regulatory request or letter)</option>
                  <option value="Low">Low (Informational query)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Endorse newborn dependent for Group Medical policy"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Description & relevant reference IDs
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide UAN number, insurance policy ID, or specific document requirement..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px]"
                >
                  Submit ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
