import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useHrms } from '../../context/HrmsContext';
import { useToast } from '../common/Toast';
import { cn } from '../../lib/utils';

interface PeoplePageProps {
  onSelectEmployee: (empId: string) => void;
}

export function PeoplePage({ onSelectEmployee }: PeoplePageProps) {
  const { employees, addEmployee, role } = useHrms();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Add Employee Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: '',
    role: '',
    department: 'Investment Banking',
    location: 'Mumbai (BKC HQ)',
    email: '',
    phone: '',
    annualCTC: '₹24,00,000',
    salaryBand: 'Band L4',
    reportingManager: 'Vikramaditya Singhania',
    status: 'Confirmed' as const,
  });

  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return ['All', ...Array.from(depts)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchTerm, selectedDept, selectedStatus]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = ['Employee Code', 'Full Name', 'Role', 'Department', 'Location', 'Status', 'Email', 'Phone', 'CTC'];
    const rows = filteredEmployees.map((e) => [
      `"${e.employeeCode}"`,
      `"${e.name}"`,
      `"${e.role}"`,
      `"${e.department}"`,
      `"${e.location}"`,
      `"${e.status}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.annualCTC || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `acme_workforce_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      message: `Exported ${filteredEmployees.length} employee records to CSV.`,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name.trim() || !newEmp.role.trim()) {
      showToast({ type: 'warning', message: 'Please provide full name and role designation.' });
      return;
    }

    const created = addEmployee({
      ...newEmp,
      email: newEmp.email || `${newEmp.name.toLowerCase().replace(/\s+/g, '.')}@acmefin.in`,
      phone: newEmp.phone || '+91 98200 11223',
    });

    setIsAddModalOpen(false);
    showToast({
      type: 'success',
      message: `Successfully onboarded ${created.name} (${created.employeeCode}).`,
    });

    // Reset form
    setNewEmp({
      name: '',
      role: '',
      department: 'Investment Banking',
      location: 'Mumbai (BKC HQ)',
      email: '',
      phone: '',
      annualCTC: '₹24,00,000',
      salaryBand: 'Band L4',
      reportingManager: 'Vikramaditya Singhania',
      status: 'Confirmed',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
            Workforce Directory
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Active organizational registry, designations, and compliance bands across all Indian offices.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} strokeWidth={1.8} />
            <span>Export CSV</span>
          </button>

          {role === 'hr_admin' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white rounded-[6px] shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={15} strokeWidth={2} />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, employee code, role or email..."
            className="w-full pl-8 pr-3 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-primary)] text-[12px]"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Dept filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[var(--text-tertiary)] text-[11px] font-medium">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none text-[12px]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[var(--text-tertiary)] text-[11px] font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none text-[12px]"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Probation">Probation</option>
              <option value="Notice Period">Notice Period</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Reporting Manager</th>
                <th className="py-3 px-4">Annual CTC</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--text-tertiary)]">
                    No workforce members match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp.id)}
                    className="hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                          {emp.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                            {emp.name}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-tertiary)]">
                            {emp.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--text-primary)]">{emp.role}</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{emp.location}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{emp.reportingManager}</td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      {emp.annualCTC || '₹28,50,000'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                          emp.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : emp.status === 'Probation'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                        )}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEmployee(emp.id);
                        }}
                        className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
                      >
                        View Profile →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} members
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] disabled:opacity-40 hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] disabled:opacity-40 hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-subtle)]">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Onboard New Employee</h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">Create workforce record with Indian statutory defaults</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-[12px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Deshmukh"
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Designation Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Risk Analyst"
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  >
                    <option value="Investment Banking">Investment Banking</option>
                    <option value="Risk & Quant Analytics">Risk & Quant Analytics</option>
                    <option value="Technology Infrastructure">Technology Infrastructure</option>
                    <option value="Finance & Treasury">Finance & Treasury</option>
                    <option value="Wealth Management">Wealth Management</option>
                    <option value="Legal & Regulatory">Legal & Regulatory</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Office Location</label>
                  <select
                    value={newEmp.location}
                    onChange={(e) => setNewEmp({ ...newEmp, location: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  >
                    <option value="Mumbai (BKC HQ)">Mumbai (BKC HQ)</option>
                    <option value="Mumbai (Nariman Pt)">Mumbai (Nariman Pt)</option>
                    <option value="Pune (Hinjawadi)">Pune (Hinjawadi)</option>
                    <option value="Bengaluru (ORR)">Bengaluru (ORR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Corporate Email</label>
                  <input
                    type="email"
                    placeholder="name@acmefin.in"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Direct Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98200 00000"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Annual CTC (INR)</label>
                  <input
                    type="text"
                    placeholder="₹25,00,000"
                    value={newEmp.annualCTC}
                    onChange={(e) => setNewEmp({ ...newEmp, annualCTC: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)] block mb-1">Reporting Manager</label>
                  <input
                    type="text"
                    value={newEmp.reportingManager}
                    onChange={(e) => setNewEmp({ ...newEmp, reportingManager: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-end space-x-2.5 pt-3 -mx-5 -mb-5 bg-[var(--bg-surface-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs cursor-pointer"
                >
                  Confirm & Add to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
