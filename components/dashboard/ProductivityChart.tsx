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
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-white/85 dark:bg-[#0c0e1f]/75 backdrop-blur-md p-5 shadow-xs flex flex-col justify-between">
      {/* Header & Metric Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
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
        <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1 self-start sm:self-auto text-xs">
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

      {/* Chart Visual Section */}
      <div className="pt-6 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-48 px-2">
          {data.map((day) => {
            const isFocus = activeMetric === 'focus';
            const value = isFocus ? day.focusHours : day.commitCount;
            const maxValue = isFocus ? maxFocusHours : maxCommits;
            const heightPercent = Math.max(Math.min((value / maxValue) * 100, 100), 4);
            const isHovered = hoveredDay?.day === day.day;

            return (
              <div
                key={day.day}
                className="flex flex-col items-center gap-2 group h-full justify-end relative cursor-pointer"
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-30 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <p className="font-bold">{day.day}</p>
                    <p className="text-[11px] opacity-90">
                      {isFocus ? `${day.focusHours}h focus` : `${day.commitCount} commits`} • {day.tasksCompleted} tasks
                    </p>
                  </div>
                )}

                {/* Value Label */}
                <span
                  className={cn(
                    'text-[10px] font-semibold transition-opacity duration-200',
                    day.isToday
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200'
                  )}
                >
                  {isFocus ? (value > 0 ? `${value}h` : '-') : (value > 0 ? value : '-')}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[36px] bg-zinc-100 dark:bg-zinc-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 relative">
                  <div
                    className={cn(
                      'w-full rounded-t-lg transition-all duration-500',
                      day.isToday
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-sm shadow-indigo-500/30'
                        : value > 0
                        ? 'bg-zinc-300 dark:bg-zinc-700 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-500'
                        : 'bg-transparent'
                    )}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors',
                      day.isToday
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-zinc-500 dark:text-zinc-400'
                    )}
                  >
                    {day.shortDay}
                  </span>
                  {day.isToday && (
                    <span className="h-1 w-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-2.5 text-center">
        <div className="p-2.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 transition-colors">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 uppercase tracking-wider font-semibold">
            Total Focus
          </p>
          <p className="text-base font-bold text-zinc-950 dark:text-white mt-0.5">
            {totalFocus.toFixed(1)}h
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 transition-colors">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 uppercase tracking-wider font-semibold">
            Total Commits
          </p>
          <p className="text-base font-bold text-zinc-950 dark:text-white mt-0.5">
            {totalCommits}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 transition-colors">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 uppercase tracking-wider font-semibold">
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
