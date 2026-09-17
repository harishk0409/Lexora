import React, { useState } from 'react';
import { SUGGESTED_RESEARCH_PROMPTS } from '../data/mockLegalArchive';
import { Search, Compass, Scale, Volume2, VolumeX, CornerDownLeft, Download, Sliders, Cpu, Clock, Plus, User, Shield, Home } from 'lucide-react';
import { ArchiveSettingsModal } from './ArchiveSettingsModal';
import { sound } from '../utils/audio';
import { UserProfile } from '../types';

interface LandingViewProps {
  onSearch: (query: string) => void;
  onSelectPrompt: (query: string) => void;
  onFocusChange: (focused: boolean) => void;
  onQueryChange: (query: string) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenGraphDirect?: () => void;
  onOpenSelfLearning?: () => void;
  onToggleHistory?: () => void;
  onNewChat?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  chatCount?: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onSearch,
  onSelectPrompt,
  onFocusChange,
  onQueryChange,
  audioEnabled,
  onToggleAudio,
  onOpenGraphDirect,
  onOpenSelfLearning,
  onToggleHistory,
  onNewChat,
  currentUser,
  onOpenAuth,
  chatCount = 0
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sound.playArchivePulse();
      onSearch(inputValue.trim());
    }
  };

  const handlePromptClick = (title: string) => {
    sound.playArchivePulse();
    onSelectPrompt(title);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onQueryChange(val);
  };

  const handleGoHome = () => {
    sound.playArchivePulse();
    setInputValue('');
    onQueryChange('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col justify-between px-3.5 sm:px-8 md:px-12 py-5 sm:py-8 max-w-6xl mx-auto w-full min-w-0 pointer-events-none">
      {/* Top Archival Navigation Bar — Refined, Pristine & Uncluttered */}
      <header className="flex items-center justify-between w-full pointer-events-auto gap-2">
        <div 
          onClick={handleGoHome}
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0 group"
          title="Lexora Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#c5a880]/30 bg-[#2a0d14]/40 flex items-center justify-center shadow-sm group-hover:border-[#c5a880] transition-colors">
            <Scale className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div>
            <span className="font-['Cinzel'] tracking-[0.24em] text-sm sm:text-base text-[#f5f2eb] font-semibold block">
              LEXORA
            </span>
            <p className="hidden sm:block text-[10px] tracking-[0.22em] text-[#9e988f] uppercase font-light">
              The Living Law Archive
            </p>
          </div>
        </div>

        {/* Refined Archival Controls with Home & History */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Direct Home Redirect Icon */}
          <button
            id="btn-landing-home"
            onClick={handleGoHome}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#c5a880]/60 bg-[#2b0c15]/60 hover:bg-[#3d111e] text-[#faedd0] transition-all text-xs font-['Plus_Jakarta_Sans'] font-medium shadow-sm active:scale-95"
            title="Redirect Directly to Home"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />
            <span className="hidden xs:inline sm:inline">Home</span>
          </button>

          {/* History Icon */}
          {onToggleHistory && (
            <button
              id="btn-landing-history"
              onClick={onToggleHistory}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#c5a880]/40 bg-[#161820]/90 hover:bg-[#20222d] text-[#faedd0] hover:border-[#c5a880] transition-all text-xs font-['Plus_Jakarta_Sans'] font-medium shadow-sm active:scale-95"
              title="See Docket History"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />
              <span className="hidden xs:inline sm:inline">History</span>
              {chatCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#3d111e] text-[#faedd0] border border-[#c5a880]/30 ml-0.5">
                  {chatCount}
                </span>
              )}
            </button>
          )}

          {onNewChat && (
            <button
              id="btn-landing-new-chat"
              onClick={onNewChat}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#c5a880]/60 bg-gradient-to-r from-[#2b0c15] to-[#42121e] text-[#faedd0] hover:brightness-110 transition-all text-xs font-['Plus_Jakarta_Sans'] font-semibold shadow-sm"
              title="Start a New Legal Docket"
            >
              <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">New Docket</span>
            </button>
          )}

          {/* Counsel User Account Pill */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#12141a]/90 hover:border-[#c5a880]/50 hover:bg-[#1b1e27] text-xs transition-colors"
              title={currentUser ? `Authenticated as ${currentUser.name}` : "Counsel Login / Register"}
            >
              <User className="w-3.5 h-3.5 text-[#c5a880]" />
              <span className="hidden md:inline text-[11px] text-[#e3ded3] max-w-[110px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] + ' ' + (currentUser.name.split(' ')[1] || '') : 'Counsel'}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg border border-white/10 bg-[#14161d]/80 text-[#9e988f] hover:text-[#f5f2eb] hover:border-[#c5a880]/40 transition-colors"
            title="Archive Specifications & Telemetry"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleAudio}
            className="p-1.5 sm:p-2 rounded-lg border border-white/10 bg-[#14161d]/80 text-[#9e988f] hover:text-[#f5f2eb] hover:border-[#c5a880]/40 transition-colors"
            title={audioEnabled ? "Disable Archival Acoustic Resonance" : "Enable Archival Acoustic Resonance"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Hero Research Portal Central Content */}
      <main className="my-auto py-12 flex flex-col items-center text-center max-w-3xl mx-auto w-full pointer-events-auto">
        {/* Big Statement: Ask the Law. */}
        <h1 className="font-['Cinzel'] text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f5f2eb] mb-5 leading-[1.08]">
          Ask the Law.
        </h1>

        {/* Editorial Subtitle */}
        <p className="font-['Newsreader'] italic text-lg sm:text-xl md:text-2xl text-[#c2bcae] max-w-2xl mb-10 leading-relaxed font-normal">
          Explore legislation, cases and legal knowledge through an intelligent research interface connected to a living digital archive.
        </p>

        {/* Large Elegant Research Portal Search Bar */}
        <div className="w-full relative group">
          <form
            onSubmit={handleSubmit}
            className={`relative flex items-center w-full transition-all duration-300 rounded-xl border ${
              isFocused
                ? 'border-[#c5a880] shadow-[0_0_35px_rgba(197,168,128,0.18)] bg-[#101217]'
                : 'border-white/15 hover:border-[#c5a880]/50 bg-[#111318]/90'
            } backdrop-blur-xl p-2 sm:p-2.5`}
          >
            {/* Search icon */}
            <div className="pl-3 pr-2 text-[#c5a880]">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
            </div>

            {/* Input field */}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                onFocusChange(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                onFocusChange(false);
              }}
              placeholder="What are you looking for?"
              className="w-full min-w-0 bg-transparent px-2 py-2 sm:py-3 text-sm sm:text-lg text-[#f5f2eb] placeholder-[#8c857b] font-['Newsreader'] focus:outline-none tracking-wide"
            />

            {/* Return / Launch Button */}
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`shrink-0 flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider font-semibold transition-all ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-[#42121e] to-[#6b1d2f] text-[#faedd0] border border-[#c5a880]/40 shadow-md hover:brightness-110 active:scale-95'
                  : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
              }`}
            >
              <span>Search</span>
              <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </form>

          {/* Focal indicator below search field */}
          <div className="flex items-center justify-between px-2 sm:px-3 pt-2 text-[11px] text-[#9e988f]">
            <span className="flex items-center space-x-1.5 tracking-widest uppercase text-[9px] sm:text-[10px] text-[#8c857b]">
              <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-[#c5a880] animate-ping' : 'bg-[#c5a880]/40'}`} />
              <span>{isFocused ? 'Archive Inquisitor Focused' : 'Search the Living Archive'}</span>
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-[#706b64]">
              Press Enter ↵
            </span>
          </div>
        </div>

        {/* Floating Suggested Archival Prompts */}
        <div className="w-full mt-8 sm:mt-12 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] sm:text-[11px] font-['Plus_Jakarta_Sans'] tracking-[0.2em] text-[#c5a880]/80 uppercase">
              ARCHIVAL RESEARCH INQUIRIES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 text-left w-full min-w-0">
            {SUGGESTED_RESEARCH_PROMPTS.map((prompt, idx) => (
              <div
                key={idx}
                onClick={() => handlePromptClick(prompt.title)}
                data-interactive="true"
                className="group relative p-3.5 sm:p-4 rounded-xl border border-white/10 hover:border-[#c5a880]/60 bg-[#13151c]/70 hover:bg-[#1a1318]/80 backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-0.5 shadow-sm w-full min-w-0"
              >
                {/* Subtle corner ornament */}
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
                  <div className="w-full h-full border-t border-r border-[#c5a880]" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#c5a880] font-semibold font-['Plus_Jakarta_Sans'] uppercase shrink-0">
                    {prompt.domain}
                  </span>
                  <span className="text-[10px] font-mono text-[#8a8479] truncate max-w-[180px] sm:max-w-none">
                    {prompt.sectionSnippet}
                  </span>
                </div>

                <h3 className="font-['Newsreader'] text-sm sm:text-base text-[#f5f2eb] font-normal group-hover:text-[#faedd0] transition-colors leading-snug break-words">
                  {prompt.title}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {prompt.keyTerms.map((term, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] px-2 py-0.5 rounded border border-white/5 bg-white/5 text-[#b0a99e] font-light"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Clean Minimal Archival Footer */}
      <footer className="pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-[#706a61] pointer-events-auto font-['Newsreader']">
        <span>Lexora Jurisprudence Archive</span>
        <span className="italic text-[#8c857a]">Connected Network of Law</span>
      </footer>

      {/* Archive Settings / Specifications Drawer */}
      <ArchiveSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        audioEnabled={audioEnabled}
        onToggleAudio={onToggleAudio}
      />
    </div>
  );
};
