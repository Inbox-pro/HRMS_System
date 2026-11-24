import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  ApprovalRequest,
  ComplianceDeadline,
  Celebration,
} from '../types';
import {
  MOCK_APPROVALS,
  MOCK_COMPLIANCE_ALERTS,
  MOCK_PAYROLL_STEPS,
  MOCK_CELEBRATIONS,
} from '../data/mockData';

export interface DirectoryEmployee {
  id: string;
  name: string;
  employeeCode: string;
  role: string;
  department: string;
  location: string;
  initials: string;
  email: string;
  phone: string;
  joiningDate: string;
  reportingManager: string;
  status: 'Confirmed' | 'Probation' | 'Notice Period';
  ytdAttendancePct: number;
  salaryBand: string;
  directReportsCount?: number;
  annualCTC?: string;
  bankAccount?: string;
  panNumber?: string;
  uanNumber?: string;
  leaveBalance?: {
    casual: number;
    earned: number;
    sick: number;
  };
}

export interface BiometricPunch {
  id: string;
  empId: string;
  empName: string;
  empCode: string;
  terminal: string;
  inTime: string;
  outTime: string;
  workHours: string;
  overtimeHours: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Missed Punch';
  date: string;
}

export interface RequisitionItem {
  id: string;
  roleTitle: string;
  department: string;
  hiringManager: string;
  location: string;
  targetBudget: string;
  activeCandidates: number;
  daysOpen: number;
  priority: 'Urgent' | 'Normal';
  status: 'Open' | 'Final Round' | 'Offer Drafting' | 'Closed';
}

export interface CandidateItem {
  id: string;
  name: string;
  currentCompany: string;
  applyingFor: string;
  stage: 'Screening' | 'AI Phone Screen' | 'Technical Bar-Raiser' | 'Partner Round' | 'Offer Extended' | 'Hired' | 'Archived';
  rating: string;
  noticePeriod: string;
  expectedCTC: string;
  location: string;
  email?: string;
  phone?: string;
  appliedDate?: string;
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

export interface NotificationItem {
  id: string;
  title: string;
  text: string;
  time: string;
  urgent: boolean;
  category: 'compliance' | 'approval' | 'system' | 'payroll';
  read: boolean;
}

// Initial seed data
const SEED_EMPLOYEES: DirectoryEmployee[] = [
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
    salaryBand: 'Band L5 (Executive)',
    directReportsCount: 4,
    annualCTC: '₹34,00,000',
    panNumber: 'ABCPI8821K',
    uanNumber: '101482910482',
    leaveBalance: { casual: 4.5, earned: 12.0, sick: 6.0 },
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
    salaryBand: 'Band L4 (Senior)',
    directReportsCount: 2,
    annualCTC: '₹26,00,000',
    panNumber: 'BPMPM9912L',
    uanNumber: '101931882012',
    leaveBalance: { casual: 5.0, earned: 14.5, sick: 7.0 },
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
    salaryBand: 'Band L6 (VP)',
    directReportsCount: 16,
    annualCTC: '₹48,00,000',
    panNumber: 'AVBPP1120K',
    uanNumber: '101214009182',
    leaveBalance: { casual: 6.0, earned: 18.0, sick: 8.0 },
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
    salaryBand: 'Band L4 (Senior)',
    directReportsCount: 3,
    annualCTC: '₹31,00,000',
    leaveBalance: { casual: 3.0, earned: 8.0, sick: 5.0 },
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
    salaryBand: 'Band L8 (Executive VP)',
    directReportsCount: 22,
    annualCTC: '₹85,00,000',
    leaveBalance: { casual: 8.0, earned: 24.0, sick: 10.0 },
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
    salaryBand: 'Band L3 (Associate)',
    directReportsCount: 0,
    annualCTC: '₹19,50,000',
    leaveBalance: { casual: 2.5, earned: 4.0, sick: 4.0 },
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
    salaryBand: 'Band L4 (Senior)',
    directReportsCount: 5,
    annualCTC: '₹28,50,000',
    leaveBalance: { casual: 4.0, earned: 11.0, sick: 5.5 },
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
    joiningDate: '12 Sep 2024',
    reportingManager: 'Aditya Sen',
    status: 'Probation',
    ytdAttendancePct: 91.8,
    salaryBand: 'Band L3 (Associate)',
    directReportsCount: 0,
    annualCTC: '₹22,00,000',
    leaveBalance: { casual: 2.0, earned: 3.5, sick: 3.0 },
  },
];

