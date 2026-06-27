import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SupabaseAIResponse } from '@/types';
import { Brain, Heart, Lightbulb, Zap } from 'lucide-react';
import { CrisisCard } from './CrisisCard';

export function AIResponse({ response }: { response: SupabaseAIResponse }) {
  if (!response) return null;

  const isHighStress = response.severity_level && response.severity_level >= 4;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-6 border-l-4 border-l-[var(--color-primary)] w-full">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="text-lg font-semibold">MindEase Insight</h2>
        </div>

        {response.emotional_pattern && (
          <p className="text-lg text-[var(--color-text-primary)] mb-6 font-medium">
            "{response.emotional_pattern}"
          </p>
        )}

        {response.stress_triggers && response.stress_triggers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Identified Triggers</h3>
            <div className="flex flex-wrap gap-2">
              {response.stress_triggers.map((trigger, i) => (
                <Badge key={i} variant="outline" className="bg-orange-50">{trigger}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {response.coping_strategy && (
            <div className="bg-[var(--color-bg)] p-4 rounded-[var(--radius-card)]">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="font-semibold text-sm">Strategy</h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">{response.coping_strategy}</p>
            </div>
          )}

          {response.mindfulness_exercise && (
            <div className="bg-teal-50 p-4 rounded-[var(--radius-card)]">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-sm text-teal-800">Mindfulness</h3>
              </div>
              <p className="text-sm text-teal-700">{response.mindfulness_exercise}</p>
            </div>
          )}
        </div>

        {response.motivation && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex gap-3 items-start">
              <div className="bg-indigo-100 p-2 rounded-full shrink-0">
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-[var(--color-text-primary)] italic font-medium">
                "{response.motivation}"
              </p>
            </div>
          </div>
        )}
      </Card>

      {isHighStress && <CrisisCard />}
    </div>
  );
}
