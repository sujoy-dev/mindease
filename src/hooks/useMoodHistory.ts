import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SupabaseMoodLog } from '@/types';
import { useAuth } from './useAuth';

export const useMoodHistory = (limit = 7) => {
  const [logs, setLogs] = useState<SupabaseMoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

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
