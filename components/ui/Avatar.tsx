import React, { useState } from 'react';
import { User } from '@/types';
import { cn, getUserStatusStyles } from '@/lib/utils';

interface AvatarProps {
  user?: User;
  src?: string;
  name?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  src,
  name,
  initials,
  size = 'md',
  showStatus = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const displayName = user?.name || name || 'User';
  const displayInitials =
    user?.initials ||
    initials ||
    displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  const imageSrc = !imageError ? (user?.avatarUrl || src) : undefined;

  const sizeStyles = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const statusDotSizes = {
    xs: 'h-1.5 w-1.5 ring-1',
    sm: 'h-2 w-2 ring-1.5',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
    xl: 'h-3.5 w-3.5 ring-2',
  };

  const statusInfo = user?.status ? getUserStatusStyles(user.status) : null;

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 ring-2 ring-white dark:ring-zinc-900 select-none shadow-xs',
          sizeStyles[size]
        )}
        title={displayName}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={displayName}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{displayInitials}</span>
        )}
      </div>

      {showStatus && statusInfo && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-zinc-900',
            statusDotSizes[size],
            statusInfo.color,
            statusInfo.pulse && 'animate-pulse'
          )}
          title={statusInfo.label}
        />
      )}
    </div>
  );
};

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = 'sm',
  className = '',
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const sizeStyles = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
  };

  return (
    <div className={cn('flex items-center -space-x-2 overflow-hidden', className)}>
      {visibleUsers.map((u) => (
        <Avatar key={u.id} user={u} size={size} />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 ring-2 ring-white dark:ring-zinc-900 font-semibold',
            sizeStyles[size]
          )}
          title={`${remainingCount} more members`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
