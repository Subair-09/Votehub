import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  Check,
  Vote,
  X
} from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  onSelectNav: (item: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'my-votes', label: 'My Votes', icon: ShieldCheck },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D1B35] text-white flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className="space-y-8">
          {/* Logo & Close Button (Mobile) */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1769E8] flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                VoteHub
              </span>
            </div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectNav(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1769E8] text-white shadow-md shadow-[#1769E8]/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Callout */}
        <div className="pt-6 border-t border-white/10 px-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 mb-3">
            <Vote className="w-4 h-4 text-slate-300" />
          </div>
          <h4 className="text-white font-bold text-base leading-tight">
            Your Vote
            <br />
            Matters
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed mt-2">
            Be part of the change.
            <br />
            Vote for the candidate
            <br />
            you believe in.
          </p>
        </div>
      </aside>
    </>
  );
};
