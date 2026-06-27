import { analyzePatterns } from '../src/utils/patternAnalyzer';
import { SupabaseJournalEntry, SupabaseAIResponse } from '../src/types';

describe('analyzePatterns', () => {
  it('returns empty data when no entries are provided', () => {
    const result = analyzePatterns([], []);
    expect(result.entriesCount).toBe(0);
    expect(result.averageMood).toBe(0);
  });

  it('calculates average mood and frequent pattern', () => {
    const entries: SupabaseJournalEntry[] = [
      { id: '1', user_id: 'u1', entry_text: 'text', mood_score: 2, exam_type: 'NEET' },
      { id: '2', user_id: 'u1', entry_text: 'text', mood_score: 4, exam_type: 'NEET' },
    ];
    const responses: SupabaseAIResponse[] = [
      { journal_entry_id: '1', user_id: 'u1', stress_triggers: ['time'], emotional_pattern: 'Anxious', severity_level: 4, coping_strategy: '', mindfulness_exercise: '', motivation: '', raw_response: '' },
      { journal_entry_id: '2', user_id: 'u1', stress_triggers: ['time', 'sleep'], emotional_pattern: 'Anxious', severity_level: 2, coping_strategy: '', mindfulness_exercise: '', motivation: '', raw_response: '' }
    ];

    const result = analyzePatterns(entries, responses);
    expect(result.entriesCount).toBe(2);
    expect(result.averageMood).toBe(3); // (2+4)/2
    expect(result.frequentPattern).toBe('Anxious');
    expect(result.commonTriggers).toContain('time');
    expect(result.commonTriggers).toContain('sleep');
  });
});
