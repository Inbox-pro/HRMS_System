import { useState } from 'react';
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import type { EmployeeBrief, UserRole } from '../../types';
import { useToast } from '../common/Toast';

interface PeoplePageProps {
  onSelectEmployee: (empId: string) => void;
  role: UserRole;
}

interface DirectoryEmployee extends EmployeeBrief {
  status: 'Confirmed' | 'Probation' | 'Notice Period';
  joiningDate: string;
  reportingManager: string;
  ytdAttendancePct: number;
  salaryBand: string;
  phone: string;
}

const DIRECTORY_DATA: DirectoryEmployee[] = [
  {
    id: 'emp-10482',
    name: 'Ananya Iyer',
    employeeCode: 'EMP-10482',
    role: 'AVP, Equity Research',
    department: 'Investment Banking',
    location: 'Mumbai (BKC HQ)',
    initials: 'AI',
    email: 'ananya.iyer@acmefin.in',
    phone: '+91 98201 44521',
    joiningDate: '14 Jan 2022',
    reportingManager: 'Vikramaditya Singhania',
    status: 'Confirmed',
    ytdAttendancePct: 96.8,
    salaryBand: 'Band L5',
  },
  {
    id: 'emp-10931',
    name: 'Rohan Mehta',
    employeeCode: 'EMP-10931',
    role: 'Lead Compliance Officer',
    department: 'Legal & Regulatory',
    location: 'Mumbai (Nariman Pt)',
    initials: 'RM',
    email: 'rohan.mehta@acmefin.in',
    phone: '+91 97112 88390',
    joiningDate: '27 Nov 2023',
    reportingManager: 'Sunil Kulkarni',
    status: 'Confirmed',
    ytdAttendancePct: 97.4,
    salaryBand: 'Band L4',
  },
  {
    id: 'emp-10214',
    name: 'Vikram Patel',
    employeeCode: 'EMP-10214',
    role: 'VP, Infrastructure & SecOps',
    department: 'Technology Infrastructure',
    location: 'Pune (Hinjawadi)',
    initials: 'VP',
    email: 'vikram.patel@acmefin.in',
    phone: '+91 94220 51920',
    joiningDate: '25 Nov 2021',
    reportingManager: 'Nitin Rao (CTO)',
    status: 'Confirmed',
    ytdAttendancePct: 98.1,
    salaryBand: 'Band L6',
  },
  {
    id: 'emp-11309',
    name: 'Amit Joshi',
    employeeCode: 'EMP-11309',
    role: 'Senior Backend Architect',
    department: 'Technology Infrastructure',
    location: 'Pune (Hinjawadi)',
    initials: 'AJ',
    email: 'amit.joshi@acmefin.in',
    phone: '+91 98904 12389',
    joiningDate: '10 Mar 2024',
    reportingManager: 'Vikram Patel',
    status: 'Confirmed',
    ytdAttendancePct: 94.2,
    salaryBand: 'Band L4',
  },
  {
    id: 'emp-10822',
    name: 'Pooja Agarwal',
    employeeCode: 'EMP-10822',
    role: 'Chief Financial Officer',
    department: 'Finance & Treasury',
    location: 'Mumbai (BKC HQ)',
    initials: 'PA',
    email: 'pooja.agarwal@acmefin.in',
    phone: '+91 98200 90123',
    joiningDate: '01 Aug 2020',
    reportingManager: 'Arjun Singhania (MD)',
    status: 'Confirmed',
    ytdAttendancePct: 99.0,
    salaryBand: 'Band L8',
  },
  {
    id: 'emp-11048',
    name: 'Farah Sheikh',
    employeeCode: 'EMP-11048',
    role: 'Derivatives Risk Analyst',
    department: 'Risk & Quant Analytics',
    location: 'Mumbai (BKC HQ)',
    initials: 'FS',
    email: 'farah.sheikh@acmefin.in',
    phone: '+91 98192 33412',
    joiningDate: '05 May 2024',
    reportingManager: 'Aditya Sen',
    status: 'Probation',
    ytdAttendancePct: 95.6,
    salaryBand: 'Band L3',
  },
  {
    id: 'emp-10773',
    name: 'Priya Nambiar',
    employeeCode: 'EMP-10773',
    role: 'Senior Wealth Manager',
    department: 'Wealth Management',
    location: 'Bengaluru (ORR)',
    initials: 'PN',
    email: 'priya.nambiar@acmefin.in',
    phone: '+91 99801 77652',
    joiningDate: '18 Oct 2022',
    reportingManager: 'Rajesh Sanghvi',
    status: 'Confirmed',
    ytdAttendancePct: 93.4,
    salaryBand: 'Band L4',
  },
  {
    id: 'emp-11512',
    name: 'Devendra Kothari',
    employeeCode: 'EMP-11512',
    role: 'Quantitative Modeler',
    department: 'Risk & Quant Analytics',
    location: 'Bengaluru (ORR)',
    initials: 'DK',
    email: 'devendra.k@acmefin.in',
    phone: '+91 97411 99281',
    joiningDate: '02 Sep 2024',
    reportingManager: 'Aditya Sen',
    status: 'Probation',
    ytdAttendancePct: 97.0,
    salaryBand: 'Band L3',
  },
];

