import { EXAM_LIST } from '@/constants/examList';
import { ExamType } from '@/types';

interface ExamSelectorProps {
  value: ExamType;
  onChange: (exam: ExamType) => void;
}

export function ExamSelector({ value, onChange }: ExamSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAM_LIST.map((exam) => (
        <button
          key={exam.id}
          type="button"
          onClick={() => onChange(exam.id as ExamType)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            value === exam.id
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-white text-[var(--color-text-secondary)] border-gray-200 hover:border-[var(--color-primary)]/50'
          }`}
        >
          {exam.id}
        </button>
      ))}
    </div>
  );
}
