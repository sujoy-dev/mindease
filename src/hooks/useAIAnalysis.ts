import { useState, useCallback } from 'react';
import { SupabaseJournalEntry, SupabaseAIResponse } from '@/types';

/**
 * Hook to manage AI analysis of journal entries.
 * Handles the loading state, errors, and fetch request to the analyze API.
 * 
 * @returns {Object} Object containing the analyze function, loading state, error state, and response data.
 */
export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    journal: SupabaseJournalEntry;
    aiResponse: SupabaseAIResponse;
  } | null>(null);

  /**
   * Analyzes the journal entry by making an API request.
   * 
   * @param {string} entry_text - The text content of the journal entry.
   * @param {number} mood_score - The mood score associated with the entry.
   * @param {string} [exam_type] - The optional exam type context.
   * @returns {Promise<any>} The AI analysis result data.
   */
  const analyze = useCallback(async (entry_text: string, mood_score: number, exam_type?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry_text, mood_score, exam_type }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to analyze entry');

      setData(json);
      return json;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error, data };
};
