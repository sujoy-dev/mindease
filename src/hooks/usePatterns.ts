import { useState, useCallback, useEffect } from 'react';
import { PatternData } from '@/types';
import { useAuth } from './useAuth';

export const usePatterns = (limit = 7) => {
  const [patterns, setPatterns] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPatterns = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/patterns?limit=${limit}`);
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || 'Failed to fetch patterns');
      
      setPatterns(json as PatternData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchPatterns();
  }, [fetchPatterns]);

  return { patterns, loading, error, refetch: fetchPatterns };
};
