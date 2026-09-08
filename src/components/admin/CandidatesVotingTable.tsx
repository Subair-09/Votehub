import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Trophy, Users, Info, Download, UserPlus } from 'lucide-react';
import { Candidate } from '../../data/candidates';

interface CandidatesVotingTableProps {
  candidates: Candidate[];
  totalVotes: number;
  onViewCandidate: (candidate: Candidate) => void;
  onDownloadReport: () => void;
  onAddCandidate?: () => void;
}

type SortOption = 'votes-desc' | 'votes-asc' | 'name-asc' | 'name-desc';

export const CandidatesVotingTable: React.FC<CandidatesVotingTableProps> = ({
  candidates,
  totalVotes,
  onViewCandidate,
  onDownloadReport,
  onAddCandidate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('votes-desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter & Sort Candidates
  const processedCandidates = useMemo(() => {
    let list = [...candidates];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.position.toLowerCase().includes(q) ||
          (c.party && c.party.toLowerCase().includes(q))
      );
    }

    // Sort order
    switch (sortOption) {
      case 'votes-desc':
        list.sort((a, b) => b.votes - a.votes);
        break;
      case 'votes-asc':
        list.sort((a, b) => a.votes - b.votes);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return list;
  }, [candidates, searchQuery, sortOption]);

  const sortLabelMap: Record<SortOption, string> = {
    'votes-desc': 'Votes (Highest)',
    'votes-asc': 'Votes (Lowest)',
    'name-asc': 'Name (A - Z)',
    'name-desc': 'Name (Z - A)',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DDE7F3] shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Table Card Header */}
      <div className="p-6 pb-4 border-b border-[#DDE7F3]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#0D1B35] tracking-tight">
          Candidates & Voting Results
        </h2>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px] sm:min-w-[240px]">
            <Search className="w-4 h-4 text-[#60708D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate..."
              className="w-full pl-9 pr-3.5 py-2 text-xs font-medium text-[#10234D] bg-white border border-[#DDE7F3] rounded-xl placeholder:text-[#94A3B8] focus:outline-hidden focus:ring-2 focus:ring-[#1769E8]/20 focus:border-[#1769E8] transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#10234D] bg-white border border-[#DDE7F3] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="text-[#60708D] font-normal">Sort by:</span>
              <span>{sortLabelMap[sortOption]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#60708D]" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-[#DDE7F3] shadow-lg py-1 z-20">
                {(['votes-desc', 'votes-asc', 'name-asc', 'name-desc'] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      sortOption === opt
                        ? 'font-bold text-[#1769E8] bg-blue-50/60'
                        : 'text-[#10234D] hover:bg-slate-50'
                    }`}
                  >
                    {sortLabelMap[opt]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Candidate Button */}
          {onAddCandidate && (
            <button
              onClick={onAddCandidate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#1769E8] hover:bg-blue-600 rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Candidate</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#DDE7F3] bg-[#F8FAFD]/60">
              <th className="py-3 px-4 sm:px-6 text-[11px] font-bold text-[#60708D] uppercase tracking-wider w-12 text-center">
                #
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider">
                Candidate
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider">
                Position
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider">
                Votes
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider w-44">
                Percentage
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#60708D] uppercase tracking-wider text-center">
                Status
              </th>
              <th className="py-3 px-4 sm:px-6 text-[11px] font-bold text-[#60708D] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE7F3]/60">
            {processedCandidates.map((cand, idx) => {
              const rank = idx + 1;
              const isLeader = rank === 1;
              const percentage =
                totalVotes > 0 ? ((cand.votes / totalVotes) * 100).toFixed(1) : '0.0';

              return (
                <tr
                  key={cand.id}
                  className="hover:bg-[#F9FBFE] transition-colors group"
                >
                  {/* # Rank Badge */}
                  <td className="py-4 px-4 sm:px-6 text-center">
                    <div
                      className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                        isLeader
                          ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                          : 'bg-[#F1F5F9] text-[#60708D]'
                      }`}
                    >
                      {rank}
                    </div>
                  </td>

                  {/* Candidate Avatar & Details */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.image}
                        alt={cand.name}
                        className="w-11 h-11 rounded-full object-cover object-top border border-[#DDE7F3] shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-[#0D1B35] group-hover:text-[#1769E8] transition-colors truncate">
                          {cand.name}
                        </span>
                        <span className="text-xs text-[#60708D] truncate">
                          {cand.party || 'Independent'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Position */}
                  <td className="py-4 px-4 text-xs font-medium text-[#10234D]">
                    {cand.position}
                  </td>

                  {/* Votes */}
                  <td className="py-4 px-4 text-sm font-extrabold text-[#0D1B35]">
                    {cand.votes.toLocaleString()}
                  </td>

                  {/* Percentage & Progress Bar */}
                  <td className="py-4 px-4">
                    <div className="w-full">
                      <div className="text-xs font-bold text-[#0D1B35] mb-1.5">
                        {percentage}%
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EAF3FF] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLeader ? 'bg-[#18A968]' : 'bg-[#1769E8]'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center">
                    {isLeader ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#EAFBF1] text-[#18A968] border border-[#C6EED7]">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Leading</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#EBF3FE] text-[#1769E8] border border-[#D0E2FF]">
                        <Users className="w-3.5 h-3.5" />
                        <span>{rank === 2 ? '2nd' : rank === 3 ? '3rd' : `${rank}th`}</span>
                      </span>
                    )}
                  </td>

                  {/* Actions (View Button) */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => onViewCandidate(cand)}
                      className="px-4 py-1.5 rounded-lg bg-[#1769E8] hover:bg-[#1257C4] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Information Bar */}
      <div className="p-4 sm:p-5 bg-[#F4F8FE] border-t border-[#DDE7F3] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Info Text */}
        <div className="flex items-center gap-2.5 text-[#10234D]">
          <div className="w-5 h-5 rounded-full bg-[#1769E8] text-white flex items-center justify-center shrink-0">
            <Info className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-medium">
            Keep the voting process fair, secure and transparent.
          </span>
        </div>

        {/* Right Download Report Button */}
        <button
          onClick={onDownloadReport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1769E8] hover:bg-[#1257C4] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </button>
      </div>
    </div>
  );
};
