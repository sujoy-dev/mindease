import { PatternData } from '@/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Target, Activity, TrendingUp } from 'lucide-react';
import { MOOD_SCALE } from '@/constants/moodScale';

export function PatternSummary({ data }: { data: PatternData | null }) {
  if (!data || data.entriesCount === 0) {
    return (
      <Card className="p-6 text-center">
        <Activity className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-700">No patterns yet</h3>
        <p className="text-sm text-gray-500 mt-1">Keep journaling! We need a few more entries to identify your unique patterns.</p>
      </Card>
    );
  }

  const avgMoodInt = Math.round(data.averageMood);
  const moodInfo = MOOD_SCALE.find(m => m.value === avgMoodInt) || MOOD_SCALE[2];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 flex items-start gap-4 bg-gradient-to-br from-[var(--color-bg)] to-white">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 shrink-0">
            <span className="text-2xl">{moodInfo.emoji}</span>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Average Mood</h3>
            <p className="text-lg font-semibold text-gray-900">{moodInfo.label}</p>
            <p className="text-xs text-gray-400 mt-1">Over last {data.entriesCount} entries</p>
          </div>
        </Card>

        {data.frequentPattern && (
          <Card className="p-5 flex items-start gap-4">
            <div className="bg-indigo-50 p-2 rounded-xl shrink-0 text-indigo-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dominant Emotion</h3>
              <p className="text-sm font-medium text-gray-900">{data.frequentPattern}</p>
            </div>
          </Card>
        )}
      </div>

      {data.commonTriggers.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[var(--color-secondary)]" />
            <h3 className="font-semibold text-gray-900">Frequent Triggers</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.commonTriggers.map((t, i) => (
              <Badge key={i} className="px-3 py-1 bg-gray-100 text-gray-700 border-none">{t}</Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
