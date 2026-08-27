import { TaskPriority, TaskStatus, ProjectStatus } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getPriorityStyles(priority: TaskPriority) {
  switch (priority) {
    case 'urgent':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
        dot: 'bg-rose-500',
        label: 'Urgent',
      };
    case 'high':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
        dot: 'bg-amber-500',
        label: 'High',
      };
    case 'medium':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
        dot: 'bg-blue-500',
        label: 'Medium',
      };
    case 'low':
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
        label: 'Low',
      };
  }
}

export function getStatusStyles(status: TaskStatus) {
  switch (status) {
    case 'completed':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Completed',
      };
    case 'in_review':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
        dot: 'bg-purple-500',
        label: 'In Review',
      };
    case 'in_progress':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
        dot: 'bg-indigo-500',
        label: 'In Progress',
      };
    case 'backlog':
      return {
        bg: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
        dot: 'bg-zinc-400',
        label: 'Backlog',
      };
  }
}

export function getProjectStatusStyles(status: ProjectStatus) {
  switch (status) {
    case 'on_track':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
        label: 'On Track',
      };
    case 'at_risk':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
        label: 'At Risk',
      };
    case 'delayed':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
        label: 'Delayed',
      };
    case 'completed':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
        label: 'Completed',
      };
  }
}

export function getUserStatusStyles(status: 'flow' | 'available' | 'in_review' | 'away') {
  switch (status) {
    case 'flow':
      return { color: 'bg-emerald-500', label: 'In Flow Mode', pulse: true };
    case 'available':
      return { color: 'bg-blue-500', label: 'Available for Pairing', pulse: false };
    case 'in_review':
      return { color: 'bg-purple-500', label: 'Reviewing PRs', pulse: false };
    case 'away':
      return { color: 'bg-zinc-400', label: 'Away', pulse: false };
  }
}
