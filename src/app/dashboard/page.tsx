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
      <main className="w-full max-w-[390px] mx-auto px-[20px] pb-xl flex-grow md:max-w-3xl md:mt-lg flex flex-col gap-md">
        {/* Mobile Top Bar (Greeting & Avatar) */}
        <div className="flex justify-between items-center py-sm md:hidden">
          <h1 className="font-headline-md text-headline-md">Good morning, {profile?.name?.split(' ')[0] || 'Friend'} 👋</h1>
          <div className="w-[40px] h-[40px] rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
            {profile?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>

        {/* Desktop Greeting (if nav is visible) */}
        <div className="hidden md:flex justify-between items-center py-sm w-full">
          <h1 className="font-headline-lg text-headline-lg">Good morning, {profile?.name?.split(' ')[0] || 'Friend'} 👋</h1>
          <div className="w-[48px] h-[48px] rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-sm">
            {profile?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>

        {/* Streak Card */}
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-r from-primary to-secondary p-md shadow-[var(--shadow-card)]">
          <div className="absolute inset-0 shimmer pointer-events-none"></div>
          <div className="relative z-10 text-on-primary">
            <h2 className="font-headline-md text-headline-md mb-xs">🔥 {profile?.streak_count || 0} day streak — keep going!</h2>
            <p className="font-body-md text-on-primary/90">Consistency is your superpower</p>
          </div>
        </div>

        {/* Recent Insight Pill */}
        <div className="flex items-center gap-sm bg-secondary-fixed/20 text-on-secondary-container px-md py-sm rounded-full w-full">
          <span className="text-xl">💡</span>
          <span className="font-label-md text-label-md">Ready to uncover your patterns?</span>
        </div>

        {/* Today's Mood */}
        <section className="flex flex-col gap-sm">
          <h3 className="font-headline-md text-headline-md text-on-background/90">How are you feeling right now?</h3>
          <div className="flex justify-between items-center gap-2">
            {[
              { emoji: '😔', val: 1 },
              { emoji: '😟', val: 2 },
              { emoji: '😐', val: 3 },
              { emoji: '🙂', val: 4 },
              { emoji: '😊', val: 5 }
            ].map(mood => (
              <button 
                key={mood.val}
                className="w-full aspect-square max-w-[60px] bg-surface-container-lowest rounded-xl shadow-[var(--shadow-card)] flex items-center justify-center text-2xl hover:shadow-md transition-all hover:border hover:border-primary/20"
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </section>

        {/* Quick Journal Card */}
        <div className="bg-surface-container bg-opacity-50 rounded-[var(--radius-card)] p-md shadow-[var(--shadow-card)] flex flex-col gap-sm">
          <div className="flex items-center gap-sm text-primary">
            <span className="text-2xl">✍️</span>
            <h3 className="font-headline-md text-headline-md">What's on your mind today?</h3>
          </div>
          <p className="font-body-md text-on-surface-variant">Even 2 lines can help</p>
          
          <Link href="/journal">
            <button className="bg-primary text-on-primary font-label-md text-label-md rounded-[var(--radius-pill)] py-sm px-md mt-sm self-start hover:shadow-lg transition-all flex items-center gap-xs">
              Start journaling <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
