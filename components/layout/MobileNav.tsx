'use client';

import React, { useEffect } from 'react';
import { TabType, User } from '@/types';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Activity,
  X,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUser: User;
  projectsCount?: number;
  tasksCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  currentUser,
  projectsCount,
  tasksCount,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: projectsCount !== undefined ? `${projectsCount}` : undefined },
    { id: 'tasks', label: 'Tasks & Sprints', icon: CheckSquare, badge: tasksCount !== undefined ? `${tasksCount}` : undefined },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
  ];

  const handleSelect = (tab: TabType) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">Pankaj&apos;s DevHub</span>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Personal Workspace</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 space-y-1.5">
            <span className="text-[11px] font-semibold uppercase text-zinc-400 dark:text-zinc-500 px-3 block mb-2">
              Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('h-5 w-5', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400')} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <Avatar user={currentUser} size="md" showStatus />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-zinc-400 truncate">{currentUser.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
