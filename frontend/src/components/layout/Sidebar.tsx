import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Database,
  SlidersHorizontal,
  CheckCircle2,
  BookOpen,
  Code,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const primaryNav = [
    { name: 'Overview', path: '/app/overview', icon: LayoutDashboard },
    { name: 'New Analysis', path: '/app/new-analysis', icon: PlusCircle },
    { name: 'Projects', path: '/app/projects', icon: FolderKanban },
    { name: 'Datasets', path: '/app/datasets', icon: Database },
    { name: 'Results Workspace', path: '/app/results', icon: SlidersHorizontal },
    { name: 'Validation', path: '/app/validation', icon: CheckCircle2 },
  ];

  const secondaryNav = [
    { name: 'Documentation', path: '/app/docs', icon: BookOpen },
    { name: 'API Reference', path: '/app/api', icon: Code },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 relative z-20 shrink-0 shadow-2xs',
        collapsed ? 'w-14' : 'w-60'
      )}
    >
      {/* Primary Navigation */}
      <div className="flex-1 py-4 px-2.5 space-y-6 overflow-y-auto">
        <div>
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Main Menu
            </span>
          )}
          <nav className="space-y-1">
            {primaryNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all group',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              System & API
            </span>
          )}
          <nav className="space-y-1">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all',
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0 text-slate-400" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-2.5 border-t border-slate-200 flex justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors w-full flex items-center justify-center gap-2 text-xs font-medium"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
