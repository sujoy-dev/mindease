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
    <main className="flex flex-col items-center min-h-screen p-md bg-background relative overflow-hidden pb-12">
      {/* Atmospheric background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed opacity-40 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed opacity-30 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[480px] flex flex-col items-center pt-lg relative z-10">
        
        {/* Progress Dots */}
        <div className="flex gap-2 mb-xl">
          <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
        </div>

        {/* Logo & Tagline */}
        <div className="flex flex-col items-center mb-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 mb-4 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[40px]">spa</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Let's personalize your sanctuary</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[300px]">A few quick questions to tailor MindEase to your unique journey.</p>
        </div>

        {error && (
          <div className="w-full bg-error-container/20 text-error p-3 rounded-lg mb-4 text-sm text-center" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[24px] shadow-[0_4px_20px_rgba(99,102,241,0.08)] p-lg transition-all">
          
          {step === 1 && (
            <div className="space-y-[24px] animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="name">
                  What should I call you?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant text-[20px]">person</span>
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your preferred name"
                    className="block w-full pl-10 py-3 bg-[#F1F5F9] border border-[#E0E7FF] rounded-[12px] font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={() => name.trim() && setStep(2)}
                  disabled={!name.trim()}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm font-label-md text-label-md font-medium text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50"
                >
                  Continue
                  <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-[24px] animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Which exam are you preparing for?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {EXAM_LIST.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setExam(e.id)}
                      className={`text-left p-4 rounded-[16px] border transition-all ${
                        exam === e.id
                          ? 'border-primary bg-primary-fixed/20 ring-1 ring-primary'
                          : 'border-[#E0E7FF] bg-[#F1F5F9] hover:border-primary/50'
                      }`}
                    >
                      <div className="font-label-md text-label-md text-on-surface font-semibold">{e.label}</div>
                      <div className="font-caption text-caption text-on-surface-variant mt-1">{e.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 flex justify-center items-center py-4 px-4 border border-[#E0E7FF] rounded-full shadow-sm font-label-md text-label-md font-medium text-on-surface bg-white hover:bg-surface-container-low transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={() => exam && setStep(3)}
                  disabled={!exam}
                  className="w-2/3 flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm font-label-md text-label-md font-medium text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-[24px] animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  How would you like me to respond?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'gentle', label: 'Gentle & Comforting', desc: 'Soft, empathetic support' },
                    { id: 'direct', label: 'Direct & Practical', desc: 'Clear, actionable advice without fluff' },
                    { id: 'motivational', label: 'Motivational', desc: 'Energizing and inspiring encouragement' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id as TonePreference)}
                      className={`text-left p-4 rounded-[16px] border transition-all ${
                        tone === t.id
                          ? 'border-primary bg-primary-fixed/20 ring-1 ring-primary'
                          : 'border-[#E0E7FF] bg-[#F1F5F9] hover:border-primary/50'
                      }`}
                    >
                      <div className="font-label-md text-label-md text-on-surface font-semibold">{t.label}</div>
                      <div className="font-caption text-caption text-on-surface-variant mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 flex justify-center items-center py-4 px-4 border border-[#E0E7FF] rounded-full shadow-sm font-label-md text-label-md font-medium text-on-surface bg-white hover:bg-surface-container-low transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!tone || loading}
                  className="w-2/3 flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm font-label-md text-label-md font-medium text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Start My Journey'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
