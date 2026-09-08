import React, { useState } from 'react';
import { Menu, ChevronDown, User, LogOut, Shield } from 'lucide-react';

interface TopHeaderProps {
  userName?: string;
  onToggleMobileMenu: () => void;
  onLogout?: () => void;
  onOpenMyVotes?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userName = 'John Doe',
  onToggleMobileMenu,
  onLogout,
  onOpenMyVotes,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#DDE7F3] flex items-center justify-between px-6 lg:px-10">
      {/* Left side: Hamburger button on mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: User Avatar & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
        >
          {/* Circular user avatar icon */}
          <div className="w-8 h-8 rounded-full bg-[#17345F] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <User className="w-4 h-4 text-blue-100" />
          </div>

          <span className="font-semibold text-sm text-[#10234D]">
            {userName}
          </span>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              onClick={() => setIsDropdownOpen(false)}
              className="fixed inset-0 z-40"
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#DDE7F3] py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="text-xs font-bold text-[#10234D] truncate">{userName}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  Verified Voter
                </span>
              </div>

              {onOpenMyVotes && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenMyVotes();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1769E8] flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  My Ballot Status
                </button>
              )}

              {onLogout && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};
