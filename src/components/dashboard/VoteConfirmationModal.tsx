import React, { useState } from 'react';
import { X, ShieldCheck, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Candidate } from '../../data/candidates';

interface VoteConfirmationModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmVote: (candidateId: string) => void;
  hasAlreadyVoted: boolean;
}

export const VoteConfirmationModal: React.FC<VoteConfirmationModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onConfirmVote,
  hasAlreadyVoted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleCastVote = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onConfirmVote(candidate.id);
    }, 700);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DDE7F3] overflow-hidden text-left">
        {/* Header */}
        <div className="bg-[#0D1B35] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1769E8] flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {isSuccess ? 'Ballot Recorded' : 'Confirm Your Vote'}
              </h3>
              <p className="text-slate-300 text-xs">Official VoteHub Voter Registry</p>
            </div>
          </div>
          <button
            onClick={handleDone}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            /* Success Receipt */
            <div className="text-center space-y-4 py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="font-extrabold text-xl text-[#10234D]">
                  Vote Successfully Cast!
                </h4>
                <p className="text-xs text-[#60708D] mt-1 max-w-xs mx-auto">
                  Your official ballot choice has been cryptographically recorded on the VoteHub ledger.
                </p>
              </div>

              <div className="bg-[#F4F8FE] border border-[#DDE7F3] rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Candidate Selected:</span>
                  <strong className="text-[#10234D]">{candidate.name}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Position:</span>
                  <strong className="text-[#10234D]">{candidate.position}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Voter Name:</span>
                  <strong className="text-[#10234D]">John Doe</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Verification Hash:</span>
                  <span className="font-mono font-bold text-blue-600 text-[11px]">
                    #VH-7A92F-{(Math.random() * 9000 + 1000).toFixed(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-3 bg-[#1769E8] hover:bg-[#1257c2] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          ) : hasAlreadyVoted ? (
            /* Already Voted Warning */
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-[#10234D]">
                  Single Vote Constraint
                </h4>
                <p className="text-xs text-[#60708D] mt-1">
                  To protect democratic fairness, VoteHub strictly enforces <strong className="text-[#10234D]">one vote per authenticated voter</strong>. Your vote is already locked.
                </p>
              </div>
              <button
                onClick={handleDone}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          ) : (
            /* Confirmation Form */
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-3.5 bg-[#F4F8FE] rounded-xl border border-[#DDE7F3]">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div>
                  <span className="text-[11px] font-bold text-[#1769E8] uppercase tracking-wide">
                    {candidate.position}
                  </span>
                  <h4 className="font-extrabold text-base text-[#10234D] leading-tight">
                    {candidate.name}
                  </h4>
                  <span className="text-xs text-[#60708D]">
                    Currently #{candidate.rank} with {candidate.votes.toLocaleString()} votes
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#60708D] bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  Please note: This action is permanent.
                </p>
                <p className="text-amber-800">
                  You are voting as <strong>John Doe</strong>. Once submitted, your vote cannot be undone or transferred to another candidate.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCastVote}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#1769E8] hover:bg-[#1257c2] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    'Confirm & Vote'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
