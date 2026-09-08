import React from 'react';
import { ShieldCheck, Users, Lock, Zap } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      id: 'feature-secure',
      title: 'Secure & Transparent',
      description: 'Your vote is safe and counts. No fraud, no manipulation.',
      icon: ShieldCheck,
    },
    {
      id: 'feature-easy',
      title: 'Easy to Use',
      description: 'Quick and simple voting process from any device.',
      icon: Users,
    },
    {
      id: 'feature-one-vote',
      title: 'One Person, One Vote',
      description: 'Each voter can only vote once to ensure fairness.',
      icon: Lock,
    },
    {
      id: 'feature-realtime',
      title: 'Real-Time Results',
      description: "Track the progress and see who's leading.",
      icon: Zap,
    },
  ];

  return (
    <section id="features" className="bg-white py-14 md:py-18 border-y border-slate-100/80">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className="flex flex-col items-start group"
              >
                {/* Rounded light-blue icon container */}
                <div className="w-13 h-13 rounded-2xl bg-[#E8F2FF] flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-2xs">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
