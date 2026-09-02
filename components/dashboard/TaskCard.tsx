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
  ChevronDown,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

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
    <div className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0e1227]/90 dark:to-[#080a1c]/95 backdrop-blur-md p-4 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.03)] hover:border-indigo-500/40 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08),inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all flex flex-col justify-between group">
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

          {/* Interactive Status Changer Dropdown */}
          <div className="relative inline-block">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="appearance-none rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 pr-6 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              <option value="backlog">Backlog</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>

        {/* Task Title */}
        <h4 className="text-sm font-bold text-zinc-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed mb-3">
          {task.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Git Branch & PR */}
        {(task.branchName || task.prNumber) && (
          <div className="flex items-center gap-2 mb-3 text-xs flex-wrap">
            {task.branchName && (
              <span className="inline-flex items-center gap-1 font-mono text-zinc-800 dark:text-zinc-200 bg-zinc-100/90 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-medium">
                <GitBranch className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                {task.branchName}
              </span>
            )}
            {task.prNumber && (
              <span className="inline-flex items-center gap-1 font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 font-medium">
                <GitPullRequest className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                #{task.prNumber}
              </span>
            )}
          </div>
        )}

        {/* Subtask checklist container */}
        {totalSubtasks > 0 && (
          <div className="mb-3 p-3 rounded-lg bg-zinc-100/90 dark:bg-[#070918]/80 border border-zinc-200/90 dark:border-indigo-950/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-colors">
            <div className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 mb-2 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" /> Subtasks
              </span>
              <span className="font-bold text-zinc-950 dark:text-white">
                {completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)
              </span>
            </div>
            <ProgressBar
              value={subtaskProgress}
              size="xs"
              variant={subtaskProgress === 100 ? 'success' : 'default'}
            />

            {/* Checklist items */}
            <div className="mt-2.5 space-y-1.5">
              {task.subtasks.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-2.5 py-1 text-xs hover:text-zinc-950 dark:hover:text-white cursor-pointer select-none group/item"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask && onToggleSubtask(task.id, st.id)}
                    className="h-3.5 w-3.5 rounded border-zinc-400 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                  />
                  <span
                    className={cn(
                      'text-xs leading-tight transition-colors',
                      st.completed
                        ? 'line-through text-zinc-500 dark:text-zinc-400 font-medium'
                        : 'text-zinc-900 dark:text-zinc-100 font-medium'
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
      <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300">
          <span className="flex items-center gap-1.5 font-medium" title="Due date">
            <Calendar className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span>{formatDate(task.dueDate)}</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-zinc-800 dark:text-zinc-200 font-medium" title="Logged / Estimated hours">
            <Clock className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span>{task.loggedHours}h / {task.estimatedHours}h</span>
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
