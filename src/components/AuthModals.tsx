import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, UserCheck } from 'lucide-react';

interface AuthModalProps {
  type: 'login' | 'signup' | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userName: string, voterId?: string) => void;
  onSwitchType?: (type: 'login' | 'signup') => void;
}

export const AuthModals: React.FC<AuthModalProps> = ({
  type,
  isOpen,
  onClose,
  onSuccess,
  onSwitchType,
}) => {
  const [voterId, setVoterId] = useState('VH-2025-9842');
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !type) return null;

  const isLogin = type === 'login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const chosenName = fullName.trim() || (isLogin ? 'John Doe' : 'New Voter');
      onSuccess(chosenName, voterId);
      onClose();
    }, 500);
  };

  const handleQuickDemoFill = () => {
    setFullName('John Doe');
    setVoterId('VH-2025-9842');
    setEmail('john.doe@example.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-left">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              {isLogin ? <KeyRound className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {isLogin ? 'Voter Portal Login' : 'Voter Registration'}
              </h3>
              <p className="text-blue-100 text-[11px]">
                {isLogin
                  ? 'Access your authenticated ballot dashboard'
                  : 'Enroll with verified government accreditation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Subair Nurudeen"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Voter ID / National Identification Number
            </label>
            <input
              type="text"
              required
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              placeholder="VH-2025-XXXX"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Secret Passcode / PIN
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? 'Authenticating...'
                : isLogin
                ? 'Login to Cast Ballot'
                : 'Create Verified Account'}
            </button>
          </div>

          {/* Switch mode */}
          <div className="text-center pt-1 text-xs text-slate-500">
            {isLogin ? (
              <p>
                Don't have a registered voter account?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchType && onSwitchType('signup')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchType && onSwitchType('login')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Protected by VoteHub End-to-End Cryptography</span>
          </div>
        </form>
      </div>
    </div>
  );
};
