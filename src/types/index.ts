export type ExamType = 'NEET' | 'JEE' | 'CUET' | 'CAT' | 'GATE' | 'UPSC';
export type TonePreference = 'gentle' | 'direct' | 'motivational';

export interface UserProfile {
  id: string; // uuid
  name: string;
  exam_type: ExamType;
  tone_preference: TonePreference;
  streak_count: number;
  last_entry_date: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string; // uuid
  user_id: string;
  entry_text: string;
  mood_score: number; // 1 to 5
  exam_type: ExamType;
  created_at: string;
}

export interface SupabaseJournalEntry {
  id?: string;
  user_id: string;
  entry_text: string;
  mood_score: number;
  exam_type: string;
  created_at?: string;
}

export interface AIWellnessResponse {
  triggers: string[];
  pattern: string;
  severityLevel: number; // 1 to 5
  copingStrategy: string;
  mindfulnessExercise: string;
  motivation: string;
}

export interface SupabaseAIResponse {
  id?: string;
  journal_entry_id: string;
  user_id: string;
  stress_triggers: string[];
  emotional_pattern: string | null;
  severity_level: number | null;
  coping_strategy: string | null;
  mindfulness_exercise: string | null;
  motivation: string | null;
  raw_response: string | null;
  created_at?: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  mood_score: number;
  logged_at: string;
}

export interface SupabaseMoodLog {
  id?: string;
  user_id: string;
  mood_score: number;
  logged_at?: string;
}

import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null; // Supabase user
  session: Session | null; // Supabase session
  isLoading: boolean;
}

export interface OnboardingData {
  name: string;
  exam_type: ExamType | '';
  tone_preference: TonePreference | '';
}

export interface PatternData {
  commonTriggers: string[];
  averageMood: number;
  frequentPattern: string | null;
  entriesCount: number;
}
