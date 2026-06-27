import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../src/hooks/useAuth';
import { createClient } from '../src/lib/supabase/client';
import { useRouter } from 'next/navigation';

jest.mock('../src/lib/supabase/client');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useAuth', () => {
  let mockSupabase: any;
  let mockRouter: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('initializes with loading true and fetches session', async () => {
    const { result } = renderHook(() => useAuth());

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the async useEffect
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('logout signs out and redirects to login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});
