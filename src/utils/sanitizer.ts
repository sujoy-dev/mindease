import { ExamType, TonePreference } from '../types';
import { EXAM_LIST } from '../constants/examList';

/**
 * Trims whitespace and removes HTML tags from input string.
 * @param input Raw string input
 * @returns Sanitized string
 */
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  const noHtml = input.replace(/<[^>]*>?/gm, '');
  return noHtml.trim();
};

/**
 * Validates and limits journal entry text length (max 2000 chars).
 * @param text The journal entry text
 * @returns Sanitized and truncated text
 */
export const validateJournalEntry = (text: string): string => {
  const sanitized = sanitizeText(text);
  if (sanitized.length > 2000) {
    return sanitized.substring(0, 2000);
  }
  return sanitized;
};

/**
 * Validates mood score to ensure it is between 1 and 5.
 * @param score Raw mood score
 * @returns A valid mood score between 1 and 5
 */
export const validateMoodScore = (score: number | string): number => {
  const num = typeof score === 'string' ? parseInt(score, 10) : score;
  if (isNaN(num)) return 3; // Default to neutral if invalid
  if (num < 1) return 1;
  if (num > 5) return 5;
  return num;
};

/**
 * Validates exam type against the allowed list.
 * @param exam Raw exam type string
 * @returns A valid ExamType or 'NEET' as default
 */
export const validateExamType = (exam: string): ExamType => {
  const validExams = EXAM_LIST.map((e) => e.id as string);
  if (validExams.includes(exam)) {
    return exam as ExamType;
  }
  return 'NEET'; // Default
};

/**
 * Validates tone preference against allowed types.
 * @param tone Raw tone preference string
 * @returns A valid TonePreference or 'gentle' as default
 */
export const validateTonePreference = (tone: string): TonePreference => {
  const validTones = ['gentle', 'direct', 'motivational'];
  if (validTones.includes(tone)) {
    return tone as TonePreference;
  }
  return 'gentle'; // Default
};
