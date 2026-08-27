import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-800/80',
        className
      )}
    />
  );
};

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-3 w-4/5 mt-3" />
    </div>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs flex flex-col justify-between h-64">
      <div>
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-6 w-12 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-4/5 mb-4" />
      </div>
      <div>
        <Skeleton className="h-2 w-full mb-4" />
        <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>
      <Skeleton className="h-5 w-4/5 mb-2 mt-2" />
      <Skeleton className="h-3.5 w-full mb-3" />
      <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
};
