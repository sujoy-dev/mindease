import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthState } from '@/types';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, session: null, isLoading: true });
  const supabase = createClient();
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

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return { ...authState, logout };
};
