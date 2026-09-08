import React, { useState } from 'react';
import { Candidate } from '../../data/candidates';

interface VoteDistributionCardProps {
  candidates: Candidate[];
  totalVotes: number;
}

interface Segment {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  color: string;
  strokeDasharray: string;
  strokeDashoffset: number;
}

export const VoteDistributionCard: React.FC<VoteDistributionCardProps> = ({
  candidates,
  totalVotes,
}) => {
  const [hoveredCandidateId, setHoveredCandidateId] = useState<string | null>(null);

  // Colors matching the reference image:
  // Aisha (Blue), Daniel (Purple), Chinwe (Teal/Cyan), Ibrahim (Green), Fatima (Amber), Tunde (Slate)
  const candidateColors: Record<string, string> = {
    'aisha-bello': '#1769E8', // Primary Blue
    'daniel-okafor': '#8B5CF6', // Purple
    'chinwe-nwosu': '#06B6D4', // Teal/Cyan
    'ibrahim-musa': '#10B981', // Green
    'fatima-sani': '#F59E0B', // Amber
    'tunde-alabi': '#64748B', // Slate
  };

  const defaultColors = ['#1769E8', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#64748B'];

  // Calculate donut metrics
  const radius = 65;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercentage = 0;

  const segments: Segment[] = candidates.map((cand, index) => {
    const rawPct = totalVotes > 0 ? (cand.votes / totalVotes) * 100 : 0;
    const pct = parseFloat(rawPct.toFixed(1));
    const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
    // SVG strokeDashoffset runs clockwise
    const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
    cumulativePercentage += pct;

    return {
      id: cand.id,
      name: cand.name,
      votes: cand.votes,
      percentage: pct,
      color: candidateColors[cand.id] || defaultColors[index % defaultColors.length],
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <h3 className="font-bold text-base text-[#0D1B35] tracking-tight pb-4">
        Vote Distribution
      </h3>

      {/* Donut Chart and Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {segments.map((seg) => {
              const isHovered = hoveredCandidateId === seg.id;
              return (
                <circle
                  key={seg.id}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCandidateId(seg.id)}
                  onMouseLeave={() => setHoveredCandidateId(null)}
                />
              );
            })}
          </svg>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-black text-[#0D1B35] tracking-tight leading-none">
              {totalVotes.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-[#60708D] mt-1">
              Total Votes
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2.5">
          {segments.map((seg) => {
            const isHovered = hoveredCandidateId === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredCandidateId(seg.id)}
                onMouseLeave={() => setHoveredCandidateId(null)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-50 font-bold' : 'font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-[#10234D] truncate">{seg.name}</span>
                </div>
                <span className="font-bold text-[#0D1B35] ml-2 shrink-0">
                  {seg.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
