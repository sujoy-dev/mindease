import { validateJournalEntry, validateMoodScore, validateExamType } from '../src/utils/sanitizer';

describe('Sanitizer Utilities', () => {
  it('trims whitespace and removes HTML from journal entry', () => {
    const input = '  <script>alert(1)</script> Hello World!  ';
    const result = validateJournalEntry(input);
    expect(result).toBe('alert(1) Hello World!'); // next/jsdom strip behavior or just basic tags
  });

  it('limits text to 2000 characters', () => {
    const input = 'a'.repeat(2500);
    const result = validateJournalEntry(input);
    expect(result.length).toBe(2000);
  });

  it('validates mood score bounds', () => {
    expect(validateMoodScore(6)).toBe(5);
    expect(validateMoodScore(0)).toBe(1);
    expect(validateMoodScore(3)).toBe(3);
    expect(validateMoodScore('invalid')).toBe(3);
  });

  it('validates exam types', () => {
    expect(validateExamType('UPSC')).toBe('UPSC');
    expect(validateExamType('INVALID_EXAM')).toBe('NEET');
  });
});
