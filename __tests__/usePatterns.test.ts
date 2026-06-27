import { renderHook, act } from '@testing-library/react';
import { usePatterns } from '../src/hooks/usePatterns';
import { useAuth } from '../src/hooks/useAuth';

jest.mock('../src/hooks/useAuth');

describe('usePatterns', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not fetch if unauthenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    const { result } = renderHook(() => usePatterns());

    expect(result.current.loading).toBe(true);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fetches pattern data on mount', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'u1' } });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ commonTriggers: ['exams'] }),
    });

    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => usePatterns()).result;
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/patterns?limit=7');
    expect(hookResult.current.patterns).toEqual({ commonTriggers: ['exams'] });
    expect(hookResult.current.loading).toBe(false);
  });
});
