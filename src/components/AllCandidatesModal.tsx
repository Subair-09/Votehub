import React, { useState } from 'react';
import { X, Search, Crown, Users } from 'lucide-react';
import { Candidate } from '../data/candidates';

interface AllCandidatesModalProps {
  candidates: Candidate[];
  isOpen: boolean;
  onClose: () => void;
  onVoteClick: (candidate: Candidate) => void;
  userVotedId: string | null;
}

export const AllCandidatesModal: React.FC<AllCandidatesModalProps> = ({
  candidates,
  isOpen,
  onClose,
  onVoteClick,
  userVotedId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  if (!isOpen) return null;

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              OFFICIAL 2025 BALLOT ROSTER
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              All Running Candidates ({candidates.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate or position..."
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 w-56 text-slate-900"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {selectedCandidate ? (
            /* Detailed Candidate Manifesto View */
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-200">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                ← Back to Candidate Directory
              </button>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
                <img
                  src={selectedCandidate.image}
                  alt={selectedCandidate.name}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-sm shrink-0"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                      {selectedCandidate.position}
                    </span>
                    <span className="text-xs text-slate-400">
                      Rank #{selectedCandidate.rank}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {selectedCandidate.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 mb-5">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block font-medium">Education</span>
                      <strong className="text-slate-800">{selectedCandidate.education}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block font-medium">Background</span>
                      <strong className="text-slate-800">{selectedCandidate.experience}</strong>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-2">
                    Key Manifesto Pillars:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside mb-6">
                    {selectedCandidate.manifesto?.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      onClose();
                      onVoteClick(selectedCandidate);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm"
                  >
                    Cast Vote for {selectedCandidate.name}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Grid of Candidates */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((c) => {
                const isVoted = userVotedId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`bg-white rounded-xl p-5 border text-center flex flex-col items-center relative transition-shadow hover:shadow-md ${
                      c.isLeader ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                    }`}
                  >
                    {/* Badge */}
                    {c.isLeader ? (
                      <div className="absolute top-3 left-3 w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-amber-600">
                        <Crown className="w-3.5 h-3.5 fill-amber-500" />
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                        #{c.rank}
                      </div>
                    )}

                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-2xs mb-3"
                    />

                    <h4 className="font-bold text-base text-slate-900 leading-tight">
                      {c.name}
                    </h4>
                    <span className="text-xs font-semibold text-blue-600 mb-2">
                      {c.position}
                    </span>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 min-h-[32px]">
                      {c.description}
                    </p>

                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-4 mt-auto">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{c.votes.toLocaleString()} votes</span>
                    </div>

                    <div className="w-full flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="flex-1 py-2 text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Manifesto
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onVoteClick(c);
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          isVoted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isVoted ? 'Voted ✓' : 'Vote'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
