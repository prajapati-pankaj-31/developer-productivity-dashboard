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
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenShortcuts?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  onStatusChange,
  onOpenProfile,
  onOpenSettings,
  onOpenShortcuts,
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
        className="group flex items-center gap-2.5 p-1.5 rounded-xl border border-transparent hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar user={user} size="sm" showStatus />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-zinc-100 group-hover:text-white leading-tight transition-colors">
            {user.name}
          </span>
          <span className="text-[11px] text-zinc-400 group-hover:text-zinc-300 leading-tight transition-colors">
            {user.role}
          </span>
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 text-zinc-400 group-hover:text-indigo-400 transition-all duration-200', isOpen && 'rotate-180 text-indigo-400')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-gradient-to-b from-[#0e1227] to-[#070918] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.1)] border border-indigo-950/80 py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {/* Header Info - Clicking opens Profile Modal */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onOpenProfile) onOpenProfile();
            }}
            className="w-full text-left px-4 py-3 border-b border-indigo-950/50 hover:bg-white/[0.03] transition-colors cursor-pointer group/header"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-100 group-hover/header:text-indigo-300 transition-colors">{user.name}</p>
              <span className="text-[10px] text-indigo-400 opacity-0 group-hover/header:opacity-100 transition-opacity font-medium">Edit Profile →</span>
            </div>
            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            <div className="mt-2.5 p-2 rounded-lg bg-[#0a0d20]/80 border border-indigo-950/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <div className="flex justify-between items-center text-[11px] mb-1 font-medium text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-indigo-400" /> Weekly Goal ({user.weeklyFocusGoalHours ? (user.weeklyFocusGoalHours * 0.9).toFixed(1) : 31.5}h / {user.weeklyFocusGoalHours || 35}h)
                </span>
                <span className="text-indigo-400 font-semibold">90%</span>
              </div>
              <ProgressBar value={90} size="xs" variant="success" />
            </div>
          </button>

          {/* Status Selection */}
          <div className="px-3 py-2 border-b border-indigo-950/50">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase px-2">
              Developer Status
            </span>
            <div className="mt-1.5 space-y-1">
              {statuses.map((st) => (
                <button
                  key={st.key}
                  onClick={() => {
                    if (onStatusChange) onStatusChange(st.key);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'group/st w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 text-left cursor-pointer',
                    user.status === st.key
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/35 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                      : 'border border-transparent text-zinc-300 hover:bg-white/[0.05] hover:text-white hover:border-white/[0.08]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full transition-transform group-hover/st:scale-125 duration-150', st.dot)} />
                    <div>
                      <div className="font-medium text-zinc-200 group-hover/st:text-white transition-colors">{st.label}</div>
                      <div className="text-[10px] text-zinc-400 group-hover/st:text-zinc-300 transition-colors">{st.desc}</div>
                    </div>
                  </div>
                  {user.status === st.key && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Menu Items */}
          <div className="px-1.5 py-1.5 text-xs text-zinc-300 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenSettings) onOpenSettings();
              }}
              className="group/item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all duration-150 cursor-pointer"
            >
              <Settings className="h-4 w-4 text-zinc-400 group-hover/item:text-indigo-400 group-hover/item:scale-110 transition-all duration-150" />
              <span className="font-medium">Workspace Preferences</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className="group/item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all duration-150 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-400 group-hover/item:scale-110 transition-all duration-150" />
              <span className="font-medium">Productivity &amp; Identity</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenShortcuts) onOpenShortcuts();
              }}
              className="group/item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all duration-150 cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 text-zinc-400 group-hover/item:text-indigo-400 group-hover/item:scale-110 transition-all duration-150" />
              <span className="font-medium">Keyboard Shortcuts</span>
              <kbd className="ml-auto text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 text-zinc-400 group-hover/item:border-zinc-600 transition-colors">
                ?
              </kbd>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1.5 border-t border-indigo-950/50 px-1.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenSettings) onOpenSettings();
              }}
              className="group/logout w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-150 cursor-pointer"
            >
              <LogOut className="h-4 w-4 group-hover/logout:-translate-x-0.5 transition-transform duration-150" />
              <span className="font-medium">Workspace Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
