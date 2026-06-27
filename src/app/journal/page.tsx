'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { JournalForm } from '@/components/features/JournalForm';
import { AIResponse } from '@/components/features/AIResponse';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BottomNav, DesktopSidebar } from '@/components/layout/Navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * JournalPage — Entry point for daily journaling.
 * Shows the journal form initially, then switches to the AI response view
 * once the user submits and analysis completes.
 */
export default function JournalPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { analyze, loading: analyzing, data: aiData } = useAIAnalysis();
  const [submitted, setSubmitted] = useState(false);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <LoadingSpinner />
      </div>
    );
  }

  /** Handle journal submission → trigger AI analysis */
  const handleSubmit = async (text: string, mood: number, exam: string) => {
    setSubmitted(false);
    await analyze(text, mood, exam);
    setSubmitted(true);
  };

  /** Go back from AI response to journal form */
  const handleBack = () => {
    setSubmitted(false);
  };

  const showAI = submitted && aiData?.aiResponse;

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">
      <DesktopSidebar />

      {/* md:ml-64 offsets for the fixed 256px sidebar on desktop */}
      <main className="flex-1 md:ml-64 flex flex-col w-full px-5 md:px-10 pt-6 pb-28 md:pb-10 overflow-y-auto">
        <div className="max-w-[820px] w-full mx-auto flex flex-col flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {showAI && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
                  aria-label="Back to journal"
                >
                  <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-[#1E1B4B] leading-tight">
                  {showAI ? 'Today\'s Journal' : 'Today\'s Journal'}
                </h1>
                <span className="text-xs text-[#9CA3AF]">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#6366F1] text-xs font-semibold flex items-center gap-1.5">
              📚 {profile?.exam_type || 'Exam'}
            </span>
          </div>

          {/* Content */}
          {!showAI ? (
            <div className="flex-1 flex flex-col">
              <JournalForm
                defaultExam={profile?.exam_type || 'NEET'}
                onSubmit={handleSubmit}
                loading={analyzing}
              />
            </div>
          ) : (
            <AIResponse response={aiData.aiResponse} />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
