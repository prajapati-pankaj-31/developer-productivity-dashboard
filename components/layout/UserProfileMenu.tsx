'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  ChevronDown,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfileMenuProps {
  user: User;
  onStatusChange?: (newStatus: User['status']) => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statuses: { key: User['status']; label: string; dot: string; desc: string }[] = [
    { key: 'flow', label: 'Flow State', dot: 'bg-emerald-500', desc: 'Muted alerts & deep focus' },
    { key: 'available', label: 'Available', dot: 'bg-blue-500', desc: 'Open for pairing & chats' },
    { key: 'in_review', label: 'Reviewing PRs', dot: 'bg-purple-500', desc: 'Focusing on code reviews' },
    { key: 'away', label: 'Away', dot: 'bg-zinc-400', desc: 'AFK or in meeting' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar user={user} size="sm" showStatus />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
            {user.name}
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
            {user.role}
          </span>
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Header Info */}
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
            <div className="mt-2.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
              <div className="flex justify-between items-center text-[11px] mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-indigo-500" /> Weekly Goal (31.5h / 35h)
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">90%</span>
              </div>
              <ProgressBar value={90} size="xs" variant="success" />
            </div>
          </div>

          {/* Status Selection */}
          <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase px-2">
              Developer Status
            </span>
            <div className="mt-1 space-y-0.5">
              {statuses.map((st) => (
                <button
                  key={st.key}
                  onClick={() => {
                    if (onStatusChange) onStatusChange(st.key);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left hover:bg-zinc-100 dark:hover:bg-zinc-800',
                    user.status === st.key && 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', st.dot)} />
                    <div>
                      <div>{st.label}</div>
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500">{st.desc}</div>
                    </div>
                  </div>
                  {user.status === st.key && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Menu Items */}
          <div className="px-1 py-1 text-xs text-zinc-700 dark:text-zinc-300">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Settings className="h-4 w-4 text-zinc-400" />
              <span>Workspace Preferences</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Productivity Insights</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-zinc-400" />
              <span>Keyboard Shortcuts</span>
              <kbd className="ml-auto text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                ?
              </kbd>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1 border-t border-zinc-100 dark:border-zinc-800 px-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
