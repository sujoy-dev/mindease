'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/services/supabase';
import { EXAM_LIST } from '@/constants/examList';
import { ExamType, TonePreference } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SuccessToast } from '@/components/ui/SuccessToast';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { BottomNav, DesktopSidebar } from '@/components/layout/Navigation';

export default function SettingsPage() {
  const { profile, loading: profileLoading, refetch } = useProfile();
  const { logout } = useAuth();
  
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState(profile?.name || '');
  const [exam, setExam] = useState<ExamType>(profile?.exam_type || 'NEET');
  const [tone, setTone] = useState<TonePreference>(profile?.tone_preference || 'gentle');

  // Sync state when profile loads
  if (profile && !name && !profileLoading) {
    setName(profile.name);
    setExam(profile.exam_type);
    setTone(profile.tone_preference);
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setUpdating(true);
    setError(null);
    try {
      await updateProfile(profile.id, { name, exam_type: exam, tone_preference: tone });
      setSuccess('Profile updated successfully.');
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      <DesktopSidebar />
      <main className="flex-1 pb-20 md:pb-8 md:pl-64 pt-8 px-4 md:px-8 max-w-3xl mx-auto w-full">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Settings</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage your account preferences.</p>
          </div>
          <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            Logout
          </Button>
        </header>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {error && <ErrorMessage message={error} />}
            <SuccessToast message={success || ''} onClose={() => setSuccess(null)} />

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-[var(--radius-input)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Primary Exam Focus</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value as ExamType)}
                className="w-full p-3 border border-gray-200 rounded-[var(--radius-input)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
              >
                {EXAM_LIST.map((e) => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">AI Companion Tone</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'gentle', label: 'Gentle' },
                  { id: 'direct', label: 'Direct' },
                  { id: 'motivational', label: 'Motivational' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id as TonePreference)}
                    className={`p-3 rounded-[var(--radius-input)] border text-sm font-medium transition-colors ${
                      tone === t.id 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <Button type="submit" disabled={updating || !name.trim()} className="w-full sm:w-auto">
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Disclaimer Card per problem statement requirements */}
        <Card className="mt-8 p-6 bg-gray-50 border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Important Disclaimer</h3>
          <p className="text-sm text-gray-500">
            This is a wellness companion, not a substitute for professional help. The AI analysis and suggestions provided are for educational and motivational purposes only. If you are experiencing a mental health crisis, please reach out to a professional or call iCall: 9152987821.
          </p>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
