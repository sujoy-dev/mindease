import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SupabaseJournalEntry } from '@/types';
import { useAuth } from './useAuth';

export const useJournal = (limit = 10) => {
  const [entries, setEntries] = useState<SupabaseJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (err) throw err;
      setEntries(data as SupabaseJournalEntry[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, limit]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, error, refetch: fetchEntries };
};
