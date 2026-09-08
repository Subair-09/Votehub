import React, { useState } from 'react';
import { X, CheckCircle2, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { Candidate } from '../data/candidates';

interface VoteModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmVote: (candidateId: string) => void;
  hasAlreadyVoted: boolean;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onConfirmVote,
  hasAlreadyVoted,
}) => {
  const [voterCode, setVoterCode] = useState('VH-2025-9842');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [receiptHash, setReceiptHash] = useState('');

  if (!isOpen || !candidate) return null;

  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterCode.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedHash = `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
      setReceiptHash(generatedHash);
      setIsSubmitting(false);
      setVoteSuccess(true);
      onConfirmVote(candidate.id);
    }, 700);
  };

  const handleDone = () => {
    setVoteSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-200" />
            <span className="font-bold text-base">VoteHub Ballot Box</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {voteSuccess ? (
            /* Success Receipt View */
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-3 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                Ballot Cryptographically Sealed
              </span>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                Vote Cast Successfully!
              </h3>
              <p className="text-slate-600 text-xs mb-6">
                Your vote for <strong className="text-blue-600">{candidate.name}</strong> as{' '}
                <strong>{candidate.position}</strong> has been counted and locked.
              </p>

              {/* Digital Voting Receipt */}
              <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left text-xs text-slate-600 mb-6 space-y-2 font-mono">
                <div className="flex justify-between border-b border-slate-200 pb-1.5 font-sans font-bold text-slate-800">
                  <span>Official Voting Receipt</span>
                  <span className="text-blue-600">VALIDATED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Timestamp:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Voter Token:</span>
                  <span>{voterCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Verification Hash:</span>
                  <span className="text-blue-700 font-semibold">{receiptHash}</span>
                </div>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
              >
                Return to Election Dashboard
              </button>
            </div>
          ) : hasAlreadyVoted ? (
            /* Already Voted Notice */
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                One Person, One Vote
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                You have already submitted a vote in this election cycle. To maintain integrity and prevent electoral fraud, each voter code is strictly limited to one verified ballot.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            /* Confirmation Form */
            <form onSubmit={handleCastVote} className="space-y-5">
              {/* Candidate Info Card */}
              <div className="flex items-center gap-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-blue-600">
                    {candidate.position}
                  </span>
                  <span className="text-lg font-bold text-slate-900 leading-tight">
                    {candidate.name}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">
                    Current tally: {candidate.votes.toLocaleString()} votes
                  </span>
                </div>
              </div>

              {/* Voter Authorization Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  Voter Identification Code
                </label>
                <input
                  type="text"
                  value={voterCode}
                  onChange={(e) => setVoterCode(e.target.value)}
                  placeholder="e.g. VH-2025-XXXX"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-400">
                  Pre-filled with your demo credential. Click confirm to cast your vote.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Verifying...' : 'Confirm Vote'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
