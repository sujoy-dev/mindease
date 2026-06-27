import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function SuccessToast({ message, duration = 3000, onClose }: { message: string, duration?: number, onClose?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible || !message) return null;
  
  return (
    <div 
      className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-100 shadow-[var(--shadow-card)] text-[var(--color-success)] p-4 rounded-[var(--radius-card)] z-50 animate-in slide-in-from-bottom-5 fade-in duration-300"
      role="alert"
      aria-live="polite"
    >
      <CheckCircle2 className="w-5 h-5" />
      <p className="font-medium text-[var(--color-text-primary)]">{message}</p>
    </div>
  );
}
