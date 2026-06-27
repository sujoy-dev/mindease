import { renderHook, act } from '@testing-library/react';
import { useMoodHistory } from '../src/hooks/useMoodHistory';
import { useAuth } from '../src/hooks/useAuth';
import { createClient } from '../src/lib/supabase/client';

jest.mock('../src/hooks/useAuth');
jest.mock('../src/lib/supabase/client');

describe('useMoodHistory', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [{ id: 1, mood_score: 4 }], error: null }),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not fetch if user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useMoodHistory());
    
    expect(result.current.loading).toBe(true); // Wait, loading starts true in useEffect...
    // Let's just check the data is empty and fetch was not called
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('fetches mood logs for authenticated user', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '123' } });

    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => useMoodHistory()).result;
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('mood_logs');
    expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', '123');
    expect(hookResult.current.logs).toEqual([{ id: 1, mood_score: 4 }]);
    expect(hookResult.current.loading).toBe(false);
  });
});
