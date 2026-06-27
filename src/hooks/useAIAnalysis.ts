import { useState } from 'react';
import { SupabaseJournalEntry, SupabaseAIResponse } from '@/types';

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    journal: SupabaseJournalEntry;
    aiResponse: SupabaseAIResponse;
  } | null>(null);

  const analyze = async (entry_text: string, mood_score: number, exam_type?: string) => {
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
  };

  return { analyze, loading, error, data };
};
