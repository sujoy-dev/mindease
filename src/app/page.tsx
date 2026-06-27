'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Brain, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        
        <div className="max-w-3xl w-full text-center space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Your Personal AI Wellness Companion</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight">
            MindEase
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Navigate the stress of competitive exams with a companion that truly understands. 
            Track your mood, discover your patterns, and get AI-guided support when you need it most.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-white">
                Log In
              </Button>
            </Link>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mt-24 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Insights</h3>
              <p className="text-sm text-gray-500">Uncover hidden stress triggers and receive personalized coping strategies tailored to your specific exam focus.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-teal-50 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Safe Space</h3>
              <p className="text-sm text-gray-500">A private, secure environment to vent your thoughts and track your emotional journey without judgment.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
