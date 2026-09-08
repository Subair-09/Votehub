import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  Users,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import heroImg from '../assets/images/votehub_hero_custom.png';

interface LoginPageProps {
  onLoginSuccess: (userName: string, voterId?: string) => void;
  onNavigateSignUp: () => void;
  onNavigateHome: () => void;
  onNavigateAdmin?: () => void;
  onForgotPasswordClick?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateSignUp,
  onNavigateHome,
  onNavigateAdmin,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState('john.doe@votehub.org');
  const [password, setPassword] = useState('VoteHub2025!');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address format.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Invalid email or password. Please try again.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticated credential verification
    setTimeout(() => {
      setIsLoading(false);
      if (email.toLowerCase().includes('admin') && onNavigateAdmin) {
        onNavigateAdmin();
        return;
      }

      // Derive display name from email or default to John Doe
      const namePart = email.split('@')[0];
      const formattedName = namePart
        .split(/[._-]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      onLoginSuccess(formattedName || 'John Doe', 'VH-2025-9842');
    }, 700);
  };

  // Google OAuth flow simulation
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('John Doe (Google Verified)', 'VH-2025-GOOGLE');
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setIsForgotModalOpen(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Utility Bar (Back to Landing & Quick Info) */}
      <div className="w-full max-w-[1140px] flex items-center justify-between mb-4 sm:mb-6 px-1">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#60708D] hover:text-[#10234D] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to VoteHub Home</span>
        </button>

        <div className="flex items-center gap-4 text-xs text-[#60708D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Official Voter Authentication System</span>
          </div>
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1769E8] hover:bg-blue-100 font-bold transition-colors cursor-pointer"
            >
              Admin Portal →
            </button>
          )}
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div className="w-full max-w-[1140px] bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE7F3] shadow-xl shadow-blue-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* ===================================================
            LEFT PANEL (Branding, Messaging, Trust, Illustration)
           =================================================== */}
        <div className="bg-[#F0F6FE] p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#DDE7F3]">
          {/* Top content area */}
          <div>
            {/* 1. VoteHub Logo */}
            <div
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1769E8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Check className="w-6 h-6 stroke-[3.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl text-[#0D1B35] tracking-tight leading-none">
                  VoteHub
                </span>
                <span className="text-[11px] font-medium text-[#60708D] tracking-tight mt-0.5">
                  Your Voice Matters
                </span>
              </div>
            </div>

            {/* 2. Welcome Message */}
            <div className="mt-8 sm:mt-10 space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0D1B35] tracking-tight leading-[1.12]">
                Welcome Back! <br />
                Your Voice Still{' '}
                <span className="text-[#1769E8]">Matters</span>
              </h1>
              <p className="text-[#60708D] text-sm sm:text-[15px] leading-relaxed max-w-md pt-1">
                Login to your account and continue being part of the change.
                Together, we can build a better future.
              </p>
            </div>

            {/* 3. Three Trust Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-8 pt-2">
              {/* Feature 1 */}
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#1769E8] mb-2">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0D1B35] leading-tight">
                  Secure
                </h4>
                <p className="text-[11px] sm:text-xs text-[#60708D] leading-tight">
                  Your data is protected
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#1769E8] mb-2">
                  <Users className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0D1B35] leading-tight">
                  Transparent
                </h4>
                <p className="text-[11px] sm:text-xs text-[#60708D] leading-tight">
                  No fraud, no manipulation
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#1769E8] mb-2">
                  <Zap className="w-5 h-5 fill-[#1769E8] stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0D1B35] leading-tight">
                  Real-Time
                </h4>
                <p className="text-[11px] sm:text-xs text-[#60708D] leading-tight">
                  See results as they happen
                </p>
              </div>
            </div>
          </div>

          {/* 4. Lower Voting Illustration (Integrated seamlessly at the bottom) */}
          <div className="relative mt-8 -mb-7 sm:-mb-10 lg:-mb-12 xl:-mb-14 -mx-7 sm:-mx-10 lg:-mx-12 xl:-mx-14 flex justify-center items-end select-none pointer-events-none">
            <img
              src={heroImg}
              alt="Official VoteHub voting illustration - Hand placing ballot into blue ballot box with 'Your Vote Matters'"
              className="w-full max-w-[500px] h-auto object-contain object-bottom"
              loading="eager"
            />
          </div>
        </div>

        {/* ===================================================
            RIGHT PANEL (Login Form)
           =================================================== */}
        <div className="bg-white p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center">
          <div className="w-full max-w-[420px] mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl sm:text-[32px] font-extrabold text-[#0D1B35] tracking-tight leading-tight">
                Login to Your Account
              </h2>
              <p className="text-xs sm:text-sm text-[#60708D] mt-2">
                Welcome back! Please enter your details to continue.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Address Field */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs sm:text-sm font-semibold text-[#10234D] mb-1.5"
                >
                  Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-5 h-5 text-[#94A3B8] absolute left-3.5 pointer-events-none shrink-0" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border border-[#DDE7F3] rounded-xl text-sm text-[#10234D] placeholder:text-[#94A3B8] focus:border-[#1769E8] focus:ring-2 focus:ring-[#1769E8]/20 transition-all outline-none shadow-2xs"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs sm:text-sm font-semibold text-[#10234D] mb-1.5"
                >
                  Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-5 h-5 text-[#94A3B8] absolute left-3.5 pointer-events-none shrink-0" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-3 sm:py-3.5 bg-white border border-[#DDE7F3] rounded-xl text-sm text-[#10234D] placeholder:text-[#94A3B8] focus:border-[#1769E8] focus:ring-2 focus:ring-[#1769E8]/20 transition-all outline-none shadow-2xs"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#94A3B8] hover:text-[#10234D] transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5 text-xs sm:text-sm">
                <label
                  htmlFor="remember-me"
                  className="flex items-center gap-2.5 cursor-pointer select-none group"
                >
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4.5 h-4.5 rounded flex items-center justify-center transition-colors cursor-pointer ${
                      rememberMe
                        ? 'bg-[#1769E8] text-white'
                        : 'border border-[#DDE7F3] bg-white group-hover:border-slate-400'
                    }`}
                  >
                    {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="font-medium text-[#60708D] group-hover:text-[#10234D] transition-colors">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (onForgotPasswordClick) {
                      onForgotPasswordClick();
                    } else {
                      setIsForgotModalOpen(true);
                    }
                  }}
                  className="font-semibold text-[#1769E8] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1769E8] hover:bg-[#1257C2] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-[#E2E8F0]" />
              <span className="absolute bg-white px-3 text-xs font-semibold text-[#94A3B8]">
                OR
              </span>
            </div>

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl border border-[#DDE7F3] bg-white hover:bg-slate-50 font-bold text-xs sm:text-sm text-[#0D1B35] flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Sign Up Link at bottom */}
            <div className="text-center pt-1 text-xs sm:text-sm text-[#60708D]">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={onNavigateSignUp}
                className="font-bold text-[#1769E8] hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#DDE7F3] space-y-4">
            <h3 className="text-lg font-bold text-[#0D1B35]">
              Reset Voter Password
            </h3>
            <p className="text-xs text-[#60708D] leading-relaxed">
              Enter your registered voter email address. We will verify your civic ID and send password reset instructions.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                ✓ Password reset link has been dispatched to {forgotEmail}. Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-white border border-[#DDE7F3] rounded-xl text-xs text-[#10234D] placeholder:text-[#94A3B8] focus:border-[#1769E8] outline-none"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#1769E8] hover:bg-[#1257C2] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
