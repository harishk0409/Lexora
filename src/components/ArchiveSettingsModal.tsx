import React from 'react';
import { X, Sliders, Database, Shield, BookOpen, Volume2, VolumeX, CheckCircle, Scale, Cpu } from 'lucide-react';

interface ArchiveSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const ArchiveSettingsModal: React.FC<ArchiveSettingsModalProps> = ({
  isOpen,
  onClose,
  audioEnabled,
  onToggleAudio
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md pointer-events-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0e1015] border border-[#c5a880]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 bg-[#14161f] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg border border-[#c5a880]/30 bg-[#2b0c15] flex items-center justify-center">
              <Scale className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-['Cinzel'] text-sm tracking-wider text-[#f5f2eb] font-bold">
                ARCHIVE SPECIFICATIONS & SETTINGS
              </h3>
              <p className="text-[11px] font-['Plus_Jakarta_Sans'] text-[#8e887d]">
                Corpus Index & Infrastructure Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-[#8e887d] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Corpus Statistics (Moved from Frontpage) */}
          <div>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] tracking-[0.25em] text-[#c5a880] uppercase font-semibold block mb-3">
              CORPUS REPOSITORIES
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#12141a]">
                <span className="text-[10px] text-[#7e786e] font-['Plus_Jakarta_Sans'] uppercase tracking-wider block">
                  SYNCHRONIZED PRECEDENTS
                </span>
                <span className="font-mono text-lg font-bold text-[#f5f2eb] mt-0.5 block">
                  128,490
                </span>
                <span className="text-[10px] text-emerald-400/80 flex items-center space-x-1 mt-1 font-mono">
                  <CheckCircle className="w-2.5 h-2.5" />
                  <span>Stare Decisis Active</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-white/10 bg-[#12141a]">
                <span className="text-[10px] text-[#7e786e] font-['Plus_Jakarta_Sans'] uppercase tracking-wider block">
                  SYSTEM VERSION
                </span>
                <span className="font-mono text-lg font-bold text-[#c5a880] mt-0.5 block">
                  Folio v2.4
                </span>
                <span className="text-[10px] text-[#8e887d] mt-1 block">
                  Apex Law Edition
                </span>
              </div>
            </div>
          </div>

          {/* Jurisdictional Indexes */}
          <div>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] tracking-[0.25em] text-[#c5a880] uppercase font-semibold block mb-2.5">
              JURISDICTIONAL LEXICONS
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg border border-white/5 bg-[#12141c] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="text-[#d8d4cc]">Constitutional & Apex Court Digest</span>
                </div>
                <span className="font-mono text-[10px] text-[#8e887d]">Indexed</span>
              </div>
              <div className="p-3 rounded-lg border border-white/5 bg-[#12141c] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Shield className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="text-[#d8d4cc]">Penal, Criminal & Procedural Codes</span>
                </div>
                <span className="font-mono text-[10px] text-[#8e887d]">Indexed</span>
              </div>
              <div className="p-3 rounded-lg border border-white/5 bg-[#12141c] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Database className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="text-[#d8d4cc]">Commercial & Contractual Law Reports</span>
                </div>
                <span className="font-mono text-[10px] text-[#8e887d]">Indexed</span>
              </div>
            </div>
          </div>

          {/* Ambient Acoustic Resonance Toggle */}
          <div className="p-4 rounded-xl border border-[#c5a880]/20 bg-[#161318]/50 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#faedd0] font-['Plus_Jakarta_Sans'] flex items-center space-x-2">
                <span>Archival Resonance Acoustics</span>
              </span>
              <p className="text-[11px] text-[#8e887d] font-['Newsreader'] italic">
                Subtle synthesized harmonic tones upon query execution and folio unsealing.
              </p>
            </div>
            <button
              onClick={onToggleAudio}
              className={`p-2.5 rounded-lg border transition-colors ${
                audioEnabled
                  ? 'border-[#c5a880] text-[#d4af37] bg-[#42121e]/50'
                  : 'border-white/10 text-[#8e887d] hover:text-[#f5f2eb] bg-white/5'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#12141a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2b0c15] hover:bg-[#42121e] border border-[#c5a880]/30 text-xs font-['Plus_Jakarta_Sans'] text-[#faedd0] font-medium tracking-wider transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
