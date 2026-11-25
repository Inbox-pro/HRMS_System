import { useState } from 'react';
import { Download, CheckCircle2, BookOpen } from 'lucide-react';
import { useToast } from '../common/Toast';
import type { UserRole } from '../../types';

interface PerformancePageProps {
  role: UserRole;
}

interface ComplianceCourse {
  title: string;
  mandatoryFor: string;
  dueDate: string;
  completedCount: number;
  totalCount: number;
  pct: number;
  regulatoryBody: string;
  employeeStatus?: 'Completed' | 'Pending Completion';
}

const COURSES: ComplianceCourse[] = [
  {
    title: 'ISO 27001 & SOC 2 Information Security FY 2026-27',
    mandatoryFor: 'All 1,284 employees & contractors',
    dueDate: '30 Nov 2026',
    completedCount: 1248,
    totalCount: 1284,
    pct: 97.2,
    regulatoryBody: 'CERT-In & ISO/IEC 27001:2022',
    employeeStatus: 'Completed',
  },
  {
    title: 'POSH Act (Prevention of Sexual Harassment) 2026 Certification',
    mandatoryFor: 'All permanent & retainer staff',
    dueDate: '15 Dec 2026',
    completedCount: 1190,
    totalCount: 1284,
    pct: 92.7,
    regulatoryBody: 'Ministry of Women and Child Development (India)',
    employeeStatus: 'Pending Completion',
  },
  {
    title: 'Secure Coding & OWASP Top 10 Compliance Audit',
    mandatoryFor: 'Engineering, DevOps, QA & Product staff',
    dueDate: '31 Dec 2026',
    completedCount: 420,
    totalCount: 462,
    pct: 90.9,
    regulatoryBody: 'OWASP & SOC 2 Security Committee',
    employeeStatus: 'Completed',
  },
  {
    title: 'Information Security & Data Protection (DPDP Act 2023)',
    mandatoryFor: 'Technology, Cloud Ops, Security & Support members',
    dueDate: '10 Dec 2026',
    completedCount: 680,
    totalCount: 712,
    pct: 95.5,
    regulatoryBody: 'Data Protection Board of India',
    employeeStatus: 'Completed',
  },
];

interface EmployeeGoal {
  id: string;
  title: string;
  category: string;
  targetMetric: string;
  currentProgressPct: number;
  weightagePct: number;
  status: 'On Track' | 'Needs Attention' | 'Completed';
}

const ANANYA_GOALS: EmployeeGoal[] = [
  {
    id: 'g-1',
    title: 'Automate Zero-Downtime CI/CD Canary Deployment Pipeline',
    category: 'Platform & Cloud Engineering',
    targetMetric: 'Sub-second automated rollback & telemetry pipeline on Hinjawadi DR cluster',
    currentProgressPct: 92,
    weightagePct: 35,
    status: 'On Track',
  },
  {
    id: 'g-2',
    title: 'Enterprise SaaS API Latency & Microservices Optimization',
    category: 'Product & Architecture',
    targetMetric: 'Reduce p99 API latency by 35% across 12 enterprise client tenants',
    currentProgressPct: 88,
    weightagePct: 30,
    status: 'On Track',
  },
  {
    id: 'g-3',
    title: 'Band L5 Senior Engineer Mentorship Program',
    category: 'People & Culture',
    targetMetric: 'Coach 3 junior software engineers on distributed systems & TypeScript stack',
    currentProgressPct: 75,
    weightagePct: 20,
    status: 'On Track',
  },
  {
    id: 'g-4',
    title: 'SOC 2 & DPDP Act Data Privacy Audit Documentation',
    category: 'Compliance & Governance',
    targetMetric: '100% security audit documentation sign-off before 30 Nov 2026',
    currentProgressPct: 100,
    weightagePct: 15,
    status: 'Completed',
  },
];

