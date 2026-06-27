import { useState, useCallback } from 'react';
import { ExamType } from '@/types';
import { ErrorMessage } from '../ui/ErrorMessage';

/** Props for the JournalForm component */
interface JournalFormProps {
  defaultExam: ExamType;
  onSubmit: (text: string, mood: number, exam: ExamType) => Promise<void>;
  loading: boolean;
}

/** Mood option configuration */
const MOODS = [
  { emoji: '😔', val: 1, label: 'Awful' },
  { emoji: '😟', val: 2, label: 'Bad' },
  { emoji: '😐', val: 3, label: 'Okay' },
  { emoji: '🙂', val: 4, label: 'Good' },
  { emoji: '😊', val: 5, label: 'Great' },
];

/** Prompt chip suggestions */
const PROMPTS = [
  'What stressed me today',
  "What I'm grateful for",
  'My biggest worry',
  'A small win today',
];

/**
 * JournalForm — Collects mood, optional prompt chips, and free-text journal entry.
 * Submits to AI analysis on form submission.
 */
export function JournalForm({ defaultExam, onSubmit, loading }: JournalFormProps) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState(3);
  const [exam] = useState<ExamType>(defaultExam);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please write something in your journal.');
      return;
    }
    setError(null);
    try {
      await onSubmit(text, mood, exam);
      setText('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit entry';
      setError(message);
    }
  }, [text, mood, exam, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">

      {/* ─── Mood Picker ─── */}
      <div>
        <h3 className="text-lg font-bold text-[#1E1B4B] mb-3">How are you feeling right now?</h3>
        <div className="flex gap-3">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m.val}
              onClick={() => setMood(m.val)}
              aria-label={`Select mood: ${m.label}`}
              aria-pressed={mood === m.val}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all text-center ${
                mood === m.val
                  ? 'bg-[#EEF2FF] border-2 border-[#6366F1] shadow-[0_4px_12px_rgba(99,102,241,0.15)] scale-[1.03]'
                  : 'bg-white border border-[#E5E7EB] hover:border-[#C7D2FE] shadow-sm'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className={`text-[10px] font-medium ${mood === m.val ? 'text-[#6366F1]' : 'text-[#9CA3AF]'}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Prompt Chips ─── */}
      <div>
        <p className="text-xs font-medium text-[#9CA3AF] mb-2 flex items-center gap-1">
          Need a prompt? Try these →
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {PROMPTS.map((p) => (
            <button
              type="button"
              onClick={() => setText((prev) => (prev ? prev + '\n' + p : p))}
              key={p}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-[#F3EEFF] text-[#6D28D9] text-xs font-medium hover:bg-[#E8DDFF] transition-colors border border-[#DDD6FE]/40 shadow-sm"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Textarea ─── */}
      <div className="flex-1 flex flex-col rounded-2xl bg-[#FAFAFE] border border-[#E5E7EB] shadow-sm overflow-hidden transition-all focus-within:shadow-[0_4px_20px_rgba(99,102,241,0.08)] focus-within:border-[#C7D2FE] min-h-[280px]">
        <textarea
          aria-label="Journal entry text"
          className="flex-1 w-full p-5 bg-transparent border-none resize-none text-[15px] text-[#1E1B4B] placeholder:text-[#B0ADC6] leading-relaxed focus:outline-none min-h-[220px]"
          placeholder="Write freely... How did studying go today? What's bothering you? There are no right answers here."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end items-center px-4 py-2 bg-[#FAFAFE] border-t border-[#F3F4F6]">
          <span className="text-[11px] text-[#9CA3AF]">{text.length} characters</span>
        </div>
      </div>

      {error && (
        <div aria-live="polite">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* ─── Submit Button ─── */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full md:w-auto md:min-w-[320px] bg-[#6366F1] text-white font-semibold text-base py-4 px-8 rounded-full shadow-[0_6px_20px_rgba(99,102,241,0.3)] hover:bg-[#4F46E5] hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? 'Analyzing...' : 'Analyze with AI ✨'}
        </button>
        <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
          Your entry is private and session-only 🔒
        </p>
      </div>
    </form>
  );
}
