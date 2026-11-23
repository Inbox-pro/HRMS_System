import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { KpiTile } from './components/common/KpiTile';
import { ApprovalsTable } from './components/dashboard/ApprovalsTable';
import { ComplianceAlerts } from './components/dashboard/ComplianceAlerts';
import { HeadcountTrendChart } from './components/dashboard/HeadcountTrendChart';
import { AttritionChart } from './components/dashboard/AttritionChart';
import { AttendanceChart } from './components/dashboard/AttendanceChart';
import { PayrollCycleTracker } from './components/dashboard/PayrollCycleTracker';
import { HiringFunnel } from './components/dashboard/HiringFunnel';
import { CelebrationsCard } from './components/dashboard/CelebrationsCard';
import { AskOrbitEntryPoint } from './components/dashboard/AskOrbitEntryPoint';
import { AskOrbitPanel } from './components/dashboard/AskOrbitPanel';
import { EmployeeDrawer } from './components/common/EmployeeDrawer';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastProvider, useToast } from './components/common/Toast';
import { KpiSkeleton, TableSkeleton, ChartSkeleton } from './components/common/Skeleton';
import { EmptyState } from './components/common/EmptyState';
import { ErrorState } from './components/common/ErrorState';

// Sub-pages
import { PeoplePage } from './components/pages/PeoplePage';
import { TimeLeavePage } from './components/pages/TimeLeavePage';
import { PayrollPage } from './components/pages/PayrollPage';
import { HiringPage } from './components/pages/HiringPage';
import { PerformancePage } from './components/pages/PerformancePage';
import { EngagementPage } from './components/pages/EngagementPage';
import { InsightsPage } from './components/pages/InsightsPage';
import { HelpdeskPage } from './components/pages/HelpdeskPage';
import { EmployeeHome } from './components/dashboard/EmployeeHome';
import { ManagerHome } from './components/dashboard/ManagerHome';

import {
  ADMIN_KPI_DATA,
  MANAGER_KPI_DATA,
  EMPLOYEE_KPI_DATA,
  MOCK_APPROVALS,
  MOCK_COMPLIANCE_ALERTS,
  MOCK_HEADCOUNT_TREND,
  MOCK_ATTRITION_DATA,
  MOCK_ATTENDANCE_WEEK,
  MOCK_PAYROLL_STEPS,
  MOCK_HIRING_FUNNEL,
  MOCK_CELEBRATIONS,
} from './data/mockData';
import type { UserRole, ApprovalRequest, ComplianceDeadline } from './types';
import { cn } from './lib/utils';

export type DemoState = 'normal' | 'loading' | 'empty' | 'error';