const SEED_PUNCHES: BiometricPunch[] = [
  {
    id: 'p-1',
    empId: 'emp-10482',
    empName: 'Ananya Iyer',
    empCode: 'EMP-10482',
    terminal: 'BKC HQ - Main Turnstile 02',
    inTime: '09:12 AM',
    outTime: '06:45 PM',
    workHours: '9h 33m',
    overtimeHours: '0h 33m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-2',
    empId: 'emp-10931',
    empName: 'Rohan Mehta',
    empCode: 'EMP-10931',
    terminal: 'Nariman Pt - Terminal 01',
    inTime: '08:58 AM',
    outTime: '06:15 PM',
    workHours: '9h 17m',
    overtimeHours: '0h 17m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-3',
    empId: 'emp-10214',
    empName: 'Vikram Patel',
    empCode: 'EMP-10214',
    terminal: 'Pune Hinjawadi - Gate A',
    inTime: '09:05 AM',
    outTime: '07:20 PM',
    workHours: '10h 15m',
    overtimeHours: '1h 15m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-4',
    empId: 'emp-11309',
    empName: 'Amit Joshi',
    empCode: 'EMP-11309',
    terminal: 'Pune Kalyani - Bio 03',
    inTime: '09:42 AM',
    outTime: '06:30 PM',
    workHours: '8h 48m',
    overtimeHours: '0h 00m',
    status: 'Late',
    date: '23 Nov 2026',
  },
  {
    id: 'p-5',
    empId: 'emp-11048',
    empName: 'Farah Sheikh',
    empCode: 'EMP-11048',
    terminal: 'BKC HQ - Fl 8 Turnstile A',
    inTime: '09:02 AM',
    outTime: '06:10 PM',
    workHours: '9h 08m',
    overtimeHours: '0h 08m',
    status: 'Present',
    date: '23 Nov 2026',
  },
  {
    id: 'p-6',
    empId: 'emp-10773',
    empName: 'Priya Nambiar',
    empCode: 'EMP-10773',
    terminal: 'Bengaluru ORR - Reception',
    inTime: '09:15 AM',
    outTime: '06:20 PM',
    workHours: '9h 05m',
    overtimeHours: '0h 05m',
    status: 'Present',
    date: '23 Nov 2026',
  },
];

const SEED_REQUISITIONS: RequisitionItem[] = [
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
];

const SEED_CANDIDATES: CandidateItem[] = [
  {
    id: 'cand-01',
    name: 'Karan Malhotra',
    currentCompany: 'Morgan Stanley India',
    applyingFor: 'Senior Quantitative Modeler',
    stage: 'Offer Extended',
    rating: '4.8 / 5.0',
    noticePeriod: '30 Days',
    expectedCTC: '₹41.5 LPA',
    location: 'Bengaluru',
    email: 'karan.m@gmail.com',
    phone: '+91 98450 11928',
    appliedDate: '02 Nov 2026',
  },
  {
    id: 'cand-02',
    name: 'Meera Iyer',
    currentCompany: 'Citigroup Pune',
    applyingFor: 'Lead Cloud Infrastructure Architect',
    stage: 'Partner Round',
    rating: '4.6 / 5.0',
    noticePeriod: '60 Days',
    expectedCTC: '₹34.0 LPA',
    location: 'Pune',
    email: 'meera.iyer@outlook.com',
    phone: '+91 99201 55610',
    appliedDate: '08 Nov 2026',
  },
  {
    id: 'cand-03',
    name: 'Siddharth Varma',
    currentCompany: 'Nomura Securities',
    applyingFor: 'AVP, Institutional Equity Sales',
    stage: 'Technical Bar-Raiser',
    rating: '4.4 / 5.0',
    noticePeriod: '15 Days',
    expectedCTC: '₹47.0 LPA',
    location: 'Mumbai',
    email: 'sid.varma@gmail.com',
    phone: '+91 98110 33421',
    appliedDate: '11 Nov 2026',
  },
  {
    id: 'cand-04',
    name: 'Neha Chawla',
    currentCompany: 'Deloitte Risk Advisory',
    applyingFor: 'Compliance Officer (SEBI Filings)',
    stage: 'Screening',
    rating: '4.2 / 5.0',
    noticePeriod: 'Immediate',
    expectedCTC: '₹24.0 LPA',
    location: 'Mumbai',
    email: 'neha.c@hotmail.com',
    phone: '+91 97200 44192',
    appliedDate: '18 Nov 2026',
  },
];

