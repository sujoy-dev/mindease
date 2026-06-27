import { SupabaseJournalEntry, SupabaseAIResponse, PatternData } from '../types';

/**
 * Analyzes historical journal entries and AI responses to aggregate pattern data.
 */
export const analyzePatterns = (
  entries: SupabaseJournalEntry[],
  responses: SupabaseAIResponse[]
): PatternData => {
  if (entries.length === 0) {
    return {
      commonTriggers: [],
      averageMood: 0,
      frequentPattern: null,
      entriesCount: 0
    };
  }

  // Calculate average mood
  const totalMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0);
  const averageMood = Math.round((totalMood / entries.length) * 10) / 10;

  // Aggregate triggers
  const triggerCounts: Record<string, number> = {};
  responses.forEach(r => {
    if (r.stress_triggers) {
      r.stress_triggers.forEach(trigger => {
        const t = trigger.toLowerCase().trim();
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    }
  });

  const commonTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(t => t[0]);

  // Determine most frequent pattern if any
  const patternCounts: Record<string, number> = {};
  responses.forEach(r => {
    if (r.emotional_pattern) {
      patternCounts[r.emotional_pattern] = (patternCounts[r.emotional_pattern] || 0) + 1;
    }
  });

  const frequentPatternEntry = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0];
  const frequentPattern = frequentPatternEntry ? frequentPatternEntry[0] : null;

  return {
    commonTriggers,
    averageMood,
    frequentPattern,
    entriesCount: entries.length
  };
};
