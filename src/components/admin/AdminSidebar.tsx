import React from 'react';
import {
  Home,
  Users,
  Award,
  UserCheck,
  CheckSquare,
  KeyRound,
  BarChart3,
  Settings,
  LogOut,
  Check,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'candidates'
  | 'positions'
  | 'voters'
  | 'votes'
  | 'code-management'
  | 'results'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'positions', label: 'Positions', icon: Award },
    { id: 'voters', label: 'Voters', icon: UserCheck },
    { id: 'votes', label: 'Votes', icon: CheckSquare },
    { id: 'code-management', label: 'Code Management', icon: KeyRound },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-label="Close sidebar backdrop"
        />
      )}

      {/* Fixed Dark Navy Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[245px] bg-[#0D1B35] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out select-none ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Navigation */}
        <div className="flex flex-col pt-6 px-4">
          {/* Top Logo */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1769E8] flex items-center justify-center text-white shadow-xs">
                {/* Ballot Box Checkmark Symbol */}
                <div className="relative flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[3.2]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white leading-tight">
                  VoteHub
                </span>
                <span className="text-[11px] font-medium text-[#7E97B8] tracking-normal">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1769E8] text-white shadow-md shadow-blue-500/25'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#7E97B8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Admin Profile & Logout */}
        <div className="p-4 border-t border-[#1C2C4A]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0 shadow-xs overflow-hidden">
              <svg className="w-7 h-7 text-slate-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">Admin</span>
              <span className="text-xs text-[#7E97B8] truncate">System Administrator</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 text-[#7E97B8]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
