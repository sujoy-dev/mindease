import { Flame } from 'lucide-react';
import { Card } from '../ui/Card';

export function StreakCard({ count }: { count: number }) {
  return (
    <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
      <div className="bg-white p-3 rounded-full shadow-sm relative">
        <Flame className={`w-8 h-8 ${count > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
        {count > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-ping" />
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-orange-900">Current Streak</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-orange-600">{count}</span>
          <span className="text-sm font-medium text-orange-700">Days</span>
        </div>
      </div>
    </Card>
  );
}
