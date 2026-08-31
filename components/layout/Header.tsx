'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User } from '@/types';
import { UserProfileMenu } from './UserProfileMenu';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Plus,
  Bell,
  Menu,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  currentUser: User;
  onOpenMobileNav: () => void;
  onNewTaskClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoadingState: boolean;
  onToggleLoadingState: () => void;
  onStatusChange: (status: User['status']) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenMobileNav,
  onNewTaskClick,
  searchQuery,
  onSearchChange,
  isLoadingState,
  onToggleLoadingState,
  onStatusChange,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 'n-1',
      title: 'PR #118 Approved',
      time: '20m ago',
      desc: 'Elena Rostova approved Tailwind CSS design token migration.',
      type: 'pr',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Deployment Succeeded',
      time: '1h ago',
      desc: 'Production rollout for Auth Gateway v2 complete.',
      type: 'deploy',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Task Due Tomorrow',
      time: '3h ago',
      desc: 'Redis JWT blacklist expiration review.',
      type: 'task',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/60 bg-white/80 dark:bg-[#070914]/75 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, projects, branches (⌘K)..."
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 pl-9 pr-12 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden sm:flex items-center pr-2.5">
            <kbd className="rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle skeleton loading state preview */}
        <button
          onClick={onToggleLoadingState}
          className={cn(
            'hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer',
            isLoadingState
              ? 'bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700 dark:text-amber-400'
              : 'text-zinc-600 border-zinc-200 hover:bg-zinc-100 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800'
          )}
          title="Toggle loading skeleton state for demonstration"
        >
          <RotateCw className={cn('h-3.5 w-3.5', isLoadingState && 'animate-spin text-amber-500')} />
          <span>{isLoadingState ? 'Simulating Load...' : 'Simulate Loading'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Notifications
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-3 items-start',
                      n.unread && 'bg-indigo-50/30 dark:bg-indigo-950/20'
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'pr' && (
                        <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
                          <GitPullRequest className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {n.type === 'deploy' && (
                        <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {n.type === 'task' && (
                        <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-zinc-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Task Action Button */}
        <Button size="sm" onClick={onNewTaskClick} className="shadow-sm">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Task</span>
        </Button>

        {/* User Profile */}
        <UserProfileMenu user={currentUser} onStatusChange={onStatusChange} />
      </div>
    </header>
  );
};
