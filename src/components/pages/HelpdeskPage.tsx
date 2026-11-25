import { useState, useMemo } from 'react';
import {
  Download,
  Search,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHrms, type HelpdeskTicket } from '../../context/HrmsContext';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface HelpdeskPageProps {
  role: UserRole;
}

export function HelpdeskPage({ role }: HelpdeskPageProps) {
  const { showToast } = useToast();
  const { tickets, createTicket, updateTicketStatus, currentUser } = useHrms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<HelpdeskTicket['category']>('Payroll & Tax');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<HelpdeskTicket['priority']>('Medium');

  const visibleTickets = useMemo(() => {
    return role === 'employee'
      ? tickets.filter((t) => t.employeeCode === currentUser.employeeCode || t.employeeName === currentUser.name)
      : tickets;
  }, [tickets, role, currentUser]);

  const filteredTickets = useMemo(() => {
    return visibleTickets.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.ticketNumber.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesStat = selectedStatus === 'all' || t.status === selectedStatus;
      return matchesSearch && matchesCat && matchesStat;
    });
  }, [visibleTickets, searchQuery, selectedCategory, selectedStatus]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      showToast({ type: 'warning', message: 'Please specify the ticket subject.' });
      return;
    }

    const created = createTicket({
      category: newCategory,
      subject: newSubject,
      description: newDesc || 'Standard employee service query.',
      priority: newPriority,
    });

    setIsNewModalOpen(false);
    setNewSubject('');
    setNewDesc('');
    showToast({
      type: 'success',
      message: `Created ticket ${created.ticketNumber}. Routed to HR Operations queue.`,
    });
  };

  const handleResolveTicket = (id: string, tktNum: string) => {
    updateTicketStatus(id, 'Resolved');
    showToast({
      type: 'success',
      message: `Ticket ${tktNum} marked as Resolved.`,
    });
  };

  const handleExportTicketsCSV = () => {
    const headers = ['Ticket No', 'Employee', 'Category', 'Subject', 'Priority', 'Status', 'SLA Hours Left', 'Created At'];
    const rows = filteredTickets.map((t) => [
      `"${t.ticketNumber}"`,
      `"${t.employeeName}"`,
      `"${t.category}"`,
      `"${t.subject}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.slaHoursLeft}"`,
      `"${t.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inbox_infotech_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      message: `Exported ${filteredTickets.length} service tickets to CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
            {role === 'employee' ? 'My Helpdesk & Service Tickets' : 'Employee Helpdesk & Service Desk'}
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            {role === 'employee'
              ? `${currentUser.name} (${currentUser.employeeCode}) • EPFO Form 13 transfers, Form 16 & IT asset assistance`
              : 'Enterprise HR ticketing • Statutory compliance queries, PF transfers, and IT service desk'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportTicketsCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} strokeWidth={1.8} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={2} />
            <span>Raise Service Ticket</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
            {role === 'employee' ? 'My Active Tickets' : 'Total Active Tickets'}
          </span>
          <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
            {visibleTickets.filter((t) => t.status !== 'Resolved').length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Under active operations review</span>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">First-Response SLA Target</span>
          <div className="mt-1 text-[22px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            98.2%
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Average response: 42 mins</span>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">SLA Critical (&lt; 8h left)</span>
          <div className="mt-1 text-[22px] font-bold text-amber-600 tabular-nums">
            {visibleTickets.filter((t) => t.status !== 'Resolved' && t.slaHoursLeft > 0 && t.slaHoursLeft <= 8).length}
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">Priority escalation active</span>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Resolved This Month</span>
          <div className="mt-1 text-[22px] font-bold text-[var(--brand-primary)] tabular-nums">
            {visibleTickets.filter((t) => t.status === 'Resolved').length + 42}
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">Customer satisfaction: 4.8 / 5</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search by ticket ID, subject or employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[12px] focus:outline-none focus:border-[var(--brand-primary)]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[12px] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Payroll & Tax">Payroll & Tax</option>
            <option value="Provident Fund (EPFO)">Provident Fund (EPFO)</option>
            <option value="Insurance & Mediclaim">Insurance & Mediclaim</option>
            <option value="Letters & Verifications">Letters & Verifications</option>
            <option value="IT & Assets">IT & Assets</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[12px] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Employee">Awaiting Employee</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Ticket ID</th>
                <th className="py-3 px-4 font-medium">Employee</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Subject</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">SLA Left</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--text-tertiary)]">
                    No tickets found matching your query.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--brand-primary)]">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--text-primary)]">{t.employeeName}</div>
                      <div className="text-[10px] font-mono text-[var(--text-tertiary)]">{t.employeeCode}</div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{t.category}</td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-[var(--text-primary)] truncate">{t.subject}</div>
                      <div className="text-[11px] text-[var(--text-tertiary)] truncate">{t.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-semibold border',
                          t.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                            : t.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300'
                        )}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'text-[11px] font-semibold',
                          t.status === 'Resolved'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : t.status === 'In Progress'
                            ? 'text-[var(--brand-primary)]'
                            : 'text-amber-600'
                        )}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {t.status === 'Resolved' ? (
                        <span className="text-[var(--text-tertiary)]">Met</span>
                      ) : (
                        <span className={t.slaHoursLeft <= 8 ? 'text-rose-600 font-bold' : 'text-[var(--text-primary)]'}>
                          {t.slaHoursLeft}h left
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {t.status !== 'Resolved' ? (
                        <button
                          onClick={() => handleResolveTicket(t.id, t.ticketNumber)}
                          className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline flex items-center justify-end space-x-1 ml-auto cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          <span>Resolve</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[var(--text-tertiary)]">Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Raise Ticket */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-subtle)]">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Raise New Service Ticket</h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">HR Operations & Payroll SLA SLA Target: 24h</p>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Service Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                >
                  <option value="Payroll & Tax">Payroll & Tax (Form 16, Deductions, Payslips)</option>
                  <option value="Provident Fund (EPFO)">Provident Fund (EPFO Form 13 Transfer, UAN)</option>
                  <option value="Insurance & Mediclaim">Insurance & Mediclaim (Dependent E-Cards)</option>
                  <option value="Letters & Verifications">Letters & Verifications (Bonafide, Visa)</option>
                  <option value="IT & Assets">IT & Assets (YubiKey, Laptop, VPN Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Form 13 digital transfer endorsement required"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide reference numbers, previous UAN or policy numbers..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                >
                  <option value="Medium">Medium (Normal SLA 24h)</option>
                  <option value="High">High (Critical SLA 8h)</option>
                  <option value="Low">Low (Administrative 48h)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] rounded-[6px]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
