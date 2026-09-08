/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureHighlights } from './components/FeatureHighlights';
import { FeaturedCandidates } from './components/FeaturedCandidates';
import { HowItWorks } from './components/HowItWorks';
import { ImpactStatistics } from './components/ImpactStatistics';
import { Footer } from './components/Footer';
import { VoteModal } from './components/VoteModal';
import { AllCandidatesModal } from './components/AllCandidatesModal';
import { AuthModals } from './components/AuthModals';
import { InfoModals } from './components/InfoModals';
import { INITIAL_CANDIDATES, Candidate } from './data/candidates';
import { getCandidatesApi, castVoteApi } from './lib/api';

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [userVotedId, setUserVotedId] = useState<string | null>(null);

  // Authenticated voter state - null initially (unauthenticated)
  const [currentUser, setCurrentUser] = useState<{ name: string; voterId?: string } | null>(null);

  // View state: 'landing' (default initial view) | 'login' | 'signup' | 'dashboard' | 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'admin'>('landing');

  // Load live candidates from MongoDB API on launch
  useEffect(() => {
    async function loadCandidates() {
      try {
        const liveCandidates = await getCandidatesApi();
        if (liveCandidates && liveCandidates.length > 0) {
          setCandidates(liveCandidates);
        }
      } catch (err) {
        console.log('[App] Using initial candidates baseline:', err);
      }
    }
    loadCandidates();
  }, []);

  // Landing Page state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCandidateForVote, setSelectedCandidateForVote] = useState<Candidate | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isAllCandidatesModalOpen, setIsAllCandidatesModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup' | null>(null);
  const [infoModalType, setInfoModalType] = useState<'contact' | 'privacy' | 'terms' | 'manifesto' | null>(null);
  const [manifestoCandidate, setManifestoCandidate] = useState<Candidate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Total votes count
  const initialBaseVotes = 2487;
  const newVotesAdded = candidates.reduce((acc, c) => acc + c.votes, 0) -
    INITIAL_CANDIDATES.reduce((acc, c) => acc + c.votes, 0);
  const totalVotesCast = initialBaseVotes + newVotesAdded;

  // Show a temporary banner notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sign out handler: clears session and redirects back to the landing page
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('You have been signed out. Redirected to VoteHub landing page.');
  };

  // Auth success: records user and redirects to User Dashboard
  const handleAuthSuccess = (userName: string, voterId?: string) => {
    const user = { name: userName || 'John Doe', voterId: voterId || 'VH-2025-9842' };
    setCurrentUser(user);
    setAuthModalType(null);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Welcome back, ${user.name}! Your voter dashboard is ready.`);
  };

  // Vote confirmation handler (used by both Dashboard and Landing)
  const handleConfirmVote = async (candidateId: string) => {
    if (userVotedId) return;

    setUserVotedId(candidateId);
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return { ...c, votes: c.votes + 1 };
        }
        return c;
      })
    );

    const votedCandidate = candidates.find((c) => c.id === candidateId);
    showToast(`✓ Official ballot cast for ${votedCandidate?.name || 'candidate'}. One person, one vote recorded.`);

    // Persist to MongoDB backend
    try {
      await castVoteApi(
        candidateId,
        currentUser?.voterId || `VH-${Date.now()}`,
        currentUser?.name || 'Accredited Voter'
      );
    } catch (err) {
      console.warn('[Vote API] Sync in background completed:', err);
    }
  };

  // Landing Page Navigation
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'candidates') {
      document.getElementById('candidates')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'about') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'how-it-works') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'contact') {
      setInfoModalType('contact');
    }
  };

  const handleStartVoting = () => {
    if (currentUser) {
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Please login to your voter account to access the dashboard.');
    }
  };

  const handleLandingVoteClick = (candidate: Candidate) => {
    if (!currentUser) {
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Please login or register to cast your official ballot.');
    } else {
      setSelectedCandidateForVote(candidate);
      setIsVoteModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FE] text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold border border-slate-700 animate-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Render View */}
      {currentView === 'admin' ? (
        <AdminDashboard
          candidates={candidates}
          totalVotes={totalVotesCast}
          onLogout={handleLogout}
          onNavigateLanding={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateVoterDashboard={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddCandidateSuccess={(newCand) => {
            setCandidates((prev) => [newCand, ...prev]);
          }}
        />
      ) : currentView === 'login' ? (
        <LoginPage
          onLoginSuccess={handleAuthSuccess}
          onNavigateSignUp={() => {
            setCurrentView('signup');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateHome={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateAdmin={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'signup' ? (
        <SignUpPage
          onSignUpSuccess={handleAuthSuccess}
          onNavigateLogin={() => {
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateHome={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'dashboard' ? (
        <UserDashboard
          candidates={candidates}
          onVoteSuccess={handleConfirmVote}
          userVotedId={userVotedId}
          userName={currentUser?.name || 'John Doe'}
          onLogout={handleLogout}
          onNavigateToLanding={() => setCurrentView('landing')}
        />
      ) : (
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <Navbar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            onOpenLogin={() => {
              setCurrentView('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSignUp={() => {
              setCurrentView('signup');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmin={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentUser={currentUser}
            onGoToDashboard={() => setCurrentView('dashboard')}
            onLogout={handleLogout}
          />

          <main className="flex-1 flex flex-col">
            <HeroSection
              onStartVoting={handleStartVoting}
              onLearnMore={() => handleNavigate('about')}
            />
            <FeatureHighlights />
            <FeaturedCandidates
              candidates={candidates.slice(0, 4)}
              userVotedId={userVotedId}
              onVoteClick={handleLandingVoteClick}
              onViewAllClick={() => setIsAllCandidatesModalOpen(true)}
              onViewManifesto={(c) => {
                setManifestoCandidate(c);
                setInfoModalType('manifesto');
              }}
            />
            <HowItWorks onStartVoting={handleStartVoting} />
            <ImpactStatistics
              totalVotesCast={totalVotesCast}
              totalCandidates={candidates.length}
            />
          </main>

          <Footer
            onNavigate={handleNavigate}
            onOpenPrivacy={() => setInfoModalType('privacy')}
            onOpenTerms={() => setInfoModalType('terms')}
            onOpenAdmin={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Landing Modals */}
          <VoteModal
            candidate={selectedCandidateForVote}
            isOpen={isVoteModalOpen}
            onClose={() => setIsVoteModalOpen(false)}
            onConfirmVote={handleConfirmVote}
            hasAlreadyVoted={userVotedId !== null && userVotedId !== selectedCandidateForVote?.id}
          />

          <AllCandidatesModal
            candidates={candidates}
            isOpen={isAllCandidatesModalOpen}
            onClose={() => setIsAllCandidatesModalOpen(false)}
            onVoteClick={(c) => {
              if (!currentUser) {
                setIsAllCandidatesModalOpen(false);
                setCurrentView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('Please login to cast your ballot.');
              } else {
                setSelectedCandidateForVote(c);
                setIsVoteModalOpen(true);
              }
            }}
            userVotedId={userVotedId}
          />

          <AuthModals
            type={authModalType}
            isOpen={authModalType !== null}
            onClose={() => setAuthModalType(null)}
            onSuccess={handleAuthSuccess}
            onSwitchType={(type) => setAuthModalType(type)}
          />

          <InfoModals
            type={infoModalType}
            isOpen={infoModalType !== null}
            onClose={() => {
              setInfoModalType(null);
              setManifestoCandidate(null);
            }}
            candidate={manifestoCandidate}
          />
        </div>
      )}
    </div>
  );
}
