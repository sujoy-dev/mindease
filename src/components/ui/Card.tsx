import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * A container component for grouping related content in a styled card.
 */
export const Card = React.memo(React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-card)] border border-[#E5E7EB] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)]',
        className
      )}
      {...props}
    />
  )
));
Card.displayName = 'Card';
