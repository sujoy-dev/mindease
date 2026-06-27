import { UserProfile, JournalEntry, SupabaseAIResponse } from '../types';
import { GEMINI_SYSTEM_PROMPT } from '../constants/prompts';

/**
 * Builds the comprehensive prompt for Gemini to analyze the journal entry.
 * Incorporates user profile (exam type, tone) and past responses for context.
 */
export const buildPrompt = (
  entry: JournalEntry,
  profile: UserProfile,
  previousResponses: SupabaseAIResponse[]
): string => {
  const pastContext = previousResponses.length > 0
    ? `\n\nPast interactions summary:\n${previousResponses.map(r => 
        `- Emotion: ${r.emotional_pattern} (Severity: ${r.severity_level})`
      ).join('\n')}`
    : '';

  return `${GEMINI_SYSTEM_PROMPT}

USER CONTEXT:
- Exam Preparing For: ${profile.exam_type}
- Preferred Tone: ${profile.tone_preference}
- Current Mood Score: ${entry.mood_score}/5
${pastContext}

TODAY'S JOURNAL ENTRY:
"${entry.entry_text}"

Analyze the entry based on the rules and respond STRICTLY in JSON.`;
};
