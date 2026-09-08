import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { HeroIllustration } from './HeroIllustration';

interface HeroSectionProps {
  onStartVoting: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartVoting,
  onLearnMore,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#F6FBFE] via-[#F8FCFF] to-white pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* Small rounded badge: "A Fairer Tomorrow" */}
            <div
              id="hero-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/90 text-blue-700 text-xs font-semibold tracking-wide shadow-xs mb-6"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>A Fairer Tomorrow</span>
            </div>

            {/* Large headline */}
            <h1
              id="hero-headline"
              className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6"
            >
              Your Vote <br />
              Builds a Better <br />
              <span className="text-blue-600 inline-block">Future</span>
            </h1>

            {/* Supporting text */}
            <p
              id="hero-supporting-text"
              className="text-slate-600 text-base md:text-lg leading-relaxed max-w-lg mb-8"
            >
              Welcome to the official voting platform. Make your voice count by
              voting for your preferred candidate. Together, we can create positive
              change.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                id="hero-start-voting-btn"
                onClick={onStartVoting}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all text-base cursor-pointer active:scale-[0.98]"
              >
                <span>Start Voting</span>
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>

              <button
                id="hero-learn-more-btn"
                onClick={onLearnMore}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50/80 font-semibold rounded-lg transition-colors text-base cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column Illustration */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};
