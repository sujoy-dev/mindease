import { createClient } from '@/lib/supabase/client';
import { 
  UserProfile, 
  SupabaseJournalEntry, 
  SupabaseAIResponse, 
  SupabaseMoodLog 
} from '@/types';

// Profile operations
export const getProfile = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as UserProfile;
};

export const createProfile = async (profile: Partial<UserProfile>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
};

export const updateStreak = async (userId: string) => {
  const supabase = createClient();
  const profile = await getProfile(userId);
  
  const today = new Date().toISOString().split('T')[0];
  const lastDate = profile.last_entry_date ? new Date(profile.last_entry_date).toISOString().split('T')[0] : null;

  if (today === lastDate) {
    return profile; // Already updated today
  }

  let newStreak = profile.streak_count || 0;
  
  if (lastDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1; // Reset streak
    }
  } else {
    newStreak = 1;
  }

  return updateProfile(userId, {
    streak_count: newStreak,
    last_entry_date: new Date().toISOString()
  });
};

// Journal operations
export const saveJournalEntry = async (entry: SupabaseJournalEntry) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getJournalEntries = async (userId: string, limit = 7) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// AI Response operations
export const saveAIResponse = async (response: SupabaseAIResponse) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ai_responses')
    .insert([response])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAIResponses = async (userId: string, limit = 7) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ai_responses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// Mood log operations
export const saveMoodLog = async (log: SupabaseMoodLog) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('mood_logs')
    .insert([log])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMoodLogs = async (userId: string, limit = 7) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
