import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  Clock, 
  User, 
  LogOut, 
  ChevronRight, 
  X, 
  PanelLeftClose, 
  PanelLeft,
  Scale,
  Sparkles,
  Shield,
  Layers,
  Database,
  Download
} from 'lucide-react';
import { ChatSession, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { localDB } from '../services/localDatabase';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatSession[];
  activeChatId?: string | null;
  onSelectChat: (chat: ChatSession) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportLocalDB = async () => {
    try {
      setIsExporting(true);
      sound.playArchivePulse();
      const userId = currentUser?.id || 'guest';
      const json = await localDB.exportUserData(userId);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lexora_localdb_${currentUser?.username || 'counsel'}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export localdb:', e);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.turns.some(t => t.question.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-39 pointer-events-auto transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        id="history-sidebar"
        className="fixed inset-y-0 left-0 z-40 w-[85vw] max-w-sm sm:w-88 bg-[#0b0c10]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col font-['Plus_Jakarta_Sans'] text-[#f5f2eb] animate-in slide-in-from-left duration-200 pointer-events-auto"
      >
      {/* Header with Title & Close button */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#200810]/70 to-transparent">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg border border-[#c5a880]/40 bg-[#35101a] flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div>
            <span className="font-['Cinzel'] tracking-widest text-xs font-bold text-[#f5f2eb] block">
              DOCKET HISTORY
            </span>
            <span className="text-[10px] text-[#9e988f] tracking-wider uppercase font-mono">
              {currentUser ? `@${currentUser.username}` : 'Guest Session'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#8f887d] hover:text-[#f5f2eb] hover:bg-white/10 transition-colors"
          title="Close History Bar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Action: + New Chat / New Inquiry */}
      <div className="p-3 border-b border-white/5 space-y-2.5">
        <button
          id="btn-new-chat-sidebar"
          onClick={() => {
            sound.playArchivePulse();
            onNewChat();
          }}
          className="w-full py-2.5 px-3.5 rounded-xl border border-[#c5a880]/60 bg-gradient-to-r from-[#2b0c15] via-[#3a101b] to-[#4d1424] hover:brightness-110 text-[#faedd0] font-medium text-xs tracking-wider uppercase flex items-center justify-between shadow-md transition-all group"
        >
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#591729] flex items-center justify-center text-[#faedd0] group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold font-['Cinzel']">New Legal Docket</span>
          </div>
          <span className="text-[10px] text-[#c5a880] font-mono group-hover:translate-x-0.5 transition-transform">+ Chat</span>
        </button>

        {/* Search input to filter previous inquiries */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#736e65] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search past dockets or sections..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-white/10 bg-[#12141a] text-[#f5f2eb] placeholder-[#635e54] focus:outline-none focus:border-[#c5a880]/60"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736e65] hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Dockets List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {filteredChats.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <MessageSquare className="w-8 h-8 text-[#5c5549] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#a69e90] font-['Newsreader'] italic">
              {searchTerm ? 'No dockets match your search filter.' : 'No archived inquiries yet for this counsel.'}
            </p>
            <button
              onClick={() => {
                sound.playArchivePulse();
                onNewChat();
              }}
              className="mt-3 inline-flex items-center space-x-1 text-xs text-[#c5a880] hover:underline"
            >
              <span>Launch First Docket</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = activeChatId === chat.id;
            const turnCount = chat.turns.length;

            return (
              <div
                key={chat.id}
                onClick={() => {
                  sound.playArchivePulse();
                  onSelectChat(chat);
                }}
                className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#c5a880]/60 bg-gradient-to-r from-[#200810]/90 to-[#2c0f18]/80 shadow-md'
                    : 'border-white/5 hover:border-white/15 hover:bg-white/5 bg-[#101217]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-medium truncate ${isActive ? 'text-[#faedd0]' : 'text-[#e6e2d8]'}`}>
                        {chat.title}
                      </span>
                    </div>

                    {/* Question Count & Timestamp */}
                    <div className="flex items-center space-x-2 text-[10px] text-[#7a7469]">
                      <span className="flex items-center space-x-1 font-mono text-emerald-400/90 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <Layers className="w-2.5 h-2.5" />
                        <span>{turnCount} {turnCount === 1 ? 'inquiry' : 'inquiries'}</span>
                      </span>
                      <span>•</span>
                      <span className="truncate">
                        {new Date(chat.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    title="Delete this docket"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this case docket from your archive?')) {
                        onDeleteChat(chat.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#827d73] hover:text-red-400 hover:bg-red-950/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer: User Profile & Security Status */}
      <div className="p-3 border-t border-white/10 bg-[#08090d]">
        {currentUser ? (
          <div className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-[#12141a]">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#2b0c15] border border-[#c5a880]/40 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#faedd0] truncate block">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#8e887e] truncate block font-mono">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#8e887e] hover:text-red-400 hover:bg-red-950/40 transition-colors shrink-0"
              title="Sign Out / Switch Counsel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-2 px-3 rounded-xl border border-[#c5a880]/40 bg-[#161820] hover:bg-[#20222e] text-[#c5a880] text-xs font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In / Register Counsel</span>
          </button>
        )}

        {/* LocalDB Partition Status & Backup */}
        <div className="mt-2.5 p-2 rounded-lg border border-white/10 bg-[#101218] space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center space-x-1.5 text-[#a8a297] font-mono">
              <Database className="w-3 h-3 text-[#d4af37]" />
              <span>LocalDB Partition:</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-medium flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Encrypted & Active</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px] text-[#787268]">
            <span>{chats.length} {chats.length === 1 ? 'Docket' : 'Dockets'} Stored Locally</span>
            <button
              onClick={handleExportLocalDB}
              disabled={isExporting}
              className="flex items-center space-x-1 text-[#c5a880] hover:text-[#faedd0] hover:underline font-mono transition-colors active:scale-95"
              title="Export Full User Local Database as JSON Backup"
            >
              <Download className="w-2.5 h-2.5" />
              <span>{isExporting ? 'Exporting...' : 'Export Backup'}</span>
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[9px] text-[#635f56] px-1 font-mono">
          <span className="flex items-center space-x-1">
            <Shield className="w-2.5 h-2.5 text-emerald-400" />
            <span>Isolated User Storage</span>
          </span>
          <span>Lexora v3.8</span>
        </div>
      </div>
    </aside>
  </>
  );
};
