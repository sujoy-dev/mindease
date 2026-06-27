'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Brain, Shield, Sparkles, LineChart, MessageCircleHeart, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hoveredMood, setHoveredMood] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showDemoResponse, setShowDemoResponse] = useState(false);

  // If already logged in, redirect to journal
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/journal');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <LoadingSpinner />
      </div>
    );
  }

  const handleMoodSelect = (val: number) => {
    setSelectedMood(val);
    setShowDemoResponse(false);
    setTimeout(() => {
      setShowDemoResponse(true);
    }, 800);
  };

  const moods = [
    { emoji: '😔', val: 1, label: 'Awful' },
    { emoji: '😟', val: 2, label: 'Bad' },
    { emoji: '😐', val: 3, label: 'Okay' },
    { emoji: '🙂', val: 4, label: 'Good' },
    { emoji: '😊', val: 5, label: 'Great' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col font-sans overflow-x-hidden">
      
      {/* ─── Navigation Bar ─── */}
      <nav className="w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-[#1E1B4B] tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#A78BFA] rounded-xl flex items-center justify-center text-white shadow-md">
            M
          </div>
          MindEase
        </div>
        <div className="hidden md:flex items-center gap-8 text-[#4B5563] text-sm font-medium">
          <a href="#features" className="hover:text-[#6366F1] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#6366F1] transition-colors">How it Works</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="text-sm font-semibold text-[#6366F1] px-4 py-2 hover:bg-[#EEF2FF] rounded-full transition-colors hidden sm:block">
              Log In
            </button>
          </Link>
          <Link href="/register">
            <button className="text-sm font-semibold bg-[#1E1B4B] text-white px-5 py-2.5 rounded-full hover:bg-[#312E81] transition-colors shadow-sm">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <main className="flex-1 flex flex-col items-center pt-12 md:pt-20 px-6 relative">
        
        {/* Background decorative elements */}
        <div className="absolute top-20 left-[-10%] w-[40%] h-[500px] bg-[#EEF2FF] rounded-full blur-[120px] -z-10" />
        <div className="absolute top-40 right-[-5%] w-[35%] h-[400px] bg-[#F3E8FF] rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl w-full text-center flex flex-col items-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] text-[#6366F1] font-semibold text-xs uppercase tracking-widest mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Wellness for Students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#1E1B4B] tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your calm space in the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#A78BFA]">chaos of exams.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Navigate study stress with an AI companion that truly understands. Vent freely, discover emotional patterns, and receive instant, personalized coping strategies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#6366F1] hover:bg-[#4F46E5] text-white text-lg font-semibold py-4 px-10 rounded-full shadow-[0_8px_25px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.45)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Start Journaling Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* ─── Interactive Demo Section ─── */}
        <div className="mt-20 max-w-3xl w-full bg-white rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.15)] border border-[#F3F4F6] relative z-10 mb-32 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">Try a mini check-in</h3>
            <p className="text-[#6B7280] text-sm">How are you feeling about your studies today?</p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            {moods.map((m) => (
              <button
                key={m.val}
                onMouseEnter={() => setHoveredMood(m.val)}
                onMouseLeave={() => setHoveredMood(null)}
                onClick={() => handleMoodSelect(m.val)}
                className={`w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-2xl text-3xl transition-all duration-300 ${
                  selectedMood === m.val 
                    ? 'bg-[#EEF2FF] border-2 border-[#6366F1] shadow-[0_8px_20px_rgba(99,102,241,0.2)] scale-110' 
                    : hoveredMood === m.val 
                      ? 'bg-[#F9FAFB] border-2 border-[#E5E7EB] scale-105' 
                      : 'bg-white border border-[#F3F4F6] hover:shadow-md'
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          {/* Demo AI Response Area */}
          <div className={`transition-all duration-500 overflow-hidden ${selectedMood ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="border-t border-[#F3F4F6] pt-8">
              {!showDemoResponse ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <LoadingSpinner />
                  <p className="text-sm text-[#9CA3AF]">MindEase is thinking...</p>
                </div>
              ) : (
                <div className="bg-[#F8F5FF] rounded-2xl p-6 border-l-4 border-[#6366F1] flex gap-4 items-start animate-fade-in-up">
                  <div className="w-10 h-10 rounded-full bg-[#E0D4FF] text-[#6366F1] flex items-center justify-center shrink-0">
                    <BotIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E1B4B] mb-2">MindEase says 💜</h4>
                    <p className="text-[15px] text-[#4B5563] leading-relaxed mb-4">
                      {selectedMood && selectedMood <= 2 
                        ? "I hear you. The pressure right now feels incredibly heavy, and it's completely understandable to feel overwhelmed. Remember, it's not about never falling, it's about pausing, resting, and continuing when you're ready."
                        : selectedMood === 3 
                        ? "It sounds like you're holding steady today. Even a neutral day is a win during intense prep. Take a moment to acknowledge your consistency."
                        : "That's wonderful to hear! Hold onto this momentum and positive energy. Remember what went right today so you can replicate it tomorrow."}
                    </p>
                    <Link href="/register">
                      <button className="text-sm font-semibold text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-1">
                        Sign up to get personalized advice <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Features Grid ─── */}
        <div id="features" className="w-full max-w-6xl mx-auto py-20 border-t border-[#E5E7EB]/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1B4B] mb-4">Everything you need to stay balanced</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">MindEase isn't just a journal; it's a proactive tool designed specifically for the unique mental strain of competitive exams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageCircleHeart className="w-6 h-6 text-[#EC4899]" />}
              iconBg="bg-[#FCE7F3]"
              title="Judgment-Free Journaling"
              desc="A completely private, secure space to vent your anxieties. Your entries are session-only unless you choose to save them."
            />
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-[#6366F1]" />}
              iconBg="bg-[#EEF2FF]"
              title="Instant AI Support"
              desc="Advanced AI analyzes your entry to provide immediate empathy, breathing exercises, and concrete coping strategies."
            />
            <FeatureCard 
              icon={<LineChart className="w-6 h-6 text-[#10B981]" />}
              iconBg="bg-[#D1FAE5]"
              title="Discover Your Patterns"
              desc="Track your emotional journey over time to identify hidden stress triggers and moments of incredible resilience."
            />
          </div>
        </div>

      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-white border-t border-[#F3F4F6] py-10 text-center">
        <p className="text-[#9CA3AF] text-sm">© {new Date().getFullYear()} MindEase. Built for student wellness.</p>
        <p className="text-[#EF4444] text-xs font-semibold mt-2">If you are in a crisis, please call the iCall Helpline at 9152987821.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, desc }: { icon: React.ReactNode, iconBg: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F3F4F6] hover:shadow-[0_12px_30px_rgba(99,102,241,0.08)] hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#1E1B4B] mb-3">{title}</h3>
      <p className="text-[#6B7280] leading-relaxed text-[15px]">{desc}</p>
    </div>
  );
}

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