const SEED_TICKETS: HelpdeskTicket[] = [
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
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Statutory Compliance Alert',
    text: 'TDS Form 24Q deposit due in 14 days (Estimated ₹42.8 Lakh)',
    time: '10m ago',
    urgent: true,
    category: 'compliance',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Pending Approvals Sign-off',
    text: '3 pending leave approvals require manager sign-off before 5 PM',
    time: '45m ago',
    urgent: false,
    category: 'approval',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Candidate Offer Letter Drafted',
    text: 'Karan Malhotra accepted terms for Senior Quantitative Modeler',
    time: '2h ago',
    urgent: false,
    category: 'system',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Biometric Gateway Active',
    text: 'BKC HQ Main Turnstile 02 synced 1,192 punches successfully',
    time: '4h ago',
    urgent: false,
    category: 'system',
    read: true,
  },
];

interface HrmsContextType {
  // Authentication & Routing
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  currentPath: string;
  navigateTo: (path: string) => void;

  // Role & Global Navigation
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (d: boolean) => void;

  // Active User / Session (Ananya Iyer when employee)
  currentUser: DirectoryEmployee;
  clockedIn: boolean;
  clockInTime: string | null;
  workingMinutesToday: number;
  clockIn: (terminal?: string) => void;
  clockOut: () => void;

  // Core Data Collections
  employees: DirectoryEmployee[];
  punches: BiometricPunch[];
  approvals: ApprovalRequest[];
  complianceAlerts: ComplianceDeadline[];
  requisitions: RequisitionItem[];
  candidates: CandidateItem[];
  tickets: HelpdeskTicket[];
  notifications: NotificationItem[];
  payrollSteps: typeof MOCK_PAYROLL_STEPS;
  celebrations: Celebration[];

  // Dynamic Real-Time KPIs
  kpis: {
    headcount: number;
    presentCount: number;
    openRoles: number;
    payrollTotalStr: string;
  };

  // Actions
  addEmployee: (emp: Partial<DirectoryEmployee>) => DirectoryEmployee;
  updateEmployee: (id: string, updates: Partial<DirectoryEmployee>) => void;
  deleteEmployee: (id: string) => void;
  
  applyLeave: (leave: {
    leaveType: 'casual' | 'sick' | 'earned';
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
  }) => void;

  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  bulkApproveRequests: (ids: string[]) => void;
  bulkRejectRequests: (ids: string[]) => void;

  fileCompliance: (id: string) => void;
  
  advancePayrollStep: () => void;
  resetPayrollCycle: () => void;

  createRequisition: (req: Partial<RequisitionItem>) => RequisitionItem;
  updateCandidateStage: (candidateId: string, stage: CandidateItem['stage']) => void;
  createCandidate: (candidate: Partial<CandidateItem>) => CandidateItem;

  createTicket: (ticket: Partial<HelpdeskTicket>) => HelpdeskTicket;
  updateTicketStatus: (ticketId: string, status: HelpdeskTicket['status']) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Global Dialogs & Drawers
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAskOrbitOpen: boolean;
  setIsAskOrbitOpen: (open: boolean) => void;

