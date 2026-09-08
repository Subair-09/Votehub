import React from 'react';
import { X, Trophy, CheckCircle, Award, GraduationCap, Briefcase, Vote } from 'lucide-react';
import { Candidate } from '../../data/candidates';

interface CandidateDetailsModalProps {
  candidate: Candidate | null;
  totalVotes: number;
  onClose: () => void;
}

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  candidate,
  totalVotes,
  onClose,
}) => {
  if (!candidate) return null;

  const percentage =
    totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0.0';
  const isLeader = candidate.rank === 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#DDE7F3] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header with photo & badge */}
        <div className="relative bg-gradient-to-r from-[#0D1B35] to-[#17345F] p-6 sm:p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover object-top border-4 border-white/20 shadow-md"
              />
              {isLeader && (
                <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-xs">
                  <Trophy className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Rank #{candidate.rank}
                </span>
                {isLeader && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    Leading Candidate
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white truncate mt-1">
                {candidate.name}
              </h3>
              <p className="text-xs sm:text-sm text-blue-200 font-medium truncate">
                {candidate.position} • {candidate.party || 'Independent'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Tally Metrics Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F5F9FF] border border-[#D0E2FF]">
            <div>
              <span className="text-xs text-[#60708D] font-medium">Votes Received</span>
              <p className="text-2xl font-black text-[#0D1B35] mt-0.5">
                {candidate.votes.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#60708D] font-medium">Share of Total</span>
              <p className="text-2xl font-black text-[#1769E8] mt-0.5">
                {percentage}%
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-[#60708D] font-medium">Verification Status</span>
              <p className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Audited & Confirmed
              </p>
            </div>
          </div>

          {/* Bio / Description */}
          <div>
            <h4 className="text-xs font-bold text-[#60708D] uppercase tracking-wider mb-2">
              Candidate Overview
            </h4>
            <p className="text-sm text-[#10234D] leading-relaxed">
              {candidate.description}
            </p>
          </div>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidate.education && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D1B35] mb-1">
                  <GraduationCap className="w-4 h-4 text-[#1769E8]" />
                  <span>Academic Background</span>
                </div>
                <p className="text-xs text-[#60708D] leading-relaxed">
                  {candidate.education}
                </p>
              </div>
            )}
            {candidate.experience && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D1B35] mb-1">
                  <Briefcase className="w-4 h-4 text-[#1769E8]" />
                  <span>Leadership Experience</span>
                </div>
                <p className="text-xs text-[#60708D] leading-relaxed">
                  {candidate.experience}
                </p>
              </div>
            )}
          </div>

          {/* Manifesto Commitments */}
          {candidate.manifesto && candidate.manifesto.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#60708D] uppercase tracking-wider mb-3">
                Key Manifesto Pledges
              </h4>
              <ul className="space-y-2.5">
                {candidate.manifesto.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-xs text-[#10234D] bg-slate-50/60 p-3 rounded-xl border border-slate-100"
                  >
                    <CheckCircle className="w-4 h-4 text-[#18A968] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-[#DDE7F3] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#60708D]">
            <Vote className="w-4 h-4 text-[#1769E8]" />
            <span>Encrypted Voting Ledger #VH-CHAIN-2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#1769E8] hover:bg-[#1257C4] rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
