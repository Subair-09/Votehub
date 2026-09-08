import React, { useState } from 'react';
import { Check, Menu, X, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenAdmin?: () => void;
  currentUser?: { name: string; voterId?: string } | null;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenLogin,
  onOpenSignUp,
  onOpenAdmin,
  currentUser,
  onGoToDashboard,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Candidates', id: 'candidates' },
    { label: 'About', id: 'about' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 transition-shadow">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <button
          id="navbar-brand-logo"
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
            <Check className="w-6 h-6 stroke-[3.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
              VoteHub
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-normal leading-none mt-0.5">
              Your Voice Matters
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`text-sm font-semibold relative py-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Auth Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenAdmin && (
            <button
              id="nav-admin-btn"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:text-[#0D1B35] hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              title="Open VoteHub Admin Dashboard"
            >
              <Shield className="w-4 h-4 text-[#1769E8]" />
              <span>Admin Panel</span>
            </button>
          )}

          {currentUser ? (
            <>
              <button
                id="nav-dashboard-btn"
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                <span>Dashboard ({currentUser.name.split(' ')[0]})</span>
              </button>
              <button
                id="nav-logout-btn"
                onClick={onLogout}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-login-btn"
                onClick={onOpenLogin}
                className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50/80 font-semibold text-sm transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                id="nav-signup-btn"
                onClick={onOpenSignUp}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs hover:shadow-sm cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex items-center md:hidden gap-2">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onGoToDashboard) onGoToDashboard();
                  }}
                  className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm text-center shadow-xs"
                >
                  Go to Dashboard ({currentUser.name.split(' ')[0]})
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm text-center hover:bg-slate-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-2.5 rounded-lg border border-blue-600 text-blue-600 font-semibold text-sm text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSignUp();
                  }}
                  className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm text-center shadow-xs"
                >
                  Sign Up
                </button>
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm text-center flex items-center justify-center gap-2 hover:bg-slate-50"
                  >
                    <Shield className="w-4 h-4 text-[#1769E8]" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
