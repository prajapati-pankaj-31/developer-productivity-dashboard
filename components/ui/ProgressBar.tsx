import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gradient';
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeStyles = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-3',
  };

  const variantStyles = {
    default: 'bg-indigo-600 dark:bg-indigo-500',
    success: 'bg-emerald-600 dark:bg-emerald-500',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-600 dark:bg-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
