import React from 'react';
import heroImg from '../assets/images/votehub_hero_custom.png';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[580px] lg:max-w-[650px] mx-auto flex items-center justify-center">
      {/* Soft ambient blur highlights */}
      <div className="absolute -top-6 -right-6 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-6 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Image Container with clean rounded corners matching the reference */}
      <div className="relative w-full rounded-2xl overflow-hidden group transition-all duration-300">
        <img
          src={heroImg}
          alt="VoteHub official voting illustration - A hand casting a vote into the blue ballot box with 'Your Vote Matters'"
          className="w-full h-auto object-contain transform group-hover:scale-[1.01] transition-transform duration-500 select-none pointer-events-none"
          loading="eager"
        />
      </div>
    </div>
  );
};
