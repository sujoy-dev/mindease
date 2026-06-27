import { Card } from '../ui/Card';

export function BreathingExercise() {
  return (
    <Card className="p-8 flex flex-col items-center justify-center text-center bg-teal-50 border-teal-100">
      <h3 className="text-lg font-semibold text-teal-800 mb-2">Take a moment</h3>
      <p className="text-sm text-teal-600 mb-8 max-w-xs">
        Follow the circle. Breathe in as it expands, breathe out as it shrinks.
      </p>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Breathing Circle - Uses pure CSS animation defined in globals.css */}
        <div className="absolute w-32 h-32 bg-teal-200 rounded-full animate-breathing opacity-80 shadow-lg"></div>
        <div className="relative z-10 text-teal-800 font-medium text-sm tracking-widest uppercase">
          Breathe
        </div>
      </div>
    </Card>
  );
}
