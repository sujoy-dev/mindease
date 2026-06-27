'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/services/supabase';
import { createClient } from '@/lib/supabase/client';
import { ExamType, TonePreference } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SuccessToast } from '@/components/ui/SuccessToast';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DesktopSidebar, BottomNav } from '@/components/layout/Navigation';
import {
  Shield,
  Download,
  Trash2,
  Flame,
  BookOpen,
} from 'lucide-react';

/** Mood score → emoji + label mapping */
const MOOD_MAP: Record<number, { emoji: string; label: string }> = {
  1: { emoji: '😢', label: 'Very Low' },
  2: { emoji: '😟', label: 'Stressed' },
  3: { emoji: '😐', label: 'Neutral' },
  4: { emoji: '😊', label: 'Good' },
  5: { emoji: '😌', label: 'Calm & Focused' },
};

/** Tone option data used by the radio group */
const TONE_OPTIONS: { id: TonePreference; label: string; desc: string }[] = [
  { id: 'gentle', label: 'Gentle & Nurturing', desc: 'Empathetic, soft, focuses on emotional safety.' },
  { id: 'motivational', label: 'Motivational', desc: 'Encouraging, energy-boosting, focuses on goals.' },
  { id: 'direct', label: 'Direct & Clear', desc: 'Straightforward, practical, no-nonsense advice.' },
];

