import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  UserPlus,
  LifeBuoy,
  GraduationCap,
  HeartHandshake,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { UserRole } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeNav: string;
  onSelectNav: (id: string) => void;
  role: UserRole;
}

interface NavGroup {
  groupTitle?: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export function Sidebar({ collapsed, onToggleCollapse, activeNav, onSelectNav, role }: SidebarProps) {
  // Define Role-Based Navigation Groups
  let navGroups: NavGroup[] = [];

  if (role === 'employee') {
    navGroups = [
      {
        groupTitle: 'SELF-SERVICE (ESS)',
        items: [
          { id: 'dashboard', label: 'Home (ESS)', icon: LayoutDashboard },
          { id: 'time_leave', label: 'My Time & Leaves', icon: CalendarDays, badge: '14.5d' },
          { id: 'payroll', label: 'My Pay & Tax', icon: CreditCard, badge: 'Nov slip' },
          { id: 'performance', label: 'My Goals & Learning', icon: GraduationCap, badge: '1 due' },
          { id: 'helpdesk', label: 'My Service Tickets', icon: LifeBuoy, badge: '2' },
        ],
      },
      {
        groupTitle: 'COMPANY & COMMUNITY',
        items: [
          { id: 'people', label: 'Directory & Org', icon: Users },
          { id: 'hiring', label: 'Internal Job Board (IJP)', icon: UserPlus, badge: '24' },
          { id: 'engagement', label: 'Culture & Recognition', icon: HeartHandshake },
        ],
      },
    ];
  } else if (role === 'manager') {
    navGroups = [
      {
        groupTitle: 'TEAM MANAGEMENT (MSS)',
        items: [
          { id: 'dashboard', label: 'Manager Hub', icon: LayoutDashboard },
          { id: 'people', label: 'My Team & Directory', icon: Users, badge: '18' },
          { id: 'time_leave', label: 'Team Attendance', icon: CalendarDays, badge: '3 req' },
          { id: 'hiring', label: 'Team Requisitions', icon: UserPlus, badge: '2 open' },
          { id: 'performance', label: 'Team Reviews & Goals', icon: GraduationCap },
          { id: 'helpdesk', label: 'Helpdesk & Requests', icon: LifeBuoy },
        ],
      },
      {
        groupTitle: 'PERSONAL & CULTURE',
        items: [
          { id: 'payroll', label: 'My Compensation', icon: CreditCard },
          { id: 'engagement', label: 'Workforce Culture', icon: HeartHandshake },
        ],
      },
    ];
  } else {
    // hr_admin (Full enterprise access)
    navGroups = [
      {
        groupTitle: 'CORE HR & OPERATIONS',
        items: [
          { id: 'dashboard', label: 'Home (Admin)', icon: LayoutDashboard },
          { id: 'people', label: 'People Operations', icon: Users, badge: '1,284' },
          { id: 'time_leave', label: 'Time & Attendance', icon: CalendarDays, badge: '3' },
          { id: 'payroll', label: 'Payroll & Statutory', icon: CreditCard, badge: 'Step 3' },
          { id: 'hiring', label: 'Hiring & ATS', icon: UserPlus, badge: '24' },
          { id: 'helpdesk', label: 'Helpdesk & Requests', icon: LifeBuoy, badge: '6' },
        ],
      },
      {
        groupTitle: 'STRATEGY & INSIGHTS',
        items: [
          { id: 'performance', label: 'Performance & Bell Curve', icon: GraduationCap },
          { id: 'engagement', label: 'Workforce Engagement', icon: HeartHandshake },
          { id: 'insights', label: 'Executive Insights', icon: BarChart3 },
        ],
      },
    ];
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen z-30 flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] transition-all duration-200 select-none',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Top Header / Logo */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          {/* Brand Mark - Orbit HR */}
          <div className="w-7 h-7 rounded-[5px] bg-[var(--brand-primary)] flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="font-semibold text-[14px] tracking-tight">O</span>
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-[14px] tracking-tight text-[var(--text-primary)] leading-tight">
                Orbit HR
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)] truncate leading-tight">
                {role === 'employee' ? 'Self-Service (ESS)' : role === 'manager' ? 'Manager Portal' : 'Enterprise Admin'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-[4px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} strokeWidth={1.7} /> : <ChevronLeft size={15} strokeWidth={1.7} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-0.5">
            {!collapsed && group.groupTitle && (
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
                {group.groupTitle}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[5px] text-[13px] font-medium transition-colors text-left relative group',
                    isActive
                      ? 'bg-[var(--bg-surface-subtle)] text-[var(--brand-primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)]'
                  )}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.7}
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'
                    )}
                  />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[11px] font-mono text-[var(--text-tertiary)] tabular-nums">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Indicator bar when active */}
                  {collapsed && isActive && (
                    <span className="absolute right-1 w-1 h-3 rounded-full bg-[var(--brand-primary)]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Role Context & Company Footer */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0 space-y-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
            <Building2 size={13} strokeWidth={1.7} />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="text-[12px] font-medium text-[var(--text-primary)] truncate leading-tight">
                Acme Financial Services
              </div>
              <div className="text-[10px] text-[var(--text-tertiary)] truncate leading-tight font-mono">
                {role === 'employee' ? 'Ananya Iyer (EMP-10482)' : role === 'manager' ? 'Vikram Patel (VP Risk)' : 'Pooja Agarwal (Admin)'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
