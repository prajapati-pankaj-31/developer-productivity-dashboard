'use client';

import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { TaskCardSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';

import { Select, SelectOption } from '@/components/ui/Select';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onResetFilters?: () => void;
}

const sortOptions: SelectOption<'dueDate' | 'priority' | 'hours'>[] = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'hours', label: 'Estimated Hours' },
];

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading = false,
  onStatusChange,
  onToggleSubtask,
  onResetFilters,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | TaskStatus>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'hours'>('dueDate');

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Filter by local status tab if 'all' is not selected
  const tabFilteredTasks =
    activeTab === 'all' ? tasks : tasks.filter((t) => t.status === activeTab);

  // Sorting
  const sortedTasks = [...tabFilteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    if (sortBy === 'hours') {
      return b.estimatedHours - a.estimatedHours;
    }
    return 0;
  });

  const getStatusCount = (status: 'all' | TaskStatus) => {
    if (status === 'all') return tasks.length;
    return tasks.filter((t) => t.status === status).length;
  };

  const tabs: { id: 'all' | TaskStatus; label: string }[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'in_review', label: 'In Review' },
    { id: 'backlog', label: 'Backlog' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-Tabs & Sorter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const count = getStatusCount(tab.id);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs dark:bg-indigo-500'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isActive
                      ? 'bg-indigo-700 text-indigo-100 dark:bg-indigo-600'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-zinc-400">
          <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
          <span className="hidden sm:inline font-medium">Sort:</span>
          <Select
            value={sortBy}
            onChange={(val) => setSortBy(val as 'dueDate' | 'priority' | 'hours')}
            options={sortOptions}
            size="xs"
            align="right"
            aria-label="Sort tasks by"
            className="min-w-[130px]"
            menuClassName="w-40"
          />
        </div>
      </div>

      {/* Task Grid */}
      {sortedTasks.length === 0 ? (
        <EmptyState
          title="No tasks match this view"
          description="There are currently no tasks in this column matching your filters."
          icon="tasks"
          actionLabel={onResetFilters ? 'Clear All Filters' : undefined}
          onAction={onResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onToggleSubtask={onToggleSubtask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