export function PerformancePage({ role }: PerformancePageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(
    role === 'employee' ? 'my_goals' : role === 'manager' ? 'team_reviews' : 'reviews'
  );
  const [courses, setCourses] = useState<ComplianceCourse[]>(COURSES);

  const handleLaunchCourse = (title: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.title === title ? { ...c, employeeStatus: 'Completed' } : c))
    );
    showToast({
      type: 'success',
      message: `Course launched and verified: ${title}. Digital certification issued.`,
    });
  };

  const handleSendReminder = (courseTitle: string) => {
    showToast({
      type: 'info',
      message: `Sent notification reminder to pending employees for: ${courseTitle}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            {role === 'employee'
              ? 'My Performance Goals & Mandatory Learning'
              : role === 'manager'
              ? 'Team Appraisal & Review Calibration'
              : 'Performance & Compliance Learning'}
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            {role === 'employee'
              ? 'Ananya Iyer (EMP-10482) • Q3 Annual Review Cycle • ISO 27001 & Statutory compliance'
              : role === 'manager'
              ? 'Platform & Cloud Desk (18 members) • Direct reports appraisal queue'
              : 'Q3 Annual Appraisal Cycle • ISO 27001 & Statutory mandatory courses'}
          </p>
        </div>

        {role === 'hr_admin' && (
          <button
            onClick={() => showToast({ type: 'info', message: 'Downloading Q3 Bell Curve Calibration Master Report (.xlsx)' })}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px] transition-colors"
          >
            <Download size={13} strokeWidth={1.7} />
            <span>Calibration export</span>
          </button>
        )}
      </div>

      {/* Role-Specific Metric Tiles */}
      {role === 'employee' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Overall Q3 goal progress</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              88.8%
            </div>
            <span className="text-[11px] text-[var(--success-text)] font-medium">Exceeds target benchmark</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Active OKRs</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              4 Goals
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">1 Completed • 3 On Track</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Statutory certifications</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--success-text)] tabular-nums">
              3 / 4 Done
            </div>
            <span className="text-[11px] text-[var(--warning-text)]">POSH Act due 15 Dec</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Self-appraisal status</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              Submitted
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Manager review: Tomorrow</span>
          </div>
        </div>
      ) : role === 'manager' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Team review completion</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              14 / 18
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">4 reviews awaiting sign-off</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Team top talent (9-Box)</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--success-text)] tabular-nums">
              4 Members
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">High Potential / Stars</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Mandatory InfoSec certified</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              100%
            </div>
            <span className="text-[11px] text-[var(--success-text)]">18 / 18 Compliant</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Promotion candidates</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              2
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Ananya Iyer (L6), Amit Joshi (L5)</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Review completion rate</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              78.4%
            </div>
            <span className="text-[11px] text-[var(--success-text)] font-medium">1,007 of 1,284 completed</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">9-Box top talent (Box 1 & 2)</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              18.2%
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">234 High Potential leaders</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Mandatory InfoSec certified</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
              97.2%
            </div>
            <span className="text-[11px] text-[var(--warning-text)]">36 pending before 30 Nov</span>
          </div>

          <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Appraisal bonus pool</span>
            <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
              ₹1.45 Cr
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">Q3 Disbursal ready</span>
          </div>
        </div>
      )}

      {/* Segmented Control Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px] overflow-x-auto">
        {role === 'employee' ? (
          <>
            <button
              onClick={() => setActiveTab('my_goals')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'my_goals'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              My Q3 Goals & OKRs (4)
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'compliance'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Mandatory statutory compliance learning (4)
            </button>
          </>
        ) : role === 'manager' ? (
          <>
            <button
              onClick={() => setActiveTab('team_reviews')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'team_reviews'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Team appraisal reviews (4 pending)
            </button>
            <button
              onClick={() => setActiveTab('talent_matrix')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'talent_matrix'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Team 9-Box talent matrix
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'compliance'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Team compliance status
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Appraisal calibration & bell curve
            </button>
            <button
              onClick={() => setActiveTab('talent_matrix')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'talent_matrix'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              9-Box succession grid
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1 rounded-[5px] font-medium whitespace-nowrap transition-colors ${
                activeTab === 'compliance'
                  ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Mandatory statutory certifications (4)
            </button>
          </>
        )}
      </div>

      {/* View 1: Employee Personal OKRs */}
      {activeTab === 'my_goals' && (
        <div className="space-y-3">
          {ANANYA_GOALS.map((goal) => (
            <div
              key={goal.id}
              className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-[13px] text-[var(--text-primary)]">{goal.title}</span>
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{goal.category} • Weightage: {goal.weightagePct}%</div>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="font-mono font-semibold text-[var(--brand-primary)] text-[13px]">{goal.currentProgressPct}%</span>
                  <span className={`font-medium ${goal.status === 'Completed' ? 'text-[var(--success-text)]' : 'text-[var(--brand-primary)]'}`}>
                    {goal.status}
                  </span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--brand-primary)] rounded-full transition-all" style={{ width: `${goal.currentProgressPct}%` }} />
              </div>

              <div className="text-[11px] text-[var(--text-secondary)]">
                Target: {goal.targetMetric}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Team Reviews (Manager) */}
      {activeTab === 'team_reviews' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  <th className="py-2.5 px-4 font-medium">Employee</th>
                  <th className="py-2.5 px-4 font-medium">Designation</th>
                  <th className="py-2.5 px-4 font-medium">Self-rating</th>
                  <th className="py-2.5 px-4 font-medium">Manager rating</th>
                  <th className="py-2.5 px-4 font-medium">Promotion flag</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Ananya Iyer</td>
                  <td className="py-2.5 px-4 text-[var(--text-secondary)]">Senior Software Engineer</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--text-primary)]">4.8 / 5.0</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-[var(--brand-primary)]">4.9 / 5.0</td>
                  <td className="py-2.5 px-4 text-[var(--success-text)] font-medium">Recommended for Band L6</td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => showToast({ type: 'success', message: 'Finalized Q3 appraisal rating for Ananya Iyer' })}
                      className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline"
                    >
                      Sign off review
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Rohan Mehta</td>
                  <td className="py-2.5 px-4 text-[var(--text-secondary)]">Lead Compliance Officer</td>
                  <td className="py-2.5 px-4 font-mono text-[var(--text-primary)]">4.6 / 5.0</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-[var(--brand-primary)]">4.7 / 5.0</td>
                  <td className="py-2.5 px-4 text-[var(--text-secondary)]">Lateral Band retention</td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => showToast({ type: 'success', message: 'Finalized Q3 appraisal rating for Rohan Mehta' })}
                      className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline"
                    >
                      Sign off review
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Bell Curve Calibration (Admin) */}
      {activeTab === 'reviews' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Q3 Appraisal Rating Distribution vs Target Forced Bell Curve
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Calibrated across 1,284 eligible employees (Probation staff excluded)
              </p>
            </div>
            <span className="text-[11px] font-mono text-[var(--success-text)] font-medium">Within 1.2% Target Variance</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-[12px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-center space-y-1">
              <span className="text-[11px] text-[var(--danger-text)] font-semibold block">Far Below (1.0–2.4)</span>
              <div className="text-[20px] font-bold font-mono text-[var(--text-primary)]">2.1%</div>
              <span className="text-[10px] text-[var(--text-tertiary)] block">Target: 2.0% (27 emps)</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-center space-y-1">
              <span className="text-[11px] text-[var(--warning-text)] font-semibold block">Needs Imp (2.5–3.2)</span>
              <div className="text-[20px] font-bold font-mono text-[var(--text-primary)]">7.8%</div>
              <span className="text-[10px] text-[var(--text-tertiary)] block">Target: 8.0% (100 emps)</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-center space-y-1">
              <span className="text-[11px] text-[var(--text-secondary)] font-semibold block">Meets (3.3–4.2)</span>
              <div className="text-[20px] font-bold font-mono text-[var(--brand-primary)]">64.5%</div>
              <span className="text-[10px] text-[var(--text-tertiary)] block">Target: 64.0% (828 emps)</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-center space-y-1">
              <span className="text-[11px] text-[var(--success-text)] font-semibold block">Exceeds (4.3–4.7)</span>
              <div className="text-[20px] font-bold font-mono text-[var(--text-primary)]">19.8%</div>
              <span className="text-[10px] text-[var(--text-tertiary)] block">Target: 20.0% (254 emps)</span>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded text-center space-y-1">
              <span className="text-[11px] text-[var(--brand-primary)] font-semibold block">Outstanding (4.8–5.0)</span>
              <div className="text-[20px] font-bold font-mono text-[var(--text-primary)]">5.8%</div>
              <span className="text-[10px] text-[var(--text-tertiary)] block">Target: 6.0% (75 emps)</span>
            </div>
          </div>
        </div>
      )}

      {/* View 4: 9-Box Grid */}
      {activeTab === 'talent_matrix' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                McKinsey-GE 9-Box Potential vs Performance Grid
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Succession candidates, key retention risks & executive bench strength
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded min-h-[90px]">
              <span className="text-[var(--brand-primary)] font-bold block">Box 1: Future CXO / Star</span>
              <span className="text-[var(--text-secondary)] block mt-1">High Potential • High Perf</span>
              <strong className="text-[14px] font-mono block mt-2 text-[var(--text-primary)]">84 leaders</strong>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded min-h-[90px]">
              <span className="text-[var(--brand-primary)] font-bold block">Box 2: High Performer</span>
              <span className="text-[var(--text-secondary)] block mt-1">Medium Potential • High Perf</span>
              <strong className="text-[14px] font-mono block mt-2 text-[var(--text-primary)]">150 leaders</strong>
            </div>

            <div className="p-3 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded min-h-[90px]">
              <span className="text-[var(--text-secondary)] font-bold block">Box 3: Expert Specialist</span>
              <span className="text-[var(--text-tertiary)] block mt-1">Low Potential • High Perf</span>
              <strong className="text-[14px] font-mono block mt-2 text-[var(--text-primary)]">128 leaders</strong>
            </div>
          </div>
        </div>
      )}

      {/* View 5: Mandatory Compliance Learning */}
      {activeTab === 'compliance' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Statutory Mandatory Learning & Regulatory Certifications
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                ISO 27001 InfoSec, POSH Act 2013, OWASP & DPDP Act
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.title}
                className="p-3.5 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-lg space-y-2 text-[12px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-[var(--text-primary)]">{course.title}</div>
                  <div className="text-[11px] font-mono text-[var(--warning-text)]">Due: {course.dueDate}</div>
                </div>

                <div className="text-[11px] text-[var(--text-secondary)]">
                  Authority: {course.regulatoryBody} • Audience: {course.mandatoryFor}
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                  {role === 'employee' ? (
                    course.employeeStatus === 'Completed' ? (
                      <span className="text-[var(--success-text)] font-semibold flex items-center space-x-1">
                        <CheckCircle2 size={12} />
                        <span>Certified for FY 2026-27</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleLaunchCourse(course.title)}
                        className="px-2.5 py-1 text-[11px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded transition-colors flex items-center space-x-1"
                      >
                        <BookOpen size={11} />
                        <span>Launch & complete certification</span>
                      </button>
                    )
                  ) : (
                    <>
                      <span className="font-mono tabular-nums text-[var(--text-primary)]">
                        {course.completedCount} of {course.totalCount} completed ({course.pct}%)
                      </span>
                      <button
                        onClick={() => handleSendReminder(course.title)}
                        className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline"
                      >
                        Send reminder to pending staff
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
