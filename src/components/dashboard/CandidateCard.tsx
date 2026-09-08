import React from 'react';
import { Users, Check } from 'lucide-react';
import { Candidate } from '../../data/candidates';

interface CandidateCardProps {
  candidate: Candidate;
  isVoted: boolean;
  onVoteClick: (candidate: Candidate) => void;
  disabled?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isVoted,
  onVoteClick,
  disabled = false,
}) => {
  const isLeading = candidate.isLeader;

  return (
    <div
      className={`relative rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md ${
        isLeading
          ? 'bg-[#F0FDF4] border-2 border-[#18A968] shadow-sm shadow-emerald-500/5'
          : 'bg-white border border-[#DDE7F3] shadow-2xs'
      }`}
    >
      {/* Top Badges */}
      <div className="w-full flex items-center justify-between mb-2">
        {/* Rank Badge */}
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            isLeading
              ? 'bg-[#18A968] text-white'
              : 'bg-[#EDF2F9] text-[#60708D]'
          }`}
        >
          #{candidate.rank}
        </span>

        {/* Leading Pill (Aisha Bello) */}
        {isLeading && (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#18A968] text-white">
            Leading
          </span>
        )}
      </div>

      {/* Candidate Portrait */}
      <div className="relative my-2">
        <img
          src={candidate.image}
          alt={candidate.name}
          className={`w-24 h-24 rounded-full object-cover shadow-2xs ${
            isLeading ? 'border-2 border-[#18A968]/50' : 'border-2 border-slate-100'
          }`}
        />
      </div>

      {/* Name and Position */}
      <h3 className="font-extrabold text-lg text-[#10234D] tracking-tight mt-1 leading-tight">
        {candidate.name}
      </h3>
      <span className="text-xs md:text-sm font-medium text-[#60708D] mt-0.5 mb-3 block">
        {candidate.position}
      </span>

      {/* Vote Count with 2-person users icon */}
      <div
        className={`flex items-center gap-1.5 text-xs md:text-sm font-bold mb-4 ${
          isLeading ? 'text-[#18A968]' : 'text-[#60708D]'
        }`}
      >
        <Users
          className={`w-4 h-4 ${
            isLeading ? 'text-[#18A968]' : 'text-[#1769E8]'
          }`}
        />
        <span>{candidate.votes.toLocaleString()} votes</span>
      </div>

      {/* Full-width Vote Button */}
      <button
        onClick={() => onVoteClick(candidate)}
        disabled={disabled || isVoted}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
          isVoted
            ? 'bg-emerald-600 text-white opacity-95'
            : isLeading
            ? 'bg-[#18A968] hover:bg-[#15945b] text-white shadow-xs shadow-[#18A968]/25 active:scale-[0.99]'
            : 'bg-[#1769E8] hover:bg-[#1257c2] text-white shadow-xs shadow-[#1769E8]/25 active:scale-[0.99]'
        } ${disabled && !isVoted ? 'opacity-50' : ''}`}
      >
        {isVoted ? (
          <>
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Voted ✓</span>
          </>
        ) : (
          'Vote'
        )}
      </button>
    </div>
  );
};
