import { SupabaseAIResponse } from '@/types';
import { CrisisCard } from './CrisisCard';
import { Bot, Wrench } from 'lucide-react';

/**
 * AIResponse — Renders the GenAI response after journal analysis.
 */
export function AIResponse({ response }: { response: SupabaseAIResponse }) {
  if (!response) return null;

  const isHighStress = response.severity_level && response.severity_level >= 4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* ─── Left/Center Column (Main Content) ─── */}
      <div className="lg:col-span-8 flex flex-col gap-6 w-full">
        
        {/* Analysis Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(99,102,241,0.06)] border border-[#F3F4F6]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-[#1E1B4B]">Analysis</h3>
            <div className="flex items-center gap-2 bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
              <span className={`w-2 h-2 rounded-full ${isHighStress ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`}></span>
              <span className="text-xs font-semibold text-[#4B5563]">
                {isHighStress ? 'High Stress' : (response.severity_level && response.severity_level <= 2 ? 'Low Stress' : 'Moderate Stress')}
              </span>
            </div>
          </div>
          {response.stress_triggers && response.stress_triggers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {response.stress_triggers.map((trigger, i) => (
                <span key={i} className="bg-[#FEF2F2] text-[#B91C1C] px-4 py-1.5 rounded-full text-xs font-medium border border-[#FEE2E2]">
                  {trigger}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI Main Message */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(99,102,241,0.06)] border-l-4 border-[#6366F1]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#6366F1]">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E1B4B]">MindEase says 💜</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-[#4B5563]">
            {response.emotional_pattern && (
              <p className="animate-fade-in-up delay-100">{response.emotional_pattern}</p>
            )}
            {response.raw_response && !response.emotional_pattern && (
               <p className="animate-fade-in-up delay-100">{response.raw_response}</p>
            )}
          </div>
        </div>

        {/* Bento Grid: Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coping Strategy */}
          {response.coping_strategy && (
            <div className="bg-[#F0FDF4] rounded-2xl p-6 shadow-sm border border-[#DCFCE7] relative overflow-hidden flex flex-col min-h-[220px]">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[#16A34A] mb-4">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="text-[10px] font-bold text-[#4B5563] mb-1.5 uppercase tracking-wider">Try this right now</h4>
              <p className="text-[15px] text-[#166534] font-medium leading-relaxed">
                {response.coping_strategy}
              </p>
            </div>
          )}

          {/* Mindfulness / Breathing */}
          {response.mindfulness_exercise && (
            <div className="bg-[#EEF2FF] rounded-2xl p-6 shadow-sm border border-[#E0E7FF] relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[220px]">
              <div className="relative w-24 h-24 flex items-center justify-center mb-5">
                <div className="absolute inset-0 rounded-full bg-[#C7D2FE]/50 animate-breathing blur-sm"></div>
                <div className="absolute w-16 h-16 rounded-full bg-[#A78BFA]/20"></div>
                <span className="text-3xl z-10">🫁</span>
              </div>
              <p className="text-sm font-semibold text-[#3730A3] relative z-10 px-2">
                {response.mindfulness_exercise}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Right Column (Motivation & Safety) ─── */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Motivation Card */}
        {response.motivation && (
          <div className="rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden text-white bg-gradient-to-br from-[#6366F1] to-[#A78BFA] flex flex-col justify-center min-h-[200px]">
            <span className="text-5xl opacity-40 leading-none absolute top-4 left-4 font-serif">"</span>
            <p className="text-lg md:text-xl font-medium leading-snug italic relative z-10 mt-4">
              {response.motivation}
            </p>
          </div>
        )}

        <CrisisCard alwaysVisible={true} />
      </div>
    </div>
  );
}
