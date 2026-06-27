import { cn } from '@/lib/utils';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)} aria-live="polite" aria-busy="true">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-[var(--color-text-secondary)] animate-pulse">Thinking about what you shared...</p>
    </div>
  );
}
