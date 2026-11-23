export type UserRole = 'hr_admin' | 'manager' | 'employee';

export interface EmployeeBrief {
  id: string;
  name: string;
  employeeCode: string;
  role: string;
  department: string;
  location: string;
  avatar?: string;
  initials: string;
  email: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  rawValue?: number;
  comparisonLabel: string;
  trend: 'positive' | 'negative' | 'neutral';
  trendValue: string;
  sparkline: number[];
  category: 'headcount' | 'attendance' | 'hiring' | 'payroll';
  metaNote?: string;
}

export type ApprovalType = 'leave' | 'expense' | 'contract' | 'offer';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  title: string;
  employee: EmployeeBrief;
  submittedAt: string;
  status: ApprovalStatus;
  primaryMetric: string; // e.g., "₹42,500", "4 days", "12 months", "₹18.5 LPA"
  details: {
    category: string;
    description: string;
    startDate?: string;
    endDate?: string;
    attachmentCount?: number;
    receiptCount?: number;
    recommender?: string;
  };
}

export interface ComplianceDeadline {
  id: string;
  authority: 'PF' | 'ESIC' | 'TDS' | 'CONTRACT';
  title: string;
  filingType: string;
  dueDate: string;
  daysRemaining: number;
  urgency: 'high' | 'medium' | 'low';
  estimatedLiability: string;
  affectedEmployees: number;
  status: 'pending_review' | 'ready_to_file' | 'filed';
}

export interface HeadcountTrendPoint {
  month: string;
  total: number;
  hires: number;
  exits: number;
}

export interface AttritionDeptPoint {
  department: string;
  rate: number; // percentage
  exits: number;
  headcount: number;
}

export interface AttendanceDayPoint {
  day: string;
  dateStr: string;
  present: number;
  onLeave: number;
  absent: number;
  presentPct: number;
}

export interface PayrollStep {
  step: number;
  name: string;
  shortName: string;
  date: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  subtext: string;
  handledBy: string;
}

export interface HiringFunnelStage {
  stage: string;
  count: number;
  target: number;
  conversionPct: number;
  dropOffReason?: string;
}

export interface Celebration {
  id: string;
  employee: EmployeeBrief;
  type: 'birthday' | 'anniversary';
  dateStr: string;
  daysAway: number;
  yearsCount?: number;
}

export interface EmployeeProfileModal {
  id: string;
  name: string;
  employeeCode: string;
  role: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  joiningDate: string;
  reportingManager: string;
  directReportsCount: number;
  status: 'Confirmed' | 'Probation' | 'Notice Period';
  salaryBand: string;
  panNumber: string;
  uanNumber: string;
  esicNumber: string;
  leaveBalance: {
    casual: number;
    earned: number;
    sick: number;
  };
  attendanceSummary: {
    ytdPresentPct: number;
    averageCheckin: string;
    remoteDaysThisMonth: number;
  };
  recentActions: {
    date: string;
    action: string;
    status: string;
  }[];
}

export interface AskOrbitMessage {
  id: string;
  sender: 'user' | 'orbit';
  timestamp: string;
  text: string;
  sources?: string[];
  suggestedFollowups?: string[];
  actionLink?: {
    label: string;
    href: string;
  };
}
