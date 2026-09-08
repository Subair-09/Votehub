import React from 'react';
import { Users, UserCheck, ShieldCheck } from 'lucide-react';

interface ImpactStatisticsProps {
  totalVotesCast: number;
  totalCandidates: number;
}

export const ImpactStatistics: React.FC<ImpactStatisticsProps> = ({
  totalVotesCast,
  totalCandidates,
}) => {
  return (
    <section id="impact" className="bg-[#0B1E36] py-16 md:py-20 text-white relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: Heading */}
          <div className="lg:col-span-5 flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">
              OUR IMPACT
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-snug">
              Building a Stronger <br />
              Community Together
            </h2>
          </div>

          {/* Right: 3 Statistics Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 items-center">
            {/* Stat 1: Total Votes */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {totalVotesCast.toLocaleString()}
                </span>
                <span className="text-xs text-slate-300 font-medium mt-0.5">
                  Total Votes Cast
                </span>
              </div>
            </div>

            {/* Stat 2: Candidates */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
                <UserCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {totalCandidates}
                </span>
                <span className="text-xs text-slate-300 font-medium mt-0.5">
                  Candidates
                </span>
              </div>
            </div>

            {/* Stat 3: 100% Secure & Transparent */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                  100%
                </span>
                <span className="text-xs text-slate-300 font-medium mt-0.5">
                  Secure & Transparent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
