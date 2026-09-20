'use client';

import React, { useState, useMemo } from 'react';
import { ActivityItem } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Rocket,
  MessageSquare,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  limit?: number;
  showFilters?: boolean;
}

type ActivityFilterType = 'all' | ActivityItem['type'];

const filterOptions: { id: ActivityFilterType; label: string }[] = [
  { id: 'all', label: 'All Activities' },
  { id: 'commit', label: 'Commits' },
  { id: 'pr_merged', label: 'PR Merged' },
  { id: 'pr_review', label: 'Code Reviews' },
  { id: 'deployment', label: 'Deployments' },
  { id: 'task_completed', label: 'Tasks Completed' },
];

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'Engineering Activity Stream',
  limit,
  showFilters = false,
}) => {
  const [selectedType, setSelectedType] = useState<ActivityFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="h-4 w-4 text-indigo-500" />;
      case 'pr_merged':
        return <GitPullRequest className="h-4 w-4 text-purple-500" />;
      case 'pr_review':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'deployment':
        return <Rocket className="h-4 w-4 text-amber-500" />;
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'comment':
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIconBg = (type: ActivityItem['type']) => {
    switch (type) {
      case 'commit':
        return 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-900/60';
      case 'pr_merged':
        return 'bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-900/60';
      case 'pr_review':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-900/60';
      case 'deployment':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-900/60';
      case 'task_completed':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-900/60';
      default:
        return 'bg-zinc-50 dark:bg-zinc-850 border-zinc-200/80 dark:border-zinc-800';
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedType !== 'all' && act.type !== selectedType) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(q);
        const matchesDesc = act.description.toLowerCase().includes(q);
        const matchesUser = act.user.name.toLowerCase().includes(q);
        const matchesKey = act.projectKey.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesUser && !matchesKey) {
          return false;
        }
      }
      return true;
    });
  }, [activities, selectedType, searchQuery]);

  const displayedActivities = limit ? filteredActivities.slice(0, limit) : filteredActivities;

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0b0e1e]/96 dark:to-[#070915]/98 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-100 dark:border-indigo-950/50">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-400">Live feed of commits, reviews, deployments & milestones</p>
        </div>
        <span className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Telemetry ({filteredActivities.length})
        </span>
      </div>

      {/* Filter Controls (shown in full activity view) */}
      {showFilters && (
        <div className="space-y-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities by user, commit title, or project key..."
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#070918] pl-9 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedType(opt.id)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer',
                  selectedType === opt.id
                    ? 'bg-indigo-600 text-white dark:bg-indigo-600 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {displayedActivities.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-400">
          No activity logs match your filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {displayedActivities.map((activity, index) => (
            <div key={activity.id} className="relative flex gap-3 items-start group">
              {/* Connecting line */}
              {index !== displayedActivities.length - 1 && (
                <span
                  className="absolute left-4 top-8 -bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-800"
                  aria-hidden="true"
                />
              )}

              {/* Icon Bubble */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-xs',
                  getIconBg(activity.type)
                )}
              >
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {activity.user.name}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {activity.projectKey}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0 font-medium">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>

                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mb-0.5">
                  {activity.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {activity.description}
                </p>

                {activity.badgeText && (
                  <div className="mt-1.5">
                    <span className="inline-flex text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                      {activity.badgeText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
