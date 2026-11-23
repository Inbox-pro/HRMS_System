import { useState } from 'react';
import {
  Plus,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';

interface HiringPageProps {
  role: UserRole;
}

interface RequisitionItem {
  id: string;
  roleTitle: string;
  department: string;
  hiringManager: string;
  location: string;
  targetBudget: string;
  activeCandidates: number;
  daysOpen: number;
  priority: 'Urgent' | 'Normal';
  status: 'Open' | 'Final Round' | 'Offer Drafting';
}

const REQUISITIONS: RequisitionItem[] = [
  {
    id: 'req-01',
    roleTitle: 'Senior Quantitative Modeler',
    department: 'Risk & Quant',
    hiringManager: 'Aditya Sen',
    location: 'Bengaluru (ORR)',
    targetBudget: '₹38.0 – 42.0 LPA',
    activeCandidates: 14,
    daysOpen: 22,
    priority: 'Urgent',
    status: 'Offer Drafting',
  },
  {
    id: 'req-02',
    roleTitle: 'AVP, Institutional Equity Sales',
    department: 'Sales & Distribution',
    hiringManager: 'Rajesh Sanghvi',
    location: 'Mumbai (BKC HQ)',
    targetBudget: '₹45.0 – 50.0 LPA',
    activeCandidates: 28,
    daysOpen: 18,
    priority: 'Urgent',
    status: 'Final Round',
  },
  {
    id: 'req-03',
    roleTitle: 'Lead Cloud Infrastructure Architect',
    department: 'Technology Infrastructure',
    hiringManager: 'Vikram Patel',
    location: 'Pune (Hinjawadi)',
    targetBudget: '₹32.0 – 36.0 LPA',
    activeCandidates: 34,
    daysOpen: 29,
    priority: 'Normal',
    status: 'Open',
  },
  {
    id: 'req-04',
    roleTitle: 'Compliance Officer (SEBI Filings)',
    department: 'Legal & Regulatory',
    hiringManager: 'Sunil Kulkarni',
    location: 'Mumbai (Nariman Pt)',
    targetBudget: '₹22.0 – 26.0 LPA',
    activeCandidates: 19,
    daysOpen: 14,
    priority: 'Normal',
    status: 'Open',
  },
  {
    id: 'req-05',
    roleTitle: 'Senior Private Wealth Advisor',
    department: 'Wealth Management',
    hiringManager: 'Neha Sharma',
    location: 'Surat (Athwa)',
    targetBudget: '₹28.0 – 32.0 LPA',
    activeCandidates: 12,
    daysOpen: 35,
    priority: 'Urgent',
    status: 'Final Round',
  },
];

interface CandidateItem {
  id: string;
  name: string;
  currentCompany: string;
  applyingFor: string;
  stage: 'Screening' | 'AI Phone Screen' | 'Technical Bar-Raiser' | 'Partner Round' | 'Offer Extended';
  rating: string;
  noticePeriod: string;
  expectedCTC: string;
  location: string;
}

const INITIAL_CANDIDATES: CandidateItem[] = [
  {
    id: 'c-1',
    name: 'Farah Sheikh',
    currentCompany: 'ex-Barclays Capital India',
    applyingFor: 'Senior Quantitative Modeler',
    stage: 'Offer Extended',
    rating: '9.2 / 10',
    noticePeriod: '30 days (buyout req.)',
    expectedCTC: '₹38.5 LPA',
    location: 'Bengaluru',
  },
  {
    id: 'c-2',
    name: 'Siddharth Nair',
    currentCompany: 'ex-Kotak Institutional Equities',
    applyingFor: 'AVP, Institutional Equity Sales',
    stage: 'Partner Round',
    rating: '8.8 / 10',
    noticePeriod: '60 days',
    expectedCTC: '₹46.0 LPA',
    location: 'Mumbai',
  },
  {
    id: 'c-3',
    name: 'Tanvi Gokhale',
    currentCompany: 'ex-Nutanix India',
    applyingFor: 'Lead Cloud Infrastructure Architect',
    stage: 'Technical Bar-Raiser',
    rating: '8.5 / 10',
    noticePeriod: 'Immediate',
    expectedCTC: '₹34.0 LPA',
    location: 'Pune',
  },
  {
    id: 'c-4',
    name: 'Anirudh Roy',
    currentCompany: 'ex-ICICI Securities',
    applyingFor: 'Compliance Officer (SEBI Filings)',
    stage: 'AI Phone Screen',
    rating: '8.1 / 10',
    noticePeriod: '45 days',
    expectedCTC: '₹24.0 LPA',
    location: 'Mumbai',
  },
  {
    id: 'c-5',
    name: 'Meenakshi Sundaram',
    currentCompany: 'ex-Goldman Sachs Bengaluru',
    applyingFor: 'Senior Quantitative Modeler',
    stage: 'Technical Bar-Raiser',
    rating: '9.4 / 10',
    noticePeriod: '30 days',
    expectedCTC: '₹41.0 LPA',
    location: 'Bengaluru',
  },
  {
    id: 'c-6',
    name: 'Harsh Vardhan',
    currentCompany: 'ex-HDFC Securities',
    applyingFor: 'Senior Private Wealth Advisor',
    stage: 'Screening',
    rating: '7.8 / 10',
    noticePeriod: '60 days',
    expectedCTC: '₹29.0 LPA',
    location: 'Surat',
  },
];

const KANBAN_STAGES: CandidateItem['stage'][] = [
  'Screening',
  'AI Phone Screen',
  'Technical Bar-Raiser',
  'Partner Round',
  'Offer Extended',
];

export function HiringPage({ role }: HiringPageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'requisitions' | 'kanban' | 'candidates' | 'referrals'>(
    role === 'employee' ? 'requisitions' : 'kanban'
  );
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);

  const handleCreateReq = () => {
    showToast({
      type: 'info',
      message: 'Opening Headcount Requisition Approval workflow',
    });
  };

  const handleAdvanceStage = (candId: string, currentStage: CandidateItem['stage']) => {
    const stageIdx = KANBAN_STAGES.indexOf(currentStage);
    if (stageIdx >= KANBAN_STAGES.length - 1) return;

    const nextStage = KANBAN_STAGES[stageIdx + 1];
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, stage: nextStage } : c))
    );

    showToast({
      type: 'success',
      message: `Candidate moved to stage: ${nextStage}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            {role === 'employee' ? 'Internal Job Postings (IJP) & Employee Referrals' : 'Hiring & Candidate Pipeline'}
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            {role === 'employee'
              ? 'Browse open positions across Acme Financial Services • ₹50,000 referral reward upon join'
              : role === 'manager'
              ? 'Risk & Quant Desk active mandates • Technical interview scorecards'
              : '24 open mandates across 4 locations • 482 active applicants'}
          </p>
        </div>

        {role === 'employee' ? (
          <button
            onClick={() => showToast({ type: 'success', message: 'Opening Employee Referral Submission form' })}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
          >
            <Users size={14} />
            <span>Refer a peer (₹50,000 bonus)</span>
          </button>
        ) : (
          <button
            onClick={handleCreateReq}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            <span>New requisition</span>
          </button>
        )}
      </div>

      {/* 4 Metrics */}
      {role === 'employee' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Open internal mandates</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              24 Roles
            </div>
            <span className="text-[11px] text-[var(--brand-primary)] font-medium">Eligible for transfer</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Referral bounty reward</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--success-text)] tabular-nums">
              ₹50,000
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Per successful hire</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">My submitted referrals</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              1 Candidate
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">Siddharth Nair (Final Round)</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Avg recruitment turnaround</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              19.2 Days
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">From referral to offer</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Open mandates</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              24
            </div>
            <span className="text-[11px] text-[var(--danger-text)] font-medium">4 urgent replacement roles</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Active candidate pipeline</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              482
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">184 in technical screen</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Average time to offer</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              19.2 Days
            </div>
            <span className="text-[11px] text-[var(--success-text)] font-medium">Target &lt; 25 days</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Offer acceptance rate</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              86.4%
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">BFSI industry: 74%</span>
          </div>
        </div>
      )}

      {/* Segmented Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px]">
        {role === 'employee' ? (
          <>
            <button
              onClick={() => setActiveTab('requisitions')}
              className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
                activeTab === 'requisitions'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Open internal opportunities (24)
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
                activeTab === 'referrals'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              My submitted referrals (1)
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
                activeTab === 'kanban'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Candidate pipeline board (Kanban)
            </button>
            <button
              onClick={() => setActiveTab('requisitions')}
              className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
                activeTab === 'requisitions'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Open requisitions (24)
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
                activeTab === 'candidates'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              All applicants list
            </button>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. KANBAN PIPELINE BOARD */}
      {/* ============================================================== */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage);
            return (
              <div
                key={stage}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3 flex flex-col min-w-[210px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] mb-3">
                  <span className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
                    {stage}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-[var(--text-tertiary)] bg-[var(--bg-page)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {stageCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] rounded-md space-y-2 text-[11px] shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-[12px] text-[var(--text-primary)]">
                            {cand.name}
                          </div>
                          <div className="text-[10px] text-[var(--text-tertiary)] truncate">
                            {cand.currentCompany}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] font-semibold text-[var(--brand-primary)]">
                          {cand.rating}
                        </span>
                      </div>

                      <div className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
                        {cand.applyingFor}
                      </div>

                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
                        <span>{cand.noticePeriod}</span>
                        <span className="font-mono text-[var(--text-primary)] font-medium">
                          {cand.expectedCTC}
                        </span>
                      </div>

                      {stage !== 'Offer Extended' ? (
                        <button
                          onClick={() => handleAdvanceStage(cand.id, cand.stage)}
                          className="w-full mt-1 py-1 px-2 text-[10px] font-medium text-[var(--brand-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] rounded flex items-center justify-center space-x-1 transition-colors"
                        >
                          <span>Advance stage</span>
                          <ArrowRight size={10} />
                        </button>
                      ) : (
                        <div className="w-full mt-1 py-1 px-2 text-[10px] font-medium text-[var(--success-text)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded flex items-center justify-center space-x-1">
                          <CheckCircle2 size={10} />
                          <span>Offer drafted & sent</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {stageCandidates.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-[var(--text-tertiary)] border border-dashed border-[var(--border-subtle)] rounded">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. REQUISITIONS LIST */}
      {/* ============================================================== */}
      {activeTab === 'requisitions' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Job requisition title</th>
                  <th className="py-2.5 px-4 font-medium">Department</th>
                  <th className="py-2.5 px-4 font-medium">Location</th>
                  <th className="py-2.5 px-4 font-medium">Target budget (CTC)</th>
                  <th className="py-2.5 px-4 font-medium">Hiring manager</th>
                  <th className="py-2.5 px-4 font-medium text-right">Active pipeline</th>
                  <th className="py-2.5 px-4 font-medium text-right">Days open</th>
                  <th className="py-2.5 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {REQUISITIONS.map((req) => (
                  <tr key={req.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4 font-medium text-[var(--text-primary)]">
                      {req.roleTitle}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{req.department}</td>
                    <td className="py-2.5 px-4 text-[var(--text-tertiary)]">{req.location}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[var(--text-primary)]">
                      {req.targetBudget}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{req.hiringManager}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--brand-primary)] font-medium">
                      {req.activeCandidates} candidates
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-tertiary)]">
                      {req.daysOpen}d
                    </td>
                    <td className="py-2.5 px-4 text-right text-[11px] text-[var(--text-secondary)] font-medium">
                      {req.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ALL CANDIDATES LIST */}
      {/* ============================================================== */}
      {activeTab === 'candidates' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Candidate name</th>
                  <th className="py-2.5 px-4 font-medium">Current background</th>
                  <th className="py-2.5 px-4 font-medium">Applying for</th>
                  <th className="py-2.5 px-4 font-medium">Current stage</th>
                  <th className="py-2.5 px-4 font-medium">Bar-raiser rating</th>
                  <th className="py-2.5 px-4 font-medium">Notice period</th>
                  <th className="py-2.5 px-4 font-medium text-right">Expected CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {candidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">
                      {cand.name}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">{cand.currentCompany}</td>
                    <td className="py-2.5 px-4 text-[var(--text-primary)]">{cand.applyingFor}</td>
                    <td className="py-2.5 px-4 font-medium text-[var(--brand-primary)]">{cand.stage}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[var(--text-primary)]">
                      {cand.rating}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-tertiary)]">{cand.noticePeriod}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-primary)]">
                      {cand.expectedCTC}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
