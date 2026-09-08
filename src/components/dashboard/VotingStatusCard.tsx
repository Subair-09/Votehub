import React, { useState, useEffect } from 'react';
import { Vote, Users } from 'lucide-react';

interface VotingStatusCardProps {
  totalVotesCast?: number;
}

export const VotingStatusCard: React.FC<VotingStatusCardProps> = ({
  totalVotesCast = 2487,
}) => {
  // Live ticking countdown initialized to 5d 12h 34m 20s as in the reference
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 34,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#EAF3FF] border border-[#DDE7F3] rounded-2xl p-5 md:p-6 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-[#DDE7F3]">
        {/* Left: Voting Ends In */}
        <div className="flex items-center gap-4 md:gap-5">
          <div className="w-14 h-14 rounded-full bg-[#1769E8] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#1769E8]/20">
            <Vote className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs md:text-sm font-medium text-[#60708D] block mb-0.5">
              Voting Ends In
            </span>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#10234D] tracking-tight font-mono">
              <span>{timeLeft.days}d</span>
              <span className="mx-2 font-light text-slate-300"> </span>
              <span>{timeLeft.hours}h</span>
              <span className="mx-2 font-light text-slate-300"> </span>
              <span>{timeLeft.minutes}m</span>
              <span className="mx-2 font-light text-slate-300"> </span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        {/* Right: Total Votes Cast */}
        <div className="flex items-center gap-4 md:gap-5 pt-4 md:pt-0 md:pl-8">
          <div className="w-14 h-14 rounded-full bg-blue-100/70 text-[#1769E8] flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs md:text-sm font-medium text-[#60708D] block mb-0.5">
              Total Votes Cast
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#10234D] tracking-tight">
              {totalVotesCast.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
