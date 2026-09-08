import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { VotingStatusCard } from './VotingStatusCard';
import { CandidateGrid } from './CandidateGrid';
import { CurrentLeaderCard } from './CurrentLeaderCard';
import { VoteLeaderboard } from './VoteLeaderboard';
import { BottomInfoCard } from './BottomInfoCard';
import { VoteConfirmationModal } from './VoteConfirmationModal';
import { Candidate } from '../../data/candidates';

interface UserDashboardProps {
  candidates: Candidate[];
  onVoteSuccess: (candidateId: string) => void;
  userVotedId: string | null;
  userName?: string;
  onLogout: () => void;
  onNavigateToLanding?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  candidates,
  onVoteSuccess,
  userVotedId,
  userName = 'John Doe',
  onLogout,
  onNavigateToLanding,
}) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCandidateForVote, setSelectedCandidateForVote] = useState<Candidate | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [activeTabNotice, setActiveTabNotice] = useState<string | null>(null);

  // Derive the current leader dynamically
  const sortedByVotes = [...candidates].sort((a, b) => b.votes - a.votes);
  const currentLeader = sortedByVotes[0];

  // Derive total votes cast
  const initialBaseVotes = 2487;
  const newVotesAdded = userVotedId ? 1 : 0;
  const totalVotesCast = initialBaseVotes + newVotesAdded;

  // Handle vote button click
  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidateForVote(candidate);
    setIsVoteModalOpen(true);
  };

  const handleConfirmVote = (candidateId: string) => {
    onVoteSuccess(candidateId);
  };

  const handleSelectNav = (navId: string) => {
    setActiveNav(navId);
    if (navId === 'logout') {
      onLogout();
    } else if (navId === 'candidates') {
      const el = document.getElementById('dashboard-candidate-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (navId === 'my-votes') {
      if (userVotedId) {
        const voted = candidates.find((c) => c.id === userVotedId);
        setActiveTabNotice(`Your official ballot was cast for ${voted?.name || 'candidate'}.`);
      } else {
        setActiveTabNotice('You have not cast your ballot yet. Select a candidate below!');
      }
      setTimeout(() => setActiveTabNotice(null), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FE] flex text-[#10234D]">
      {/* Toast Notice */}
      {activeTabNotice && (
        <div className="fixed top-5 right-5 z-50 bg-[#0D1B35] text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
          {activeTabNotice}
        </div>
      )}

      {/* 1. Left Fixed Sidebar (250px) */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Layout (Offset for fixed sidebar on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <TopHeader
          userName={userName}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
          onLogout={onLogout}
          onOpenMyVotes={() => handleSelectNav('my-votes')}
        />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 space-y-8 max-w-[1400px] w-full mx-auto">
          {/* Top Greeting Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10234D] tracking-tight">
              Hello, {userName.split(' ')[0] || 'John'} 👋
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#60708D]">
              Cast your vote and help choose the best candidate. Your vote counts!
            </p>
          </div>

          {/* Voting Status Card (Ends in countdown & total votes) */}
          <VotingStatusCard totalVotesCast={totalVotesCast} />

          {/* Two-Column Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: All Candidates (3-column grid) */}
            <div id="dashboard-candidate-grid" className="lg:col-span-8">
              <CandidateGrid
                candidates={candidates}
                userVotedId={userVotedId}
                onVoteClick={handleVoteClick}
              />
            </div>

            {/* Right Column: Current Leader + Vote Leaderboard + Bottom Info */}
            <div className="lg:col-span-4 space-y-6">
              {/* Current Leader Highlight Card */}
              <CurrentLeaderCard leader={currentLeader} />

              {/* Vote Leaderboard Card */}
              <VoteLeaderboard candidates={candidates} />

              {/* Bottom Information Card */}
              <BottomInfoCard />
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation & Ballot Modal */}
      <VoteConfirmationModal
        candidate={selectedCandidateForVote}
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onConfirmVote={handleConfirmVote}
        hasAlreadyVoted={userVotedId !== null}
      />
    </div>
  );
};
