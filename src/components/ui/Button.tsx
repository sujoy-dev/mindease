import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-[var(--radius-pill)] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:pointer-events-none min-h-[44px] w-full sm:w-auto';
    
    const variants = {
      primary: 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:opacity-90',
      secondary: 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-primary)]',
      outline: 'border border-gray-200 text-[var(--color-text-primary)] hover:bg-gray-50',
      ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-gray-100',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-[44px] px-6 text-base',
      lg: 'h-12 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
