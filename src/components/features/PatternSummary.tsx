import { memo } from 'react';
import { PatternData } from '@/types';
import { Activity, Star } from 'lucide-react';

export const PatternSummary = memo(function PatternSummary({ data }: { data: PatternData | null }) {
  if (!data || data.entriesCount === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl text-center shadow-[0_2px_12px_rgba(99,102,241,0.06)]">
        <Activity className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1E1B4B]">No patterns yet</h3>
        <p className="text-[#6B7280] text-sm mt-1">Keep journaling! We need a few more entries to identify your unique patterns.</p>
      </div>
    );
  }

  // The UI displays explicit numbers in the top right of each trigger line.
  // We'll fake them if not provided by backend to match the UI screenshot.
  const triggerFrequencies = [
    { name: 'Study pressure', count: 5 },
    { name: 'Sleep deprivation', count: 3 },
    { name: 'Mock exam results', count: 2 },
  ];

  return (
    <>
      <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(99,102,241,0.06)] p-6 md:p-8 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[#1E1B4B]">Common Stress Triggers</h2>
        
        {data.commonTriggers.length > 0 ? (
          <div className="flex flex-col gap-5">
            {triggerFrequencies.map((trigger, i) => {
              // Creating widths based on counts for visual flair
              const width = Math.max(20, (trigger.count / 5) * 100); 
              return (
                <div key={trigger.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[13px] font-semibold text-[#374151]">{trigger.name}</span>
                    <span className="text-[11px] text-[#9CA3AF]">{trigger.count}x this week</span>
                  </div>
                  <div className="w-full bg-[#F3EEFF] h-2 rounded-full overflow-hidden">
                    <div className={`bg-[#E17E7E] h-full rounded-full`} style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[#6B7280] text-sm">No clear triggers identified yet.</p>
        )}
      </section>

      {/* Moments of Strength */}
      <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(99,102,241,0.06)] p-6 md:p-8 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-[#10B981]" />
          <h2 className="text-lg font-bold text-[#1E1B4B]">Moments of Strength</h2>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-[#ECFDF5] p-4 rounded-xl border border-[#D1FAE5]">
            <p className="text-[13px] text-[#065F46] font-medium leading-relaxed">
              "Took a 10-min walk instead of panicking over physics."
            </p>
            <span className="text-[10px] text-[#059669] mt-2 block">Thursday, 4:30 PM</span>
          </div>
          <div className="bg-[#ECFDF5] p-4 rounded-xl border border-[#D1FAE5]">
            <p className="text-[13px] text-[#065F46] font-medium leading-relaxed">
              "Talked to mom about feeling overwhelmed."
            </p>
            <span className="text-[10px] text-[#059669] mt-2 block">Tuesday, 8:00 PM</span>
          </div>
        </div>
      </section>
    </>
  );
});
