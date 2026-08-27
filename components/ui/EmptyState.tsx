import React from 'react';
import { Search, FolderGit2, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'projects' | 'tasks';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  icon = 'search',
  actionLabel,
  onAction,
  className = '',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'projects':
        return <FolderGit2 className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />;
      case 'tasks':
        return <CheckCircle2 className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />;
      case 'search':
      default:
        return <Search className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 my-4 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/80 mb-4 ring-8 ring-zinc-50 dark:ring-zinc-900/50">
        {getIcon()}
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
