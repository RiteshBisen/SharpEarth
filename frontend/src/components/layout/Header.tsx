import React from 'react';
import { Globe, Menu, ChevronDown, Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface HeaderProps {
  onToggleMobileNav: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">
              SharpEarth
            </span>
            <Badge variant="blue" size="sm" className="hidden sm:inline-flex">
              v1.0.0
            </Badge>
          </div>
        </div>
      </div>

      {/* Middle: Active Context Switcher */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-700">
        <span className="text-slate-500 font-medium">Project:</span>
        <span className="font-semibold text-blue-700 flex items-center gap-1">
          Jaipur Infrastructure Demo
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </span>
      </div>

      {/* Right: Status & User */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>FastAPI Engine Online</span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
          <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
          </button>

          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 text-xs font-semibold">
            EO
          </div>
        </div>
      </div>
    </header>
  );
};
