'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { JournalForm } from '@/components/features/JournalForm';
import { AIResponse } from '@/components/features/AIResponse';
import { BreathingExercise } from '@/components/features/BreathingExercise';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BottomNav, DesktopSidebar } from '@/components/layout/Navigation';

export default function JournalPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { analyze, loading: analyzing, data: aiData } = useAIAnalysis();
  const [submitted, setSubmitted] = useState(false);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSubmit = async (text: string, mood: number, exam: string) => {
    setSubmitted(false);
    await analyze(text, mood, exam);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      <DesktopSidebar />
      <main className="flex-1 pb-20 md:pb-8 md:pl-64 pt-8 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Journal</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Reflect on your day, let it all out.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <JournalForm 
              defaultExam={profile?.exam_type || 'NEET'} 
              onSubmit={handleSubmit}
              loading={analyzing}
            />
          </div>

          <div className="space-y-6">
            {analyzing ? (
              <div className="h-full min-h-[300px] flex items-center justify-center bg-white/50 rounded-[var(--radius-card)] border border-gray-100">
                <LoadingSpinner />
              </div>
            ) : submitted && aiData?.aiResponse ? (
              <AIResponse response={aiData.aiResponse} />
            ) : (
              <BreathingExercise />
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
