import { useState, useCallback, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SupabaseMoodLog } from '@/types';
import { useAuth } from './useAuth';

/**
 * Hook to fetch and manage the user's mood history logs.
 * 
 * @param {number} limit - The maximum number of mood logs to fetch (default: 7).
 * @returns {Object} Object containing mood logs, loading state, error state, and a refetch function.
 */
export const useMoodHistory = (limit = 7) => {
  const [logs, setLogs] = useState<SupabaseMoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  /**
   * Fetches the user's mood logs from Supabase.
   */
  const fetchLogs = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(limit);

      if (err) throw err;
      setLogs(data as SupabaseMoodLog[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
};
