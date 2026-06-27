import { renderHook, act } from '@testing-library/react';
import { useJournal } from '../src/hooks/useJournal';
import { useAuth } from '../src/hooks/useAuth';
import { createClient } from '../src/lib/supabase/client';

jest.mock('../src/hooks/useAuth');
jest.mock('../src/lib/supabase/client');

describe('useJournal', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [{ id: 'j1' }], error: null }),
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches recent entries on mount if user authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'u1' } });

    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => useJournal()).result;
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
    expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'u1');
    expect(hookResult.current.entries).toEqual([{ id: 'j1' }]);
  });
});
