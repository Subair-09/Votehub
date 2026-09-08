import React from 'react';
import { X, Mail, Phone, MapPin, ShieldCheck, FileCheck2 } from 'lucide-react';
import { Candidate } from '../data/candidates';

interface InfoModalProps {
  type: 'contact' | 'privacy' | 'terms' | 'manifesto' | null;
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
}

export const InfoModals: React.FC<InfoModalProps> = ({
  type,
  isOpen,
  onClose,
  candidate,
}) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-left max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {type === 'contact' && <Mail className="w-5 h-5 text-blue-200" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-blue-200" />}
            {type === 'terms' && <FileCheck2 className="w-5 h-5 text-blue-200" />}
            {type === 'manifesto' && <FileCheck2 className="w-5 h-5 text-blue-200" />}
            <span className="font-bold text-base">
              {type === 'contact' && 'Contact VoteHub Commission'}
              {type === 'privacy' && 'VoteHub Privacy Policy'}
              {type === 'terms' && 'Terms of Civic Engagement'}
              {type === 'manifesto' && `${candidate?.name} - Vision & Manifesto`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          {type === 'contact' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                Have questions about voter registration, candidate eligibility, or ballot authentication? Reach out to the independent electoral monitoring board.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold uppercase">Official Email</span>
                    <strong className="text-slate-900 text-xs">support@votehub.org</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold uppercase">Voter Helpline (Toll Free)</span>
                    <strong className="text-slate-900 text-xs">+1 (800) 868-3482 (VOTE-HUB)</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold uppercase">Civic Registry Headquarters</span>
                    <strong className="text-slate-900 text-xs">Civic Technology Pavilion, Federal Plaza</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Ballot Secrecy & Privacy Safeguards</h4>
              <p>
                VoteHub uses zero-knowledge authentication tokens to guarantee that while your voter eligibility is verified, your ballot choice remains 100% anonymous and detached from personal identities.
              </p>
              <h4 className="font-bold text-slate-900 text-sm pt-2">Data Protection</h4>
              <p>
                No personal contact details or voter voting tendencies are ever sold, transmitted to third-party ad networks, or exposed to external entities.
              </p>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">One Person, One Vote Code of Conduct</h4>
              <p>
                Every voter is legally entitled to exactly one ballot submission per candidate post. Any attempt to forge voter credentials, impersonate eligible voters, or tamper with digital tallies will result in immediate disqualification and legal referral.
              </p>
              <h4 className="font-bold text-slate-900 text-sm pt-2">Audit Transparency</h4>
              <p>
                All ballot receipts can be verified using the digital cryptographic receipt hash displayed upon successful submission.
              </p>
            </div>
          )}

          {type === 'manifesto' && candidate && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                />
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {candidate.position}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                  <span className="text-xs text-slate-500">Rank #{candidate.rank} • {candidate.votes.toLocaleString()} votes</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide mb-2">Vision Statement</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  &ldquo;{candidate.description}&rdquo;
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide mb-2">Manifesto Goals</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {candidate.manifesto?.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
