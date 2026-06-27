import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthState } from '@/types';
import { useRouter } from 'next/navigation';

/**
 * Hook to manage user authentication state.
 * Subscribes to Supabase auth events and provides login state and logout function.
 * 
 * @returns {AuthState & { logout: () => Promise<void> }} The current authentication state and logout function.
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, session: null, isLoading: true });
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setAuthState({ user: session?.user || null, session, isLoading: false });
    };
    
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({ user: session?.user || null, session, isLoading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  /**
   * Logs out the current user and redirects to the login page.
   */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }, [supabase.auth, router]);

  return { ...authState, logout };
};