interface OrgNode {
  id: string;
  name: string;
  role: string;
  dept: string;
  location: string;
  initials: string;
  directReportsCount: number;
  totalTeamCount: number;
  subordinates?: OrgNode[];
}

const ORG_TREE: OrgNode = {
  id: 'emp-10001',
  name: 'Arjun Singhania',
  role: 'Managing Director & CEO',
  dept: 'Executive Committee',
  location: 'Mumbai (BKC HQ)',
  initials: 'AS',
  directReportsCount: 5,
  totalTeamCount: 1284,
  subordinates: [
    {
      id: 'emp-10822',
      name: 'Pooja Agarwal',
      role: 'Chief Financial Officer',
      dept: 'Finance & Treasury',
      location: 'Mumbai (BKC)',
      initials: 'PA',
      directReportsCount: 4,
      totalTeamCount: 86,
      subordinates: [
        {
          id: 'emp-10845',
          name: 'Sunil Rao',
          role: 'Head of Treasury & ALM',
          dept: 'Finance & Treasury',
          location: 'Mumbai (BKC)',
          initials: 'SR',
          directReportsCount: 8,
          totalTeamCount: 24,
        },
        {
          id: 'emp-10899',
          name: 'Kavita Sharma',
          role: 'Lead Controller, Statutory & Tax',
          dept: 'Finance & Treasury',
          location: 'Mumbai (BKC)',
          initials: 'KS',
          directReportsCount: 12,
          totalTeamCount: 38,
        },
      ],
    },
    {
      id: 'emp-10101',
      name: 'Nitin Rao',
      role: 'Chief Technology Officer',
      dept: 'Technology Infrastructure',
      location: 'Bengaluru (ORR)',
      initials: 'NR',
      directReportsCount: 4,
      totalTeamCount: 340,
      subordinates: [
        {
          id: 'emp-10214',
          name: 'Vikram Patel',
          role: 'VP, Infrastructure & SecOps',
          dept: 'Technology Infrastructure',
          location: 'Pune (Hinjawadi)',
          initials: 'VP',
          directReportsCount: 6,
          totalTeamCount: 84,
          subordinates: [
            {
              id: 'emp-11309',
              name: 'Amit Joshi',
              role: 'Senior Backend Architect',
              dept: 'Technology Infrastructure',
              location: 'Pune (Hinjawadi)',
              initials: 'AJ',
              directReportsCount: 5,
              totalTeamCount: 18,
            },
          ],
        },
        {
          id: 'emp-10288',
          name: 'Aditya Sen',
          role: 'Head of Quant Trading Tech',
          dept: 'Risk & Quant Analytics',
          location: 'Bengaluru (ORR)',
          initials: 'AS',
          directReportsCount: 6,
          totalTeamCount: 46,
          subordinates: [
            {
              id: 'emp-11512',
              name: 'Devendra Kothari',
              role: 'Quantitative Modeler',
              dept: 'Risk & Quant Analytics',
              location: 'Bengaluru (ORR)',
              initials: 'DK',
              directReportsCount: 0,
              totalTeamCount: 0,
            },
          ],
        },
      ],
    },
    {
      id: 'emp-10023',
      name: 'Vikramaditya Singhania',
      role: 'Head of Institutional Research & IB',
      dept: 'Investment Banking',
      location: 'Mumbai (BKC)',
      initials: 'VS',
      directReportsCount: 6,
      totalTeamCount: 210,
      subordinates: [
        {
          id: 'emp-10482',
          name: 'Ananya Iyer',
          role: 'AVP, Equity Research',
          dept: 'Investment Banking',
          location: 'Mumbai (BKC)',
          initials: 'AI',
          directReportsCount: 4,
          totalTeamCount: 14,
        },
        {
          id: 'emp-11048',
          name: 'Farah Sheikh',
          role: 'Derivatives Risk Analyst',
          dept: 'Risk & Quant Analytics',
          location: 'Mumbai (BKC)',
          initials: 'FS',
          directReportsCount: 2,
          totalTeamCount: 6,
        },
      ],
    },
    {
      id: 'emp-10034',
      name: 'Sunil Kulkarni',
      role: 'General Counsel & Chief Compliance',
      dept: 'Legal & Regulatory',
      location: 'Mumbai (Nariman Pt)',
      initials: 'SK',
      directReportsCount: 3,
      totalTeamCount: 48,
      subordinates: [
        {
          id: 'emp-10931',
          name: 'Rohan Mehta',
          role: 'Lead Compliance Officer',
          dept: 'Legal & Regulatory',
          location: 'Mumbai (Nariman Pt)',
          initials: 'RM',
          directReportsCount: 3,
          totalTeamCount: 12,
        },
      ],
    },
    {
      id: 'emp-10055',
      name: 'Neha Chawla',
      role: 'VP, People & Total Rewards',
      dept: 'Human Resources',
      location: 'Mumbai (BKC)',
      initials: 'NC',
      directReportsCount: 4,
      totalTeamCount: 34,
    },
  ],
};