export function DashboardContent() {
  const { showToast } = useToast();

  // Role and Navigation
  const [role, setRole] = useState<UserRole>('hr_admin');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Overlays
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrbitOpen, setIsOrbitOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);

  // UI state inspection for reliability testing
  const [demoState, setDemoState] = useState<DemoState>('normal');

  // Live mutable data for interactions
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(MOCK_APPROVALS);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceDeadline[]>(MOCK_COMPLIANCE_ALERTS);

  // Sync dark mode class to documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Role-specific KPIs
  const kpiData =
    role === 'manager'
      ? MANAGER_KPI_DATA
      : role === 'employee'
      ? EMPLOYEE_KPI_DATA
      : ADMIN_KPI_DATA;

  // Handlers for approvals
  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const handleBulkAction = (ids: string[], action: 'approve' | 'reject') => {
    setApprovals((prev) =>
      prev.map((item) =>
        ids.includes(item.id)
          ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
          : item
      )
    );
  };

  const handleFileCompliance = (id: string) => {
    setComplianceAlerts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'ready_to_file' as const } : item
      )
    );
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    showToast({
      type: 'info',
      message: `Switched view context to ${
        newRole === 'hr_admin'
          ? 'HR Admin (All 1,284 employees)'
          : newRole === 'manager'
          ? 'Manager (Risk & Quant Team)'
          : 'Employee (Ananya Iyer)'
      }`,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* 240px Fixed Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeNav={activeNav}
        onSelectNav={(id) => {
          setActiveNav(id);
          window.scrollTo(0, 0);
        }}
        role={role}
      />

      {/* 56px Top Bar */}
      <TopBar
        role={role}
        onRoleChange={handleRoleChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          'pt-14 transition-all duration-200 min-h-screen flex flex-col',
          sidebarCollapsed ? 'pl-16' : 'pl-60'
        )}
      >
        <div className="p-6 max-w-[1440px] w-full mx-auto space-y-6 flex-1">
          {/* Error State Global Simulation */}
          {demoState === 'error' ? (
            <div className="space-y-6">
              <ErrorState
                title="Service unreachable: Acme Financial Services HRMS API"
                message="Failed to load workforce analytics and pending approvals from master cluster. Please verify connection credentials or retry."
                onRetry={() => setDemoState('normal')}
              />
            </div>
          ) : (
            <>
              {/* PAGE ROUTING BASED ON activeNav */}
              {activeNav === 'people' && (
                <PeoplePage onSelectEmployee={(id) => setSelectedEmployeeId(id)} role={role} />
              )}

              {activeNav === 'time_leave' && (
                <TimeLeavePage onSelectEmployee={(id) => setSelectedEmployeeId(id)} role={role} />
              )}

              {activeNav === 'payroll' && <PayrollPage role={role} />}

              {activeNav === 'hiring' && <HiringPage role={role} />}

              {activeNav === 'performance' && <PerformancePage role={role} />}

              {activeNav === 'engagement' && <EngagementPage />}

              {activeNav === 'insights' && (
                <InsightsPage role={role} onBackToDashboard={() => setActiveNav('dashboard')} />
              )}

              {activeNav === 'helpdesk' && <HelpdeskPage role={role} />}

              {/* ROLE-AWARE DASHBOARD / HOME */}
              {activeNav === 'dashboard' && role === 'employee' && (
                <EmployeeHome onOpenDrawer={(id) => setSelectedEmployeeId(id)} />
              )}

              {activeNav === 'dashboard' && role === 'manager' && (
                <ManagerHome onOpenDrawer={(id) => setSelectedEmployeeId(id)} />
              )}

              {activeNav === 'dashboard' && role === 'hr_admin' && (
                <>
                  {/* ============================================================== */}
                  {/* 1. ROW OF 4 KPI TILES (Headcount, Present, Positions, Payroll) */}
                  {/* ============================================================== */}
                  <section aria-label="Workforce Key Performance Indicators">
                    {demoState === 'loading' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KpiSkeleton />
                        <KpiSkeleton />
                        <KpiSkeleton />
                        <KpiSkeleton />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpiData.map((metric) => (
                          <KpiTile
                            key={metric.id}
                            metric={metric}
                            isSelected={selectedKpiId === metric.id}
                            onClick={() => {
                              setSelectedKpiId(metric.id === selectedKpiId ? null : metric.id);
                              showToast({
                                type: 'info',
                                message: `Filtered scope for ${metric.label}`,
                              });
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </section>

                  {/* ============================================================== */}
                  {/* 2 & 3. 12-COLUMN GRID: Left (8 col) Approvals | Right (4 col) Compliance */}
                  {/* ============================================================== */}
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left 8 Columns: Needs Your Action Approvals Table */}
                    <div className="lg:col-span-8 flex flex-col">
                      {demoState === 'loading' ? (
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
                          <TableSkeleton rows={4} />
                        </div>
                      ) : demoState === 'empty' ? (
                        <EmptyState
                          title="No approvals pending"
                          description="All leave requests, expense reimbursements, contract renewals, and hiring offers have been cleared."
                          actionLabel="View archived ledger"
                          onAction={() => alert('Viewing archived ledger')}
                        />
                      ) : (
                        <ApprovalsTable
                          approvals={approvals}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onBulkAction={handleBulkAction}
                          onSelectEmployee={(empId) => setSelectedEmployeeId(empId)}
                        />
                      )}
                    </div>

                    {/* Right 4 Columns: Compliance & Deadline Alerts */}
                    <div className="lg:col-span-4 flex flex-col">
                      {demoState === 'loading' ? (
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-4">
                          <TableSkeleton rows={3} />
                        </div>
                      ) : demoState === 'empty' ? (
                        <EmptyState
                          title="No statutory filings pending"
                          description="PF ECR, ESIC returns, and TDS 24Q challans are all reconciled for this cycle."
                        />
                      ) : (
                        <ComplianceAlerts
                          alerts={complianceAlerts}
                          onFileCompliance={handleFileCompliance}
                        />
                      )}
                    </div>
                  </section>

                  {/* ============================================================== */}
                  {/* 4. ROW OF 3 CHARTS: Headcount Trend, Attrition, Attendance     */}
                  {/* ============================================================== */}
                  <section
                    aria-label="Workforce Trends and Analytics"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
                  >
                    {demoState === 'loading' ? (
                      <>
                        <ChartSkeleton />
                        <ChartSkeleton />
                        <ChartSkeleton />
                      </>
                    ) : (
                      <>
                        <HeadcountTrendChart data={MOCK_HEADCOUNT_TREND} />
                        <AttritionChart data={MOCK_ATTRITION_DATA} />
                        <AttendanceChart data={MOCK_ATTENDANCE_WEEK} />
                      </>
                    )}
                  </section>

                  {/* ============================================================== */}
                  {/* 5. ROW: Payroll Cycle Progress (5-step), Hiring Funnel, Birthdays */}
                  {/* ============================================================== */}
                  <section
                    aria-label="Operations and Culture"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                  >
                    {/* Payroll Cycle (5 columns) */}
                    <div className="lg:col-span-5 flex flex-col">
                      {demoState === 'loading' ? (
                        <ChartSkeleton />
                      ) : (
                        <PayrollCycleTracker steps={MOCK_PAYROLL_STEPS} />
                      )}
                    </div>

                    {/* Hiring Funnel (4 columns) */}
                    <div className="lg:col-span-4 flex flex-col">
                      {demoState === 'loading' ? (
                        <ChartSkeleton />
                      ) : (
                        <HiringFunnel stages={MOCK_HIRING_FUNNEL} />
                      )}
                    </div>

                    {/* Celebrations & Anniversaries (3 columns) */}
                    <div className="lg:col-span-3 flex flex-col">
                      {demoState === 'loading' ? (
                        <ChartSkeleton />
                      ) : (
                        <CelebrationsCard
                          celebrations={MOCK_CELEBRATIONS}
                          onSelectEmployee={(empId) => setSelectedEmployeeId(empId)}
                        />
                      )}
                    </div>
                  </section>

                  {/* ============================================================== */}
                  {/* 6. BOTTOM: AI Assistant Entry Point ("Ask Orbit")              */}
                  {/* ============================================================== */}
                  <section aria-label="AI Assistant Orbit">
                    <AskOrbitEntryPoint
                      onOpen={() => setIsOrbitOpen(true)}
                      onSelectPrompt={(_prompt) => {
                        setIsOrbitOpen(true);
                      }}
                    />
                  </section>
                </>
              )}
            </>
          )}

          {/* Discreet Developer State Switcher at bottom footer */}
          <footer className="pt-4 pb-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
            <span>Acme Financial Services • Orbit HR v2.4</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono">State preview:</span>
              {(['normal', 'loading', 'empty', 'error'] as DemoState[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setDemoState(st)}
                  className={cn(
                    'px-1.5 py-0.5 rounded capitalize transition-colors font-mono',
                    demoState === st
                      ? 'text-[var(--text-primary)] font-semibold underline'
                      : 'hover:text-[var(--text-secondary)]'
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </footer>
        </div>
      </main>

      {/* Slide-over Right Panels & Global Dialogs */}
      <AskOrbitPanel
        isOpen={isOrbitOpen}
        onClose={() => setIsOrbitOpen(false)}
      />

      <EmployeeDrawer
        employeeId={selectedEmployeeId}
        onClose={() => setSelectedEmployeeId(null)}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectEmployee={(empId) => setSelectedEmployeeId(empId)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
