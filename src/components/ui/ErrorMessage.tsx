import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ErrorMessage({ message, className }: { message: string, className?: string }) {
  if (!message) return null;
  
  return (
    <div 
      className={cn("flex items-start gap-2 bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-3 rounded-[var(--radius-input)] text-sm", className)}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}
