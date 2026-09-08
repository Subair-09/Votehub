import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Candidate } from '../../data/candidates';

interface VoteLeaderboardProps {
  candidates: Candidate[];
}

export const VoteLeaderboard: React.FC<VoteLeaderboardProps> = ({ candidates }) => {
  // Sort descending by votes
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted.length > 0 ? sorted[0].votes : 1;

  return (
    <div className="bg-white border border-[#DDE7F3] rounded-2xl p-5 md:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 pb-1">
        <BarChart2 className="w-5 h-5 text-[#1769E8] stroke-[2.2]" />
        <h3 className="font-extrabold text-base text-[#10234D]">
          Vote Leaderboard
        </h3>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {sorted.map((c, index) => {
          const rank = index + 1;
          const isFirst = rank === 1;
          // Calculate percentage width (relative to the leader or max percentage)
          const percentage = Math.max(8, Math.round((c.votes / maxVotes) * 100));

          return (
            <div key={c.id} className="space-y-1.5">
              {/* Row info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* Rank circle badge */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isFirst
                        ? 'bg-emerald-100 text-[#18A968]'
                        : 'bg-[#EDF2F9] text-[#60708D]'
                    }`}
                  >
                    {rank}
                  </div>

                  {/* Small Circular Headshot */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-100 shadow-2xs shrink-0"
                  />

                  {/* Name and Position */}
                  <div className="leading-tight">
                    <h4 className="font-bold text-xs text-[#10234D]">
                      {c.name}
                    </h4>
                    <span className="text-[10px] text-[#60708D] block">
                      {c.position}
                    </span>
                  </div>
                </div>

                {/* Vote Count on Right */}
                <span className="font-bold text-xs text-[#10234D]">
                  {c.votes.toLocaleString()}
                </span>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFirst ? 'bg-[#18A968]' : 'bg-[#1769E8]'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
