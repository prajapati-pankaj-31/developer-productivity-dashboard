'use client';

import React from 'react';
import { Project, TaskFilterState } from '@/types';
import { Search, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';

interface TaskFilterBarProps {
  filters: TaskFilterState;
  onFilterChange: (newFilters: Partial<TaskFilterState>) => void;
  onResetFilters: () => void;
  projects: Project[];
  totalResults: number;
  totalTasks: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  projects,
  totalResults,
  totalTasks,
}) => {
  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    filters.projectId !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all';

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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0e1227]/90 dark:to-[#080a1c]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.03)]">
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
          className="w-full rounded-lg border border-zinc-700/80 bg-[#0a0d20]/80 pl-9 pr-8 py-1.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:bg-[#0d1028] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
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
