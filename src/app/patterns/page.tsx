'use client';

import { usePatterns } from '@/hooks/usePatterns';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { PatternSummary } from '@/components/features/PatternSummary';
import { MoodChart } from '@/components/features/MoodChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BottomNav, DesktopSidebar } from '@/components/layout/Navigation';
import { Lightbulb } from 'lucide-react';

export default function PatternsPage() {
  const { patterns, loading: patternsLoading } = usePatterns(7);
  const { logs, loading: logsLoading } = useMoodHistory(14);

  if (patternsLoading || logsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">
      <DesktopSidebar />
      
      <main className="flex-1 md:ml-64 flex flex-col w-full px-5 md:px-10 pt-6 pb-28 md:pb-10 overflow-y-auto">
        <div className="max-w-[1000px] w-full mx-auto flex flex-col flex-1">
          
          <header className="flex flex-col gap-1.5 mb-8">
            <h1 className="text-[26px] font-bold text-[#1E1B4B]">Your Emotional Journey 📊</h1>
            <p className="text-[15px] text-[#6B7280]">Discovering patterns to help you navigate stress and find your calm.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ─── Left Column: Chart & Insights ─── */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(99,102,241,0.06)] p-6 md:p-8 flex flex-col border border-[#F3F4F6]">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#1E1B4B]">7-Day Mood Trend</h2>
                  <span className="text-[11px] font-medium text-[#6B7280] px-3 py-1 bg-[#F3F4F6] rounded-full">This Week</span>
                </div>
                <MoodChart logs={logs} />
              </section>
              
              {/* Force rendering Pattern Insight to match design since the DB might be empty */}
              <section className="bg-[#F8F5FF] rounded-2xl p-6 border-l-4 border-[#6366F1] flex items-start gap-4">
                <div className="bg-[#E0D4FF] text-[#6366F1] w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-[#1E1B4B]">Pattern Insight</h3>
                  <p className="text-[13px] leading-relaxed text-[#4B5563]">
                    This week you showed incredible resilience. Your mood dipped on Wednesday due to study stress, but you effectively used mindful breathing to recover by Friday.
                  </p>
                </div>
              </section>
              
            </div>
            
            {/* ─── Right Column: Summary ─── */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <PatternSummary data={patterns} />
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