interface OnboardingHire {
  id: string;
  name: string;
  role: string;
  dept: string;
  joiningDate: string;
  buddy: string;
  checklistProgress: number; // 0 to 5
  status: 'In Progress' | 'Ready for Day 1' | 'Completed';
  stepStates: {
    bgc: boolean;
    epfoForm11: boolean;
    assetDispatched: boolean;
    bankAccount: boolean;
    day1Orientation: boolean;
  };
}

const INITIAL_ONBOARDING: OnboardingHire[] = [
  {
    id: 'onb-1',
    name: 'Siddharth Varma',
    role: 'Quant Derivatives Strategist',
    dept: 'Risk & Quant',
    joiningDate: '01 Dec 2026',
    buddy: 'Ananya Iyer (AVP)',
    checklistProgress: 4,
    status: 'In Progress',
    stepStates: {
      bgc: true,
      epfoForm11: true,
      assetDispatched: true,
      bankAccount: true,
      day1Orientation: false,
    },
  },
  {
    id: 'onb-2',
    name: 'Meera Deshmukh',
    role: 'Senior Fixed Income Trader',
    dept: 'Investment Banking',
    joiningDate: '08 Dec 2026',
    buddy: 'Farah Sheikh',
    checklistProgress: 3,
    status: 'In Progress',
    stepStates: {
      bgc: true,
      epfoForm11: true,
      assetDispatched: true,
      bankAccount: false,
      day1Orientation: false,
    },
  },
  {
    id: 'onb-3',
    name: 'Abhishek Nair',
    role: 'DevOps & SRE Engineer',
    dept: 'Technology Infrastructure',
    joiningDate: '15 Dec 2026',
    buddy: 'Amit Joshi',
    checklistProgress: 2,
    status: 'In Progress',
    stepStates: {
      bgc: true,
      epfoForm11: true,
      assetDispatched: false,
      bankAccount: false,
      day1Orientation: false,
    },
  },
];

interface ExitEmployee {
  id: string;
  name: string;
  empCode: string;
  role: string;
  dept: string;
  resignationDate: string;
  lastWorkingDay: string;
  noticeDaysRemaining: number;
  itClearance: boolean;
  financeClearance: boolean;
  adminClearance: boolean;
  hrExitInterview: boolean;
  ffSettlementDraft: string;
  status: 'Clearance Pending' | 'Ready for F&F Settlement';
}

