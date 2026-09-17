import React, { useState } from 'react';
import { LegalResearchResponse, EvidenceSource, LegalDomain } from '../types';
import { LEGAL_DOMAINS_LIST } from '../data/mockLegalArchive';
import { 
  Scale, 
  Search, 
  Bookmark, 
  BookMarked, 
  Clock, 
  Library, 
  FolderArchive, 
  FileText, 
  Share2, 
  Download, 
  Network, 
  Compass, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Cpu,
  ThumbsUp,
  ThumbsDown,
  Check,
  Zap,
  Plus,
  User,
  Layers,
  MessageSquare,
  CornerDownLeft,
  Home
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ChatSession, UserProfile } from '../types';

interface ResearchWorkspaceProps {
  research: LegalResearchResponse;
  currentChat?: ChatSession | null;
  activeTurnIndex?: number;
  onSelectTurn?: (index: number) => void;
  onAskFollowUp?: (query: string) => void;
  isFollowUpLoading?: boolean;
  onNewChat?: () => void;
  onToggleHistory?: () => void;
  isHistoryOpen?: boolean;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  chatCount?: number;
  onNewSearch: (query: string) => void;
  onSelectSource: (source: EvidenceSource) => void;
  onOpenGraph: () => void;
  onBackToLanding: () => void;
  activeDomain: LegalDomain;
  onSelectDomain: (domain: LegalDomain) => void;
  historyList: string[];
  onSelectHistoryItem: (query: string) => void;
  onFeedback?: (chunkId: string, vote: 'up' | 'down') => void;
  onOpenSelfLearning?: () => void;
}

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({
  research,
  currentChat,
  activeTurnIndex = 0,
  onSelectTurn,
  onAskFollowUp,
  isFollowUpLoading = false,
  onNewChat,
  onToggleHistory,
  isHistoryOpen = false,
  currentUser,
  onOpenAuth,
  chatCount = 0,
  onNewSearch,
  onSelectSource,
  onOpenGraph,
  onBackToLanding,
  activeDomain,
  onSelectDomain,
  historyList,
  onSelectHistoryItem,
  onFeedback,
  onOpenSelfLearning
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [followUpInput, setFollowUpInput] = useState('');
  const [activeTab, setActiveTab] = useState<'brief' | 'statutes' | 'precedents' | 'procedure'>('brief');
  const [activeTooltipTerm, setActiveTooltipTerm] = useState<string | null>(null);
  const [savedBriefs, setSavedBriefs] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState<'research' | 'history' | 'saved' | 'collections'>('research');
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'up' | 'down'>>({});
  const [mobileSection, setMobileSection] = useState<'dossier' | 'evidence' | 'index'>('dossier');

  const handleFeedbackClick = (e: React.MouseEvent, chunkId: string, vote: 'up' | 'down') => {
    e.stopPropagation();
    setFeedbackMap(prev => ({ ...prev, [chunkId]: vote }));
    sound.playArchivePulse();
    if (onFeedback) {
      onFeedback(chunkId, vote);
    }
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      sound.playArchivePulse();
      onNewSearch(queryInput.trim());
      setQueryInput('');
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      setSavedBriefs(prev => [...prev, research.id]);
    } else {
      setSavedBriefs(prev => prev.filter(id => id !== research.id));
    }
  };

  // Circular gauge for relevance indicator
  const renderRelevanceGauge = (relevance: number) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (relevance / 100) * circumference;

    return (
      <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
        <svg className="w-11 h-11 -rotate-90">
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2.5"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="transparent"
            stroke={relevance > 92 ? '#d4af37' : relevance > 86 ? '#c5a880' : '#8da4c4'}
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-[10px] font-bold text-[#f5f2eb]">
            {relevance}
          </span>
          <span className="text-[7px] text-[#8e887e] font-sans -mt-1">%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col pointer-events-none text-[#f5f2eb]">
      {/* Top Workspace Header Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0c0d10]/90 backdrop-blur-xl px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto gap-2">
        {/* Brand & Home Navigation Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            id="btn-workspace-home"
            onClick={onBackToLanding}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#c5a880]/60 bg-[#2b0c15]/60 hover:bg-[#3d111e] text-xs font-['Plus_Jakarta_Sans'] font-medium text-[#faedd0] hover:border-[#c5a880] transition-all shadow-sm active:scale-95"
            title="Redirect Directly to Home"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />
            <span className="hidden xs:inline sm:inline">Home</span>
          </button>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="font-['Cinzel'] tracking-[0.2em] text-xs sm:text-sm text-[#f5f2eb] font-bold">
              LEXORA
            </span>
            <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded border border-[#c5a880]/30 bg-[#2a0d14]/40 text-[#c5a880] font-mono">
              {research.dossierId}
            </span>
          </div>
        </div>

        {/* Global Search within Archive */}
        <form onSubmit={handleQuerySubmit} className="hidden md:flex items-center w-full max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#c5a880] absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search or ask follow-up..."
              className="w-full bg-[#13151c]/90 border border-white/10 focus:border-[#c5a880] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#f5f2eb] placeholder-[#7d786f] focus:outline-none transition-colors font-['Newsreader'] tracking-wide"
            />
          </div>
        </form>

        {/* Header Action Buttons — Streamlined, Balanced & Uncluttered */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {onToggleHistory && (
            <button
              id="btn-workspace-history"
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
              id="btn-workspace-new-chat"
              onClick={onNewChat}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#c5a880]/60 bg-gradient-to-r from-[#2b0c15] to-[#42121e] text-[#faedd0] hover:brightness-110 transition-all text-xs font-['Plus_Jakarta_Sans'] font-semibold shadow-sm"
              title="Start a New Legal Docket"
            >
              <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">New Docket</span>
            </button>
          )}

          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#12141a]/90 hover:border-[#c5a880]/50 hover:bg-[#1b1e27] text-xs transition-colors"
              title={currentUser ? `Authenticated as ${currentUser.name}` : "Counsel Login / Register"}
            >
              <User className="w-3.5 h-3.5 text-[#c5a880]" />
              <span className="hidden xl:inline text-[11px] text-[#e3ded3] max-w-[100px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] + ' ' + (currentUser.name.split(' ')[1] || '') : 'Counsel'}
              </span>
            </button>
          )}

          <button
            onClick={toggleSave}
            className={`p-1.5 sm:p-2 rounded-lg border transition-colors ${
              isSaved
                ? 'border-[#c5a880] text-[#d4af37] bg-[#42121e]/50'
                : 'border-white/10 text-[#8e887d] hover:text-[#f5f2eb] hover:bg-white/5'
            }`}
            title="Bookmark Dossier"
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* Mobile View Switcher: Dossier vs Evidence vs Index */}
      <div className="lg:hidden flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#0a0c10]/95 pointer-events-auto shrink-0">
        <div className="flex items-center space-x-1.5 w-full">
          <button
            onClick={() => { setMobileSection('dossier'); sound.playArchivePulse(); }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] font-medium transition-all text-center ${
              mobileSection === 'dossier'
                ? 'bg-gradient-to-r from-[#2b0c15] to-[#3d111e] text-[#faedd0] border border-[#c5a880]/60 shadow-sm font-semibold'
                : 'bg-white/5 text-[#9e988f] hover:text-[#f5f2eb]'
            }`}
          >
            Holding & Inquiry
          </button>
          <button
            onClick={() => { setMobileSection('evidence'); sound.playArchivePulse(); }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] font-medium transition-all text-center flex items-center justify-center space-x-1 ${
              mobileSection === 'evidence'
                ? 'bg-gradient-to-r from-[#2b0c15] to-[#3d111e] text-[#faedd0] border border-[#c5a880]/60 shadow-sm font-semibold'
                : 'bg-white/5 text-[#9e988f] hover:text-[#f5f2eb]'
            }`}
          >
            <span>Evidence</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#d4af37] border border-white/10">
              {research.evidenceSources.length}
            </span>
          </button>
          <button
            onClick={() => { setMobileSection('index'); sound.playArchivePulse(); }}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-['Plus_Jakarta_Sans'] font-medium transition-all text-center flex items-center space-x-1 ${
              mobileSection === 'index'
                ? 'bg-gradient-to-r from-[#2b0c15] to-[#3d111e] text-[#faedd0] border border-[#c5a880]/60 shadow-sm'
                : 'bg-white/5 text-[#9e988f] hover:text-[#f5f2eb]'
            }`}
            title="Archive Index & Navigation"
          >
            <Library className="w-3.5 h-3.5 text-[#c5a880]" />
            <span className="text-[10px]">Index</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Sophisticated Editorial Layout */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] mx-auto overflow-x-hidden min-w-0">
        
        {/* ========================================================
            LEFT COLUMN: ARCHIVE NAVIGATION & LIBRARY INDEX
        ======================================================== */}
        <aside className={`w-full lg:w-72 xl:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0c0e12]/80 backdrop-blur-md p-4 sm:p-5 flex-col space-y-6 pointer-events-auto overflow-y-auto ${mobileSection === 'index' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Index Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <Library className="w-4 h-4 text-[#c5a880]" />
              <span className="font-['Cinzel'] tracking-[0.25em] text-xs font-bold text-[#c5a880] uppercase">
                ARCHIVE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#787268]">INDEX VOL. XII</span>
          </div>

          {/* Primary Archive Sections */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveNavSection('research')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] transition-colors ${
                activeNavSection === 'research'
                  ? 'bg-[#2b0c15]/70 text-[#faedd0] border border-[#c5a880]/30 font-medium'
                  : 'text-[#a39c90] hover:text-[#f5f2eb] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Active Research</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            <button
              onClick={() => setActiveNavSection('history')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] transition-colors ${
                activeNavSection === 'history'
                  ? 'bg-[#2b0c15]/70 text-[#faedd0] border border-[#c5a880]/30 font-medium'
                  : 'text-[#a39c90] hover:text-[#f5f2eb] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Clock className="w-3.5 h-3.5 text-[#9e988f]" />
                <span>Query History</span>
              </div>
              <span className="font-mono text-[10px] text-[#787268]">{historyList.length}</span>
            </button>

            <button
              onClick={() => setActiveNavSection('saved')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] transition-colors ${
                activeNavSection === 'saved'
                  ? 'bg-[#2b0c15]/70 text-[#faedd0] border border-[#c5a880]/30 font-medium'
                  : 'text-[#a39c90] hover:text-[#f5f2eb] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Bookmark className="w-3.5 h-3.5 text-[#9e988f]" />
                <span>Saved Opinions</span>
              </div>
              <span className="font-mono text-[10px] text-[#787268]">{savedBriefs.length + (isSaved ? 1 : 0)}</span>
            </button>

            <button
              onClick={() => setActiveNavSection('collections')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] transition-colors ${
                activeNavSection === 'collections'
                  ? 'bg-[#2b0c15]/70 text-[#faedd0] border border-[#c5a880]/30 font-medium'
                  : 'text-[#a39c90] hover:text-[#f5f2eb] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FolderArchive className="w-3.5 h-3.5 text-[#9e988f]" />
                <span>Legal Collections</span>
              </div>
              <span className="text-[10px] text-[#787268]">4</span>
            </button>

            {onOpenGraph && (
              <button
                onClick={onOpenGraph}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] text-[#a39c90] hover:text-[#faedd0] hover:bg-white/5 transition-colors"
                title="View Precedent Knowledge Graph"
              >
                <div className="flex items-center space-x-2.5">
                  <Network className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Knowledge Graph</span>
                </div>
                <span className="text-[10px] font-mono text-[#c5a880]">Atlas</span>
              </button>
            )}

            {onOpenSelfLearning && (
              <button
                onClick={onOpenSelfLearning}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-['Plus_Jakarta_Sans'] text-[#a39c90] hover:text-emerald-300 hover:bg-emerald-950/20 transition-colors"
                title="Inspect Self-Learning Engine Weights & Corpus"
              >
                <div className="flex items-center space-x-2.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Learned RAG</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Live</span>
              </button>
            )}
          </nav>

          {/* Legal Domains Catalog */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
                LEGAL DOMAINS
              </span>
              <span className="text-[9px] text-[#787268] font-mono">CORPUS</span>
            </div>

            <div className="space-y-1">
              {LEGAL_DOMAINS_LIST.map((item) => {
                const isSelected = research.domain === item.domain;
                return (
                  <div
                    key={item.domain}
                    onClick={() => {
                      onSelectDomain(item.domain);
                      sound.playArchivePulse();
                    }}
                    className={`group p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#c5a880]/60 bg-[#1f161b]/90 shadow-sm'
                        : 'border-transparent hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isSelected ? 'text-[#faedd0]' : 'text-[#d4cfc5] group-hover:text-[#f5f2eb]'}`}>
                        {item.domain}
                      </span>
                      <span className="text-[10px] font-mono text-[#8a8479]">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7e786e] line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Query History Drawer snippet if history active */}
          {historyList.length > 0 && (
            <div className="pt-2 border-t border-white/5">
              <span className="block text-[10px] font-['Plus_Jakarta_Sans'] tracking-widest text-[#8a8479] uppercase mb-2">
                RECENT DOCKETS
              </span>
              <div className="space-y-1.5">
                {historyList.slice(-4).reverse().map((hItem, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectHistoryItem(hItem)}
                    className="w-full text-left p-2 rounded text-xs text-[#b8b2a7] hover:text-[#faedd0] hover:bg-white/5 truncate transition-colors font-['Newsreader']"
                  >
                    "{hItem}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Archival Status Footer */}
          <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-[#6d675e] space-y-1">
            <div className="flex justify-between">
              <span>Jurisdictions</span>
              <span className="font-mono text-[#9e988f]">State & Federal</span>
            </div>
            <div className="flex justify-between">
              <span>Precedents Synced</span>
              <span className="font-mono text-[#c5a880]">128,490</span>
            </div>
          </div>
        </aside>

        {/* ========================================================
            CENTER COLUMN: QUESTION + EDITORIAL LEGAL ANSWER
        ======================================================== */}
        <main className={`flex-1 min-w-0 p-3.5 sm:p-8 lg:p-12 overflow-y-auto pointer-events-auto space-y-6 sm:space-y-8 w-full max-w-full ${mobileSection === 'dossier' ? 'block' : 'hidden lg:block'}`}>
          {/* Multi-Inquiry Thread Stepper / Timeline (Shown when multiple questions exist in current docket) */}
          {currentChat && currentChat.turns.length > 1 && (
            <div className="p-3 rounded-xl border border-[#c5a880]/30 bg-[#12141a]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md w-full min-w-0">
              <div className="flex items-center space-x-2 shrink-0 min-w-0">
                <div className="w-6 h-6 rounded-md bg-[#2b0c15] border border-[#c5a880]/40 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                <div className="min-w-0 truncate">
                  <span className="text-[11px] font-['Cinzel'] font-bold text-[#faedd0] uppercase tracking-wider block truncate">
                    {currentChat.title}
                  </span>
                  <span className="text-[9px] text-[#8e887e] font-mono block truncate">
                    Docket #{currentChat.id.slice(-6)} • {currentChat.turns.length} {currentChat.turns.length === 1 ? 'Inquiry' : 'Inquiries'} in Docket
                  </span>
                </div>
              </div>

              {/* Turn selector tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 scrollbar-none w-full sm:w-auto">
                {currentChat.turns.map((turn, idx) => (
                  <button
                    key={turn.id || idx}
                    type="button"
                    onClick={() => onSelectTurn && onSelectTurn(idx)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center space-x-1.5 ${
                      idx === activeTurnIndex
                        ? 'bg-gradient-to-r from-[#2b0c15] to-[#42121e] border border-[#c5a880]/80 text-[#faedd0] shadow-sm font-semibold'
                        : 'border border-white/10 bg-white/5 text-[#9e988f] hover:text-[#f5f2eb] hover:bg-white/10'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[#d4af37]">Q{idx + 1}:</span>
                    <span className="max-w-[120px] sm:max-w-[180px] truncate">{turn.question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Case Dossier Title & Inquiry Header */}
          <div className="border-b border-white/10 pb-5 sm:pb-6 w-full min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
              <span className="text-[9px] sm:text-[10px] font-['Plus_Jakarta_Sans'] tracking-[0.2em] text-[#d4af37] uppercase font-semibold px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#2b0c15]/60 shrink-0">
                {research.domain} JURISPRUDENCE
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#8a8479] px-2 py-0.5 rounded border border-white/10 bg-white/5 truncate max-w-[200px] sm:max-w-none">
                {research.jurisdiction}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#787268] shrink-0">
                {research.timestamp}
              </span>
            </div>

            {/* The Question - Break words and adaptive font sizing so it never cuts */}
            <h1 className="font-['Cinzel'] text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#f5f2eb] leading-tight break-words">
              {research.query}
            </h1>
          </div>

          {/* Tab Navigation for Analytical Perspectives */}
          <div className="flex items-center space-x-1 sm:space-x-2 border-b border-white/10 overflow-x-auto scrollbar-none pb-px w-full min-w-0">
            {[
              { id: 'brief', label: 'Judicial Assessment' },
              { id: 'statutes', label: 'Statutory Scheme' },
              { id: 'precedents', label: 'Landmark Precedents' },
              { id: 'procedure', label: 'Procedural Roadmap' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-['Plus_Jakarta_Sans'] uppercase tracking-wider font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#c5a880] text-[#faedd0]'
                    : 'border-transparent text-[#8e887d] hover:text-[#d8d4cc]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Document Content Based on Active Tab */}
          {activeTab === 'brief' && (
            <div className="space-y-8 font-['Newsreader']">
              {/* Self-Learning RAG Intelligence Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#0d1715]/80 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Cpu className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-['Cinzel'] text-xs uppercase tracking-wider text-emerald-300 font-bold">
                        Self-Learning RAG Pipeline Active
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                        CONSTITUTION • IPC 1860 • IT RULES 2000
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a1a8a5] font-sans mt-0.5">
                      Retrieval Score: <strong className="text-emerald-400 font-mono">{research.selfLearningTelemetry?.retrievalScore?.toFixed(2) ?? '1.18'}</strong> • Evaluated: <strong className="text-white font-mono">{research.selfLearningTelemetry?.chunksEvaluated ?? 26}</strong> provisions • Adaptations: <strong className="text-emerald-400 font-mono">{research.selfLearningTelemetry?.adaptationCount ?? 76}</strong>
                    </p>
                  </div>
                </div>

                {onOpenSelfLearning && (
                  <button
                    onClick={onOpenSelfLearning}
                    className="px-3 py-1 text-xs font-mono rounded-lg border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-200 transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-emerald-400" />
                    View Learned Weights
                  </button>
                )}
              </div>

              {/* Executive Assessment / Primary Holding */}
              <div className="p-4 sm:p-6 rounded-xl border border-[#c5a880]/30 bg-[#12141a]/90 backdrop-blur-md shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                  <span className="font-['Cinzel'] text-xs uppercase tracking-[0.2em] text-[#c5a880] font-bold">
                    PRIMARY RATIO & HOLDING SUMMARY
                  </span>
                </div>
                <p className="text-base sm:text-xl text-[#f5f2eb] italic leading-relaxed break-words">
                  "{research.holdingSummary}"
                </p>
              </div>

              {/* Numbered Judicial Reasoning (I, II, III, IV) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h2 className="font-['Cinzel'] text-xs sm:text-sm tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                    SUBSTANTIVE JUDICIAL REASONING
                  </h2>
                  <span className="text-[10px] text-[#7a7469] font-mono">STARE DECISIS HIERARCHY</span>
                </div>

                <div className="space-y-5">
                  {research.judicialReasoning.map((step) => (
                    <article
                      key={step.stepNumber}
                      className="group p-4 sm:p-5 rounded-lg border border-white/5 hover:border-[#c5a880]/40 bg-[#12141c]/60 hover:bg-[#16141a]/80 backdrop-blur-sm transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="w-7 h-7 rounded border border-[#c5a880]/40 bg-[#2b0c15] text-[#d4af37] font-['Cinzel'] font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h3 className="font-['Cinzel'] text-sm sm:text-base text-[#f5f2eb] font-semibold break-words">
                          {step.doctrine}
                        </h3>
                      </div>

                      <p className="text-sm sm:text-base text-[#d8d4cc] leading-relaxed pl-0 sm:pl-10 mb-3 font-normal break-words">
                        {step.explanation}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pl-10 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-[#8e887d] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
                          CITATION ANCHOR:
                        </span>
                        <span
                          onClick={() => {
                            const matchedSource = research.evidenceSources.find(s => 
                              step.citationKey.toLowerCase().includes(s.title.toLowerCase()) || 
                              s.title.toLowerCase().includes(step.citationKey.toLowerCase().slice(0, 10))
                            );
                            if (matchedSource) onSelectSource(matchedSource);
                          }}
                          className="text-xs font-mono text-[#c5a880] hover:text-[#faedd0] underline underline-offset-4 cursor-pointer"
                        >
                          {step.citationKey}
                        </span>
                        {step.statutoryAnchor && (
                          <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[#9e988f]">
                            {step.statutoryAnchor}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Key Jurisprudential Terminology with Interactive Tooltips */}
              <div className="p-5 rounded-xl border border-white/10 bg-[#101217]/70 backdrop-blur-md">
                <h3 className="font-['Cinzel'] text-xs tracking-[0.2em] text-[#c5a880] uppercase font-semibold mb-3">
                  DOCTRINAL TERMINOLOGY
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {research.keyTerminology.map((termItem) => (
                    <div key={termItem.term} className="relative">
                      <button
                        onClick={() => setActiveTooltipTerm(activeTooltipTerm === termItem.term ? null : termItem.term)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-serif transition-colors flex items-center space-x-1.5 ${
                          activeTooltipTerm === termItem.term
                            ? 'border-[#c5a880] bg-[#42121e]/50 text-[#faedd0]'
                            : 'border-white/10 bg-[#161820]/70 text-[#d8d4cc] hover:border-[#c5a880]/50'
                        }`}
                      >
                        <span className="italic font-medium">{termItem.term}</span>
                        <Info className="w-3 h-3 text-[#c5a880] opacity-80" />
                      </button>

                      {/* Tooltip Card */}
                      {activeTooltipTerm === termItem.term && (
                        <div className="absolute left-0 bottom-full mb-2 w-72 p-3.5 rounded-lg border border-[#c5a880]/40 bg-[#14161f] shadow-2xl z-40 text-left animate-in fade-in zoom-in-95 duration-150">
                          <span className="block text-[10px] font-['Plus_Jakarta_Sans'] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                            {termItem.translationOrMeaning}
                          </span>
                          <p className="text-xs text-[#d8d4cc] leading-normal font-sans">
                            {termItem.significance}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Statutory Framework Tab */}
          {activeTab === 'statutes' && (
            <div className="space-y-6 font-['Newsreader']">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                <h2 className="font-['Cinzel'] text-sm tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                  {research.statutoryFramework.title}
                </h2>
              </div>

              <div className="space-y-4">
                {research.statutoryFramework.provisions.map((prov, idx) => (
                  <div key={idx} className="p-6 rounded-lg border border-white/10 bg-[#12141a]/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-['Cinzel'] text-sm font-bold text-[#c5a880]">
                        {prov.code}
                      </span>
                      <span className="text-xs text-[#8e887d] font-mono">{prov.act}</span>
                    </div>
                    <h3 className="text-base text-[#f5f2eb] font-semibold">{prov.title}</h3>
                    <p className="text-sm sm:text-base text-[#d4cfc5] leading-relaxed italic">
                      "{prov.analysis}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Landmark Precedents Tab */}
          {activeTab === 'precedents' && (
            <div className="space-y-6 font-['Newsreader']">
              <h2 className="font-['Cinzel'] text-sm tracking-[0.25em] text-[#d4af37] uppercase font-semibold mb-4">
                COMPARATIVE LANDMARK AUTHORITIES
              </h2>

              <div className="space-y-4">
                {research.comparativePrecedents.map((prec, idx) => (
                  <div key={idx} className="p-5 rounded-lg border border-white/10 bg-[#12141c]/70 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-['Cinzel'] text-base font-bold text-[#f5f2eb]">
                        {prec.caseName}
                      </h3>
                      <span className="text-xs font-mono text-[#c5a880] px-2 py-0.5 rounded border border-white/10">
                        {prec.citation} ({prec.year})
                      </span>
                    </div>
                    <div className="text-xs text-[#9a9488] font-['Plus_Jakarta_Sans']">
                      Court: <span className="text-[#d8d4cc]">{prec.court}</span>
                    </div>
                    <p className="text-sm sm:text-base text-[#d8d4cc] leading-relaxed italic pt-2 border-t border-white/5">
                      <span className="text-[#c5a880] font-sans font-semibold text-xs not-italic uppercase tracking-wide block mb-1">
                        Ratio Decidendi:
                      </span>
                      "{prec.ratioDecidendi}"
                    </p>
                    <div className="text-xs text-[#a8a193] font-['Plus_Jakarta_Sans']">
                      Significance: {prec.distinctionOrHolding}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedural Roadmap Tab */}
          {activeTab === 'procedure' && (
            <div className="space-y-6 font-['Newsreader']">
              <h2 className="font-['Cinzel'] text-sm tracking-[0.25em] text-[#d4af37] uppercase font-semibold mb-4">
                PRACTITIONER'S PROCEDURAL GUIDANCE
              </h2>

              <div className="space-y-3">
                {research.proceduralGuidance.map((guide, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-4 rounded-lg border border-white/5 bg-[#12141a]/60">
                    <span className="w-5 h-5 rounded-full bg-[#42121e] text-[#d4af37] text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-[#d4cfc5] leading-relaxed">
                      {guide}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              MULTI-QUESTION INQUIRY CONSOLE (1 CHAT, MULTIPLE QUESTIONS)
          ======================================================== */}
          <div className="mt-10 p-5 rounded-2xl border border-[#c5a880]/30 bg-gradient-to-b from-[#14161f] to-[#0c0e14] shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2b0c15] border border-[#c5a880]/40 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-['Cinzel'] tracking-wider text-[#faedd0] uppercase">
                    Follow-Up Legal Inquiry in this Docket
                  </h3>
                  <p className="text-[11px] text-[#9e988f] font-['Newsreader'] italic">
                    Ask subsequent questions to explore exceptions, precedents, or cross-statutory doctrines within this ongoing docket.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                Multi-Turn RAG Active
              </span>
            </div>

            {/* Quick follow-up recommendation chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                `What statutory exceptions qualify this holding?`,
                `Which Supreme Court precedents conflict with or qualify this principle?`,
                `What procedural remedy is available under Section 482 / Article 32?`,
                `What is the evidentiary burden of proof required here?`
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setFollowUpInput(prompt)}
                  className="text-[11px] font-['Newsreader'] italic text-[#c5a880] hover:text-[#faedd0] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (followUpInput.trim() && onAskFollowUp && !isFollowUpLoading) {
                  sound.playArchivePulse();
                  onAskFollowUp(followUpInput.trim());
                  setFollowUpInput('');
                }
              }} 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  placeholder="Pose your follow-up legal inquiry (e.g. 'Does private defence extend to property protection?')..."
                  disabled={isFollowUpLoading}
                  className="w-full pl-3 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-white/15 bg-[#0a0c10] text-[#f5f2eb] placeholder-[#696359] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/40 font-['Newsreader']"
                />
              </div>
              <button
                type="submit"
                disabled={!followUpInput.trim() || isFollowUpLoading}
                className="px-4 py-2.5 rounded-xl border border-[#c5a880]/60 bg-gradient-to-r from-[#2b0c15] to-[#451320] text-[#faedd0] text-xs font-['Plus_Jakarta_Sans'] font-medium uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40 shrink-0 shadow-lg active:scale-95"
              >
                {isFollowUpLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <span>Ask Follow-Up</span>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#d4af37]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

        {/* ========================================================
            RIGHT COLUMN: EVIDENCE (SOURCES & AUTHORITIES)
        ======================================================== */}
        <aside className={`w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0c0e12]/80 backdrop-blur-md p-4 sm:p-5 flex-col space-y-5 pointer-events-auto overflow-y-auto ${mobileSection === 'evidence' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Evidence Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-[#c5a880]" />
              <h2 className="font-['Cinzel'] tracking-[0.25em] text-xs font-bold text-[#c5a880] uppercase">
                EVIDENCE
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#8a8479]">
              {research.evidenceSources.length} RETRIEVED
            </span>
          </div>

          <p className="text-[11px] font-['Newsreader'] italic text-[#9e988f]">
            Statutory sections, appellate decisions and treatises weighted by semantic relevance:
          </p>

          {/* Evidence Source Cards */}
          <div className="space-y-3.5">
            {research.evidenceSources.map((source) => (
              <div
                key={source.id}
                onClick={() => {
                  sound.playDocumentOpen();
                  onSelectSource(source);
                }}
                data-source-card="true"
                data-cursor="inspect"
                className="group p-4 rounded-xl border border-white/10 hover:border-[#c5a880]/60 bg-[#12141c]/80 hover:bg-[#1a141b]/90 backdrop-blur-sm transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden"
              >
                {/* Subtle side highlight */}
                <div className="absolute top-0 right-0 w-1 h-full bg-[#c5a880]/0 group-hover:bg-[#c5a880] transition-colors" />

                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <span className="text-[9px] font-['Plus_Jakarta_Sans'] uppercase tracking-[0.2em] text-[#c5a880] font-semibold block truncate">
                      {source.authority}
                    </span>
                    <h3 className="font-['Cinzel'] text-xs font-bold text-[#f5f2eb] group-hover:text-[#faedd0] transition-colors leading-snug line-clamp-1">
                      {source.title}
                    </h3>
                  </div>

                  {/* Circular Relevance Gauge */}
                  {renderRelevanceGauge(source.relevance)}
                </div>

                <div className="text-[11px] font-mono text-[#9e988f] mb-2">
                  {source.sectionOrCitation}
                </div>

                <p className="font-['Newsreader'] text-xs text-[#c2bcae] line-clamp-2 leading-relaxed italic mb-3">
                  "{source.summary}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#7a7469]">
                  <span className="truncate max-w-[90px]">{source.page || 'Direct Citation'}</span>

                  {/* Reinforce / Dampen RAG Weights */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Reinforce statutory weight in Self-Learning RAG"
                      onClick={(e) => handleFeedbackClick(e, source.id.replace('src_', ''), 'up')}
                      className={`p-1 rounded transition-colors ${
                        feedbackMap[source.id.replace('src_', '')] === 'up'
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/50'
                          : 'hover:bg-white/10 text-[#8c909b] hover:text-emerald-400'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      title="Dampen statutory weight for this query"
                      onClick={(e) => handleFeedbackClick(e, source.id.replace('src_', ''), 'down')}
                      className={`p-1 rounded transition-colors ${
                        feedbackMap[source.id.replace('src_', '')] === 'down'
                          ? 'bg-red-950/80 text-red-300 border border-red-500/50'
                          : 'hover:bg-white/10 text-[#8c909b] hover:text-red-400'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>

                    <span className="flex items-center space-x-0.5 text-[#c5a880] group-hover:translate-x-0.5 transition-transform ml-1">
                      <span>Pull Folio</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Topology Exploration Card */}
          <div className="mt-auto p-4 rounded-xl border border-[#c5a880]/20 bg-[#18131a]/60 text-center">
            <span className="block text-[10px] font-['Plus_Jakarta_Sans'] uppercase tracking-widest text-[#d4af37] font-semibold mb-1">
              STRUCTURAL JURISPRUDENCE
            </span>
            <p className="text-xs text-[#a8a194] font-['Newsreader'] italic mb-3">
              Explore how this query anchors into acts, landmark rulings and foundational concepts.
            </p>
            <button
              onClick={onOpenGraph}
              className="w-full py-2 px-3 rounded-lg border border-[#c5a880]/40 bg-[#2b0c15] hover:bg-[#42121e] text-[#faedd0] text-xs font-['Plus_Jakarta_Sans'] font-medium tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <Network className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Launch Knowledge Graph</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
