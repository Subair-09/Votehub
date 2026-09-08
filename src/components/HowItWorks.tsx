import React from 'react';
import {
  User,
  ClipboardList,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Check,
} from 'lucide-react';

interface HowItWorksProps {
  onStartVoting: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartVoting }) => {
  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your account with a valid code.',
      icon: User,
    },
    {
      number: 2,
      title: 'Browse Candidates',
      description: 'View all candidates and their manifestos.',
      icon: ClipboardList,
    },
    {
      number: 3,
      title: 'Cast Your Vote',
      description: 'Select your preferred candidate and vote.',
      icon: ShieldCheck,
    },
    {
      number: 4,
      title: 'See Results',
      description: "Track the live results and see who's leading.",
      icon: Trophy,
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#EEF5FD] py-18 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Title & 4 Connected Steps */}
          <div className="lg:col-span-8 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              It&apos;s Simple
            </h2>
            <p className="text-slate-600 text-sm md:text-base mb-12 max-w-xl">
              Start voting in just a few steps. It only takes a minute!
            </p>

            {/* 4 Connected Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isLast = idx === steps.length - 1;

                return (
                  <div key={s.number} className="relative flex flex-col items-start pr-2">
                    {/* Top Row: Circular numbered indicator + light-blue icon container + arrow */}
                    <div className="flex items-center gap-2.5 mb-4 w-full">
                      {/* Number circle */}
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {s.number}
                      </div>

                      {/* Rounded light-blue icon container */}
                      <div className="w-11 h-11 rounded-xl bg-blue-100/90 flex items-center justify-center text-blue-600 shrink-0">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      {/* Arrow between steps (hidden on last step & on small screens) */}
                      {!isLast && (
                        <div className="hidden lg:flex flex-1 items-center justify-center pl-2">
                          <ArrowRight className="w-4 h-4 text-slate-400 stroke-[1.8]" />
                        </div>
                      )}
                    </div>

                    {/* Step Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {s.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: CTA Card with Phone Illustration */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div
              id="how-it-works-cta-card"
              className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-lg shadow-blue-900/5 border border-blue-100 flex flex-col sm:flex-row items-center gap-6"
            >
              {/* Phone Graphic with Checkmark badge */}
              <div className="relative shrink-0 flex items-center justify-center">
                {/* Subtle blue radiating accents */}
                <div className="absolute -top-2 -left-2 text-blue-400 text-sm font-bold select-none">
                  /
                </div>
                <div className="absolute top-1 -left-3 text-blue-400 text-xs font-bold select-none">
                  -
                </div>
                <div className="absolute top-5 -left-3 text-blue-400 text-xs font-bold select-none">
                  \
                </div>

                {/* Smartphone outline */}
                <div className="w-16 h-28 sm:w-18 sm:h-32 rounded-2xl border-[2.5px] border-blue-600 bg-white shadow-md p-1 flex flex-col items-center justify-between rotate-[-4deg] relative">
                  {/* Top phone notch/speaker */}
                  <div className="w-4 h-1 rounded-full bg-slate-300 mt-1" />

                  {/* Screen Content: checked voting badge */}
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 my-auto shadow-2xs">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>

                  {/* Bottom indicator */}
                  <div className="w-4 h-1 rounded-full bg-slate-200 mb-1" />
                </div>
              </div>

              {/* Text & Button */}
              <div className="flex flex-col text-left">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                  Be Part of <br />
                  the Change
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-5">
                  Your vote matters. It shapes the future of our community.
                </p>
                <button
                  id="cta-start-voting-btn"
                  onClick={onStartVoting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer self-start"
                >
                  <span>Start Voting</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
