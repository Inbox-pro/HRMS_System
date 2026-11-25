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
import { useHrms } from '../../context/HrmsContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeNav: string;
  onSelectNav: (id: string) => void;
}

interface NavGroup {
  groupTitle?: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
  }[];
}

export function Sidebar({ collapsed, onToggleCollapse, activeNav, onSelectNav }: SidebarProps) {
  const { role, currentUser } = useHrms();

  let navGroups: NavGroup[] = [];

  if (role === 'employee') {
    navGroups = [
      {
        groupTitle: 'Self-service',
        items: [
          { id: 'dashboard', label: 'Home (ESS)', icon: LayoutDashboard },
          { id: 'time_leave', label: 'My Time & Leaves', icon: CalendarDays },
          { id: 'payroll', label: 'My Pay & Tax', icon: CreditCard },
          { id: 'performance', label: 'My Goals & Learning', icon: GraduationCap },
          { id: 'helpdesk', label: 'My Service Tickets', icon: LifeBuoy },
        ],
      },
      {
        groupTitle: 'Company & community',
        items: [
          { id: 'people', label: 'Directory & Org', icon: Users },
          { id: 'hiring', label: 'Internal Job Board (IJP)', icon: UserPlus },
          { id: 'engagement', label: 'Culture & Recognition', icon: HeartHandshake },
        ],
      },
    ];
  } else if (role === 'manager') {
    navGroups = [
      {
        groupTitle: 'Team management',
        items: [
          { id: 'dashboard', label: 'Manager Hub', icon: LayoutDashboard },
          { id: 'people', label: 'My Team & Directory', icon: Users },
          { id: 'time_leave', label: 'Team Attendance', icon: CalendarDays },
          { id: 'hiring', label: 'Team Requisitions', icon: UserPlus },
          { id: 'performance', label: 'Team Reviews & Goals', icon: GraduationCap },
          { id: 'helpdesk', label: 'Helpdesk & Requests', icon: LifeBuoy },
        ],
      },
      {
        groupTitle: 'Personal & culture',
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
        groupTitle: 'Core HR & operations',
        items: [
          { id: 'dashboard', label: 'Home (Admin)', icon: LayoutDashboard },
          { id: 'people', label: 'People Operations', icon: Users },
          { id: 'time_leave', label: 'Time & Attendance', icon: CalendarDays },
          { id: 'payroll', label: 'Payroll & Statutory', icon: CreditCard },
          { id: 'hiring', label: 'Hiring & ATS', icon: UserPlus },
          { id: 'helpdesk', label: 'Helpdesk & Requests', icon: LifeBuoy },
        ],
      },
      {
        groupTitle: 'Strategy & insights',
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
        'fixed top-0 left-0 h-screen z-30 flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] transition-[width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] select-none',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Top Header / Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center space-x-2.5">
          {/* Brand Mark - Orbit HR */}
          <div className="w-7 h-7 rounded-[6px] bg-[var(--brand-primary)] flex items-center justify-center text-white shrink-0">
            <span className="font-semibold text-[14px] tracking-tight">O</span>
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-[14px] tracking-tight text-[var(--text-primary)] leading-tight">
                Orbit HR
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)] truncate leading-tight">
                {role === 'employee' ? 'Self-Service (ESS)' : role === 'manager' ? 'Manager Portal' : 'Enterprise Suite'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-[4px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} strokeWidth={1.5} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={cn(groupIdx > 0 && 'mt-6')}>
            {!collapsed && group.groupTitle && (
              <div className="px-2 pb-2 text-[11px] font-medium text-[var(--text-tertiary)]">
                {group.groupTitle}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectNav(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'w-full h-8 flex items-center space-x-2 px-2 rounded-[6px] text-[13px] font-medium transition-colors text-left relative group cursor-pointer',
                      isActive
                        ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    {isActive && !collapsed && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[var(--brand-primary)]" />
                    )}
                    <span className="w-5 flex items-center justify-center shrink-0">
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        className={cn(
                          'transition-colors',
                          isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'
                        )}
                      />
                    </span>

                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {/* Active Indicator bar when collapsed */}
                    {collapsed && isActive && (
                      <span className="absolute right-1 w-1 h-3 rounded-full bg-[var(--brand-primary)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Role Context & Company Footer */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
            <Building2 size={14} strokeWidth={1.5} />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="text-[12px] font-medium text-[var(--text-primary)] truncate leading-tight">
                Acme Financial Services
              </div>
              <div className="text-[11px] text-[var(--text-tertiary)] truncate leading-tight font-mono">
                {role === 'employee' ? `${currentUser.name} (${currentUser.employeeCode})` : role === 'manager' ? 'Vikram Patel (VP Risk)' : 'Pooja Agarwal (Admin)'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
