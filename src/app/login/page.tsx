'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profile) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-md relative overflow-hidden">
      {/* Atmospheric background blobs for modern soft minimalism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed opacity-40 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed opacity-30 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md rounded-[16px] shadow-[0_4px_20px_rgba(99,102,241,0.08)] p-lg relative z-10 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] transition-shadow duration-300">
        <div className="text-center mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">spa</span>
            MindEase
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Your calm corner during the storm 🌿</p>
        </div>
        
        <div className="mb-md">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Welcome back</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Please enter your details to sign in.</p>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg mb-4 text-sm" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-[24px]">
          <div className="space-y-sm">
            <label htmlFor="email" className="block font-label-md text-label-md text-on-surface">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant text-[20px]">mail</span>
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full pl-10 py-3 bg-[#F1F5F9] border border-[#E0E7FF] rounded-[12px] font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block font-label-md text-label-md text-on-surface">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant text-[20px]">lock</span>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-3 bg-[#F1F5F9] border border-[#E0E7FF] rounded-[12px] font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm font-label-md text-label-md font-medium text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50"
              aria-busy={loading}
            >
              {loading ? 'Logging in...' : 'Login to your sanctuary'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
          New here? <Link href="/register" className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors">Register</Link>
        </p>
      </div>
    </main>
  );
}
