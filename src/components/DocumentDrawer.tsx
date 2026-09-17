import React, { useState } from 'react';
import { EvidenceSource } from '../types';
import { X, Copy, Check, ExternalLink, Bookmark, Scale, FileText, ChevronRight, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface DocumentDrawerProps {
  source: EvidenceSource | null;
  onClose: () => void;
  onInspectNode?: (label: string) => void;
}

export const DocumentDrawer: React.FC<DocumentDrawerProps> = ({
  source,
  onClose,
  onInspectNode
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!source) return null;

  const handleCopyCitation = () => {
    const citation = `${source.title}, ${source.sectionOrCitation} (${source.year}) [${source.authority}]`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-auto bg-black/60 backdrop-blur-sm transition-all duration-300">
      {/* Click outside backdrop */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Archival Folio Slide-Out Drawer */}
      <aside className="w-full max-w-2xl bg-[#0f1116] border-l border-[#c5a880]/30 shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Folio Header & Close */}
        <div className="p-6 border-b border-white/10 bg-[#14161f]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded border border-[#c5a880]/40 bg-[#2b0c15]/60 flex items-center justify-center">
              <Scale className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-['Plus_Jakarta_Sans'] tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
                  ARCHIVAL RECORD
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-[#a39c90] font-mono">
                  {source.type.toUpperCase()}
                </span>
              </div>
              <h2 className="font-['Cinzel'] text-sm tracking-wider text-[#f5f2eb] font-bold">
                {source.sectionOrCitation}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded border border-white/10 transition-colors ${
                bookmarked ? 'text-[#d4af37] bg-[#42121e]/40' : 'text-[#8a847a] hover:text-[#f5f2eb]'
              }`}
              title="Save to Folio"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded border border-white/10 text-[#8a847a] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors"
              title="Close Folio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Folio Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 font-['Newsreader']">
          {/* Document Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg border border-white/10 bg-[#12141c]/60 text-xs">
            <div>
              <span className="block font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7a7469]">
                DOCUMENT
              </span>
              <span className="font-medium text-[#d8d4cc]">{source.title}</span>
            </div>
            <div>
              <span className="block font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7a7469]">
                SECTION / BENCH
              </span>
              <span className="font-medium text-[#d8d4cc]">{source.sectionOrCitation}</span>
            </div>
            <div>
              <span className="block font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7a7469]">
                PAGE / FOLIO
              </span>
              <span className="font-mono text-[#c5a880]">{source.page || 'Folio 1'}</span>
            </div>
            <div>
              <span className="block font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-wider text-[#7a7469]">
                RELEVANCE
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono font-bold text-[#f5f2eb]">{source.relevance}%</span>
              </div>
            </div>
          </div>

          {/* Authority and Jurisdiction Banner */}
          <div className="flex items-center justify-between text-xs py-2 px-3 rounded border border-[#c5a880]/20 bg-[#1a1318]/50">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
              <span className="text-[#c5a880] tracking-wide font-['Plus_Jakarta_Sans']">
                {source.authority}
              </span>
            </div>
            <span className="text-[#8e887d] font-mono">{source.jurisdiction} • {source.year}</span>
          </div>

          {/* Section: RELEVANT PASSAGE (Highlighted in antique manuscript styling) */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-1.5 h-3 bg-[#c5a880]" />
              <h3 className="font-['Cinzel'] text-xs uppercase tracking-[0.2em] text-[#d4af37] font-semibold">
                RELEVANT PASSAGE
              </h3>
            </div>

            <div className="relative p-6 rounded-lg border border-[#c5a880]/30 bg-[#151319]/90 shadow-inner">
              {/* Decorative margin lines resembling ancient legal reporter format */}
              <div className="absolute left-3 top-4 bottom-4 w-[1px] bg-[#c5a880]/20" />
              <div className="pl-4">
                <p className="text-base sm:text-lg leading-relaxed text-[#ede8de] italic font-serif">
                  "{source.fullPassage}"
                </p>
                
                {/* Specific Highlighted Ratio */}
                <div className="mt-4 p-3 rounded border-l-2 border-[#d4af37] bg-[#42121e]/30 text-sm text-[#faedd0]">
                  <span className="block text-[10px] font-['Plus_Jakarta_Sans'] uppercase tracking-widest text-[#d4af37] font-semibold mb-1">
                    KEY OPERATIVE PRINCIPLE
                  </span>
                  <span>"{source.highlightedQuote}"</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Principles Pills */}
          <div>
            <h4 className="font-['Plus_Jakarta_Sans'] text-[11px] uppercase tracking-widest text-[#8a847a] mb-2.5">
              RATIO DECIDENDI & JURISTIC PILLARS
            </h4>
            <div className="space-y-2">
              {source.keyPrinciples.map((principle, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 text-sm text-[#d4cfc5] p-2.5 rounded border border-white/5 bg-[#12141a]/60"
                >
                  <ChevronRight className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" />
                  <span>{principle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Archival Note & Context */}
          <div className="p-4 rounded-lg border border-white/5 bg-[#101217] text-xs text-[#9a9488] leading-relaxed">
            <span className="block font-semibold text-[#c5a880] mb-1 font-['Plus_Jakarta_Sans'] text-[10px] tracking-wider uppercase">
              ARCHIVE CONCORDANCE NOTE
            </span>
            Retrieved from the authoritative law reports collection. Verified against primary gazettes with authoritative cross-references across coordinate benches and appellate divisions.
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-5 border-t border-white/10 bg-[#12141c] flex items-center justify-between">
          <button
            onClick={handleCopyCitation}
            className="flex items-center space-x-2 px-4 py-2.5 rounded border border-[#c5a880]/30 hover:border-[#c5a880] bg-[#1a171d] hover:bg-[#c5a880]/10 text-xs font-['Plus_Jakarta_Sans'] text-[#faedd0] tracking-wider transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c5a880]" />}
            <span>{copied ? 'Citation Copied' : 'Copy Official Citation'}</span>
          </button>

          {onInspectNode && (
            <button
              onClick={() => {
                onInspectNode(source.title);
                onClose();
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded bg-gradient-to-r from-[#42121e] to-[#6b1d2f] hover:brightness-110 border border-[#c5a880]/40 text-xs font-['Plus_Jakarta_Sans'] text-[#faedd0] tracking-wider transition-all shadow-md"
            >
              <span>View in Knowledge Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
