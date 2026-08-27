'use client';

import React from 'react';
import { TabType, User } from '@/types';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Activity,
  Zap,
  TrendingUp,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUser: User;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  isCollapsed = false,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: '4' },
    { id: 'tasks', label: 'Tasks & Sprints', icon: CheckSquare, badge: '6' },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col justify-between border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300 select-none z-20 shrink-0',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto p-4 scrollbar-none">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 py-2 mb-6 border-b border-zinc-100 dark:border-zinc-850 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20">
            <Code2 className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white truncate">
                  DevPulse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Pro
                </span>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                Engineering Org
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase px-3 mb-2 block">
              Menu
            </span>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900'
                )}
                title={item.label}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-500" />
                )}
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                  )}
                />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'ml-auto text-xs px-2 py-0.5 rounded-full font-semibold',
                          isActive
                            ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Focus Mode & Productivity Card */}
        {!isCollapsed && (
          <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-b from-indigo-50/80 to-zinc-50 dark:from-indigo-950/20 dark:to-zinc-900/50 border border-indigo-100 dark:border-indigo-950/60 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Sprint Cycle 14</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                On Track
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2.5">
              38 / 42 story pts resolved (90%)
            </p>
            <ProgressBar value={90} size="xs" variant="gradient" />
            <div className="mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> +12% velocity
              </span>
              <span>4d left</span>
            </div>
          </div>
        )}
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
          <Avatar user={currentUser} size="sm" showStatus />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Flow Mode Active
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
