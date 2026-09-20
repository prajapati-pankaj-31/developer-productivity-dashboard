'use client';

import React from 'react';
import { Project, TaskFilterState, User } from '@/types';
import { Search, X, RotateCcw, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

interface TaskFilterBarProps {
  filters: TaskFilterState;
  onFilterChange: (newFilters: Partial<TaskFilterState>) => void;
  onResetFilters: () => void;
  projects: Project[];
  totalResults: number;
  totalTasks: number;
  authUser?: User | null;
  onOpenAuthModal?: () => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  projects,
  totalResults,
  totalTasks,
  authUser,
  onOpenAuthModal,
}) => {
  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    filters.projectId !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    Boolean(filters.onlyMyTasks);

  const projectOptions: SelectOption[] = [
    { value: 'all', label: 'All Projects' },
    ...projects.map((p) => ({
      value: p.id,
      label: `${p.key} - ${p.name}`,
    })),
  ];

  const priorityOptions: SelectOption[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: '🔴 Urgent' },
    { value: 'high', label: '🟠 High' },
    { value: 'medium', label: '🔵 Medium' },
    { value: 'low', label: '⚪ Low' },
  ];

  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0b0e1e]/96 dark:to-[#070915]/98 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.03)]">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Filter by title, tag, or branch..."
          className="w-full rounded-lg border border-zinc-300/80 dark:border-indigo-900/60 bg-zinc-50/90 dark:bg-[#0c1026]/90 pl-9 pr-8 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-inner focus:border-indigo-500 focus:bg-white dark:focus:bg-[#101533] focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Custom Select Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Quick 'Assigned to Me' filter toggle */}
        <button
          type="button"
          onClick={() => {
            if (!authUser && onOpenAuthModal) {
              onOpenAuthModal();
              return;
            }
            onFilterChange({ onlyMyTasks: !filters.onlyMyTasks });
          }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none',
            filters.onlyMyTasks
              ? 'bg-gradient-to-r from-indigo-500/25 to-purple-500/25 border-indigo-500/60 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
              : 'border-zinc-300/80 dark:border-indigo-900/60 bg-zinc-50/90 dark:bg-[#0c1026]/90 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-indigo-500/50'
          )}
          title={authUser ? `Filter tasks assigned to ${authUser.name}` : 'Sign in to filter your tasks'}
        >
          <UserCheck className={cn('h-3.5 w-3.5', filters.onlyMyTasks ? 'text-indigo-400' : 'text-zinc-500')} />
          <span>{authUser ? 'Assigned to Me' : 'My Tasks (Login)'}</span>
        </button>

        {/* Project Selector */}
        <Select
          value={filters.projectId}
          onChange={(val) => onFilterChange({ projectId: val })}
          options={projectOptions}
          size="sm"
          aria-label="Filter by project"
          className="min-w-[140px]"
          menuClassName="w-64"
        />

        {/* Priority Selector */}
        <Select
          value={filters.priority}
          onChange={(val) => onFilterChange({ priority: val as TaskFilterState['priority'] })}
          options={priorityOptions}
          size="sm"
          aria-label="Filter by priority"
          className="min-w-[125px]"
          menuClassName="w-44"
        />

        {/* Status Selector */}
        <Select
          value={filters.status}
          onChange={(val) => onFilterChange({ status: val as TaskFilterState['status'] })}
          options={statusOptions}
          size="sm"
          align="right"
          aria-label="Filter by status"
          className="min-w-[120px]"
          menuClassName="w-44"
        />

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        )}

        {/* Results Counter */}
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 shrink-0">
          {totalResults} / {totalTasks}
        </span>
      </div>
    </div>
  );
};