export default function SettingsPage() {
  const { profile, loading: profileLoading, refetch } = useProfile();
  const { user, logout } = useAuth();
  const supabase = createClient();

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [tone, setTone] = useState<TonePreference>('gentle');

  // Stats pulled from Supabase
  const [journalCount, setJournalCount] = useState(0);
  const [dominantMood, setDominantMood] = useState<{ emoji: string; label: string }>({ emoji: '😊', label: 'Good' });

  // Notification toggles (visual only — no backend)
  const [dailyCheckin, setDailyCheckin] = useState(true);
  const [journalReminders, setJournalReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  /** Sync local state once profile arrives */
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setTone(profile.tone_preference);
    }
  }, [profile]);

  /** Fetch journal count + dominant mood */
  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      // Journal count
      const { count } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setJournalCount(count ?? 0);

      // Dominant mood from last 7 mood logs
      const { data: moods } = await supabase
        .from('mood_logs')
        .select('mood_score')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(7);

      if (moods && moods.length > 0) {
        const freq: Record<number, number> = {};
        moods.forEach((m: { mood_score: number }) => {
          freq[m.mood_score] = (freq[m.mood_score] || 0) + 1;
        });
        const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
        const topScore = Number(top[0]);
        setDominantMood(MOOD_MAP[topScore] || MOOD_MAP[3]);
      }
    } catch {
      /* stats are non-critical — fail silently */
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /** Save profile changes */
  const handleUpdate = async () => {
    if (!profile) return;
    setUpdating(true);
    setError(null);
    try {
      await updateProfile(profile.id, { name, tone_preference: tone });
      setSuccess('Profile updated successfully.');
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  /** Password reset via Supabase */
  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/settings`,
      });
      if (resetError) throw resetError;
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
    }
  };

  /** Download all user data as JSON */
  const handleDownloadData = async () => {
    if (!user) return;
    try {
      const [journals, moods, aiResponses] = await Promise.all([
        supabase.from('journal_entries').select('*').eq('user_id', user.id),
        supabase.from('mood_logs').select('*').eq('user_id', user.id),
        supabase.from('ai_responses').select('*').eq('user_id', user.id),
      ]);

      const blob = new Blob(
        [JSON.stringify({ profile, journals: journals.data, moods: moods.data, aiResponses: aiResponses.data }, null, 2)],
        { type: 'application/json' },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindease-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess('Your data has been downloaded.');
    } catch {
      setError('Failed to download data.');
    }
  };

  /** Clear all user session data (journals, moods, AI responses) */
  const handleClearData = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      'This will permanently delete all your journal entries, mood logs, and AI responses. This cannot be undone. Continue?',
    );
    if (!confirmed) return;
    try {
      await Promise.all([
        supabase.from('journal_entries').delete().eq('user_id', user.id),
        supabase.from('mood_logs').delete().eq('user_id', user.id),
        supabase.from('ai_responses').delete().eq('user_id', user.id),
      ]);
      await updateProfile(user.id, { streak_count: 0, last_entry_date: null });
      refetch();
      fetchStats();
      setSuccess('All session data has been cleared.');
    } catch {
      setError('Failed to clear session data.');
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">
      <DesktopSidebar />

      {/* md:ml-64 offsets for the fixed 256px sidebar on desktop */}
      <main className="flex-1 md:ml-64 overflow-y-auto px-5 py-8 md:px-10 pb-28 md:pb-10">
        <div className="max-w-[900px] mx-auto">

          {error && <ErrorMessage message={error} />}
          <SuccessToast message={success || ''} onClose={() => setSuccess(null)} />

          {/* ─── Profile + Stats Row ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex flex-col items-center justify-center text-center">
              <div className="w-[72px] h-[72px] bg-[#6366F1] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                {profile?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-lg font-bold text-[#1E1B4B]">{profile?.name || 'User'}</h2>
              <span className="mt-2 inline-block px-3 py-0.5 bg-[#EEF2FF] text-[#6366F1] rounded-full text-xs font-semibold">
                {profile?.exam_type || 'Exam'} Aspirant
              </span>
            </div>

            {/* Stats Cards */}
            <div className="md:col-span-2 grid grid-cols-2 gap-5">
              {/* Streak */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex flex-col justify-center">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-[#1E1B4B]">{profile?.streak_count ?? 0} Days</p>
                <p className="text-sm text-[#6B7280] mt-0.5">Current Streak 🔥</p>
              </div>

              {/* Journals */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex flex-col justify-center">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4 text-[#6366F1]" />
                </div>
                <p className="text-2xl font-bold text-[#1E1B4B]">{journalCount}</p>
                <p className="text-sm text-[#6B7280] mt-0.5">Journals Written</p>
              </div>

              {/* Mood */}
              <div className="col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-xl">
                    {dominantMood.emoji}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Most Common Mood</p>
                    <p className="text-lg font-bold text-[#1E1B4B]">{dominantMood.label}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 w-28 shrink-0">
                  <span className="text-[10px] text-[#9CA3AF]">This Week</span>
                  <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#6366F1] rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Account Settings ─── */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1E1B4B] mb-4">Account Settings</h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(99,102,241,0.06)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-[#374151] mb-1.5">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F3F4F6] border border-transparent rounded-xl px-4 py-3 text-[#1E1B4B] text-sm focus:border-[#6366F1] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#374151] mb-1.5">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-[#F3F4F6] border border-transparent rounded-xl px-4 py-3 text-[#6B7280] text-sm cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="border-t border-[#F3F4F6] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-sm text-[#6B7280]">Password was last changed 3 months ago.</p>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-[#EEF2FF] text-[#6366F1] rounded-lg text-sm font-medium hover:bg-[#E0E7FF] transition-colors whitespace-nowrap"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </section>

          {/* ─── App Preferences ─── */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1E1B4B] mb-4">App Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

              {/* Companion Tone — spans 3 of 5 cols */}
              <div className="md:col-span-3 bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(99,102,241,0.06)]">
                <h3 className="text-lg font-bold text-[#1E1B4B] mb-1">Companion Tone</h3>
                <p className="text-sm text-[#6B7280] mb-5">How should the AI communicate with you?</p>

                <div className="space-y-3">
                  {TONE_OPTIONS.map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        tone === t.id
                          ? 'border-[#6366F1] bg-[#EEF2FF]/60'
                          : 'border-transparent hover:border-[#E5E7EB]'
                      }`}
                    >
                      <span className="mt-0.5 flex-shrink-0">
                        <span
                          className={`inline-block w-[18px] h-[18px] rounded-full border-2 ${
                            tone === t.id ? 'border-[#6366F1]' : 'border-[#D1D5DB]'
                          } flex items-center justify-center`}
                        >
                          {tone === t.id && (
                            <span className="block w-2.5 h-2.5 bg-[#6366F1] rounded-full" />
                          )}
                        </span>
                      </span>
                      <div>
                        <span className="block text-sm font-semibold text-[#1E1B4B]">{t.label}</span>
                        <span className="block text-xs text-[#6B7280] mt-0.5">{t.desc}</span>
                      </div>
                      <input
                        type="radio"
                        name="tone"
                        value={t.id}
                        checked={tone === t.id}
                        onChange={() => setTone(t.id)}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Notifications — spans 2 of 5 cols */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex flex-col">
                <h3 className="text-lg font-bold text-[#1E1B4B] mb-1">Notifications</h3>
                <p className="text-sm text-[#6B7280] mb-5">Manage your reminders.</p>

                <div className="space-y-5 flex-1">
                  <ToggleRow label="Daily Check-in" checked={dailyCheckin} onChange={setDailyCheckin} />
                  <ToggleRow label="Journal Reminders" checked={journalReminders} onChange={setJournalReminders} />
                  <ToggleRow label="Marketing Emails" checked={marketingEmails} onChange={setMarketingEmails} />
                </div>
              </div>
            </div>
          </section>

          {/* ─── Privacy & Data ─── */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(99,102,241,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield className="w-5 h-5 text-[#374151]" />
                  <h3 className="text-lg font-bold text-[#1E1B4B]">Privacy & Data</h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Your sanctuary is private. You have full control over your journaling data and history.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadData}
                  className="px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Data
                </button>
                <button
                  type="button"
                  onClick={handleClearData}
                  className="px-5 py-2.5 bg-[#FEF2F2] text-[#DC2626] border border-transparent rounded-xl text-sm font-medium hover:bg-[#FEE2E2] transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Clear Session Data
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <button
          type="button"
          onClick={handleUpdate}
          disabled={updating || !name.trim()}
          className="px-7 py-3 bg-[#6366F1] text-white rounded-full text-sm font-semibold shadow-[0_6px_20px_rgba(99,102,241,0.3)] hover:bg-[#4F46E5] hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

/* ─── Toggle Switch Sub-component ─── */

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#374151]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-[#6366F1]' : 'bg-[#D1D5DB]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
