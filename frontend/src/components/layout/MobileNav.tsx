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
  X,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navItems = [
    { name: 'Overview', path: '/app/overview', icon: LayoutDashboard },
    { name: 'New Analysis', path: '/app/new-analysis', icon: PlusCircle },
    { name: 'Projects', path: '/app/projects', icon: FolderKanban },
    { name: 'Datasets', path: '/app/datasets', icon: Database },
    { name: 'Results Workspace', path: '/app/results', icon: SlidersHorizontal },
    { name: 'Validation', path: '/app/validation', icon: CheckCircle2 },
    { name: 'Documentation', path: '/app/docs', icon: BookOpen },
    { name: 'API Reference', path: '/app/api', icon: Code },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-white border-r border-slate-200 p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-base text-slate-900">SharpEarth</span>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <item.icon className="w-4 h-4 text-slate-500" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
          SharpEarth Enterprise Platform v1.0.0
        </div>
      </div>
    </div>
  );
};
