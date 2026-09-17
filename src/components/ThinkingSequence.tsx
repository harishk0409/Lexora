import React, { useEffect, useState } from 'react';
import { ResearchStage } from '../types';
import { Sparkles, Network, BookOpenCheck, ScrollText, Check } from 'lucide-react';

interface ThinkingSequenceProps {
  stage: ResearchStage;
  query: string;
  onComplete: () => void;
}

const STAGES_CONFIG: {
  key: ResearchStage;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  statTicker: string;
}[] = [
  {
    key: 'exploring',
    label: 'EXPLORING THE ARCHIVE',
    sublabel: 'Traversing statutory codifications and legal taxonomies...',
    icon: Sparkles,
    statTicker: 'Scanning 84,200 statutory provisions & enactments...'
  },
  {
    key: 'connecting',
    label: 'CONNECTING RELEVANT SOURCES',
    sublabel: 'Tracing binding precedents and appellate authorities...',
    icon: Network,
    statTicker: 'Correlating ratio decidendi across High Court & Apex precedents...'
  },
  {
    key: 'assembling',
    label: 'ASSEMBLING CONTEXT',
    sublabel: 'Synthesizing judicial reasoning and doctrine hierarchies...',
    icon: BookOpenCheck,
    statTicker: 'Validating stare decisis consistency & citation integrity...'
  },
  {
    key: 'forming',
    label: 'FORMING RESPONSE',
    sublabel: 'Formatting comprehensive judicial dossier & legal briefing...',
    icon: ScrollText,
    statTicker: 'Finalizing editorial analysis and evidence matrix...'
  }
];

export const ThinkingSequence: React.FC<ThinkingSequenceProps> = ({
  stage,
  query,
  onComplete
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (stage === 'exploring') setCurrentIdx(0);
    else if (stage === 'connecting') setCurrentIdx(1);
    else if (stage === 'assembling') setCurrentIdx(2);
    else if (stage === 'forming') setCurrentIdx(3);
  }, [stage]);

  const currentConfig = STAGES_CONFIG[currentIdx] || STAGES_CONFIG[0];
  const Icon = currentConfig.icon;

  return (
    <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 pointer-events-auto">
      {/* Background radial highlight */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#42121e]/15 blur-3xl pointer-events-none" />

      {/* Central Archival Portal Constellation */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full text-center">
        {/* Pulsing Central Icon Ring */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full border border-[#c5a880]/40 bg-[#161217]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(197,168,128,0.15)]">
            <Icon className="w-8 h-8 text-[#d4af37] animate-pulse" />
          </div>

          {/* Orbital pulsing rings */}
          <div className="absolute -inset-3 rounded-full border border-[#c5a880]/20 animate-spin" style={{ animationDuration: '14s' }}>
            <span className="w-2 h-2 rounded-full bg-[#d4af37] absolute -top-1 left-1/2 -translate-x-1/2" />
          </div>
          <div className="absolute -inset-7 rounded-full border border-white/5 animate-spin" style={{ animationDuration: '24s', animationDirection: 'reverse' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#912337] absolute top-1/2 -right-1 -translate-y-1/2" />
          </div>
        </div>

        {/* Current Query Reference */}
        <div className="mb-3 px-3.5 py-1 rounded-full border border-white/10 bg-[#14161c]/80 text-[11px] font-mono text-[#a69f94] tracking-wider truncate max-w-md">
          INQUIRY: "{query}"
        </div>

        {/* Active Stage Label */}
        <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#f5f2eb] mb-2">
          {currentConfig.label}
        </h2>
        <p className="font-['Newsreader'] italic text-base sm:text-lg text-[#c5a880] mb-8 font-light">
          {currentConfig.sublabel}
        </p>

        {/* 4 Sequential Stage Indicators */}
        <div className="w-full grid grid-cols-4 gap-2 mb-6">
          {STAGES_CONFIG.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-full h-1 rounded-full mb-2 transition-all duration-500 ${
                    isCompleted
                      ? 'bg-[#c5a880]'
                      : isCurrent
                      ? 'bg-gradient-to-r from-[#42121e] to-[#c5a880] animate-pulse'
                      : 'bg-white/10'
                  }`}
                />
                <div className="flex items-center space-x-1">
                  {isCompleted ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center text-[9px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-mono ${
                        isCurrent
                          ? 'border-[#c5a880] text-[#c5a880] animate-pulse'
                          : 'border-white/20 text-white/30'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  )}
                  <span
                    className={`text-[9px] font-['Plus_Jakarta_Sans'] tracking-widest uppercase hidden sm:inline ${
                      isCurrent ? 'text-[#f5f2eb] font-semibold' : 'text-[#7a746a]'
                    }`}
                  >
                    {step.key}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Simulated Archive Telemetry */}
        <div className="w-full p-3 rounded-lg border border-white/5 bg-[#0f1116]/80 text-left font-mono text-[11px] text-[#8e877c] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="truncate">{currentConfig.statTicker}</span>
          </div>
          <span className="text-[#c5a880] text-[10px] uppercase tracking-wider pl-2 whitespace-nowrap">
            Synthesizing
          </span>
        </div>
      </div>
    </div>
  );
};
