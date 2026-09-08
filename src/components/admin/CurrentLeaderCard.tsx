import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { Candidate } from '../../data/candidates';

interface CurrentLeaderCardProps {
  leader: Candidate;
  totalVotes: number;
  onViewLeader: (candidate: Candidate) => void;
}

export const CurrentLeaderCard: React.FC<CurrentLeaderCardProps> = ({
  leader,
  totalVotes,
  onViewLeader,
}) => {
  const percentage = totalVotes > 0 ? ((leader.votes / totalVotes) * 100).toFixed(1) : '36.6';

  return (
    <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4">
        <Trophy className="w-5 h-5 text-[#1769E8]" />
        <h3 className="font-bold text-base text-[#0D1B35] tracking-tight">
          Current Leader
        </h3>
      </div>

      {/* Content Container */}
      <div
        onClick={() => onViewLeader(leader)}
        className="p-4 rounded-xl bg-[#F4FBF7] border border-[#C6EED7]/70 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#EDF8F2] transition-colors group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar with Crown */}
          <div className="relative shrink-0">
            <img
              src={leader.image}
              alt={leader.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover object-top border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
            />
            {/* Gold Crown Badge */}
            <div className="absolute -top-2 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-xs">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0">
            <h4 className="font-extrabold text-base sm:text-lg text-[#0D1B35] truncate group-hover:text-[#1769E8] transition-colors">
              {leader.name}
            </h4>
            <p className="text-xs text-[#60708D] font-medium -mt-0.5">
              {leader.position}
            </p>

            {/* Green Vote Count Box */}
            <div className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded-md bg-[#D1F2DE] text-[#138350] text-xs font-bold">
              ({leader.votes.toLocaleString()} votes)
            </div>
          </div>
        </div>

        {/* Percentage on Right */}
        <div className="text-right shrink-0">
          <span className="text-xl sm:text-2xl font-black text-[#0D1B35] tracking-tight">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
