import { useState, useCallback, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SupabaseJournalEntry } from '@/types';
import { useAuth } from './useAuth';

/**
 * Hook to manage fetching and state of journal entries for a user.
 * 
 * @param {number} limit - The maximum number of journal entries to fetch (default: 10).
 * @returns {Object} Object containing entries, loading state, error, and a refetch function.
 */
export const useJournal = (limit = 10) => {
  const [entries, setEntries] = useState<SupabaseJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  /**
   * Fetches journal entries from Supabase.
   */
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
