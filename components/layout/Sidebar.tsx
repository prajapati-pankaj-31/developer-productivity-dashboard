'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TabType, User } from '@/types';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Activity,
  Zap,
  TrendingUp,
  Code2,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUser: User;
  projectsCount?: number;
  tasksCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
}

const MIN_WIDTH = 240;
const MAX_WIDTH = 420;
const DEFAULT_WIDTH = 280;
const STORAGE_KEY = 'devpulse_sidebar_width';

function getInitialWidth(): number {
  if (typeof window !== 'undefined') {
    try {
      const savedWidth = localStorage.getItem(STORAGE_KEY);
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10);
        if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }
  return DEFAULT_WIDTH;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  projectsCount,
  tasksCount,
  isCollapsed = false,
  onOpenProfile,
  onOpenSettings,
}) => {
  const [width, setWidth] = useState<number>(getInitialWidth);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const clampedWidth = Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH);
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      try {
        setWidth((currentWidth) => {
          localStorage.setItem(STORAGE_KEY, String(currentWidth));
          return currentWidth;
        });
      } catch {
        // Ignore localStorage errors
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: projectsCount !== undefined ? `${projectsCount}` : undefined },
    { id: 'tasks', label: 'Tasks & Sprints', icon: CheckSquare, badge: tasksCount !== undefined ? `${tasksCount}` : undefined },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
  ];

  return (
    <aside
      ref={sidebarRef}
      suppressHydrationWarning
      style={{ width: isCollapsed ? 80 : `${width}px` }}
      className={cn(
        'relative hidden lg:flex flex-col justify-between border-r border-indigo-950/60 bg-[#050611]/60 backdrop-blur-xl select-none z-20 shrink-0 h-full overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.3)]',
        isResizing ? 'transition-none' : 'transition-[width] duration-150 ease-out'
      )}
    >
      {/* Content Container (Sits cleanly on top of global dynamic background) */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto p-4 scrollbar-none">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 py-2 mb-6 border-b border-indigo-950/40 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20">
            <Code2 className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white truncate">
                  Pankaj&apos;s DevHub
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 shrink-0">
                  AI &amp; Dev
                </span>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-400 truncate">
                Personal Workspace
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
                    ? 'bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 text-indigo-300 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] border-l-2 border-indigo-500'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                )}
                title={item.label}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-indigo-400'
                      : 'text-zinc-400 group-hover:text-zinc-200'
                  )}
                />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'ml-auto text-xs px-2 py-0.5 rounded-full font-semibold shrink-0',
                          isActive
                            ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-700/50'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
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

          {/* Quick Settings Action */}
          <button
            type="button"
            onClick={onOpenSettings}
            className={cn(
              'group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent hover:border-indigo-500/20 cursor-pointer text-left mt-1',
              isCollapsed && 'justify-center px-2'
            )}
            title="Workspace Preferences"
          >
            <Settings className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
            {!isCollapsed && <span className="truncate">Settings</span>}
          </button>
        </div>

        {/* Focus Mode & Productivity Card */}
        {!isCollapsed && (
          <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-b from-[#0e1227]/90 to-[#080a1a]/95 backdrop-blur-xs border border-indigo-950/60 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                <span className="truncate">Sprint Cycle 14</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 shrink-0">
                On Track
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-2.5 truncate">
              38 / 42 story pts resolved (90%)
            </p>
            <ProgressBar value={90} size="xs" variant="gradient" />
            <div className="mt-3 pt-2.5 border-t border-indigo-950/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 truncate">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> +12% velocity
              </span>
              <span className="shrink-0">4d left</span>
            </div>
          </div>
        )}
      </div>

      {/* User profile footer */}
      <div className="relative z-10 p-3 border-t border-indigo-950/50 bg-[#050611]/80 backdrop-blur-xs">
        <button
          type="button"
          onClick={onOpenProfile}
          className="group/profile w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-indigo-500/30 transition-all text-left cursor-pointer"
          title="Open Developer Profile & Settings"
        >
          <Avatar user={currentUser} size="sm" showStatus />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-100 group-hover/profile:text-indigo-300 transition-colors truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-zinc-500 group-hover/profile:text-indigo-400 opacity-0 group-hover/profile:opacity-100 transition-opacity">
                  Edit ⚙️
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">Flow Mode Active</span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Resizable Handle / Border (Desktop only) */}
      {!isCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-30 transition-colors group',
            isResizing ? 'bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'hover:bg-indigo-500/40'
          )}
          title="Drag to resize sidebar (240px - 420px)"
        >
          {/* Visual indicator bar */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0.5 w-0.5 h-8 bg-zinc-600 group-hover:bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </aside>
  );
};
