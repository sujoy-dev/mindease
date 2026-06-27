import { AIWellnessResponse } from '../types';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeJournalEntry = async (prompt: string): Promise<{ data?: AIWellnessResponse, raw?: string, error?: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    
    // Safety fallback: ensure response is valid JSON
    let parsed: AIWellnessResponse;
    try {
      parsed = JSON.parse(text) as AIWellnessResponse;
      
      // Basic validation of expected fields
      if (!parsed.triggers || typeof parsed.severityLevel !== 'number') {
        throw new Error('Invalid JSON structure returned from Gemini.');
      }
      
      return { data: parsed, raw: text };
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON', parseError);
      return { error: 'Failed to process AI response.', raw: text };
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return { error: error.message || 'An error occurred during AI analysis.' };
  }
};
