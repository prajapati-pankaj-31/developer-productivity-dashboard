'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  Search,
  PlusCircle,
  Layers,
  User,
  Settings,
  HelpCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  label: string;
  desc: string;
  icon: React.ElementType;
}

interface ShortcutSection {
  category: string;
  items: ShortcutItem[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const sections: ShortcutSection[] = [
    {
      category: 'Navigation & Search',
      items: [
        {
          keys: ['⌘', 'K'],
          label: 'Global Search',
          desc: 'Search tasks, projects, git branches & filters',
          icon: Search,
        },
        {
          keys: ['1', '2', '3', '4'],
          label: 'Switch Tabs',
          desc: 'Quick jump between Overview, Projects, Tasks & Activity',
          icon: Layers,
        },
      ],
    },
    {
      category: 'Actions & Identity',
      items: [
        {
          keys: ['N'],
          label: 'Create New Task',
          desc: 'Open sprint task creation dialog',
          icon: PlusCircle,
        },
        {
          keys: ['P'],
          label: 'Developer Profile',
          desc: 'Edit developer persona, status & tech skills',
          icon: User,
        },
        {
          keys: ['S'],
          label: 'Workspace Settings',
          desc: 'Configure focus timer, telemetry & FX',
          icon: Settings,
        },
      ],
    },
    {
      category: 'System & Dialogs',
      items: [
        {
          keys: ['?'],
          label: 'Shortcuts Reference',
          desc: 'Display this keyboard shortcut guide',
          icon: HelpCircle,
        },
        {
          keys: ['Esc'],
          label: 'Dismiss / Close',
          desc: 'Close active modal, dropdown, or search',
          icon: XCircle,
        },
      ],
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Developer Keyboard Shortcuts"
      description="Power-user hotkeys designed for high-velocity engineering workflows."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Sections Grid */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.category} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  {section.category}
                </span>
                <div className="flex-1 h-px bg-indigo-950/60" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#060814]/90 border border-indigo-950/70 hover:border-indigo-500/40 hover:bg-[#0a0e28]/80 hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)] transition-all"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 pr-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 group-hover:text-indigo-300 group-hover:scale-105 transition-all mt-0.5">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* 3D Styled Keyboard Keys */}
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, idx) => (
                          <React.Fragment key={idx}>
                            <kbd className="min-w-[24px] px-2 py-1 rounded-md bg-gradient-to-b from-[#1c224a] to-[#0e122b] text-indigo-200 border border-indigo-500/40 shadow-[0_2px_0_0_rgba(99,102,241,0.35),inset_0_1px_0_0_rgba(255,255,255,0.12)] font-mono text-[11px] font-bold text-center leading-none inline-block">
                              {k}
                            </kbd>
                            {idx < item.keys.length - 1 && (
                              <span className="text-zinc-500 text-[10px] font-mono">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Pro Tip & Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-indigo-950/60">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px] text-zinc-300">Esc</kbd> anytime to dismiss active dialogs.
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={onClose} className="self-end sm:self-auto">
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
};