  resetAllDataToDefaults: () => void;
}

const HrmsContext = createContext<HrmsContextType | undefined>(undefined);

const STORAGE_KEY = 'orbit_hrms_live_store_v1';

const PATH_TO_NAV_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/people': 'people',
  '/time_leave': 'time_leave',
  '/attendance': 'time_leave',
  '/payroll': 'payroll',
  '/hiring': 'hiring',
  '/performance': 'performance',
  '/engagement': 'engagement',
  '/insights': 'insights',
  '/helpdesk': 'helpdesk',
};

const NAV_TO_PATH_MAP: Record<string, string> = {
  dashboard: '/dashboard',
  people: '/people',
  time_leave: '/attendance',
  payroll: '/payroll',
  hiring: '/hiring',
  performance: '/performance',
  engagement: '/engagement',
  insights: '/insights',
  helpdesk: '/helpdesk',
};

export function HrmsProvider({ children }: { children: React.ReactNode }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(`${STORAGE_KEY}_auth`);
      return savedAuth !== null ? JSON.parse(savedAuth) : true;
    } catch {
      return true;
    }
  });

  // Real URL path routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '/' ? path : '/dashboard';
    }
    return '/dashboard';
  });

  // Role & Nav
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem(`${STORAGE_KEY}_role`);
      return (savedRole as UserRole) || 'hr_admin';
    } catch {
      return 'hr_admin';
    }
  });

  const [activeNav, setActiveNavState] = useState<string>(() => {
    const initialNav = PATH_TO_NAV_MAP[currentPath] || 'dashboard';
    return initialNav;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Navigate function that updates URL and history
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', path);
      } catch {}
    }
    const nav = PATH_TO_NAV_MAP[path];
    if (nav) {
      setActiveNavState(nav);
    }
  };

  const setActiveNav = (nav: string) => {
    setActiveNavState(nav);
    const path = NAV_TO_PATH_MAP[nav] || `/${nav}`;
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', path);
      } catch {}
    }
  };

  // Sync browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/dashboard';
      setCurrentPath(path);
      const nav = PATH_TO_NAV_MAP[path];
      if (nav) {
        setActiveNavState(nav);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save auth & role to storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_auth`, JSON.stringify(isAuthenticated));
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_role`, role);
    } catch {}
  }, [role]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const login = (newRole: UserRole, _email?: string) => {
    setIsAuthenticated(true);
    setRole(newRole);
    navigateTo('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigateTo('/login');
  };

  // Overlays
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAskOrbitOpen, setIsAskOrbitOpen] = useState(false);

  // Clock status
  const [clockedIn, setClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState<string | null>('09:12 AM');
  const [workingMinutesToday, setWorkingMinutesToday] = useState(384); // 6h 24m

  // Live collections
  const [employees, setEmployees] = useState<DirectoryEmployee[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_employees`);
      return saved ? JSON.parse(saved) : SEED_EMPLOYEES;
    } catch {
      return SEED_EMPLOYEES;
    }
  });

  const [punches, setPunches] = useState<BiometricPunch[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_punches`);
      return saved ? JSON.parse(saved) : SEED_PUNCHES;
    } catch {
      return SEED_PUNCHES;
    }
  });

  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_approvals`);
      return saved ? JSON.parse(saved) : MOCK_APPROVALS;
    } catch {
      return MOCK_APPROVALS;
    }
  });

  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceDeadline[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_compliance`);
      return saved ? JSON.parse(saved) : MOCK_COMPLIANCE_ALERTS;
    } catch {
      return MOCK_COMPLIANCE_ALERTS;
    }
  });

  const [requisitions, setRequisitions] = useState<RequisitionItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_requisitions`);
      return saved ? JSON.parse(saved) : SEED_REQUISITIONS;
    } catch {
      return SEED_REQUISITIONS;
    }
  });

  const [candidates, setCandidates] = useState<CandidateItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_candidates`);
      return saved ? JSON.parse(saved) : SEED_CANDIDATES;
    } catch {
      return SEED_CANDIDATES;
    }
  });

  const [tickets, setTickets] = useState<HelpdeskTicket[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
      return saved ? JSON.parse(saved) : SEED_TICKETS;
    } catch {
      return SEED_TICKETS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  const [payrollSteps, setPayrollSteps] = useState(MOCK_PAYROLL_STEPS);
  const [celebrations] = useState<Celebration[]>(MOCK_CELEBRATIONS);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
    } catch {
      // quota or private mode fallback
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_punches`, JSON.stringify(punches));
    } catch {}
  }, [punches]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_approvals`, JSON.stringify(approvals));
    } catch {}
  }, [approvals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_compliance`, JSON.stringify(complianceAlerts));
    } catch {}
  }, [complianceAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_requisitions`, JSON.stringify(requisitions));
    } catch {}
  }, [requisitions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_candidates`, JSON.stringify(candidates));
    } catch {}
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Working live timer when clocked in
  useEffect(() => {
    if (!clockedIn) return;
    const interval = setInterval(() => {
      setWorkingMinutesToday((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, [clockedIn]);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamic persona matching active user context
  const currentUser =
    role === 'manager'
      ? employees.find((e) => e.id === 'emp-10214') || employees[0]
      : role === 'hr_admin'
      ? employees.find((e) => e.id === 'emp-10822') || employees[0]
      : employees.find((e) => e.id === 'emp-10482') || employees[0];

  // Dynamic KPIs computed from live state
  const kpis = {
    headcount: 1280 + employees.length - 8,
    presentCount: 1190 + (clockedIn ? 1 : 0),
    openRoles: requisitions.filter((r) => r.status !== 'Closed').length,
    payrollTotalStr: '₹4.82 Cr',
  };

  // Actions
  const clockIn = (terminal = 'BKC HQ - Main Turnstile 02') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClockedIn(true);
    setClockInTime(timeStr);

    const newPunch: BiometricPunch = {
      id: `p-${Date.now()}`,
      empId: currentUser.id,
      empName: currentUser.name,
      empCode: currentUser.employeeCode,
      terminal,
      inTime: timeStr,
      outTime: '—',
      workHours: 'In Progress',
      overtimeHours: '0h 00m',
      status: 'Present',
      date: '23 Nov 2026 (Today)',
    };

    setPunches((prev) => [newPunch, ...prev.filter((p) => p.empId !== currentUser.id)]);
  };

  const clockOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClockedIn(false);

    const hours = Math.floor(workingMinutesToday / 60);
    const mins = workingMinutesToday % 60;
    const workHoursStr = `${hours}h ${mins}m`;

    setPunches((prev) =>
      prev.map((p) => {
        if (p.empId === currentUser.id && p.outTime === '—') {
          return {
            ...p,
            outTime: timeStr,
            workHours: workHoursStr,
          };
        }
        return p;
      })
    );
  };

  const addEmployee = (emp: Partial<DirectoryEmployee>): DirectoryEmployee => {
    const newEmp: DirectoryEmployee = {
      id: `emp-${Date.now().toString().slice(-5)}`,
      name: emp.name || 'New Employee',
      employeeCode: emp.employeeCode || `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
      role: emp.role || 'Associate',
      department: emp.department || 'Operations',
      location: emp.location || 'Mumbai (BKC HQ)',
      initials: (emp.name || 'NE')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      email: emp.email || 'employee@acmefin.in',
      phone: emp.phone || '+91 98000 00000',
      joiningDate: emp.joiningDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reportingManager: emp.reportingManager || 'Vikramaditya Singhania',
      status: emp.status || 'Confirmed',
      ytdAttendancePct: 100,
      salaryBand: emp.salaryBand || 'Band L3',
      directReportsCount: 0,
      annualCTC: emp.annualCTC || '₹18,00,000',
      leaveBalance: { casual: 6, earned: 12, sick: 6 },
    };

    setEmployees((prev) => [newEmp, ...prev]);

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Employee Onboarded',
        text: `${newEmp.name} (${newEmp.employeeCode}) added to ${newEmp.department}`,
        time: 'Just now',
        urgent: false,
        category: 'system',
        read: false,
      },
      ...prev,
    ]);

    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<DirectoryEmployee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const applyLeave = (leave: {
    leaveType: 'casual' | 'sick' | 'earned';
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
  }) => {
    // Deduct leave balance
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === currentUser.id && e.leaveBalance) {
          return {
            ...e,
            leaveBalance: {
              ...e.leaveBalance,
              [leave.leaveType]: Math.max(0, e.leaveBalance[leave.leaveType] - leave.days),
            },
          };
        }
        return e;
      })
    );

    // Create approval item
    const newApproval: ApprovalRequest = {
      id: `appr-${Date.now()}`,
      type: 'leave',
      title: `${leave.days} Day${leave.days > 1 ? 's' : ''} ${leave.leaveType.toUpperCase()} Leave Request`,
      employee: {
        id: currentUser.id,
        name: currentUser.name,
        employeeCode: currentUser.employeeCode,
        role: currentUser.role,
        department: currentUser.department,
        location: currentUser.location,
        initials: currentUser.initials,
        email: currentUser.email,
      },
      submittedAt: 'Just now',
      status: 'pending',
      primaryMetric: `${leave.days} day${leave.days > 1 ? 's' : ''}`,
      details: {
        category: `${leave.leaveType.toUpperCase()} Leave`,
        description: leave.reason || 'Personal / Medical leave request',
        startDate: leave.startDate,
        endDate: leave.endDate,
        recommender: currentUser.reportingManager,
      },
    };

    setApprovals((prev) => [newApproval, ...prev]);

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Leave Application Submitted',
        text: `${leave.days} days ${leave.leaveType} leave routed to ${currentUser.reportingManager}`,
        time: 'Just now',
        urgent: false,
        category: 'approval',
        read: false,
      },
      ...prev,
    ]);
  };

  const approveRequest = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a))
    );
  };

  const rejectRequest = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' as const } : a))
    );
  };

  const bulkApproveRequests = (ids: string[]) => {
    setApprovals((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'approved' as const } : a))
    );
  };

  const bulkRejectRequests = (ids: string[]) => {
    setApprovals((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, status: 'rejected' as const } : a))
    );
  };

  const fileCompliance = (id: string) => {
    setComplianceAlerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'filed' as const } : c))
    );
  };

  const advancePayrollStep = () => {
    setPayrollSteps((prev) => {
      const inProgressIndex = prev.findIndex((s) => s.status === 'in_progress');
      if (inProgressIndex === -1) {
        // all done or not started
        return prev;
      }
      return prev.map((s, idx) => {
        if (idx === inProgressIndex) {
          return { ...s, status: 'completed' };
        }
        if (idx === inProgressIndex + 1) {
          return { ...s, status: 'in_progress' };
        }
        return s;
      });
    });
  };

  const resetPayrollCycle = () => {
    setPayrollSteps(MOCK_PAYROLL_STEPS);
  };

  const createRequisition = (req: Partial<RequisitionItem>): RequisitionItem => {
    const newReq: RequisitionItem = {
      id: `req-${Date.now().toString().slice(-4)}`,
      roleTitle: req.roleTitle || 'Open Position',
      department: req.department || 'Operations',
      hiringManager: req.hiringManager || 'Arjun Singhania',
      location: req.location || 'Mumbai (BKC HQ)',
      targetBudget: req.targetBudget || '₹25.0 - 30.0 LPA',
      activeCandidates: 0,
      daysOpen: 1,
      priority: req.priority || 'Normal',
      status: 'Open',
    };
    setRequisitions((prev) => [newReq, ...prev]);
    return newReq;
  };

  const updateCandidateStage = (candidateId: string, stage: CandidateItem['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage } : c))
    );
  };

  const createCandidate = (candidate: Partial<CandidateItem>): CandidateItem => {
    const newCand: CandidateItem = {
      id: `cand-${Date.now().toString().slice(-4)}`,
      name: candidate.name || 'New Candidate',
      currentCompany: candidate.currentCompany || 'Self Employed',
      applyingFor: candidate.applyingFor || 'Senior Quantitative Modeler',
      stage: candidate.stage || 'Screening',
      rating: candidate.rating || '4.5 / 5.0',
      noticePeriod: candidate.noticePeriod || '30 Days',
      expectedCTC: candidate.expectedCTC || '₹30.0 LPA',
      location: candidate.location || 'Mumbai',
      email: candidate.email || 'candidate@gmail.com',
      phone: candidate.phone || '+91 99000 00000',
      appliedDate: 'Today',
    };
    setCandidates((prev) => [newCand, ...prev]);
    return newCand;
  };

  const createTicket = (ticket: Partial<HelpdeskTicket>): HelpdeskTicket => {
    const newTkt: HelpdeskTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      ticketNumber: `HD-${Math.floor(8000 + Math.random() * 1999)}`,
      employeeName: currentUser.name,
      employeeCode: currentUser.employeeCode,
      category: ticket.category || 'Payroll & Tax',
      subject: ticket.subject || 'Support Request',
      description: ticket.description || 'Request details pending',
      priority: ticket.priority || 'Medium',
      status: 'Open',
      slaHoursLeft: ticket.priority === 'High' ? 8 : 24,
      assignedTo: 'Sunil Rao (HR Operations)',
      createdAt: 'Just now',
    };
    setTickets((prev) => [newTkt, ...prev]);
    return newTkt;
  };

  const updateTicketStatus = (ticketId: string, status: HelpdeskTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetAllDataToDefaults = () => {
    setEmployees(SEED_EMPLOYEES);
    setPunches(SEED_PUNCHES);
    setApprovals(MOCK_APPROVALS);
    setComplianceAlerts(MOCK_COMPLIANCE_ALERTS);
    setRequisitions(SEED_REQUISITIONS);
    setCandidates(SEED_CANDIDATES);
    setTickets(SEED_TICKETS);
    setNotifications(SEED_NOTIFICATIONS);
    setPayrollSteps(MOCK_PAYROLL_STEPS);
    localStorage.removeItem(`${STORAGE_KEY}_employees`);
    localStorage.removeItem(`${STORAGE_KEY}_punches`);
    localStorage.removeItem(`${STORAGE_KEY}_approvals`);
    localStorage.removeItem(`${STORAGE_KEY}_compliance`);
    localStorage.removeItem(`${STORAGE_KEY}_requisitions`);
    localStorage.removeItem(`${STORAGE_KEY}_candidates`);
    localStorage.removeItem(`${STORAGE_KEY}_tickets`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
  };

  return (
    <HrmsContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentPath,
        navigateTo,
        role,
        setRole,
        activeNav,
        setActiveNav,
        sidebarCollapsed,
        setSidebarCollapsed,
        isDarkMode,
        setIsDarkMode,
        currentUser,
        clockedIn,
        clockInTime,
        workingMinutesToday,
        clockIn,
        clockOut,
        employees,
        punches,
        approvals,
        complianceAlerts,
        requisitions,
        candidates,
        tickets,
        notifications,
        payrollSteps,
        celebrations,
        kpis,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        applyLeave,
        approveRequest,
        rejectRequest,
        bulkApproveRequests,
        bulkRejectRequests,
        fileCompliance,
        advancePayrollStep,
        resetPayrollCycle,
        createRequisition,
        updateCandidateStage,
        createCandidate,
        createTicket,
        updateTicketStatus,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        selectedEmployeeId,
        setSelectedEmployeeId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAskOrbitOpen,
        setIsAskOrbitOpen,
        resetAllDataToDefaults,
      }}
    >
      {children}
    </HrmsContext.Provider>
  );
}

export function useHrms() {
  const context = useContext(HrmsContext);
  if (!context) {
    throw new Error('useHrms must be used within an HrmsProvider');
  }
  return context;
}
