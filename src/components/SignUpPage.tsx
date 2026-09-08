import React, { useState, useEffect } from 'react';
import {
  Check,
  ShieldCheck,
  Users,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Info,
  ArrowRight,
  Loader2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import heroImg from '../assets/images/votehub_hero_custom.png';

interface SignUpPageProps {
  onSignUpSuccess: (userName: string, voterId?: string) => void;
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

// Pre-seeded authorized 7-digit admin codes for demo verification
const DEFAULT_VALID_ADMIN_CODES = [
  '7842910',
  '5918234',
  '8302194',
  '4192038',
  '6291045',
  '9012345',
  '3829104',
];

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSignUpSuccess,
  onNavigateLogin,
  onNavigateHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Used codes stored in localStorage to ensure one-time use per 7-digit admin code
  const [usedCodes, setUsedCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('votehub_used_signup_codes');
      return saved ? JSON.parse(saved) : ['9012345']; // Pre-mark 9012345 as used to demo the used-code validation
    } catch {
      return ['9012345'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('votehub_used_signup_codes', JSON.stringify(usedCodes));
    } catch {
      // ignore
    }
  }, [usedCodes]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Full Name
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full legal name.';
    }

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // 3. Phone Number
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/;
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!phoneRegex.test(phoneNumber.trim().replace(/\s+/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number.';
    }

    // 4. Signup Code (Admin-provided 7-digit code)
    const sanitizedCode = signupCode.trim();
    if (!sanitizedCode) {
      errors.signupCode = '7-digit signup code is required.';
    } else if (!/^\d{7}$/.test(sanitizedCode)) {
      errors.signupCode = 'Invalid signup code. Must be exactly 7 digits.';
    } else if (usedCodes.includes(sanitizedCode)) {
      errors.signupCode = 'This signup code has already been used.';
    } else if (!DEFAULT_VALID_ADMIN_CODES.includes(sanitizedCode)) {
      errors.signupCode = 'Invalid signup code. Please check the code provided by your administrator.';
    }

    // 5. Password
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    // 6. Confirm Password
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Pick first error for top banner if appropriate
      const firstKey = Object.keys(errors)[0];
      setErrorMessage(errors[firstKey]);
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const usedCode = signupCode.trim();

    setTimeout(() => {
      // Mark code as permanently used
      const updatedUsedCodes = [...usedCodes, usedCode];
      setUsedCodes(updatedUsedCodes);

      try {
        localStorage.setItem('votehub_used_signup_codes', JSON.stringify(updatedUsedCodes));
      } catch {
        // ignore
      }

      setIsLoading(false);
      setRegistrationSuccess(true);

      // Transition to dashboard after brief confirmation
      setTimeout(() => {
        const generatedVoterId = `VH-${usedCode}`;
        onSignUpSuccess(fullName.trim(), generatedVoterId);
      }, 1200);
    }, 900);
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess('Verified Google Voter', 'VH-7842910');
    }, 700);
  };

  const handleApplyDemoCode = () => {
    // Pick first unused code
    const firstAvailable = DEFAULT_VALID_ADMIN_CODES.find((c) => !usedCodes.includes(c)) || '7842910';
    setSignupCode(firstAvailable);
    setFieldErrors((prev) => ({ ...prev, signupCode: '' }));
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Utility Bar */}
      <div className="w-full max-w-[1140px] flex items-center justify-between mb-4 sm:mb-6 px-1">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#60708D] hover:text-[#10234D] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to VoteHub Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#60708D]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Official Voter Registration</span>
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div className="w-full max-w-[1140px] bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE7F3] shadow-xl shadow-blue-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* ===================================================
            LEFT PANEL (Branding, Messaging, Illustration, Trust)
           =================================================== */}
        <div className="bg-[#F0F6FE] p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#DDE7F3]">
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

            {/* 2. Community Badge */}
            <div className="mt-6 sm:mt-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBFE] text-[#1769E8] text-xs font-semibold select-none shadow-2xs">
                <Users className="w-3.5 h-3.5 stroke-[2.4]" />
                <span>Join a community that cares</span>
              </div>
            </div>

            {/* 3. Main Message */}
            <div className="mt-6 sm:mt-8 space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0D1B35] tracking-tight leading-[1.14]">
                Your Voice <br />
                Builds a Better <br />
                <span className="text-[#1769E8]">Future</span>
              </h1>
              <p className="text-[#60708D] text-xs sm:text-sm leading-relaxed max-w-md pt-1">
                Register today and be part of a transparent, secure and fair voting process. Together, we can create positive change.
              </p>
            </div>
          </div>

          {/* 4. Voting Illustration (Lower-Middle Position matching reference) */}
          <div className="relative my-6 -mx-4 sm:-mx-6 flex justify-center items-center select-none pointer-events-none">
            <img
              src={heroImg}
              alt="Official VoteHub voting illustration - Hand placing ballot into blue ballot box with 'Your Vote Matters'"
              className="w-full max-w-[440px] h-auto object-contain"
              loading="eager"
            />
          </div>

          {/* 5. Trust Features (Bottom of Left Panel) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-[#DDE7F3]/60">
            {/* Feature 1: Secure */}
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#1769E8] mb-2">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-[#0D1B35] leading-tight">
                Secure
              </h4>
              <p className="text-[11px] sm:text-xs text-[#60708D] leading-tight">
                Your data is <br className="hidden sm:inline" />
                protected
              </p>
            </div>

            {/* Feature 2: Transparent */}
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#1769E8] mb-2">
                <Users className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-[#0D1B35] leading-tight">
                Transparent
              </h4>
              <p className="text-[11px] sm:text-xs text-[#60708D] leading-tight">
                No fraud, <br className="hidden sm:inline" />
                no manipulation
              </p>
            </div>

            {/* Feature 3: Real-Time */}
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#E0EDFD] flex items-center justify-center text-[#1769E8] mb-2">
                <Zap className="w-5 h-5 fill-[#1769E8] stroke-[1.5]" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-[#0D1B35] leading-tight">
                Real-Time
              </h4>
              <p className="text-[11px] sm:text-xs text-[#60708D] leading-tight">
                See results <br className="hidden sm:inline" />
                as they happen
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT PANEL (Registration Form)
           =================================================== */}
        <div className="bg-white p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center">
          <div className="w-full max-w-[420px] mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl sm:text-[32px] font-extrabold text-[#0D1B35] tracking-tight leading-tight">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-[#60708D] mt-2">
                Get started in just a few simple steps. It only takes a minute!
              </p>
            </div>

            {/* Registration Success Overlay Message */}
            {registrationSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">Account Created Successfully!</p>
                  <p className="text-emerald-700 text-xs font-normal mt-0.5">Redirecting to your voting dashboard...</p>
                </div>
              </div>
            )}

            {/* Global Error Banner */}
            {errorMessage && !registrationSuccess && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Full Name */}
              <div>
                <label
                  htmlFor="signup-fullname"
                  className="block text-xs sm:text-sm font-semibold text-[#10234D] mb-1.5"
                >
                  Full Name *
                </label>
                <div className="relative flex items-center">
                  <User className="w-4.5 h-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your full name"
                    className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${
                      fieldErrors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-[#DDE7F3] focus:ring-[#1769E8]/20 focus:border-[#1769E8]'
                    } rounded-xl text-sm text-[#10234D] placeholder:text-[#94A3B8] focus:ring-2 transition-all outline-none shadow-2xs`}
                    disabled={isLoading || registrationSuccess}
                    autoComplete="name"
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* 2. Email Address */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs sm:text-sm font-semibold text-[#10234D] mb-1.5"
                >
                  Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4.5 h-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your email address"
                    className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${
                      fieldErrors.email ? 'border-red-400 focus:ring-red-200' : 'border-[#DDE7F3] focus:ring-[#1769E8]/20 focus:border-[#1769E8]'
                    } rounded-xl text-sm text-[#10234D] placeholder:text-[#94A3B8] focus:ring-2 transition-all outline-none shadow-2xs`}
                    disabled={isLoading || registrationSuccess}
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* 3. Phone Number */}
              <div>
                <label
                  htmlFor="signup-phone"
                  className="block text-xs sm:text-sm font-semibold text-[#10234D] mb-1.5"
                >
                  Phone Number *
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4.5 h-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (fieldErrors.phoneNumber) setFieldErrors((prev) => ({ ...prev, phoneNumber: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your phone number"
                    className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${
                      fieldErrors.phoneNumber ? 'border-red-400 focus:ring-red-200' : 'border-[#DDE7F3] focus:ring-[#1769E8]/20 focus:border-[#1769E8]'
                    } rounded-xl text-sm text-[#10234D] placeholder:text-[#94A3B8] focus:ring-2 transition-all outline-none shadow-2xs`}
                    disabled={isLoading || registrationSuccess}
                    autoComplete="tel"
                  />
                </div>
                {fieldErrors.phoneNumber && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">{fieldErrors.phoneNumber}</p>
                )}
              </div>

              {/* 4. Signup Code & Info Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="signup-code"
                    className="block text-xs sm:text-sm font-semibold text-[#10234D]"
                  >
                    Signup Code *
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyDemoCode}
                    className="text-[11px] text-[#1769E8] hover:underline font-semibold cursor-pointer"
                    title="Insert an unused admin demo code"
                  >
                    Auto-fill demo code
                  </button>
                </div>
                <div className="relative flex items-center">
                  <KeyRound className="w-4.5 h-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-code"
                    type="text"
                    required
                    maxLength={7}
                    value={signupCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 7);
                      setSignupCode(val);
                      if (fieldErrors.signupCode) setFieldErrors((prev) => ({ ...prev, signupCode: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your 7-digit code"
                    className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border tracking-wider font-mono ${
                      fieldErrors.signupCode ? 'border-red-400 focus:ring-red-200' : 'border-[#DDE7F3] focus:ring-[#1769E8]/20 focus:border-[#1769E8]'
                    } rounded-xl text-sm text-[#10234D] placeholder:font-sans placeholder:tracking-normal placeholder:text-[#94A3B8] focus:ring-2 transition-all outline-none shadow-2xs`}
                    disabled={isLoading || registrationSuccess}
                  />
                </div>

                {fieldErrors.signupCode && (
                  <p className="text-[11px] text-red-600 font-medium mt-1.5">{fieldErrors.signupCode}</p>
                )}

                {/* Information Box directly underneath */}
                <div className="mt-2.5 p-3 sm:p-3.5 rounded-xl bg-[#EAF3FF] border border-[#D0E3FC] flex items-start gap-2.5 sm:gap-3 text-left">
                  <Info className="w-4.5 h-4.5 text-[#1769E8] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#17345F] leading-relaxed font-normal">
                    You need a code provided by the admin to create your account. Each code can only be used once.
                  </p>
                </div>
              </div>

              {/* 5. Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs sm:text-sm font-semibold text-[#10234D] mb-1.5"
                >
                  Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4.5 h-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Create a password"
                    className={`w-full pl-11 pr-11 py-3 sm:py-3.5 bg-white border ${
                      fieldErrors.password ? 'border-red-400 focus:ring-red-200' : 'border-[#DDE7F3] focus:ring-[#1769E8]/20 focus:border-[#1769E8]'
                    } rounded-xl text-sm text-[#10234D] placeholder:text-[#94A3B8] focus:ring-2 transition-all outline-none shadow-2xs`}
                    disabled={isLoading || registrationSuccess}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#94A3B8] hover:text-[#10234D] p-1 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* 6. Confirm Password */}
              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs sm:text-sm font-semibold text-[#10234D] mb-1.5"
                >
                  Confirm Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4.5 h-4.5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Confirm your password"
                    className={`w-full pl-11 pr-11 py-3 sm:py-3.5 bg-white border ${
                      fieldErrors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-[#DDE7F3] focus:ring-[#1769E8]/20 focus:border-[#1769E8]'
                    } rounded-xl text-sm text-[#10234D] placeholder:text-[#94A3B8] focus:ring-2 transition-all outline-none shadow-2xs`}
                    disabled={isLoading || registrationSuccess}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-[#94A3B8] hover:text-[#10234D] p-1 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* 7. Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading || registrationSuccess}
                className="w-full mt-2 py-3 sm:py-3.5 px-6 rounded-xl bg-[#1769E8] hover:bg-[#1257C4] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Voter Account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider: OR */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[#DDE7F3] w-full" />
              <span className="bg-white px-3 text-xs font-semibold text-[#60708D] uppercase tracking-wider">
                OR
              </span>
              <div className="border-t border-[#DDE7F3] w-full" />
            </div>

            {/* Google Registration */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading || registrationSuccess}
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl border border-[#DDE7F3] bg-white hover:bg-slate-50 font-bold text-xs sm:text-sm text-[#0D1B35] flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Log In link at bottom */}
            <div className="text-center pt-1 text-xs sm:text-sm text-[#60708D]">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="font-bold text-[#1769E8] hover:underline cursor-pointer transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
