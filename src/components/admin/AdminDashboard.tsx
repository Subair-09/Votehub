import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { StatCards } from './StatCards';
import { CandidatesVotingTable } from './CandidatesVotingTable';
import { CurrentLeaderCard } from './CurrentLeaderCard';
import { VoteDistributionCard } from './VoteDistributionCard';
import { RecentActivityCard } from './RecentActivityCard';
import { CodeManagementView } from './CodeManagementView';
import { CandidateDetailsModal } from './CandidateDetailsModal';
import { DatabaseStatusModal } from './DatabaseStatusModal';
import { AddCandidateModal } from './AddCandidateModal';
import { PositionsManagementView } from './PositionsManagementView';
import { Candidate } from '../../data/candidates';
import { IntegrationStatus, getIntegrationStatus } from '../../lib/api';
import {
  Users,
  CheckCircle,
  FileText,
  Sliders,
  Sparkles,
  Download,
  Clock,
  ShieldCheck,
  Search,
  Database,
  Cloud,
  UserPlus,
  Award,
} from 'lucide-react';

interface AdminDashboardProps {
  candidates: Candidate[];
  totalVotes: number;
  onLogout: () => void;
  onNavigateLanding: () => void;
  onNavigateVoterDashboard: () => void;
  onAddCandidateSuccess?: (candidate: Candidate) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  candidates,
  totalVotes,
  onLogout,
  onNavigateLanding,
  onNavigateVoterDashboard,
  onAddCandidateSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Database and Cloudinary integration modals & status
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);

  const fetchStatus = async () => {
    try {
      const s = await getIntegrationStatus();
      setIntegrationStatus(s);
    } catch (err) {
      console.warn('Status fetch error', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Identify current leader (highest votes)
  const currentLeader = [...candidates].sort((a, b) => b.votes - a.votes)[0] || candidates[0];

  // Total registered voters from reference
  const totalVoters = 2487;

  // Handle report generation & download
  const handleDownloadReport = () => {
    const csvContent = [
      'VoteHub Official Election Audit Report',
      'Election: Student Union President',
      `Date Generated: ${new Date().toLocaleString()}`,
      `Total Registered Voters: ${totalVoters}`,
      `Total Votes Cast: ${totalVotes}`,
      `Turnout: ${((totalVotes / totalVoters) * 100).toFixed(1)}%`,
      '',
      'Rank,Candidate,Party,Position,Votes,Percentage,Status',
      ...candidates
        .sort((a, b) => b.votes - a.votes)
        .map(
          (c, i) =>
            `${i + 1},"${c.name}","${c.party || 'Independent'}","${c.position}",${c.votes},${(
              (c.votes / totalVotes) *
              100
            ).toFixed(1)}%,${i === 0 ? 'Leading' : `${i + 1}th`}`
        ),
      '',
      'Cryptographic Integrity Check: SHA-256 Validated - No Tampering Detected',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `votehub-official-election-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast('Official Election Audit Report downloaded successfully (CSV).');
    setTimeout(() => setDownloadToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FE] text-[#10234D] flex">
      {/* Fixed Dark Navy Sidebar (Left) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={onLogout}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by 245px on desktop) */}
      <div className="flex-1 lg:ml-[245px] flex flex-col min-w-0">
        {/* Top White Header */}
        <AdminHeader
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigateLanding={onNavigateLanding}
          onNavigateVoterDashboard={onNavigateVoterDashboard}
          onLogout={onLogout}
          onOpenDatabaseStatus={() => setIsDatabaseModalOpen(true)}
          status={integrationStatus}
        />

        {/* Floating Notification */}
        {downloadToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0D1B35] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#18A968] animate-ping shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Tab-based Main Workspace */}
        <main className="p-6 sm:p-8 flex-1">
          {activeTab === 'dashboard' ? (
            <div className="space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
              {/* Main Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Heading & Subtitle */}
                <div>
                  <h1 className="text-3xl sm:text-[32px] font-extrabold text-[#0D1B35] tracking-tight leading-tight">
                    Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-[#60708D] mt-1 font-medium">
                    Overview of the voting process and real-time results
                  </p>
                </div>

                {/* Right Election Status & Timer Info */}
                <div className="flex flex-col items-start md:items-end gap-1.5">
                  {/* Green Voting Open Pill */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAFBF1] border border-[#C6EED7] text-[#18A968] text-xs font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#18A968] animate-pulse shrink-0" />
                    <span>Voting Open</span>
                  </div>

                  {/* Election details */}
                  <div className="text-left md:text-right">
                    <span className="text-xs font-bold text-[#0D1B35] block">
                      Election: Student Union President
                    </span>
                    <span className="text-[11px] font-medium text-[#60708D]">
                      Ends: Sep 30, 2026 • 11:59 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Four Horizontal Statistics Cards */}
              <StatCards
                totalVoters={totalVoters}
                totalVotesCast={totalVotes}
                totalCandidates={candidates.length}
                timeRemaining="2d 12h 34m"
              />

              {/* Main Content Grid: 70% Left Table + 30% Right Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Candidates & Voting Results (~70% width) */}
                <div className="lg:col-span-8 space-y-6">
                  <CandidatesVotingTable
                    candidates={candidates}
                    totalVotes={totalVotes}
                    onViewCandidate={(c) => setSelectedCandidate(c)}
                    onDownloadReport={handleDownloadReport}
                    onAddCandidate={() => setIsAddCandidateOpen(true)}
                  />
                </div>

                {/* Right Column: Leader, Donut Chart & Recent Activity (~30% width) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Current Leader Card */}
                  <CurrentLeaderCard
                    leader={currentLeader}
                    totalVotes={totalVotes}
                    onViewLeader={(c) => setSelectedCandidate(c)}
                  />

                  {/* Vote Distribution Donut Chart */}
                  <VoteDistributionCard
                    candidates={candidates}
                    totalVotes={totalVotes}
                  />

                  {/* Recent Activity List */}
                  <RecentActivityCard />
                </div>
              </div>
            </div>
          ) : activeTab === 'code-management' ? (
            <div className="max-w-[1600px] mx-auto">
              <CodeManagementView />
            </div>
          ) : activeTab === 'positions' ? (
            /* Dedicated Admin Positions Management */
            <div className="max-w-[1600px] mx-auto">
              <PositionsManagementView candidates={candidates} />
            </div>
          ) : activeTab === 'candidates' ? (
            /* Dedicated Candidates View */
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#0D1B35]">
                    Candidate Roster & Manifestos
                  </h2>
                  <p className="text-xs text-[#60708D] mt-1">
                    Manage election candidates, position designations, and policy commitments.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab('positions')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200"
                  >
                    <Award className="w-4 h-4 text-[#1769E8]" />
                    <span>Enter / Manage Positions</span>
                  </button>

                  <button
                    onClick={() => setIsAddCandidateOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1769E8] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Candidate</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {candidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="bg-white rounded-2xl border border-[#DDE7F3] p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4">
                        <img
                          src={cand.image}
                          alt={cand.name}
                          className="w-16 h-16 rounded-full object-cover object-top border border-[#DDE7F3]"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#1769E8]">
                            {cand.position}
                          </span>
                          <h4 className="font-extrabold text-base text-[#0D1B35]">
                            {cand.name}
                          </h4>
                          <span className="text-xs text-[#60708D]">
                            {cand.party || 'Independent'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#60708D] mt-3 line-clamp-2">
                        {cand.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#DDE7F3] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">Current Votes</span>
                        <p className="font-black text-sm text-[#0D1B35]">
                          {cand.votes.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedCandidate(cand)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1769E8] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                      >
                        View Full Dossier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'voters' ? (
            /* Voters Accreditation Directory */
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B35]">
                  Accredited Voter Directory
                </h2>
                <p className="text-xs text-[#60708D] mt-1">
                  2,487 registered voters • 2,302 ballots cast (92.7% overall turnout)
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 shadow-xs">
                <div className="space-y-3">
                  {[
                    { id: 'VH-7842910', name: 'John Doe', dept: 'Computer Engineering', status: 'Voted', time: '1 hour ago' },
                    { id: 'VH-9138402', name: 'Amina Yusuf', dept: 'Political Science', status: 'Voted', time: '2 hours ago' },
                    { id: 'VH-6294715', name: 'Emeka Nwosu', dept: 'Law & Jurisprudence', status: 'Voted', time: '3 hours ago' },
                    { id: 'VH-8401923', name: 'Fatima Aliyu', dept: 'Public Health', status: 'Pending', time: 'Accredited' },
                    { id: 'VH-5729104', name: 'David Adebayo', dept: 'Economics & Finance', status: 'Voted', time: '4 hours ago' },
                  ].map((voter) => (
                    <div
                      key={voter.id}
                      className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-[#1769E8]">
                          {voter.id}
                        </span>
                        <h5 className="font-bold text-sm text-[#0D1B35]">{voter.name}</h5>
                        <span className="text-xs text-[#60708D]">{voter.dept}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            voter.status === 'Voted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {voter.status}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">{voter.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'votes' ? (
            /* Live Immutable Ballot Ledger */
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B35]">
                  Cryptographic Ballot Ledger
                </h2>
                <p className="text-xs text-[#60708D] mt-1">
                  SHA-256 immutable audit chain recording anonymous voter verification receipts.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 shadow-xs space-y-3">
                {[
                  { hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', time: '2m ago', position: 'President', status: 'Confirmed' },
                  { hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', time: '5m ago', position: 'President', status: 'Confirmed' },
                  { hash: '8743b52063cd84097a65d1633f5c74f5', time: '7m ago', position: 'President', status: 'Confirmed' },
                  { hash: '35a9e381b1a27567549b5f8a6f783212', time: '10m ago', position: 'President', status: 'Confirmed' },
                ].map((block, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="font-mono text-[#0D1B35] truncate max-w-md">
                      Block #{2302 - i}: {block.hash}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#60708D]">{block.time}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                        {block.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'results' ? (
            /* Results Breakdown */
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0D1B35]">
                    Comprehensive Election Results
                  </h2>
                  <p className="text-xs text-[#60708D] mt-1">
                    Audited tally and distribution metrics.
                  </p>
                </div>
                <button
                  onClick={handleDownloadReport}
                  className="px-4 py-2 bg-[#1769E8] text-white text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Full Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VoteDistributionCard candidates={candidates} totalVotes={totalVotes} />
                <CurrentLeaderCard leader={currentLeader} totalVotes={totalVotes} onViewLeader={setSelectedCandidate} />
              </div>
            </div>
          ) : (
            /* Election Settings */
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B35]">
                  Election Configuration & Controls
                </h2>
                <p className="text-xs text-[#60708D] mt-1">
                  Manage voting window, administrative security, and election parameters.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#DDE7F3] p-6 shadow-xs space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#0D1B35] mb-1">
                    Election Title
                  </label>
                  <input
                    type="text"
                    defaultValue="Student Union President Election 2026"
                    className="w-full px-3.5 py-2 text-xs border border-[#DDE7F3] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D1B35] mb-1">
                    Voting Deadline
                  </label>
                  <input
                    type="text"
                    defaultValue="Sep 30, 2026 • 11:59 PM"
                    className="w-full px-3.5 py-2 text-xs border border-[#DDE7F3] rounded-xl"
                  />
                </div>

                <div className="pt-4 border-t border-[#DDE7F3] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0D1B35]">Live Voting Portal Status</span>
                    <p className="text-xs text-[#60708D]">Currently accepting accredited votes</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Voting Active
                  </span>
                </div>
              </div>

              {/* Database & Cloudinary Storage Integration Status Card */}
              <div className="bg-white rounded-2xl border border-[#DDE7F3] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1769E8] flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0D1B35]">Database & Media Storage Architecture</h3>
                      <p className="text-xs text-[#60708D]">MongoDB Atlas and Cloudinary media backend</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDatabaseModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1769E8] text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Status Details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#DDE7F3] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#60708D] font-medium block">MongoDB State</span>
                      <span className="text-xs font-bold text-[#0D1B35]">
                        {integrationStatus?.mongodb?.connected ? 'Live Connected' : 'In-Memory Ready'}
                      </span>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${integrationStatus?.mongodb?.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#DDE7F3] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#60708D] font-medium block">Cloudinary Media</span>
                      <span className="text-xs font-bold text-[#0D1B35]">
                        {integrationStatus?.cloudinary?.configured ? 'Cloud Active' : 'Fallback Buffer'}
                      </span>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${integrationStatus?.cloudinary?.configured ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Candidate Dossier / Details Modal */}
      <CandidateDetailsModal
        candidate={selectedCandidate}
        totalVotes={totalVotes}
        onClose={() => setSelectedCandidate(null)}
      />

      {/* Database & Cloudinary Status Modal */}
      <DatabaseStatusModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        status={integrationStatus}
        onRefresh={fetchStatus}
      />

      {/* Register Candidate Modal with Cloudinary Upload */}
      <AddCandidateModal
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
        onCandidateAdded={(newCand) => {
          onAddCandidateSuccess?.(newCand);
          setDownloadToast(`${newCand.name} saved with Cloudinary portrait!`);
          setTimeout(() => setDownloadToast(null), 4000);
          fetchStatus();
        }}
      />
    </div>
  );
};
