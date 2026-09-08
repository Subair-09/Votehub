import React from 'react';
import { Users, Check, User, Clock } from 'lucide-react';

interface StatCardsProps {
  totalVoters?: number;
  totalVotesCast?: number;
  totalCandidates?: number;
  timeRemaining?: string;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalVoters = 2487,
  totalVotesCast = 2302,
  totalCandidates = 6,
  timeRemaining = '2d 12h 34m',
}) => {
  const turnoutPercent = ((totalVotesCast / totalVoters) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {/* CARD 1: Total Voters (Blue) */}
      <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1769E8] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
          <Users className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-[#60708D] tracking-normal">
            Total Voters
          </span>
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#0D1B35] tracking-tight leading-tight mt-0.5">
            {totalVoters.toLocaleString()}
          </span>
          <span className="text-xs text-[#60708D] mt-0.5">
            Registered voters
          </span>
        </div>
      </div>

      {/* CARD 2: Total Votes Cast (Green) */}
      <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#18A968] text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
          <Check className="w-7 h-7 stroke-[2.8]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-[#60708D] tracking-normal">
            Total Votes Cast
          </span>
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#0D1B35] tracking-tight leading-tight mt-0.5">
            {totalVotesCast.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-[#60708D] mt-0.5">
            {turnoutPercent}% turnout
          </span>
        </div>
      </div>

      {/* CARD 3: Total Candidates (Purple) */}
      <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
          <User className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-[#60708D] tracking-normal">
            Total Candidates
          </span>
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#0D1B35] tracking-tight leading-tight mt-0.5">
            {totalCandidates}
          </span>
          <span className="text-xs text-[#60708D] mt-0.5">
            Active candidates
          </span>
        </div>
      </div>

      {/* CARD 4: Time Remaining (Orange) */}
      <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
          <Clock className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-[#60708D] tracking-normal">
            Time Remaining
          </span>
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#0D1B35] tracking-tight leading-tight mt-0.5">
            {timeRemaining}
          </span>
          <span className="text-xs text-[#60708D] mt-0.5">
            Voting ends
          </span>
        </div>
      </div>
    </div>
  );
};
