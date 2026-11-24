import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Download,
  X,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHrms, type CandidateItem } from '../../context/HrmsContext';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface HiringPageProps {
  role: UserRole;
}

const KANBAN_STAGES: CandidateItem['stage'][] = [
  'Screening',
  'AI Phone Screen',
  'Technical Bar-Raiser',
  'Partner Round',
  'Offer Extended',
  'Hired',
];

export function HiringPage({ role }: HiringPageProps) {
  const { showToast } = useToast();
  const {
    requisitions,
    candidates,
    createRequisition,
    createCandidate,
    updateCandidateStage,
  } = useHrms();

  const [activeTab, setActiveTab] = useState<'requisitions' | 'kanban' | 'candidates'>(
    role === 'employee' ? 'requisitions' : 'kanban'
  );

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isCandModalOpen, setIsCandModalOpen] = useState(false);

  // Form states
  const [newReq, setNewReq] = useState({
    roleTitle: '',
    department: 'Risk & Quant',
    hiringManager: 'Aditya Sen',
    location: 'Mumbai (BKC HQ)',
    targetBudget: '₹35.0 – 40.0 LPA',
    priority: 'Urgent' as const,
  });

  const [newCand, setNewCand] = useState({
    name: '',
    currentCompany: '',
    applyingFor: requisitions[0]?.roleTitle || 'Senior Quantitative Modeler',
    stage: 'Screening' as CandidateItem['stage'],
    rating: '4.5 / 5.0',
    noticePeriod: '30 Days',
    expectedCTC: '₹35.0 LPA',
    location: 'Mumbai',
    email: '',
    phone: '',
  });

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.applyingFor.toLowerCase().includes(q) ||
        c.currentCompany.toLowerCase().includes(q)
      );
    });
  }, [candidates, searchTerm]);

  const handleCreateReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReq.roleTitle.trim()) {
      showToast({ type: 'warning', message: 'Please specify the role title.' });
      return;
    }
    const created = createRequisition(newReq);
    setIsReqModalOpen(false);
    showToast({
      type: 'success',
      message: `Created headcount requisition for ${created.roleTitle} (${created.id}).`,
    });
  };

  const handleCreateCandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCand.name.trim()) {
      showToast({ type: 'warning', message: 'Please specify candidate name.' });
      return;
    }
    const created = createCandidate(newCand);
    setIsCandModalOpen(false);
    showToast({
      type: 'success',
      message: `Added candidate ${created.name} to ${created.applyingFor} pipeline.`,
    });
  };

  const handleAdvanceStage = (candId: string, currentStage: CandidateItem['stage']) => {
    const stageIdx = KANBAN_STAGES.indexOf(currentStage);
    if (stageIdx >= KANBAN_STAGES.length - 1) return;

    const nextStage = KANBAN_STAGES[stageIdx + 1];
    updateCandidateStage(candId, nextStage);
    showToast({
      type: 'success',
      message: `Candidate moved to stage: ${nextStage}`,
    });
  };

  const handleExportCandidatesCSV = () => {
    const headers = ['Candidate ID', 'Name', 'Current Company', 'Applying For', 'Pipeline Stage', 'Rating', 'Notice Period', 'Expected CTC', 'Location'];
    const rows = candidates.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.currentCompany}"`,
      `"${c.applyingFor}"`,
      `"${c.stage}"`,
      `"${c.rating}"`,
      `"${c.noticePeriod}"`,
      `"${c.expectedCTC}"`,
      `"${c.location}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `acme_candidates_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      message: `Exported ${candidates.length} candidate profiles to CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
            {role === 'employee' ? 'Internal Job Board (IJP) & Referrals' : 'Talent Acquisition & ATS Pipeline'}
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            {role === 'employee'
              ? 'Explore internal mobility opportunities • ₹50,000 referral bounty on successful hire'
              : 'End-to-end recruitment pipeline • Requisitions, bar-raisers, and offer workflows'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCandidatesCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} strokeWidth={1.8} />
            <span>Export Pipeline</span>
          </button>

          {role !== 'employee' && (
            <>
              <button
                onClick={() => setIsCandModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-default)] rounded-[6px] text-[var(--text-primary)] shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={14} strokeWidth={2} />
                <span>Add Candidate</span>
              </button>
              <button
                onClick={() => setIsReqModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[6px] shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={14} strokeWidth={2} />
                <span>New Requisition</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4 Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Open Requisitions</span>
          <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
            {requisitions.filter((r) => r.status !== 'Closed').length} Positions
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">
            {requisitions.filter((r) => r.priority === 'Urgent').length} Urgent mandates
          </span>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Active In-Flight Candidates</span>
          <div className="mt-1 text-[22px] font-bold text-[var(--brand-primary)] tabular-nums">
            {candidates.length} Profiles
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Across 6 pipeline stages</span>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Offers Extended / Final</span>
          <div className="mt-1 text-[22px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {candidates.filter((c) => c.stage === 'Offer Extended' || c.stage === 'Hired').length} Candidates
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Acceptance rate: 88.4%</span>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Avg. Time-to-Fill</span>
          <div className="mt-1 text-[22px] font-bold text-[var(--text-primary)] tabular-nums font-mono">
            34 Days
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">Target SLA: &lt; 45 days</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px]">
        <button
          onClick={() => setActiveTab('kanban')}
          className={cn(
            'px-3 py-1 rounded-[5px] font-medium transition-colors cursor-pointer',
            activeTab === 'kanban'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          )}
        >
          Visual Stage Pipeline
        </button>
        <button
          onClick={() => setActiveTab('requisitions')}
          className={cn(
            'px-3 py-1 rounded-[5px] font-medium transition-colors cursor-pointer',
            activeTab === 'requisitions'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          )}
        >
          Job Requisitions ({requisitions.length})
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={cn(
            'px-3 py-1 rounded-[5px] font-medium transition-colors cursor-pointer',
            activeTab === 'candidates'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          )}
        >
          Candidate Directory ({candidates.length})
        </button>
      </div>

      {/* Tab 1: Visual Kanban Pipeline */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-2">
          {KANBAN_STAGES.map((stage) => {
            const stageCands = candidates.filter((c) => c.stage === stage);

            return (
              <div
                key={stage}
                className="bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg p-3 flex flex-col min-w-[210px]"
              >
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[var(--border-subtle)]">
                  <span className="text-[11px] font-bold text-[var(--text-primary)] truncate uppercase tracking-wider">
                    {stage}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    {stageCands.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px]">
                  {stageCands.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-[var(--text-tertiary)] italic">
                      Empty stage
                    </div>
                  ) : (
                    stageCands.map((cand) => (
                      <div
                        key={cand.id}
                        className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] rounded-lg shadow-xs text-[12px] space-y-1.5 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-[var(--text-primary)] text-[12px] leading-tight">
                            {cand.name}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">
                            {cand.rating}
                          </span>
                        </div>

                        <p className="text-[11px] font-medium text-[var(--brand-primary)] leading-tight truncate">
                          {cand.applyingFor}
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                          {cand.currentCompany}
                        </p>

                        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                          <span>{cand.location}</span>
                          {stage !== 'Hired' && (
                            <button
                              onClick={() => handleAdvanceStage(cand.id, cand.stage)}
                              className="text-[var(--brand-primary)] hover:underline font-semibold flex items-center space-x-0.5 cursor-pointer"
                              title="Advance to Next Stage"
                            >
                              <span>Next</span>
                              <ChevronRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Requisitions Table */}
      {activeTab === 'requisitions' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Role Mandate</th>
                  <th className="py-3 px-4 font-medium">Department</th>
                  <th className="py-3 px-4 font-medium">Location</th>
                  <th className="py-3 px-4 font-medium">Hiring Manager</th>
                  <th className="py-3 px-4 font-medium">Target CTC Band</th>
                  <th className="py-3 px-4 font-medium">Priority</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {requisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--text-primary)]">{req.roleTitle}</div>
                      <div className="text-[11px] font-mono text-[var(--text-tertiary)]">{req.id}</div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{req.department}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{req.location}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{req.hiringManager}</td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      {req.targetBudget}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-semibold border',
                          req.priority === 'Urgent'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300'
                        )}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--brand-primary)]">
                      {req.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Candidates Table */}
      {activeTab === 'candidates' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden shadow-xs">
          <div className="p-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search candidates by name, company, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-[6px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[12px] focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
              {filteredCandidates.length} profiles listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Candidate</th>
                  <th className="py-3 px-4 font-medium">Applying For</th>
                  <th className="py-3 px-4 font-medium">Current Firm</th>
                  <th className="py-3 px-4 font-medium">Expected CTC</th>
                  <th className="py-3 px-4 font-medium">Notice Period</th>
                  <th className="py-3 px-4 font-medium">Stage</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--text-primary)]">{cand.name}</div>
                      <div className="text-[11px] text-[var(--text-tertiary)] font-mono">{cand.id}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{cand.applyingFor}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{cand.currentCompany}</td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-700">{cand.expectedCTC}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{cand.noticePeriod}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--brand-subtle)] text-[var(--brand-primary)] border border-[var(--brand-border)]">
                        {cand.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleAdvanceStage(cand.id, cand.stage)}
                        className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
                      >
                        Advance Stage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Requisition */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-subtle)]">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">New Requisition Mandate</h3>
              <button onClick={() => setIsReqModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateReqSubmit} className="p-5 space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Algo Trading Developer"
                  value={newReq.roleTitle}
                  onChange={(e) => setNewReq({ ...newReq, roleTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Department</label>
                  <select
                    value={newReq.department}
                    onChange={(e) => setNewReq({ ...newReq, department: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  >
                    <option value="Risk & Quant">Risk & Quant</option>
                    <option value="Technology Infrastructure">Technology Infrastructure</option>
                    <option value="Sales & Distribution">Sales & Distribution</option>
                    <option value="Wealth Management">Wealth Management</option>
                    <option value="Legal & Regulatory">Legal & Regulatory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Location</label>
                  <select
                    value={newReq.location}
                    onChange={(e) => setNewReq({ ...newReq, location: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  >
                    <option value="Mumbai (BKC HQ)">Mumbai (BKC HQ)</option>
                    <option value="Pune (Hinjawadi)">Pune (Hinjawadi)</option>
                    <option value="Bengaluru (ORR)">Bengaluru (ORR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Budget Band (LPA)</label>
                  <input
                    type="text"
                    value={newReq.targetBudget}
                    onChange={(e) => setNewReq({ ...newReq, targetBudget: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Priority</label>
                  <select
                    value={newReq.priority}
                    onChange={(e) => setNewReq({ ...newReq, priority: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsReqModalOpen(false)}
                  className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] rounded-[6px]"
                >
                  Create Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Candidate */}
      {isCandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-subtle)]">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Add Candidate Profile</h3>
              <button onClick={() => setIsCandModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateCandSubmit} className="p-5 space-y-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Candidate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Rao"
                  value={newCand.name}
                  onChange={(e) => setNewCand({ ...newCand, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Applying For Position</label>
                <select
                  value={newCand.applyingFor}
                  onChange={(e) => setNewCand({ ...newCand, applyingFor: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                >
                  {requisitions.map((r) => (
                    <option key={r.id} value={r.roleTitle}>
                      {r.roleTitle} ({r.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Current Employer</label>
                  <input
                    type="text"
                    placeholder="e.g. JP Morgan India"
                    value={newCand.currentCompany}
                    onChange={(e) => setNewCand({ ...newCand, currentCompany: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">Expected CTC</label>
                  <input
                    type="text"
                    value={newCand.expectedCTC}
                    onChange={(e) => setNewCand({ ...newCand, expectedCTC: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsCandModalOpen(false)}
                  className="px-3.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[var(--brand-primary)] rounded-[6px]"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
