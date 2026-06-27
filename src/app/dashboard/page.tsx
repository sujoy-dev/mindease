'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { StreakCard } from '@/components/features/StreakCard';
import { MoodPicker } from '@/components/ui/MoodPicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BottomNav, DesktopSidebar } from '@/components/layout/Navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  if (profileLoading || authLoading) {
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
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Hi, {profile?.name || 'Friend'} 👋
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Let's check in on how you're feeling today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="p-6 h-full flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Quick Log</h2>
              <MoodPicker value={3} onChange={() => {}} className="mb-6 pointer-events-none opacity-80 blur-[1px]" />
              <Link href="/journal">
                <Button className="w-full sm:w-auto">Start Journal Entry</Button>
              </Link>
            </Card>
          </div>
          <div>
            <StreakCard count={profile?.streak_count || 0} />
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Your Journey</h2>
          <Card className="p-8 text-center bg-indigo-50 border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">Ready to uncover your patterns?</h3>
            <p className="text-sm text-indigo-700 mb-4 max-w-sm mx-auto">
              Log your thoughts consistently to receive personalized insights and tailored coping strategies.
            </p>
            <Link href="/patterns">
              <Button variant="outline" className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300">
                View My Patterns
              </Button>
            </Link>
          </Card>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
