import React from 'react';
import { Check, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#071322] border-t border-slate-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
          {/* Left: VoteHub Logo & Tagline */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-500 transition-colors">
              <Check className="w-5 h-5 stroke-[3.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-white tracking-tight leading-tight">
                VoteHub
              </span>
              <span className="text-[11px] font-medium text-slate-400 tracking-normal leading-none mt-0.5">
                Your Voice Matters
              </span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('candidates')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Candidates
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#facebook"
              aria-label="VoteHub on Facebook"
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            {/* X (formerly Twitter) icon */}
            <a
              href="#x"
              aria-label="VoteHub on X"
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#instagram"
              aria-label="VoteHub on Instagram"
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#linkedin"
              aria-label="VoteHub on LinkedIn"
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 VoteHub. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            {onOpenAdmin && (
              <>
                <span className="text-slate-700">|</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-blue-400 text-slate-400 transition-colors cursor-pointer font-semibold"
                >
                  Admin Portal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
