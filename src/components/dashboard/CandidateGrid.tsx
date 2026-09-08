import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Candidate } from '../../data/candidates';
import { CandidateCard } from './CandidateCard';

interface CandidateGridProps {
  candidates: Candidate[];
  userVotedId: string | null;
  onVoteClick: (candidate: Candidate) => void;
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({
  candidates,
  userVotedId,
  onVoteClick,
}) => {
  const [sortOption, setSortOption] = useState<'votes-desc' | 'votes-asc' | 'alphabetical'>('votes-desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Sorting
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortOption === 'votes-desc') return b.votes - a.votes;
    if (sortOption === 'votes-asc') return a.votes - b.votes;
    return a.name.localeCompare(b.name);
  });

  const getSortLabel = () => {
    switch (sortOption) {
      case 'votes-desc':
        return 'Votes (Highest)';
      case 'votes-asc':
        return 'Votes (Lowest)';
      case 'alphabetical':
        return 'Name (A-Z)';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#10234D] tracking-tight">
          All Candidates
        </h2>

        {/* Sorting Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE7F3] rounded-lg text-xs font-semibold text-[#60708D] hover:text-[#10234D] hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Sort by:</span>
            <span className="text-[#10234D]">{getSortLabel()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isSortOpen && (
            <>
              <div
                onClick={() => setIsSortOpen(false)}
                className="fixed inset-0 z-20"
              />
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#DDE7F3] rounded-xl shadow-lg py-1 z-30 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    setSortOption('votes-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${
                    sortOption === 'votes-desc'
                      ? 'text-[#1769E8] font-bold bg-blue-50/50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Votes (Highest)
                </button>
                <button
                  onClick={() => {
                    setSortOption('votes-asc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${
                    sortOption === 'votes-asc'
                      ? 'text-[#1769E8] font-bold bg-blue-50/50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Votes (Lowest)
                </button>
                <button
                  onClick={() => {
                    setSortOption('alphabetical');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${
                    sortOption === 'alphabetical'
                      ? 'text-[#1769E8] font-bold bg-blue-50/50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Name (A-Z)
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3-Column Candidate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedCandidates.map((candidate) => {
          const isVoted = userVotedId === candidate.id;
          const hasVotedForAnother = userVotedId !== null && !isVoted;

          return (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isVoted={isVoted}
              disabled={hasVotedForAnother}
              onVoteClick={onVoteClick}
            />
          );
        })}
      </div>
    </div>
  );
};
