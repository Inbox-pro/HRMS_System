import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
} from 'lucide-react';
import type { ApprovalRequest, ApprovalType } from '../../types';
import { useToast } from '../common/Toast';
import { cn } from '../../lib/utils';
import { EmptyState } from '../common/EmptyState';

interface ApprovalsTableProps {
  approvals: ApprovalRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBulkAction: (ids: string[], action: 'approve' | 'reject') => void;
  onSelectEmployee: (empId: string) => void;
}

export function ApprovalsTable({
  approvals,
  onApprove,
  onReject,
  onBulkAction,
  onSelectEmployee,
}: ApprovalsTableProps) {
  const { showToast } = useToast();
  const [selectedType, setSelectedType] = useState<ApprovalType | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'date' | 'employee' | 'type'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const pendingItems = approvals.filter((item) => item.status === 'pending');

  const filteredItems = pendingItems.filter((item) => {
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === 'employee') {
      return sortAsc
        ? a.employee.name.localeCompare(b.employee.name)
        : b.employee.name.localeCompare(a.employee.name);
    }
    if (sortField === 'type') {
      return sortAsc
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    return sortAsc
      ? a.submittedAt.localeCompare(b.submittedAt)
      : b.submittedAt.localeCompare(a.submittedAt);
  });

  const totalPages = Math.ceil(sortedItems.length / pageSize) || 1;
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((item) => item.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleInlineApprove = (item: ApprovalRequest) => {
    onApprove(item.id);
    showToast({
      type: 'success',
      message: `Approved ${item.type} for ${item.employee.name}`,
      undoAction: () => {
        item.status = 'pending';
        showToast({
          type: 'info',
          message: `Reverted approval for ${item.employee.name}`,
        });
      },
    });
  };

  const handleInlineReject = (item: ApprovalRequest) => {
    onReject(item.id);
    showToast({
      type: 'warning',
      message: `Declined ${item.type} for ${item.employee.name}`,
      undoAction: () => {
        item.status = 'pending';
        showToast({
          type: 'info',
          message: `Reverted decline for ${item.employee.name}`,
        });
      },
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    onBulkAction(selectedIds, 'approve');
    setSelectedIds([]);
    showToast({
      type: 'success',
      message: `Approved ${count} requests`,
    });
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    onBulkAction(selectedIds, 'reject');
    setSelectedIds([]);
    showToast({
      type: 'warning',
      message: `Declined ${count} requests`,
    });
  };

  const typeLabels: Record<ApprovalType, string> = {
    leave: 'Leave',
    expense: 'Expense',
    contract: 'Contract',
    offer: 'Offer',
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header with Title and Filter Tabs */}
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Needs your action
          </h2>
          <span className="text-[12px] font-mono text-[var(--text-tertiary)] tabular-nums">
            {pendingItems.length}
          </span>
        </div>

        {/* Clean Segmented Filter Tabs */}
        <div className="flex items-center space-x-0.5 text-[12px]">
          {(['all', 'leave', 'expense', 'contract', 'offer'] as const).map((type) => {
            const count =
              type === 'all'
                ? pendingItems.length
                : pendingItems.filter((i) => i.type === type).length;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
                className={cn(
                  'px-2.5 py-1 rounded-[5px] font-medium capitalize transition-colors',
                  isSelected
                    ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                )}
              >
                {type} <span className="tabular-nums text-[11px] text-[var(--text-tertiary)] font-mono ml-0.5">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Banner when rows selected */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2 bg-[var(--brand-subtle)] border-b border-[var(--brand-border)] flex items-center justify-between text-[12px]">
          <span className="text-[var(--brand-primary)] font-medium">
            {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkApprove}
              className="px-2.5 py-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[12px] font-medium rounded-[5px] transition-colors"
            >
              Approve selected
            </button>
            <button
              onClick={handleBulkReject}
              className="px-2.5 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-default)] text-[12px] font-medium rounded-[5px] transition-colors"
            >
              Decline selected
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto">
        {paginatedItems.length === 0 ? (
          <EmptyState
            title="No approvals pending"
            description="All leave requests, expense reimbursements, contract renewals, and hiring offers have been cleared."
            actionLabel="View archived ledger"
            onAction={() => alert('Opening archived approvals ledger...')}
          />
        ) : (
          <table className="w-full text-left border-collapse text-[13px] table-fixed">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[var(--text-tertiary)] font-medium text-[11px]">
                <th className="w-8 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedItems.length > 0 &&
                      selectedIds.length === paginatedItems.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-[var(--border-default)] accent-[var(--brand-primary)] cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
                <th
                  className="w-44 px-2.5 py-2 cursor-pointer hover:text-[var(--text-primary)]"
                  onClick={() => {
                    setSortField('employee');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>Submitter</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="w-20 px-2 py-2 cursor-pointer hover:text-[var(--text-primary)]"
                  onClick={() => {
                    setSortField('type');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="px-3 py-2">Details</th>
                <th className="w-40 px-3 py-2 text-right">Value</th>
                <th className="w-36 px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {paginatedItems.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'hover:bg-[var(--bg-surface-hover)] transition-colors',
                      isChecked && 'bg-[var(--brand-subtle)]/40'
                    )}
                  >
                    {/* Checkbox */}
                    <td className="w-8 px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectRow(item.id)}
                        className="rounded border-[var(--border-default)] accent-[var(--brand-primary)] cursor-pointer"
                        aria-label={`Select approval for ${item.employee.name}`}
                      />
                    </td>

                    {/* Employee Profile link */}
                    <td className="w-44 px-2.5 py-2.5 truncate">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => onSelectEmployee(item.employee.id)}
                          className="w-6 h-6 rounded-full bg-[var(--bg-surface-subtle)] text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 transition-colors"
                          title="Open employee profile"
                        >
                          {item.employee.initials}
                        </button>
                        <div className="truncate">
                          <button
                            type="button"
                            onClick={() => onSelectEmployee(item.employee.id)}
                            className="font-medium text-[12px] text-[var(--text-primary)] hover:underline truncate block text-left leading-tight"
                          >
                            {item.employee.name}
                          </button>
                          <span className="text-[11px] text-[var(--text-tertiary)] truncate block font-mono leading-tight">
                            {item.employee.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Plain Calm Text Type (NO pill badge!) */}
                    <td className="w-20 px-2 py-2.5 whitespace-nowrap text-[12px] text-[var(--text-secondary)] font-medium">
                      {typeLabels[item.type]}
                    </td>

                    {/* Request Details */}
                    <td className="px-3 py-3 truncate">
                      <div className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-tertiary)] truncate">
                        {item.details.description}
                      </div>
                    </td>

                    {/* Value/Metric right-aligned in tabular figures */}
                    <td className="w-40 px-3 py-3 text-right truncate tabular-nums font-medium text-[12px] text-[var(--text-primary)]" title={item.primaryMetric}>
                      {item.primaryMetric}
                    </td>

                    {/* Clean Linear-style text buttons */}
                    <td className="w-36 px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center space-x-1.5 justify-end">
                        <button
                          onClick={() => handleInlineApprove(item)}
                          className="px-2 py-1 text-[11px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[4px] transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleInlineReject(item)}
                          className="px-2 py-1 text-[11px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] rounded-[4px] transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
        <span>
          {filteredItems.length} pending requests
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-[var(--bg-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="tabular-nums font-mono text-[var(--text-secondary)]">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-[var(--bg-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
