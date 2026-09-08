import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { Candidate } from '../../data/candidates';

interface CurrentLeaderCardProps {
  leader: Candidate;
}

export const CurrentLeaderCard: React.FC<CurrentLeaderCardProps> = ({ leader }) => {
  return (
    <div className="relative bg-[#F0FAF4] border border-[#C6F0D8] rounded-2xl p-5 md:p-6 shadow-2xs overflow-hidden text-center flex flex-col items-center">
      {/* Decorative Confetti & Sparkles matching the reference image */}
      <div className="absolute top-10 left-6 w-2 h-2 rounded-full bg-emerald-300/70 pointer-events-none" />
      <div className="absolute top-20 left-10 w-1.5 h-3 rotate-45 rounded-xs bg-emerald-400/60 pointer-events-none" />
      <div className="absolute top-12 right-8 w-2 h-2 rounded-full bg-emerald-400/60 pointer-events-none" />
      <div className="absolute top-24 right-6 w-1.5 h-3 -rotate-12 rounded-xs bg-emerald-300/70 pointer-events-none" />
      <div className="absolute top-32 left-8 w-2.5 h-1 rotate-30 rounded-xs bg-emerald-300/50 pointer-events-none" />
      <div className="absolute top-36 right-10 w-2.5 h-1 -rotate-45 rounded-xs bg-emerald-400/50 pointer-events-none" />

      {/* Header Row */}
      <div className="w-full flex items-start gap-3 text-left mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#18A968] shrink-0">
          <Trophy className="w-5 h-5 fill-[#18A968]" />
        </div>
        <div>
          <h3 className="font-extrabold text-base text-[#10234D] leading-tight">
            Current Leader
          </h3>
          <p className="text-xs text-[#60708D] mt-0.5">
            The candidate with the most votes
          </p>
        </div>
      </div>

      {/* Portrait with floating Gold Crown */}
      <div className="relative mt-2 mb-1 inline-block">
        <img
          src={leader.image}
          alt={leader.name}
          className="w-24 h-24 rounded-full object-cover border-3 border-emerald-400/80 shadow-md"
        />

        {/* Floating Gold Crown Badge on Top-Right */}
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white shadow-sm">
          <Crown className="w-4 h-4 fill-white" />
        </div>
      </div>

      {/* Leader Name and Details */}
      <h4 className="font-extrabold text-lg text-[#10234D] mt-2">
        {leader.name}
      </h4>
      <span className="text-xs font-medium text-[#60708D] block">
        {leader.position}
      </span>

      {/* Vote Count in Bold Green */}
      <div className="text-2xl font-black text-[#18A968] tracking-tight mt-2">
        {leader.votes.toLocaleString()} votes
      </div>
    </div>
  );
};
