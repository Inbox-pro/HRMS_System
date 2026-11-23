import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Check,
  LogOut,
  Shield,
  Briefcase,
  User,
} from 'lucide-react';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface TopBarProps {
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  sidebarCollapsed: boolean;
}

export function TopBar({
  role,
  onRoleChange,
  onOpenSearch,
  isDarkMode,
  onToggleTheme,
  sidebarCollapsed,
}: TopBarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: React.ElementType }> = {
    hr_admin: { title: 'HR Admin', subtitle: 'Acme Financial Services (All 1,284)', icon: Shield },
    manager: { title: 'Manager View', subtitle: 'Risk & Quant Team (18 Members)', icon: Briefcase },
    employee: { title: 'Employee View', subtitle: 'Ananya Iyer (EMP-10482)', icon: User },
  };

  const notifications = [
    { id: 'n1', text: 'TDS Form 24Q deposit due in 14 days', time: '10m ago', urgent: true },
    { id: 'n2', text: '3 pending leave approvals require sign-off', time: '45m ago', urgent: false },
    { id: 'n3', text: 'Farah Sheikh accepted offer letter draft', time: '2h ago', urgent: false },
  ];

  return (
    <header
      className={cn(
        'h-14 fixed top-0 right-0 z-20 flex items-center justify-between px-6 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] transition-all duration-200',
        sidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      {/* Left: Page Title & Context */}
      <div className="flex items-center space-x-3">
        <h1 className="text-[16px] font-semibold text-[var(--text-primary)] tracking-tight">
          Dashboard
        </h1>
        <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[var(--border-strong)]" />
        <span className="hidden sm:inline-block text-[12px] text-[var(--text-tertiary)] tabular-nums">
          Monday, 23 Nov 2026
        </span>
      </div>

      {/* Center: Global Search Bar with Ctrl+K shortcut */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-8 px-3 rounded-[6px] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] flex items-center justify-between text-[13px] text-[var(--text-tertiary)] transition-colors group"
        >
          <div className="flex items-center space-x-2">
            <Search size={15} strokeWidth={1.7} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
            <span className="text-[var(--text-secondary)]">Search employees, payroll, filings...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] shadow-xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-[6px] text-[13px] font-medium border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
            title="Switch Dashboard Role View"
          >
            {React.createElement(roleLabels[role].icon, {
              size: 15,
              strokeWidth: 1.7,
              className: 'text-[var(--brand-primary)]',
            })}
            <span className="text-[var(--text-primary)] font-semibold">{roleLabels[role].title}</span>
            <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-64 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl py-1 z-30 divide-y divide-[var(--border-subtle)] animate-in fade-in-50 duration-100">
              <div className="px-3 py-2 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Select Dashboard Role
              </div>
              {(['hr_admin', 'manager', 'employee'] as UserRole[]).map((r) => {
                const item = roleLabels[r];
                const Icon = item.icon;
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setShowRoleMenu(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--bg-surface-subtle)] transition-colors',
                      isSelected && 'bg-[var(--brand-subtle)]'
                    )}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        size={16}
                        strokeWidth={1.7}
                        className={isSelected ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}
                      />
                      <div>
                        <div className={cn('text-[13px] font-medium', isSelected ? 'text-[var(--brand-primary)] font-semibold' : 'text-[var(--text-primary)]')}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-tertiary)]">{item.subtitle}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-[var(--brand-primary)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] relative transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={18} strokeWidth={1.7} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--brand-primary)] ring-2 ring-[var(--bg-surface)]" />
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-1 w-72 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl py-1 z-30 divide-y divide-[var(--border-subtle)] animate-in fade-in-50 duration-100">
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">Notifications</span>
                <span className="text-[11px] text-[var(--brand-primary)] hover:underline cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="py-1 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-3 py-2 hover:bg-[var(--bg-surface-subtle)] text-[12px] cursor-pointer"
                  >
                    <p className="text-[var(--text-primary)] font-medium">{n.text}</p>
                    <span className="text-[11px] text-[var(--text-tertiary)] mt-0.5 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={18} strokeWidth={1.7} /> : <Moon size={18} strokeWidth={1.7} />}
        </button>

        {/* Profile Avatar / Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1 rounded-[6px] hover:bg-[var(--bg-surface-subtle)] transition-colors"
            title="User Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-medium text-[12px]">
              AI
            </div>
            <span className="text-[13px] font-medium text-[var(--text-primary)] hidden lg:inline-block">
              Ananya I.
            </span>
            <ChevronDown size={14} className="text-[var(--text-tertiary)] hidden lg:inline-block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1 w-56 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl py-1 z-30 divide-y divide-[var(--border-subtle)]">
              <div className="px-3 py-2">
                <p className="text-[13px] font-medium text-[var(--text-primary)]">Ananya Iyer</p>
                <p className="text-[11px] text-[var(--text-tertiary)]">HR Admin • Acme Fin Services</p>
              </div>
              <div className="py-1 text-[12px]">
                <button className="w-full px-3 py-1.5 text-left text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)]">
                  Account settings
                </button>
                <button className="w-full px-3 py-1.5 text-left text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)]">
                  Audit log & activity
                </button>
                <button className="w-full px-3 py-1.5 text-left text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)]">
                  Acme HR policies
                </button>
              </div>
              <div className="py-1 text-[12px]">
                <button className="w-full px-3 py-1.5 text-left text-[var(--danger)] hover:bg-[var(--danger-subtle)] flex items-center justify-between">
                  <span>Sign out</span>
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
