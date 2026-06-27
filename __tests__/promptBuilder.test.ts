import { buildPrompt } from '../src/utils/promptBuilder';
import { UserProfile, JournalEntry, SupabaseAIResponse, ExamType, TonePreference } from '../src/types';
import { GEMINI_SYSTEM_PROMPT } from '../src/constants/prompts';

describe('promptBuilder', () => {
  it('builds a prompt with correct context', () => {
    const entry: JournalEntry = {
      id: '1',
      user_id: '123',
      entry_text: 'I am so stressed about physics.',
      mood_score: 2,
      exam_type: 'JEE' as ExamType,
      created_at: '',
    };
    const profile: UserProfile = {
      id: '123',
      name: 'Test',
      created_at: '',
      last_entry_date: null,
      streak_count: 0,
      exam_type: 'JEE' as ExamType,
      tone_preference: 'gentle' as TonePreference,
    };
    const previousResponses: SupabaseAIResponse[] = [
      {
        id: '1',
        journal_entry_id: '1',
        user_id: '123',
        emotional_pattern: 'Academic Burnout',
        severity_level: 4,
        stress_triggers: [],
        coping_strategy: null,
        mindfulness_exercise: null,
        motivation: null,
        raw_response: null,
        created_at: '',
      }
    ];

    const prompt = buildPrompt(entry, profile, previousResponses);

    expect(prompt).toContain(GEMINI_SYSTEM_PROMPT);
    expect(prompt).toContain('Exam Preparing For: JEE');
    expect(prompt).toContain('Preferred Tone: gentle');
    expect(prompt).toContain('Current Mood Score: 2/5');
    expect(prompt).toContain('Academic Burnout');
    expect(prompt).toContain('I am so stressed about physics.');
  });
});
