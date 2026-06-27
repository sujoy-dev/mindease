import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

/**
 * Badge component for displaying status, labels, or tags.
 */
export const Badge = React.memo(function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-indigo-100 text-indigo-700',
    success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    warning: 'bg-orange-100 text-orange-700',
    danger: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
    outline: 'border border-gray-200 text-gray-700 bg-white',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
