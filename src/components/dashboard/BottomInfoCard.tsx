import React from 'react';
import { Info } from 'lucide-react';

export const BottomInfoCard: React.FC = () => {
  return (
    <div className="bg-[#EAF3FF] border border-[#D6E6FA] rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
      <div className="w-7 h-7 rounded-full bg-[#1769E8] text-white flex items-center justify-center shrink-0 shadow-2xs">
        <Info className="w-4 h-4 stroke-[2.5]" />
      </div>
      <p className="text-xs font-medium text-[#10234D] leading-relaxed">
        Each vote counts! Make your voice heard and support your preferred candidate.
      </p>
    </div>
  );
};
