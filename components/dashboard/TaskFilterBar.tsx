'use client';

import React from 'react';
import { Project, TaskFilterState } from '@/types';
import { Search, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
        </div>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Filter by title, tag, or branch..."
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/60 pl-9 pr-8 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Select Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Project Selector */}
        <select
          value={filters.projectId}
          onChange={(e) => onFilterChange({ projectId: e.target.value })}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.key} - {p.name}
            </option>
          ))}
        </select>

        {/* Priority Selector */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High</option>
          <option value="medium">🔵 Medium</option>
          <option value="low">⚪ Low</option>
        </select>

        {/* Status Selector */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="backlog">Backlog</option>
          <option value="completed">Completed</option>
        </select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        )}

        {/* Results Counter */}
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
          {totalResults} / {totalTasks}
        </span>
      </div>
    </div>
  );
};
