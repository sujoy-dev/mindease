import { PhoneCall, ShieldAlert } from 'lucide-react';
import React from 'react';

/**
 * Renders a crisis support card providing emergency contact information.
 */
export const CrisisCard = React.memo(function CrisisCard({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  // Always render based on rule8 which specifies Crisis Card must be always visible on AI response screen
  return (
    <div className="bg-[#FEF2F2] rounded-2xl p-6 border border-[#FEE2E2] mt-auto md:mt-0 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-[#B91C1C]">
        <ShieldAlert className="w-5 h-5" />
        <h4 className="text-xs font-bold uppercase tracking-wider">Support is here</h4>
      </div>
      <p className="text-sm text-[#4B5563] mb-5 leading-relaxed">
        Feeling overwhelmed and need someone to talk to right away?
      </p>
      <a 
        className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#FEE2E2] hover:bg-[#FEE2E2]/50 transition-colors shadow-sm" 
        href="tel:9152987821"
      >
        <span className="text-sm font-semibold text-[#1E1B4B]">iCall Helpline</span>
        <span className="text-sm font-bold text-[#6366F1] flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4" />
          9152987821
        </span>
      </a>
      <p className="text-[10px] text-center text-[#EF4444] mt-4 font-semibold opacity-80 uppercase tracking-wide">
        This is not a substitute for professional help.
      </p>
    </div>
  );
}

);
