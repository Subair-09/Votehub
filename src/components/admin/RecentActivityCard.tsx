import React, { useState } from 'react';
import { Check, User, KeyRound, X } from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'vote' | 'user' | 'code';
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Aisha Bello received a vote',
    timestamp: '2 minutes ago',
    type: 'vote',
  },
  {
    id: 'act-2',
    title: 'Daniel Okafor received a vote',
    timestamp: '5 minutes ago',
    type: 'user',
  },
  {
    id: 'act-3',
    title: 'A voter with code 7F3A2B1 voted',
    timestamp: '7 minutes ago',
    type: 'code',
  },
  {
    id: 'act-4',
    title: 'Chinwe Nwosu received a vote',
    timestamp: '10 minutes ago',
    type: 'vote',
  },
  {
    id: 'act-5',
    title: 'Tunde Alabi received a vote',
    timestamp: '12 minutes ago',
    type: 'user',
  },
  {
    id: 'act-6',
    title: 'A voter with code 4D9C8E2 registered',
    timestamp: '15 minutes ago',
    type: 'code',
  },
  {
    id: 'act-7',
    title: 'Ibrahim Musa received a vote',
    timestamp: '18 minutes ago',
    type: 'vote',
  },
  {
    id: 'act-8',
    title: 'Fatima Sani received a vote',
    timestamp: '22 minutes ago',
    type: 'vote',
  },
];

export const RecentActivityCard: React.FC = () => {
  const [showAllModal, setShowAllModal] = useState(false);

  // Render icon based on type
  const renderIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'vote':
        return (
          <div className="w-8 h-8 rounded-full bg-[#EAFBF1] text-[#18A968] flex items-center justify-center shrink-0 border border-[#C6EED7]">
            <Check className="w-4 h-4 stroke-[2.8]" />
          </div>
        );
      case 'user':
        return (
          <div className="w-8 h-8 rounded-full bg-[#EBF3FE] text-[#1769E8] flex items-center justify-center shrink-0 border border-[#CFE2FE]">
            <User className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'code':
        return (
          <div className="w-8 h-8 rounded-full bg-[#E6F4EA] text-[#137333] flex items-center justify-center shrink-0 border border-[#CEEAD6]">
            <KeyRound className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5 sm:p-6 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <h3 className="font-bold text-base text-[#0D1B35] tracking-tight">
            Recent Activity
          </h3>
          <button
            onClick={() => setShowAllModal(true)}
            className="text-xs font-bold text-[#1769E8] hover:text-[#1257C4] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Activity List */}
        <div className="space-y-3.5">
          {INITIAL_ACTIVITIES.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {renderIcon(item.type)}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#10234D] truncate">
                  {item.title}
                </span>
                <span className="text-[11px] text-[#60708D]">
                  {item.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Activity Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DDE7F3] shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#DDE7F3]">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#0D1B35]">Real-Time Audit Trail</h3>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Live Log
                </span>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {INITIAL_ACTIVITIES.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {renderIcon(item.type)}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold text-[#10234D]">
                      {item.title}
                    </span>
                    <span className="text-xs text-[#60708D]">
                      {item.timestamp} • Verification Hash #SHA256-OK
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#DDE7F3] bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setShowAllModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1769E8] text-white text-xs font-semibold hover:bg-blue-700"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
