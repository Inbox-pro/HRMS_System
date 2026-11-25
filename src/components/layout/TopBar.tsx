import { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { useHrms } from '../../context/HrmsContext';
import { useToast } from '../common/Toast';
import { cn } from '../../lib/utils';

interface TopBarProps {
  sidebarCollapsed: boolean;
  activeNav?: string;
}

export function TopBar({
  sidebarCollapsed,
  activeNav = 'dashboard',
}: TopBarProps) {
  const {
    role,
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    isDarkMode,
    setIsDarkMode,
    setIsCommandPaletteOpen,
    setSelectedEmployeeId,
    resetAllDataToDefaults,
    logout,
  } = useHrms();

  const { showToast } = useToast();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

  const getPageTitle = () => {
    switch (activeNav) {
      case 'people':
        return role === 'employee' ? 'Company Directory' : role === 'manager' ? 'Team Directory' : 'People Operations';
      case 'time_leave':
        return role === 'employee' ? 'My Time & Attendance' : role === 'manager' ? 'Team Attendance' : 'Time & Attendance';
      case 'payroll':
        return role === 'employee' ? 'My Compensation & Tax' : role === 'manager' ? 'My Compensation' : 'Payroll & Statutory';
      case 'hiring':
        return role === 'employee' ? 'Internal Job Board (IJP)' : role === 'manager' ? 'Team Requisitions' : 'Hiring & ATS';
      case 'performance':
        return role === 'employee' ? 'My Goals & Performance' : role === 'manager' ? 'Team Reviews & Goals' : 'Performance & Bell Curve';
      case 'engagement':
        return 'Workforce Engagement';
      case 'insights':
        return 'Executive Insights';
      case 'helpdesk':
        return role === 'employee' ? 'My Service Tickets' : 'Helpdesk & Requests';
      case 'dashboard':
      default:
        return role === 'employee' ? 'Home (ESS)' : role === 'manager' ? 'Manager Hub' : 'Workforce Dashboard';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = notifFilter === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <header
      className={cn(
        'h-14 fixed top-0 right-0 z-20 flex items-center justify-between px-6 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] transition-[left] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] select-none',
        sidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      {/* Left: Page Title */}
      <div className="flex items-center shrink-0">
        <h1 className="text-[15px] font-medium text-[var(--text-primary)] tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Center: Global Search Bar with Ctrl+K shortcut */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-8 px-3 rounded-[8px] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] flex items-center justify-between text-[12px] text-[var(--text-tertiary)] transition-colors group cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search size={16} strokeWidth={1.5} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
            <span className="text-[var(--text-secondary)]">Search</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-[8px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] relative transition-colors cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={16} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-1 w-80 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl z-30 divide-y divide-[var(--border-subtle)] animate-in fade-in-50 duration-100">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--brand-primary)] text-white font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[var(--brand-primary)] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <CheckCheck size={12} />
                    <span>Read all</span>
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-[var(--text-tertiary)] hover:text-[var(--danger)] cursor-pointer"
                    title="Clear all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[var(--border-subtle)] px-3 text-[11px] font-medium bg-[var(--bg-surface-subtle)]">
                <button
                  onClick={() => setNotifFilter('all')}
                  className={cn(
                    'py-1.5 px-2 border-b-2 transition-colors cursor-pointer',
                    notifFilter === 'all'
                      ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold'
                      : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setNotifFilter('unread')}
                  className={cn(
                    'py-1.5 px-2 border-b-2 transition-colors cursor-pointer',
                    notifFilter === 'unread'
                      ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold'
                      : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-[12px] text-[var(--text-tertiary)]">
                    No notifications to display
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={cn(
                        'p-3 hover:bg-[var(--bg-surface-subtle)] text-[12px] transition-colors cursor-pointer flex items-start space-x-2.5',
                        !n.read && 'bg-[var(--brand-subtle)]'
                      )}
                    >
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
                          n.read ? 'bg-transparent' : n.urgent ? 'bg-[var(--danger)]' : 'bg-[var(--brand-primary)]'
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-[var(--text-primary)] text-[11px]">{n.title}</p>
                          <span className="text-[10px] text-[var(--text-tertiary)]">{n.time}</span>
                        </div>
                        <p className="text-[var(--text-secondary)] text-[11px] mt-0.5 leading-snug">{n.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-[8px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
        </button>

        {/* Profile Avatar & Account Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1 rounded-[8px] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
            title="User Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border border-[var(--border-default)] flex items-center justify-center font-medium text-[11px]">
              {currentUser.initials}
            </div>
            <div className="text-left hidden lg:block leading-tight">
              <span className="text-[12px] font-medium text-[var(--text-primary)] block">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-tertiary)] block">
                {currentUser.employeeCode}
              </span>
            </div>
            <ChevronDown size={14} strokeWidth={1.5} className="text-[var(--text-tertiary)] hidden lg:inline-block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1 w-60 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl py-1 z-30 divide-y divide-[var(--border-subtle)]">
              <div className="px-3 py-2.5">
                <p className="text-[12px] font-semibold text-[var(--text-primary)]">{currentUser.name}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{currentUser.role}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{currentUser.email}</p>
              </div>

              <div className="py-1 text-[12px]">
                <button
                  onClick={() => {
                    setSelectedEmployeeId(currentUser.id);
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)] flex items-center justify-between cursor-pointer"
                >
                  <span>My Profile & Leaves</span>
                  <ExternalLink size={12} />
                </button>
                <button
                  onClick={() => {
                    resetAllDataToDefaults();
                    setShowProfileMenu(false);
                    showToast({
                      type: 'info',
                      message: 'Reset enterprise state to default seed data.',
                    });
                  }}
                  className="w-full px-3 py-1.5 text-left text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)] flex items-center justify-between cursor-pointer"
                >
                  <span>Reset Demo Data</span>
                  <RotateCcw size={12} />
                </button>
              </div>

              <div className="py-1 text-[12px]">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    showToast({
                      type: 'info',
                      message: 'Signed out of Acme Enterprise workspace.',
                    });
                  }}
                  className="w-full px-3 py-1.5 text-left text-[var(--danger)] hover:bg-[var(--danger-subtle)] cursor-pointer"
                >
                  Sign Out (SSO)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
