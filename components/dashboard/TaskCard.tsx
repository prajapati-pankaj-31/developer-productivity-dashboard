'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getPriorityStyles, formatDate, cn } from '@/lib/utils';
import {
  Calendar,
  GitBranch,
  GitPullRequest,
  Clock,
  CheckSquare,
} from 'lucide-react';

import { Select, SelectOption } from '@/components/ui/Select';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const statusOptions: SelectOption<TaskStatus>[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
];

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onToggleSubtask,
}) => {
  const priorityStyles = getPriorityStyles(task.priority);

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0b0e1e]/96 dark:to-[#070915]/98 backdrop-blur-md p-4 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.03)] hover:border-indigo-500/40 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08),inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Project Key + Priority + Status selector */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 px-2 py-0.5 rounded">
              {task.projectName}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityStyles.bg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${priorityStyles.dot}`} />
              {priorityStyles.label}
            </span>
          </div>

          {/* Interactive Custom Status Changer Dropdown */}
          <Select
            value={task.status}
            onChange={(newStatus) => onStatusChange(task.id, newStatus)}
            options={statusOptions}
            size="xs"
            align="right"
            aria-label="Change task status"
            className="min-w-[105px]"
            menuClassName="w-36"
          />
        </div>

        {/* Task Title */}
        <h4
          className={cn(
            'text-sm font-bold transition-colors mb-1.5 leading-snug',
            task.status === 'completed'
              ? 'line-through text-zinc-300 dark:text-zinc-300 font-bold decoration-zinc-500/70'
              : 'text-zinc-950 dark:text-white group-hover:text-indigo-400'
          )}
        >
          {task.title}
        </h4>

        {/* Description */}
        <p
          className={cn(
            'text-xs line-clamp-2 leading-relaxed mb-3 font-normal',
            task.status === 'completed'
              ? 'text-zinc-400 dark:text-zinc-400'
              : 'text-zinc-700 dark:text-zinc-300'
          )}
        >
          {task.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/50 select-none"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Git Branch & PR */}
        {(task.branchName || task.prNumber) && (
          <div className="flex items-center gap-2 mb-3 text-xs flex-wrap">
            {task.branchName && (
              <span className="inline-flex items-center gap-1 font-mono text-zinc-800 dark:text-indigo-300 bg-zinc-100/90 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-zinc-200 dark:border-indigo-900/50 font-medium select-none">
                <GitBranch className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                {task.branchName}
              </span>
            )}
            {task.prNumber && (
              <span className="inline-flex items-center gap-1 font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/50 font-medium select-none">
                <GitPullRequest className="h-3 w-3 text-purple-600 dark:text-purple-400 shrink-0" />
                #{task.prNumber}
              </span>
            )}
          </div>
        )}

        {/* Subtask checklist container */}
        {totalSubtasks > 0 && (
          <div className="mb-3.5 p-3.5 rounded-xl bg-zinc-100/90 dark:bg-[#060814]/95 border border-zinc-200/90 dark:border-indigo-950/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] transition-colors">
            <div className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 mb-2.5 font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium">
                <CheckSquare className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" /> Subtasks
              </span>
              <span className="font-bold text-zinc-950 dark:text-zinc-100 font-mono text-[11px]">
                {completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)
              </span>
            </div>
            <ProgressBar
              value={subtaskProgress}
              size="xs"
              variant={subtaskProgress === 100 ? 'success' : 'default'}
            />

            {/* Checklist items */}
            <div className="mt-3 space-y-2">
              {task.subtasks.map((st) => (
                <label
                  key={st.id}
                  className="group/item flex items-center gap-2.5 py-0.5 text-xs cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask && onToggleSubtask(task.id, st.id)}
                    className="h-3.5 w-3.5 rounded border-zinc-500/80 dark:border-indigo-900/90 bg-[#0a0d20] text-indigo-500 focus:ring-indigo-500/30 cursor-pointer shrink-0 accent-indigo-500"
                  />
                  <span
                    className={cn(
                      'text-xs leading-snug transition-colors',
                      st.completed
                        ? 'line-through text-zinc-400 dark:text-zinc-400 font-medium decoration-zinc-500/80'
                        : 'text-zinc-900 dark:text-zinc-100 font-medium group-hover/item:text-white'
                    )}
                  >
                    {st.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Due date, logged hours & Assignee */}
      <div className="pt-3 border-t border-zinc-200/80 dark:border-indigo-950/50 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium" title="Due date">
            <Calendar className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span className="text-zinc-700 dark:text-zinc-300">{formatDate(task.dueDate)}</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono font-medium" title="Logged / Estimated hours">
            <Clock className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span className="text-zinc-700 dark:text-zinc-300">{task.loggedHours}h / {task.estimatedHours}h</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Avatar user={task.assignee} size="xs" />
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hidden sm:inline">
            {task.assignee.name.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};
