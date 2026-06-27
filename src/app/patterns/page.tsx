'use client';

import { usePatterns } from '@/hooks/usePatterns';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { PatternSummary } from '@/components/features/PatternSummary';
import { MoodChart } from '@/components/features/MoodChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { BottomNav, DesktopSidebar } from '@/components/layout/Navigation';

export default function PatternsPage() {
  const { patterns, loading: patternsLoading } = usePatterns(7);
  const { logs, loading: logsLoading } = useMoodHistory(14); // Fetch 14 days for better chart view

  if (patternsLoading || logsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      <DesktopSidebar />
      <main className="flex-1 pb-20 md:pb-8 md:pl-64 pt-8 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Patterns</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Discover your emotional trends over time.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Mood History (Last 14 Days)</h2>
              <MoodChart logs={logs} />
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <PatternSummary data={patterns} />
          </div>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}
