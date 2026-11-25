import { useState } from 'react';
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
import { AskOrbitPanel } from './components/dashboard/AskOrbitPanel';
import { EmployeeDrawer } from './components/common/EmployeeDrawer';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastProvider, useToast } from './components/common/Toast';
import { HrmsProvider, useHrms } from './context/HrmsContext';
import { LoginPage } from './components/auth/LoginPage';
import { FloatingAiRobot } from './components/common/FloatingAiRobot';

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
  MOCK_HEADCOUNT_TREND,
  MOCK_ATTRITION_DATA,
  MOCK_ATTENDANCE_WEEK,
  MOCK_HIRING_FUNNEL,
  MOCK_CELEBRATIONS,
} from './data/mockData';
import { cn } from './lib/utils';

export function DashboardContent() {
  const { showToast } = useToast();
  const {
    isAuthenticated,
    currentPath,
    role,
    activeNav,
    setActiveNav,
    sidebarCollapsed,
    setSidebarCollapsed,
    approvals,
    complianceAlerts,
    approveRequest,
    rejectRequest,
    bulkApproveRequests,
    bulkRejectRequests,
    fileCompliance,
    payrollSteps,
    kpis,
    selectedEmployeeId,
    setSelectedEmployeeId,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isAskOrbitOpen,
    setIsAskOrbitOpen,
  } = useHrms();

  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);

  // If user is not authenticated or navigated to /login, show enterprise Login Page
  if (!isAuthenticated || currentPath === '/login') {
    return <LoginPage />;
  }

  // Dynamic KPI cards based on live state
  const baseKpiData =
    role === 'manager'
      ? MANAGER_KPI_DATA
      : role === 'employee'
      ? EMPLOYEE_KPI_DATA
      : ADMIN_KPI_DATA;

  const kpiData = baseKpiData.map((k) => {
    if (k.id === 'kpi-headcount') {
      return { ...k, value: kpis.headcount.toLocaleString() };
    }
    if (k.id === 'kpi-attendance') {
      return { ...k, value: kpis.presentCount.toLocaleString() };
    }
    if (k.id === 'kpi-open-roles') {
      return { ...k, value: kpis.openRoles.toString() };
    }
    return k;
  });

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
      />

      {/* 56px Top Bar */}
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        activeNav={activeNav}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          'pt-14 transition-[padding] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] min-h-screen flex flex-col',
          sidebarCollapsed ? 'pl-16' : 'pl-60'
        )}
      >
        <div className="p-6 max-w-[1440px] w-full mx-auto space-y-6 flex-1">
          {/* PAGE ROUTING BASED ON activeNav */}
          {activeNav === 'people' && (
            <PeoplePage onSelectEmployee={(id) => setSelectedEmployeeId(id)} />
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
              {/* 1. ROW OF 4 KPI TILES */}
              <section aria-label="Workforce Key Performance Indicators">
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
                          message: `Focused workforce scope: ${metric.label}`,
                        });
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* 2 & 3. 12-COLUMN GRID: Approvals & Compliance */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex flex-col">
                  <ApprovalsTable
                    approvals={approvals}
                    onApprove={(id) => {
                      approveRequest(id);
                      showToast({ type: 'success', message: 'Approved request.' });
                    }}
                    onReject={(id) => {
                      rejectRequest(id);
                      showToast({ type: 'info', message: 'Rejected request.' });
                    }}
                    onBulkAction={(ids, action) => {
                      if (action === 'approve') bulkApproveRequests(ids);
                      else bulkRejectRequests(ids);
                      showToast({
                        type: 'success',
                        message: `Bulk ${action}d ${ids.length} requests.`,
                      });
                    }}
                    onSelectEmployee={(empId) => setSelectedEmployeeId(empId)}
                  />
                </div>

                <div className="lg:col-span-4 flex flex-col">
                  <ComplianceAlerts
                    alerts={complianceAlerts}
                    onFileCompliance={(id) => {
                      fileCompliance(id);
                      showToast({
                        type: 'success',
                        message: 'Statutory compliance return recorded as filed.',
                      });
                    }}
                  />
                </div>
              </section>

              {/* 4. ROW OF CHARTS: Main trend chart + compact ranked lists */}
              <section
                aria-label="Workforce Trends and Analytics"
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
              >
                <div className="lg:col-span-6 flex flex-col">
                  <HeadcountTrendChart data={MOCK_HEADCOUNT_TREND} />
                </div>
                <div className="lg:col-span-3 flex flex-col">
                  <AttritionChart data={MOCK_ATTRITION_DATA} />
                </div>
                <div className="lg:col-span-3 flex flex-col">
                  <AttendanceChart data={MOCK_ATTENDANCE_WEEK} />
                </div>
              </section>

              {/* 5. ROW: Operations and Culture */}
              <section
                aria-label="Operations and Culture"
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
              >
                <div className="lg:col-span-5 flex flex-col">
                  <PayrollCycleTracker steps={payrollSteps} />
                </div>

                <div className="lg:col-span-4 flex flex-col">
                  <HiringFunnel stages={MOCK_HIRING_FUNNEL} />
                </div>

                <div className="lg:col-span-3 flex flex-col">
                  <CelebrationsCard
                    celebrations={MOCK_CELEBRATIONS}
                    onSelectEmployee={(empId) => setSelectedEmployeeId(empId)}
                  />
                </div>
              </section>
            </>
          )}

          {/* Clean, authentic SaaS enterprise footer */}
          <footer className="pt-6 pb-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-tertiary)] gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-[var(--text-secondary)]">Orbit HR Enterprise v2.4</span>
              <span>•</span>
              <span>Inbox Infotech</span>
              <span>•</span>
              <span className="text-[var(--success-text)] font-medium">All systems operational</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>ISO 27001 & EPFO Compliant</span>
              <span>•</span>
              <span>256-bit AES Encryption</span>
              <span>•</span>
              <span>Security Center</span>
            </div>
          </footer>
        </div>
      </main>

      {/* Slide-over Right Panels & Global Dialogs */}
      <AskOrbitPanel
        isOpen={isAskOrbitOpen}
        onClose={() => setIsAskOrbitOpen(false)}
      />

      <EmployeeDrawer
        employeeId={selectedEmployeeId}
        onClose={() => setSelectedEmployeeId(null)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectEmployee={(empId) => setSelectedEmployeeId(empId)}
      />

      <FloatingAiRobot />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <HrmsProvider>
        <DashboardContent />
      </HrmsProvider>
    </ToastProvider>
  );
}
