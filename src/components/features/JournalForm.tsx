import { useState } from 'react';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { MoodPicker } from '../ui/MoodPicker';
import { Button } from '../ui/Button';
import { ExamSelector } from './ExamSelector';
import { ExamType } from '@/types';
import { ErrorMessage } from '../ui/ErrorMessage';

interface JournalFormProps {
  defaultExam: ExamType;
  onSubmit: (text: string, mood: number, exam: ExamType) => Promise<void>;
  loading: boolean;
}

export function JournalForm({ defaultExam, onSubmit, loading }: JournalFormProps) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState(3);
  const [exam, setExam] = useState<ExamType>(defaultExam);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please write something in your journal.');
      return;
    }
    setError(null);
    try {
      await onSubmit(text, mood, exam);
      setText(''); // Reset only text on success
    } catch (err: any) {
      setError(err.message || 'Failed to submit entry');
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">How are you feeling right now?</h2>
          <MoodPicker value={mood} onChange={setMood} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Which exam are you focusing on today?</h2>
          <ExamSelector value={exam} onChange={setExam} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Journal your thoughts</h2>
          <Textarea 
            placeholder="What's on your mind? Did you take a mock test? Are you feeling overwhelmed by a specific subject?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <ErrorMessage message={error} />}

        <Button type="submit" disabled={loading || !text.trim()} className="w-full">
          {loading ? 'Analyzing...' : 'Log & Get Support'}
        </Button>
      </form>
    </Card>
  );
}
