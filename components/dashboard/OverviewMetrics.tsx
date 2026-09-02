'use client';

import React from 'react';
import { ProductivityMetric } from '@/types';
import { Zap, Flame, GitPullRequest, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCardSkeleton } from '@/components/ui/SkeletonLoader';

interface OverviewMetricsProps {
  metrics: ProductivityMetric[];
  isLoading?: boolean;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  metrics,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'Flame':
        return <Flame className="h-5 w-5 text-rose-500" />;
      case 'GitPullRequest':
        return <GitPullRequest className="h-5 w-5 text-purple-500" />;
      case 'Clock':
      default:
        return <Clock className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200/60 dark:border-amber-900/60';
      case 'Flame':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200/60 dark:border-rose-900/60';
      case 'GitPullRequest':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200/60 dark:border-purple-900/60';
      case 'Clock':
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border border-indigo-200/60 dark:border-indigo-900/60';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0e1227]/90 dark:to-[#080a1c]/95 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.03)] transition-all hover:border-indigo-500/40 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08),inset_0_1px_0_0_rgba(255,255,255,0.05)] group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {metric.label}
            </span>
            <div className={cn('p-2 rounded-xl transition-transform group-hover:scale-105', getIconBg(metric.iconName))}>
              {getMetricIcon(metric.iconName)}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {metric.unit}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
              {metric.description}
            </p>
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded shrink-0',
                metric.trend === 'up' && 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400',
                metric.trend === 'down' && 'text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400',
                metric.trend === 'neutral' && 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'
              )}
            >
              {metric.trend === 'up' && <TrendingUp className="h-3 w-3" />}
              {metric.trend === 'down' && <TrendingDown className="h-3 w-3" />}
              {metric.trend === 'neutral' && <Minus className="h-3 w-3" />}
              <span>{Math.abs(metric.changePercent)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
