import { renderHook, act } from '@testing-library/react';
import { useAIAnalysis } from '../src/hooks/useAIAnalysis';

describe('useAIAnalysis', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('initializes with loading false and no error', () => {
    const { result } = renderHook(() => useAIAnalysis());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it('sets loading to true while analyzing and then updates data', async () => {
    const mockData = { journal: { id: 1 }, aiResponse: { id: 1 } };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useAIAnalysis());

    let analyzeResult;
    await act(async () => {
      analyzeResult = await result.current.analyze('test entry', 3, 'JEE');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_text: 'test entry', mood_score: 3, exam_type: 'JEE' }),
    });

    expect(analyzeResult).toEqual(mockData);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error if API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error' }),
    });

    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      try {
        await result.current.analyze('test entry', 3);
      } catch (e) {
        // Handle error correctly
      }
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.loading).toBe(false);
  });
});
