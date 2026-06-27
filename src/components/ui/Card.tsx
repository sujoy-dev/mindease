import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-card)] border border-gray-100 bg-white text-[var(--color-text-primary)] shadow-[var(--shadow-card)]',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';
