import * as React from 'react';
import { MOOD_SCALE } from '@/constants/moodScale';
import { cn } from '@/lib/utils';

interface MoodPickerProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * A horizontal row of emoji buttons for picking a mood score (1-5).
 */
export const MoodPicker = React.memo(function MoodPicker({ value, onChange, className }: MoodPickerProps) {
  return (
    <div className={cn("flex flex-row justify-between sm:justify-start gap-2 sm:gap-4", className)}>
      {MOOD_SCALE.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all min-w-[60px]",
            value === mood.value 
              ? `border-[var(--color-primary)] ${mood.color} scale-110 shadow-md` 
              : "border-gray-100 hover:bg-gray-50 hover:border-gray-200 bg-white"
          )}
          aria-label={`Select mood: ${mood.label}`}
          aria-pressed={value === mood.value}
        >
          <span className="text-2xl mb-1">{mood.emoji}</span>
          <span className={cn(
            "text-[10px] font-medium hidden sm:block",
            value === mood.value ? "text-current" : "text-gray-500"
          )}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}

);
