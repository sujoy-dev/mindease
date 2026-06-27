'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EXAM_LIST } from '@/constants/examList';
import { TonePreference } from '@/types';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [exam, setExam] = useState('');
  const [tone, setTone] = useState<TonePreference | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        // Check if profile already exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          router.push('/dashboard');
        }
      }
    };
    checkAuth();
  }, [supabase, router]);

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error: profileError } = await supabase.from('profiles').upsert([
        {
          id: session.user.id,
          name,
          exam_type: exam,
          tone_preference: tone || 'gentle',
        }
      ]);

      if (profileError) throw profileError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8">
        {/* Progress indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step >= s ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-[var(--color-primary)]' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">What should I call you?</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-4 border border-gray-200 rounded-[var(--radius-input)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-lg"
              autoFocus
            />
            <button
              onClick={() => name.trim() && setStep(2)}
              disabled={!name.trim()}
              className="w-full bg-[var(--color-primary)] text-white p-4 rounded-[var(--radius-pill)] font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Which exam are you preparing for?</h2>
            <div className="grid grid-cols-1 gap-3">
              {EXAM_LIST.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setExam(e.id)}
                  className={`p-4 rounded-[var(--radius-input)] border text-left transition-all ${exam === e.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]' : 'border-gray-200 hover:border-[var(--color-primary)]/50'}`}
                >
                  <div className="font-semibold text-[var(--color-text-primary)]">{e.label}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">{e.description}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-700 p-4 rounded-[var(--radius-pill)] font-medium">Back</button>
              <button
                onClick={() => exam && setStep(3)}
                disabled={!exam}
                className="w-2/3 bg-[var(--color-primary)] text-white p-4 rounded-[var(--radius-pill)] font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">How would you like me to respond?</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'gentle', label: 'Gentle & Comforting', desc: 'Soft, empathetic support' },
                { id: 'direct', label: 'Direct & Practical', desc: 'Clear, actionable advice without fluff' },
                { id: 'motivational', label: 'Motivational', desc: 'Energizing and inspiring encouragement' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id as TonePreference)}
                  className={`p-4 rounded-[var(--radius-input)] border text-left transition-all ${tone === t.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]' : 'border-gray-200 hover:border-[var(--color-primary)]/50'}`}
                >
                  <div className="font-semibold text-[var(--color-text-primary)]">{t.label}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">{t.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="w-1/3 bg-gray-100 text-gray-700 p-4 rounded-[var(--radius-pill)] font-medium">Back</button>
              <button
                onClick={handleComplete}
                disabled={!tone || loading}
                className="w-2/3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white p-4 rounded-[var(--radius-pill)] font-medium disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Start My Journey'}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
