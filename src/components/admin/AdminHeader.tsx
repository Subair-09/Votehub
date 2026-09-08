import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, ExternalLink, Shield, LogOut, Database, Cloud } from 'lucide-react';
import { IntegrationStatus } from '../../lib/api';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  onNavigateLanding: () => void;
  onNavigateVoterDashboard: () => void;
  onLogout: () => void;
  onOpenDatabaseStatus?: () => void;
  status?: IntegrationStatus | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  onNavigateLanding,
  onNavigateVoterDashboard,
  onLogout,
  onOpenDatabaseStatus,
  status,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isMongoLive = status?.mongodb?.connected;
  const isCloudinaryLive = status?.cloudinary?.configured;

  return (
    <header className="h-18 bg-white border-b border-[#DDE7F3] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Hamburger button & Database Status Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 rounded-xl text-[#0D1B35] hover:bg-slate-100 transition-colors cursor-pointer lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        {onOpenDatabaseStatus && (
          <button
            onClick={onOpenDatabaseStatus}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50/80 hover:bg-blue-50/80 hover:border-blue-200 transition-all text-xs font-semibold cursor-pointer group shadow-2xs"
            title="View MongoDB and Cloudinary connection health"
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isMongoLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Database className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600" />
              <span className="text-slate-700 group-hover:text-blue-700 hidden sm:inline">MongoDB:</span>
              <span className={`font-bold ${isMongoLive ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isMongoLive ? 'Live' : 'Active'}
              </span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600" />
              <span className="text-slate-700 group-hover:text-blue-700 hidden sm:inline">Cloudinary:</span>
              <span className={`font-bold ${isCloudinaryLive ? 'text-emerald-700' : 'text-blue-600'}`}>
                {isCloudinaryLive ? 'Ready' : 'Fallback'}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Right: Notifications & Admin Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setDropdownOpen(false);
            }}
            className="p-2 text-[#60708D] hover:text-[#0D1B35] hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Red notification indicator dot */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#DDE7F3] shadow-xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE7F3]">
                <h4 className="font-bold text-sm text-[#0D1B35]">Notifications</h4>
                <span className="text-[11px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                  <p className="font-semibold text-[#0D1B35]">Turnout Milestone Reached</p>
                  <p className="text-[#60708D] mt-0.5">Turnout passed 92.7% (2,302 votes cast).</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">5m ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-[#0D1B35]">New Voter Accreditation</p>
                  <p className="text-[#60708D] mt-0.5">Admin code 7F3A2B1 verified and ballot submitted.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">7m ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-[#0D1B35]">Audit Hash Logged</p>
                  <p className="text-[#60708D] mt-0.5">Cryptographic snapshot SHA-256 confirmed.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15m ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 -mr-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-full bg-[#17345F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              A
            </div>
            <span className="font-bold text-sm text-[#0D1B35] hidden sm:inline">
              Admin
            </span>
            <ChevronDown className="w-4 h-4 text-[#60708D]" />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#DDE7F3] shadow-xl p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#DDE7F3]">
                <p className="text-xs font-bold text-[#0D1B35]">Super Administrator</p>
                <p className="text-[11px] text-[#60708D]">admin@votehub.org</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateVoterDashboard();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#10234D] hover:bg-blue-50 hover:text-[#1769E8] rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[#1769E8]" />
                  <span>Switch to Voter Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateLanding();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#10234D] hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#60708D]" />
                  <span>View Public Landing Page</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#DDE7F3]">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