const INITIAL_EXITS: ExitEmployee[] = [
  {
    id: 'exit-1',
    name: 'Karan Malhotra',
    empCode: 'EMP-10619',
    role: 'Associate, Equity Sales',
    dept: 'Sales & Distribution',
    resignationDate: '01 Nov 2026',
    lastWorkingDay: '30 Nov 2026',
    noticeDaysRemaining: 7,
    itClearance: true,
    financeClearance: true,
    adminClearance: true,
    hrExitInterview: true,
    ffSettlementDraft: '₹3,42,800 (Gratuity + Encashment 8d)',
    status: 'Ready for F&F Settlement',
  },
  {
    id: 'exit-2',
    name: 'Sneha Rao',
    empCode: 'EMP-11102',
    role: 'Database Engineer',
    dept: 'Technology Infrastructure',
    resignationDate: '15 Nov 2026',
    lastWorkingDay: '15 Dec 2026',
    noticeDaysRemaining: 22,
    itClearance: false,
    financeClearance: true,
    adminClearance: false,
    hrExitInterview: false,
    ffSettlementDraft: 'Under Calculation',
    status: 'Clearance Pending',
  },
];

export function PeoplePage({ onSelectEmployee, role }: PeoplePageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'directory' | 'org_chart' | 'transitions'>('directory');

  // Directory filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Org chart state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'emp-10001': true,
    'emp-10822': true,
    'emp-10101': true,
    'emp-10023': true,
    'emp-10214': true,
  });

  // Transitions state
  const [onboardings, setOnboardings] = useState<OnboardingHire[]>(INITIAL_ONBOARDING);
  const [exits, setExits] = useState<ExitEmployee[]>(INITIAL_EXITS);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleCompleteOnboardingStep = (onbId: string, stepKey: keyof OnboardingHire['stepStates']) => {
    setOnboardings((prev) =>
      prev.map((item) => {
        if (item.id !== onbId) return item;
        const updatedSteps = { ...item.stepStates, [stepKey]: true };
        const completedCount = Object.values(updatedSteps).filter(Boolean).length;
        return {
          ...item,
          stepStates: updatedSteps,
          checklistProgress: completedCount,
          status: completedCount === 5 ? 'Ready for Day 1' : 'In Progress',
        };
      })
    );
    showToast({
      type: 'success',
      message: 'Onboarding checklist step verified and signed off.',
    });
  };

  const handleReleaseFFSettlement = (exitId: string, empName: string) => {
    setExits((prev) => prev.filter((e) => e.id !== exitId));
    showToast({
      type: 'success',
      message: `Full & Final (F&F) settlement for ${empName} approved and queued for bank disbursement.`,
    });
  };

  // Filter Directory
  const filtered = DIRECTORY_DATA.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesLoc = locationFilter === 'all' || emp.location.includes(locationFilter);
    return matchesSearch && matchesDept && matchesLoc;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Recursive Org Chart Node Renderer
  const renderOrgNode = (node: OrgNode, level: number = 0) => {
    const isExpanded = expandedNodes[node.id] ?? false;
    const hasChildren = node.subordinates && node.subordinates.length > 0;

    return (
      <div key={node.id} className="relative flex flex-col items-center">
        {/* Node Card */}
        <div
          className={`relative z-10 w-64 p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] rounded-lg shadow-xs transition-all text-left ${
            level === 0 ? 'ring-1 ring-[var(--brand-primary)]' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center font-semibold text-[11px] shrink-0">
                {node.initials}
              </div>
              <div className="truncate">
                <button
                  onClick={() => onSelectEmployee(node.id)}
                  className="font-medium text-[12px] text-[var(--text-primary)] hover:underline truncate block text-left"
                >
                  {node.name}
                </button>
                <span className="text-[10px] text-[var(--text-tertiary)] truncate block">
                  {node.role}
                </span>
              </div>
            </div>

            {hasChildren && (
              <button
                onClick={() => toggleNode(node.id)}
                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-surface-subtle)] transition-colors"
                title={isExpanded ? 'Collapse team' : 'Expand team'}
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
            <span className="truncate">{node.dept}</span>
            <span className="font-mono tabular-nums text-[var(--brand-primary)] font-medium">
              {node.totalTeamCount > 0 ? `${node.totalTeamCount} in org` : 'Individual Contributor'}
            </span>
          </div>
        </div>

        {/* Connecting Lines and Child Branches */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center mt-3 w-full">
            <div className="w-px h-4 bg-[var(--border-default)]" />
            <div className="flex justify-center items-start space-x-6 relative pt-4">
              {node.subordinates!.length > 1 && (
                <div className="absolute top-0 left-12 right-12 h-px bg-[var(--border-default)]" />
              )}
              {node.subordinates!.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  <div className="w-px h-4 bg-[var(--border-default)] absolute -top-4" />
                  {renderOrgNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and View Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
            {role === 'employee' ? 'Company Directory & Organization Hierarchy' : 'People & Employee Operations'}
          </h2>
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Acme Financial Services • 1,284 total headcount across 4 hubs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => showToast({ type: 'info', message: 'Generating Directory master register (.xlsx)' })}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-[5px] transition-colors"
          >
            <Download size={13} strokeWidth={1.7} />
            <span>Export register</span>
          </button>
          {role === 'hr_admin' && (
            <button
              onClick={() => showToast({ type: 'info', message: 'Opening New Employee Onboarding wizard' })}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
            >
              <Plus size={13} strokeWidth={1.7} />
              <span>Add employee</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Metric Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Total headcount</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
            1,284
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">1,241 confirmed • 43 probation</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">Average tenure</span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--text-primary)] tabular-nums">
            3.4 yrs
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">BFSI benchmark: 2.8 yrs</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
            {role === 'employee' ? 'Locations active' : 'Onboarding pipeline (Q3)'}
          </span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--brand-primary)] tabular-nums">
            {role === 'employee' ? '4 Hubs' : onboardings.length}
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">
            {role === 'employee' ? 'Mumbai, Pune, BLR, Surat' : 'Joining Nov–Dec 2026'}
          </span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
          <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
            {role === 'employee' ? 'My department team' : 'Pending exit clearances'}
          </span>
          <div className="mt-1 text-[22px] font-semibold text-[var(--warning-text)] tabular-nums">
            {role === 'employee' ? '14 Members' : exits.length}
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">
            {role === 'employee' ? 'Fixed Income & Research' : 'Full & Final queue active'}
          </span>
        </div>
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center space-x-1 border-b border-[var(--border-subtle)] pb-2 text-[12px]">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
            activeTab === 'directory'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Directory (1,284)
        </button>
        <button
          onClick={() => setActiveTab('org_chart')}
          className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
            activeTab === 'org_chart'
              ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Organization hierarchy (Tree)
        </button>
        {role !== 'employee' && (
          <button
            onClick={() => setActiveTab('transitions')}
            className={`px-3 py-1 rounded-[5px] font-medium transition-colors ${
              activeTab === 'transitions'
                ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Transitions: Onboarding & Exits ({onboardings.length + exits.length})
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. DIRECTORY TABLE VIEW */}
      {/* ============================================================== */}
      {activeTab === 'directory' && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search name, EMP code, designation..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-[12px] bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] focus:outline-none"
              >
                <option value="all">All departments</option>
                <option value="Investment Banking">Investment Banking</option>
                <option value="Legal & Regulatory">Legal & Regulatory</option>
                <option value="Technology Infrastructure">Technology Infrastructure</option>
                <option value="Risk & Quant Analytics">Risk & Quant Analytics</option>
                <option value="Finance & Treasury">Finance & Treasury</option>
                <option value="Wealth Management">Wealth Management</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-[12px] bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-[5px] text-[var(--text-primary)] focus:outline-none"
              >
                <option value="all">All locations</option>
                <option value="BKC">Mumbai (BKC HQ)</option>
                <option value="Nariman">Mumbai (Nariman Pt)</option>
                <option value="Hinjawadi">Pune (Hinjawadi)</option>
                <option value="Bengaluru">Bengaluru (ORR)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px] table-fixed">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                    <th className="w-56 px-3 py-2 font-medium">Employee</th>
                    <th className="w-44 px-2.5 py-2 font-medium">Designation</th>
                    <th className="w-36 px-2.5 py-2 font-medium">Department</th>
                    <th className="w-32 px-2.5 py-2 font-medium">Location</th>
                    <th className="w-36 px-2.5 py-2 font-medium">Reporting manager</th>
                    <th className="w-24 px-2.5 py-2 font-medium text-right">Attendance</th>
                    <th className="w-24 px-2.5 py-2 font-medium text-right">Status</th>
                    <th className="w-20 px-3 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {paginated.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                      <td className="w-56 px-3 py-2.5">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => onSelectEmployee(emp.id)}
                            className="w-6 h-6 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] flex items-center justify-center font-medium text-[10px] text-[var(--text-secondary)] shrink-0"
                          >
                            {emp.initials}
                          </button>
                          <div className="truncate">
                            <button
                              type="button"
                              onClick={() => onSelectEmployee(emp.id)}
                              className="font-medium text-[12px] text-[var(--text-primary)] hover:underline truncate block text-left leading-tight"
                            >
                              {emp.name}
                            </button>
                            <span className="text-[11px] text-[var(--text-tertiary)] font-mono truncate block leading-tight">
                              {emp.employeeCode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="w-44 px-2.5 py-2.5 truncate text-[var(--text-secondary)]">{emp.role}</td>
                      <td className="w-36 px-2.5 py-2.5 truncate text-[var(--text-secondary)]">{emp.department}</td>
                      <td className="w-32 px-2.5 py-2.5 truncate text-[var(--text-tertiary)]">{emp.location}</td>
                      <td className="w-36 px-2.5 py-2.5 truncate text-[var(--text-secondary)]">{emp.reportingManager}</td>
                      <td className="w-24 px-2.5 py-2.5 text-right tabular-nums font-mono text-[var(--text-primary)]">
                        {emp.ytdAttendancePct}%
                      </td>
                      <td className="w-24 px-2.5 py-2.5 text-right text-[11px] text-[var(--text-secondary)]">
                        {emp.status}
                      </td>
                      <td className="w-20 px-3 py-2.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectEmployee(emp.id)}
                          className="text-[11px] font-medium text-[var(--brand-primary)] hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-3.5 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(filtered.length, currentPage * pageSize)} of {filtered.length} employees
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-[var(--bg-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. INTERACTIVE ORGANIZATION HIERARCHY TREE */}
      {/* ============================================================== */}
      {activeTab === 'org_chart' && (
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg space-y-6 overflow-x-auto min-h-[500px]">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Acme Financial Services Leadership & Reporting Hierarchy
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Click any person to view profile drawer • Toggle arrows to expand and collapse department trees
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setExpandedNodes({
                    'emp-10001': true,
                    'emp-10822': true,
                    'emp-10101': true,
                    'emp-10023': true,
                    'emp-10034': true,
                    'emp-10214': true,
                    'emp-10288': true,
                  })
                }
                className="text-[11px] px-2 py-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded hover:bg-[var(--bg-page)] text-[var(--text-secondary)]"
              >
                Expand all
              </button>
              <button
                onClick={() => setExpandedNodes({ 'emp-10001': true })}
                className="text-[11px] px-2 py-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded hover:bg-[var(--bg-page)] text-[var(--text-secondary)]"
              >
                Collapse to executive
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-center">{renderOrgNode(ORG_TREE)}</div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. LIFECYCLE TRANSITIONS: ONBOARDING & EXITS */}
      {/* ============================================================== */}
      {activeTab === 'transitions' && (
        <div className="space-y-6">
          {/* Section A: New Joiner Onboarding */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div>
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                  Q3 Pre-boarding & New Joiner Checklist
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Background verification (IDfy), Aadhaar/PAN, EPFO Form 11, and IT MacBook M3 dispatch
                </p>
              </div>
              <span className="text-[11px] font-mono text-[var(--brand-primary)] font-medium">
                {onboardings.length} upcoming hires
              </span>
            </div>

            <div className="space-y-3">
              {onboardings.map((hire) => (
                <div
                  key={hire.id}
                  className="p-3.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-page)] space-y-3 hover:border-[var(--border-default)] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-[13px] text-[var(--text-primary)]">
                        {hire.name}
                      </span>
                      <span className="text-[12px] text-[var(--text-secondary)] ml-2">
                        • {hire.role} ({hire.dept})
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span className="text-[var(--text-tertiary)]">
                        Joining date: <strong className="text-[var(--text-primary)]">{hire.joiningDate}</strong>
                      </span>
                      <span className="text-[var(--text-tertiary)]">
                        Assigned buddy: <strong className="text-[var(--brand-primary)]">{hire.buddy}</strong>
                      </span>
                    </div>
                  </div>

                  {/* 5-step checklist pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px]">
                    <button
                      onClick={() => handleCompleteOnboardingStep(hire.id, 'bgc')}
                      className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                        hire.stepStates.bgc
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                          : 'border-dashed border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>1. BGC clearance</span>
                      {hire.stepStates.bgc && <CheckCircle2 size={12} className="text-[var(--success-text)]" />}
                    </button>

                    <button
                      onClick={() => handleCompleteOnboardingStep(hire.id, 'epfoForm11')}
                      className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                        hire.stepStates.epfoForm11
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                          : 'border-dashed border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>2. EPFO Form 11</span>
                      {hire.stepStates.epfoForm11 && <CheckCircle2 size={12} className="text-[var(--success-text)]" />}
                    </button>

                    <button
                      onClick={() => handleCompleteOnboardingStep(hire.id, 'assetDispatched')}
                      className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                        hire.stepStates.assetDispatched
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                          : 'border-dashed border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>3. MacBook & YubiKey</span>
                      {hire.stepStates.assetDispatched && <CheckCircle2 size={12} className="text-[var(--success-text)]" />}
                    </button>

                    <button
                      onClick={() => handleCompleteOnboardingStep(hire.id, 'bankAccount')}
                      className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                        hire.stepStates.bankAccount
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                          : 'border-dashed border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>4. Salary account (Kotak)</span>
                      {hire.stepStates.bankAccount && <CheckCircle2 size={12} className="text-[var(--success-text)]" />}
                    </button>

                    <button
                      onClick={() => handleCompleteOnboardingStep(hire.id, 'day1Orientation')}
                      className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                        hire.stepStates.day1Orientation
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                          : 'border-dashed border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>5. Day 1 orientation</span>
                      {hire.stepStates.day1Orientation && <CheckCircle2 size={12} className="text-[var(--success-text)]" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Offboarding Clearances & F&F Settlement */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div>
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                  Employee Exit Clearances & Full & Final (F&F) Settlement
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Notice period adherence, hardware asset recovery, gratuity eligibility (Payment of Gratuity Act 1972)
                </p>
              </div>
              <span className="text-[11px] font-mono text-[var(--warning-text)] font-medium">
                {exits.length} in notice period
              </span>
            </div>

            <div className="space-y-3">
              {exits.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-page)] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-[13px] text-[var(--text-primary)]">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-tertiary)] ml-2">
                        {item.empCode} • {item.role} ({item.dept})
                      </span>
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-[var(--danger-text)] font-medium">
                      LWD: {item.lastWorkingDay} ({item.noticeDaysRemaining} days remaining)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
                      <span>IT hardware returned</span>
                      <span className={item.itClearance ? 'text-[var(--success-text)] font-semibold' : 'text-[var(--warning-text)]'}>
                        {item.itClearance ? 'Cleared' : 'Pending'}
                      </span>
                    </div>

                    <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
                      <span>Finance advances</span>
                      <span className={item.financeClearance ? 'text-[var(--success-text)] font-semibold' : 'text-[var(--warning-text)]'}>
                        {item.financeClearance ? 'Cleared' : 'Pending'}
                      </span>
                    </div>

                    <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
                      <span>Admin access card</span>
                      <span className={item.adminClearance ? 'text-[var(--success-text)] font-semibold' : 'text-[var(--warning-text)]'}>
                        {item.adminClearance ? 'Cleared' : 'Pending'}
                      </span>
                    </div>

                    <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded flex justify-between items-center">
                      <span>HR exit interview</span>
                      <span className={item.hrExitInterview ? 'text-[var(--success-text)] font-semibold' : 'text-[var(--warning-text)]'}>
                        {item.hrExitInterview ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[12px]">
                    <div className="text-[11px] text-[var(--text-secondary)]">
                      F&F draft amount: <strong className="font-mono text-[var(--text-primary)]">{item.ffSettlementDraft}</strong>
                    </div>

                    {item.status === 'Ready for F&F Settlement' ? (
                      <button
                        onClick={() => handleReleaseFFSettlement(item.id, item.name)}
                        className="px-2.5 py-1 text-[11px] font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-[5px] transition-colors"
                      >
                        Release F&F disbursement
                      </button>
                    ) : (
                      <span className="text-[11px] text-[var(--warning-text)]">
                        Department sign-offs incomplete
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
