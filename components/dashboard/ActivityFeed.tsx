'use client';

import React from 'react';
import { ActivityItem } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Rocket,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'Engineering Activity Stream',
  limit,
}) => {
  const displayedActivities = limit ? activities.slice(0, limit) : activities;

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

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0e1227]/90 dark:to-[#080a1c]/95 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-indigo-950/50">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-400">Live feed of commits, reviews & deployments</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Telemetry
        </span>
      </div>

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
    </div>
  );
};
