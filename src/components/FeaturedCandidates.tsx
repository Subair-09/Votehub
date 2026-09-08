import React from 'react';
import { ArrowRight, Crown, Users } from 'lucide-react';
import { Candidate } from '../data/candidates';

interface FeaturedCandidatesProps {
  candidates: Candidate[];
  userVotedId: string | null;
  onVoteClick: (candidate: Candidate) => void;
  onViewAllClick: () => void;
  onViewManifesto: (candidate: Candidate) => void;
}

export const FeaturedCandidates: React.FC<FeaturedCandidatesProps> = ({
  candidates,
  userVotedId,
  onVoteClick,
  onViewAllClick,
  onViewManifesto,
}) => {
  // We showcase the top 4 candidates in the featured row matching the reference
  const featured = candidates.slice(0, 4);

  return (
    <section id="candidates" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
              FEATURED CANDIDATES
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Meet the Candidates
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl">
              Get to know the people who are running and the vision they bring.
            </p>
          </div>

          <button
            id="view-all-candidates-top-btn"
            onClick={onViewAllClick}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>View All Candidates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Candidate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((c) => {
            const hasUserVotedThis = userVotedId === c.id;

            return (
              <div
                key={c.id}
                id={`candidate-card-${c.id}`}
                className={`relative bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 shadow-xs hover:shadow-lg ${
                  c.isLeader
                    ? 'border-2 border-amber-300 ring-4 ring-amber-50'
                    : 'border border-blue-100/90 hover:border-blue-200'
                }`}
              >
                {/* Top Corner Badges */}
                {c.isLeader ? (
                  <>
                    {/* Golden Crown Badge on Top Left */}
                    <div
                      title="Current Leader"
                      className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-amber-100/90 border border-amber-300 flex items-center justify-center text-amber-600 shadow-2xs"
                    >
                      <Crown className="w-4 h-4 fill-amber-500 text-amber-600 stroke-[2.2]" />
                    </div>

                    {/* Circular Gold Number 1 Badge on Top Right */}
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      1
                    </div>
                  </>
                ) : (
                  /* Standard Rank Badge on Top Left (#2, #3, #4) */
                  <div className="absolute top-4 left-4 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                    #{c.rank}
                  </div>
                )}

                {/* Candidate Circular Portrait */}
                <div
                  onClick={() => onViewManifesto(c)}
                  className="mt-3 relative w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm cursor-pointer group shrink-0"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold">
                    View Profile
                  </div>
                </div>

                {/* Name & Position */}
                <h3
                  onClick={() => onViewManifesto(c)}
                  className="text-lg font-bold text-slate-900 mt-4 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {c.name}
                </h3>
                <span className="text-xs font-semibold text-blue-600 mt-0.5 mb-2.5">
                  {c.position}
                </span>

                {/* Short Description */}
                <p className="text-slate-500 text-xs leading-relaxed px-1 min-h-[44px] mb-4">
                  {c.description}
                </p>

                {/* Vote Count */}
                <div className="flex items-center justify-center gap-1.5 text-slate-700 text-sm font-bold mb-5 mt-auto">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{c.votes.toLocaleString()} votes</span>
                </div>

                {/* Vote Action Button */}
                <button
                  id={`vote-btn-${c.id}`}
                  onClick={() => onVoteClick(c)}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all shadow-xs cursor-pointer ${
                    hasUserVotedThis
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                  }`}
                >
                  {hasUserVotedThis ? 'Voted ✓' : 'Vote'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
