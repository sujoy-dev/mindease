import { useState, useCallback, useEffect } from 'react';
import { PatternData } from '@/types';
import { useAuth } from './useAuth';

/**
 * Hook to fetch and manage the user's mood and journal patterns.
 * 
 * @param {number} limit - The maximum number of days to analyze (default: 7).
 * @returns {Object} Object containing patterns data, loading state, error state, and a refetch function.
 */
export const usePatterns = (limit = 7) => {
  const [patterns, setPatterns] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Fetches the pattern analysis data from the backend API.
   */
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
