'use client';

import React, { useState } from 'react';
import { DailyProductivity } from '@/types';
import { cn } from '@/lib/utils';
import { GitCommit, Clock } from 'lucide-react';

interface ProductivityChartProps {
  data: DailyProductivity[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'focus' | 'commits'>('focus');
  const [hoveredDay, setHoveredDay] = useState<DailyProductivity | null>(null);

  const maxFocusHours = 10;
  const maxCommits = 20;

  const totalFocus = data.reduce((acc, curr) => acc + curr.focusHours, 0);
  const totalCommits = data.reduce((acc, curr) => acc + curr.commitCount, 0);
  const totalTasks = data.reduce((acc, curr) => acc + curr.tasksCompleted, 0);

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0e1227]/90 dark:to-[#080a1c]/95 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.03)] flex flex-col justify-between">
      {/* Header & Metric Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-indigo-950/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Weekly Productivity Velocity
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
              +14% vs last week
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Daily focus hours and code shipping cadence
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-[#070918]/80 border border-zinc-200/80 dark:border-indigo-950/50 p-1 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveMetric('focus')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
              activeMetric === 'focus'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Focus Hours</span>
          </button>
          <button
            onClick={() => setActiveMetric('commits')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
              activeMetric === 'commits'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            )}
          >
            <GitCommit className="h-3.5 w-3.5" />
            <span>Git Commits</span>
          </button>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="mt-4">
        {/* Metric Value Preview on Hover */}
        <div className="flex items-center justify-between h-7 mb-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {activeMetric === 'focus' ? 'Focus Target: 7.0h / day' : 'Commit Cadence: Mon - Fri'}
          </span>
          {hoveredDay && (
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-in fade-in duration-100">
              {hoveredDay.day}:{' '}
              {activeMetric === 'focus'
                ? `${hoveredDay.focusHours}h focus`
                : `${hoveredDay.commitCount} commits, ${hoveredDay.pullRequestsCount} PRs`}
            </span>
          )}
        </div>

        {/* Bar Columns */}
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-4 pb-2">
          {data.map((item) => {
            const value = activeMetric === 'focus' ? item.focusHours : item.commitCount;
            const maxValue = activeMetric === 'focus' ? maxFocusHours : maxCommits;
            const heightPercent = Math.max(Math.round((value / maxValue) * 100), 4);
            const isHovered = hoveredDay?.day === item.day;

            return (
              <div
                key={item.day}
                onMouseEnter={() => setHoveredDay(item)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              >
                {/* Value tooltip on top of bar */}
                <span
                  className={cn(
                    'text-[10px] font-mono transition-opacity duration-150',
                    isHovered
                      ? 'opacity-100 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'opacity-60 text-zinc-400 group-hover:opacity-100'
                  )}
                >
                  {value > 0 ? (activeMetric === 'focus' ? `${value}h` : value) : '-'}
                </span>

                {/* Track and Bar Fill */}
                <div className="w-full max-w-[48px] h-36 bg-zinc-100 dark:bg-zinc-800/40 rounded-lg overflow-hidden p-1 flex flex-col justify-end relative border border-transparent group-hover:border-indigo-500/30 transition-colors">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={cn(
                      'w-full rounded-md transition-all duration-300 ease-out',
                      item.isToday
                        ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-blue-400 shadow-md shadow-indigo-500/20'
                        : isHovered
                        ? 'bg-gradient-to-t from-indigo-500 to-indigo-400'
                        : 'bg-gradient-to-t from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600'
                    )}
                  />
                </div>

                {/* Day label */}
                <span
                  className={cn(
                    'text-xs transition-colors',
                    item.isToday
                      ? 'font-bold text-indigo-600 dark:text-indigo-400'
                      : isHovered
                      ? 'font-medium text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-400 dark:text-zinc-500'
                  )}
                >
                  {item.shortDay}
                  {item.isToday && (
                    <span className="block mx-auto h-1 w-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-indigo-950/50 grid grid-cols-3 gap-2.5 text-center">
        <div className="p-2.5 rounded-lg bg-zinc-100/80 dark:bg-[#070918]/80 border border-zinc-200/80 dark:border-indigo-950/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-colors">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-semibold">
            Total Focus
          </p>
          <p className="text-base font-bold text-zinc-950 dark:text-white mt-0.5">
            {totalFocus.toFixed(1)}h
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-100/80 dark:bg-[#070918]/80 border border-zinc-200/80 dark:border-indigo-950/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-colors">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-semibold">
            Total Commits
          </p>
          <p className="text-base font-bold text-zinc-950 dark:text-white mt-0.5">
            {totalCommits}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-100/80 dark:bg-[#070918]/80 border border-zinc-200/80 dark:border-indigo-950/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-colors">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-semibold">
            Completed
          </p>
          <p className="text-base font-bold text-zinc-950 dark:text-white mt-0.5">
            {totalTasks} tasks
          </p>
        </div>
      </div>
    </div>
  );
};
