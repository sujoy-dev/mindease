import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfile, saveJournalEntry, saveAIResponse, updateStreak, getAIResponses, saveMoodLog } from '@/services/supabase';
import { validateJournalEntry, validateMoodScore } from '@/utils/sanitizer';
import { buildPrompt } from '@/utils/promptBuilder';
import { analyzeJournalEntry } from '@/services/gemini';
import { JournalEntry, SupabaseJournalEntry, SupabaseAIResponse, SupabaseMoodLog } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { entry_text, mood_score, exam_type } = body;

    // Validate and sanitize
    const sanitizedText = validateJournalEntry(entry_text);
    const validMoodScore = validateMoodScore(mood_score);

    if (!sanitizedText) {
      return NextResponse.json({ error: 'Journal entry text is required.' }, { status: 400 });
    }

    // Fetch user profile for context
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
    }
    
    // Fetch last 3 AI responses for context
    const { data: previousResponses } = await supabase
      .from('ai_responses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    const tempJournalEntry: JournalEntry = {
      id: 'temp',
      user_id: user.id,
      entry_text: sanitizedText,
      mood_score: validMoodScore,
      exam_type: exam_type || profile.exam_type,
      created_at: new Date().toISOString(),
    };

    const prompt = buildPrompt(tempJournalEntry, profile, previousResponses || []);
    
    // Call Gemini
    const { data: aiData, error: aiError, raw } = await analyzeJournalEntry(prompt);

    if (aiError || !aiData) {
      return NextResponse.json({ error: aiError || 'Failed to analyze entry' }, { status: 500 });
    }

    // Save Journal Entry to Supabase
    const { data: savedEntry, error: journalError } = await supabase
      .from('journal_entries')
      .insert([{
        user_id: user.id,
        entry_text: sanitizedText,
        mood_score: validMoodScore,
        exam_type: exam_type || profile.exam_type,
      }])
      .select()
      .single();

    if (journalError || !savedEntry) {
      throw journalError || new Error('Failed to save journal entry');
    }

    // Save AI Response to Supabase
    const { data: savedResponse, error: aiResponseError } = await supabase
      .from('ai_responses')
      .insert([{
        journal_entry_id: savedEntry.id,
        user_id: user.id,
        stress_triggers: aiData.triggers,
        emotional_pattern: aiData.pattern,
        severity_level: aiData.severityLevel,
        coping_strategy: aiData.copingStrategy,
        mindfulness_exercise: aiData.mindfulnessExercise,
        motivation: aiData.motivation,
        raw_response: raw || null,
      }])
      .select()
      .single();

    if (aiResponseError || !savedResponse) {
      throw aiResponseError || new Error('Failed to save AI response');
    }

    // Save Mood Log independently for chart consistency
    await supabase
      .from('mood_logs')
      .insert([{
        user_id: user.id,
        mood_score: validMoodScore,
      }]);

    // Update Streak logic inline
    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.last_entry_date ? new Date(profile.last_entry_date).toISOString().split('T')[0] : null;

    if (today !== lastDate) {
      let newStreak = profile.streak_count || 0;
      if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastDate === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      await supabase
        .from('profiles')
        .update({
          streak_count: newStreak,
          last_entry_date: new Date().toISOString()
        })
        .eq('id', user.id);
    }

    return NextResponse.json({
      journal: savedEntry,
      aiResponse: savedResponse
    });

  } catch (error: any) {
    console.error('Analyze API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
