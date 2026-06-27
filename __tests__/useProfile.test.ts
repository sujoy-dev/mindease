import { renderHook, act } from '@testing-library/react';
import { useProfile } from '../src/hooks/useProfile';
import { useAuth } from '../src/hooks/useAuth';
import { createClient } from '../src/lib/supabase/client';

jest.mock('../src/hooks/useAuth');
jest.mock('../src/lib/supabase/client');

describe('useProfile', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { name: 'Test' }, error: null }),
      update: jest.fn().mockReturnThis(),
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not fetch if unauthenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, isLoading: false });
    
    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => useProfile()).result;
    });

    expect(hookResult.current.loading).toBe(false);
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('fetches profile data on mount', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'u1' } });

    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => useProfile()).result;
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'u1');
    expect(hookResult.current.profile).toEqual({ name: 'Test' });
    expect(hookResult.current.loading).toBe(false);
  });
});
