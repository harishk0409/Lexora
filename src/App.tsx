import React, { useState, useEffect, useCallback } from 'react';
import { LivingWallpaper } from './components/LivingWallpaper';
import { LandingView } from './components/LandingView';
import { ThinkingSequence } from './components/ThinkingSequence';
import { ResearchWorkspace } from './components/ResearchWorkspace';
import { DocumentDrawer } from './components/DocumentDrawer';
import { KnowledgeGraphModal } from './components/KnowledgeGraphModal';
import { SelfLearningModal } from './components/SelfLearningModal';
import { AuthModal } from './components/AuthModal';
import { HistorySidebar } from './components/HistorySidebar';
import { LegalResearchResponse, EvidenceSource, LegalDomain, ResearchStage, UserProfile, ChatSession, ChatTurn } from './types';
import { PRESET_RESEARCH_DOSSIERS, generateMockResearch } from './data/mockLegalArchive';
import { sound } from './utils/audio';
import { authClient } from './services/authClient';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'thinking' | 'research'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [thinkingStage, setThinkingStage] = useState<ResearchStage>('idle');
  const [currentResearch, setCurrentResearch] = useState<LegalResearchResponse>(
    PRESET_RESEARCH_DOSSIERS['contract-section-10']
  );
  const [selectedSource, setSelectedSource] = useState<EvidenceSource | null>(null);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isSelfLearningOpen, setIsSelfLearningOpen] = useState(false);
  
  // Auth & Isolated Multi-User Chat State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  const [historyList, setHistoryList] = useState<string[]>([
    'What are the five exceptions to murder under IPC Section 300?',
    'How does Article 21 protect life and personal liberty against arbitrary state action?',
    'How are Digital Signatures verified under IT Rules 2000?'
  ]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [activeDomain, setActiveDomain] = useState<LegalDomain>('Criminal');

  // Load user profile and their isolated chat sessions on initial mount
  useEffect(() => {
    const initializeAuthAndChats = async () => {
      try {
        const user = await authClient.getMe();
        if (user) {
          setCurrentUser(user);
          const userChats = await authClient.getChats();
          setChats(userChats);
        } else {
          // If not logged in yet, try default demo counsel login for instant seamless first impression
          try {
            const demo = await authClient.login('counsel_sharma', 'lexora123');
            setCurrentUser(demo.user);
            const demoChats = await authClient.getChats();
            setChats(demoChats);
          } catch {
            // Guest mode
          }
        }
      } catch (err) {
        console.warn('Initial session check failed:', err);
      }
    };
    initializeAuthAndChats();
  }, []);

  // Reload user's isolated chats whenever currentUser changes
  const reloadChats = async () => {
    try {
      const userChats = await authClient.getChats();
      setChats(userChats);
    } catch (err) {
      console.error('Failed to reload chats:', err);
    }
  };

  // Audio mute toggle
  const handleToggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) {
      sound.playArchivePulse();
    }
  };

  // Execute inquiry search with real RAG backend + create/update docket in user's isolated store
  const startResearch = async (query: string, domainHint?: LegalDomain) => {
    setSearchQuery(query);
    setViewMode('thinking');
    setThinkingStage('exploring');

    // Add to quick history
    if (!historyList.includes(query)) {
      setHistoryList(prev => [...prev, query]);
    }

    // Thinking sequence steps
    setTimeout(() => {
      setThinkingStage('connecting');
    }, 550);

    setTimeout(() => {
      setThinkingStage('assembling');
    }, 1150);

    setTimeout(() => {
      setThinkingStage('forming');
    }, 1750);

    try {
      // If user is logged in, create persistent chat docket in their isolated store
      let resolvedResearch: LegalResearchResponse | null = null;
      let newDocketSession: ChatSession | null = null;

      if (currentUser) {
        try {
          newDocketSession = await authClient.createChat(query, domainHint || activeDomain);
          if (newDocketSession && newDocketSession.turns.length > 0) {
            resolvedResearch = newDocketSession.turns[0].research;
            setCurrentChat(newDocketSession);
            setActiveTurnIndex(0);
            await reloadChats();
          }
        } catch (chatErr) {
          console.warn('Direct chat creation failed, falling back to query endpoint:', chatErr);
        }
      }

      if (!resolvedResearch) {
        // Query our full-stack RAG model
        const ragRes = await fetch('/api/rag/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, domain: domainHint || activeDomain })
        });
        if (ragRes.ok) {
          resolvedResearch = await ragRes.json();
        }
      }

      // Maintain minimum duration for the cinematic thinking sequence
      await new Promise(resolve => setTimeout(resolve, 1800));

      if (resolvedResearch && resolvedResearch.holdingSummary) {
        setCurrentResearch(resolvedResearch);
        setActiveDomain(resolvedResearch.domain || domainHint || activeDomain);
      } else {
        const fallback = generateMockResearch(query, domainHint || activeDomain);
        setCurrentResearch(fallback);
        setActiveDomain(fallback.domain);
      }
    } catch (err) {
      console.warn('RAG backend call error, falling back to local synthesizer:', err);
      const fallback = generateMockResearch(query, domainHint || activeDomain);
      setCurrentResearch(fallback);
      setActiveDomain(fallback.domain);
    } finally {
      setThinkingStage('completed');
      setViewMode('research');
      sound.playResolveHarmonic();
    }
  };

  // Multi-Question in 1 chat: Ask follow-up question within active docket session
  const handleAskFollowUp = async (followUpQuestion: string) => {
    if (!followUpQuestion.trim()) return;
    setIsFollowUpLoading(true);

    try {
      if (currentChat && currentUser) {
        // Add turn to existing chat in the user's isolated backend
        const result = await authClient.addTurnToChat(currentChat.id, followUpQuestion.trim(), activeDomain);
        setCurrentChat(result.chat);
        setActiveTurnIndex(result.chat.turns.length - 1);
        setCurrentResearch(result.newTurn.research);
        setActiveDomain(result.newTurn.domain || activeDomain);
        await reloadChats();
      } else {
        // If not saved to a chat yet, query RAG endpoint
        const ragRes = await fetch('/api/rag/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: followUpQuestion.trim(), 
            domain: activeDomain 
          })
        });

        let newResearch: LegalResearchResponse;
        if (ragRes.ok) {
          newResearch = await ragRes.json();
        } else {
          newResearch = generateMockResearch(followUpQuestion.trim(), activeDomain);
        }

        setCurrentResearch(newResearch);
      }
      sound.playResolveHarmonic();
    } catch (err) {
      console.error('Failed to process follow-up:', err);
      const fallback = generateMockResearch(followUpQuestion.trim(), activeDomain);
      setCurrentResearch(fallback);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Selecting a past chat docket from history bar
  const handleSelectChat = (chat: ChatSession) => {
    setCurrentChat(chat);
    if (chat.turns.length > 0) {
      const latestTurnIdx = chat.turns.length - 1;
      setActiveTurnIndex(latestTurnIdx);
      setCurrentResearch(chat.turns[latestTurnIdx].research);
      setActiveDomain(chat.turns[latestTurnIdx].domain || 'Criminal');
    }
    setViewMode('research');
    setIsHistorySidebarOpen(false);
    sound.playArchivePulse();
  };

  // Switch between turns within the current docket
  const handleSelectTurn = (turnIndex: number) => {
    if (currentChat && currentChat.turns[turnIndex]) {
      setActiveTurnIndex(turnIndex);
      setCurrentResearch(currentChat.turns[turnIndex].research);
      setActiveDomain(currentChat.turns[turnIndex].domain || activeDomain);
      sound.playArchivePulse();
    }
  };

  // Start fresh new chat docket
  const handleNewChat = () => {
    setCurrentChat(null);
    setActiveTurnIndex(0);
    setViewMode('landing');
    setSearchQuery('');
    setThinkingStage('idle');
    setIsHistorySidebarOpen(false);
    sound.playArchivePulse();
  };

  // Delete chat docket
  const handleDeleteChat = async (chatId: string) => {
    try {
      await authClient.deleteChat(chatId);
      await reloadChats();
      if (currentChat?.id === chatId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await authClient.logout();
    setCurrentUser(null);
    setChats([]);
    setCurrentChat(null);
    setViewMode('landing');
    setIsHistorySidebarOpen(false);
    sound.playArchivePulse();
  };

  // User feedback loop to train the self-learning model
  const handleFeedback = async (chunkId: string, vote: 'up' | 'down') => {
    try {
      const res = await fetch('/api/rag/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          chunkId,
          vote
        })
      });
      const data = await res.json();
      if (data.newWeight && currentResearch?.selfLearningTelemetry) {
        setCurrentResearch(prev => ({
          ...prev,
          selfLearningTelemetry: {
            ...prev.selfLearningTelemetry!,
            adaptationCount: (prev.selfLearningTelemetry?.adaptationCount || 0) + 1,
            activeWeights: {
              ...(prev.selfLearningTelemetry?.activeWeights || {}),
              [chunkId]: data.newWeight
            }
          }
        }));
      }

      // Also record in active turn if part of chat
      if (currentChat && currentUser) {
        const turn = currentChat.turns[activeTurnIndex];
        if (turn) {
          fetch(`/api/chats/${currentChat.id}/turns/${turn.id}/feedback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authClient.getToken()}`
            },
            body: JSON.stringify({ vote })
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Feedback recording failed:', err);
    }
  };

  const handleDomainSelect = (domain: LegalDomain) => {
    setActiveDomain(domain);
    let queryForDomain = `Jurisprudence and leading precedents in ${domain} Law`;
    if (domain === 'Criminal') queryForDomain = 'What are the five exceptions to murder under IPC Section 300?';
    else if (domain === 'Constitution') queryForDomain = 'How does Article 21 protect life and personal liberty against arbitrary state action?';
    else if (domain === 'Contract') queryForDomain = 'Essential elements of a valid contract';
    else if (domain === 'Torts' || domain === 'Case Law') queryForDomain = 'Find cases concerning negligence';

    startResearch(queryForDomain, domain);
  };

  const handleCanvasClick = useCallback(() => {
    sound.playArchivePulse();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0b0e] text-[#f5f2eb] font-['Plus_Jakarta_Sans'] overflow-x-hidden selection:bg-[#42121e] selection:text-[#faedd0]">
      {/* Signature Feature: The Living Interactive Legal Wallpaper */}
      <LivingWallpaper
        stage={thinkingStage}
        searchFocused={isSearchFocused}
        searchQuery={searchQuery}
        activeDomain={activeDomain}
        onCanvasClick={handleCanvasClick}
      />

      {/* 3. Main Views Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {viewMode === 'landing' && (
          <LandingView
            onSearch={(q) => startResearch(q)}
            onSelectPrompt={(q) => startResearch(q)}
            onFocusChange={setIsSearchFocused}
            onQueryChange={setSearchQuery}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
            onOpenGraphDirect={() => setIsGraphOpen(true)}
            onOpenSelfLearning={() => setIsSelfLearningOpen(true)}
            onToggleHistory={() => setIsHistorySidebarOpen(prev => !prev)}
            onNewChat={handleNewChat}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            chatCount={chats.length}
          />
        )}

        {viewMode === 'thinking' && (
          <ThinkingSequence
            stage={thinkingStage}
            query={searchQuery}
            onComplete={() => setViewMode('research')}
          />
        )}

        {viewMode === 'research' && currentResearch && (
          <ResearchWorkspace
            research={currentResearch}
            currentChat={currentChat}
            activeTurnIndex={activeTurnIndex}
            onSelectTurn={handleSelectTurn}
            onAskFollowUp={handleAskFollowUp}
            isFollowUpLoading={isFollowUpLoading}
            onNewChat={handleNewChat}
            onToggleHistory={() => setIsHistorySidebarOpen(prev => !prev)}
            isHistoryOpen={isHistorySidebarOpen}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            chatCount={chats.length}
            onNewSearch={(q) => startResearch(q)}
            onSelectSource={(source) => setSelectedSource(source)}
            onOpenGraph={() => setIsGraphOpen(true)}
            onOpenSelfLearning={() => setIsSelfLearningOpen(true)}
            onFeedback={handleFeedback}
            onBackToLanding={() => {
              setViewMode('landing');
              setThinkingStage('idle');
            }}
            activeDomain={activeDomain}
            onSelectDomain={handleDomainSelect}
            historyList={historyList}
            onSelectHistoryItem={(q) => startResearch(q)}
          />
        )}
      </div>

      {/* 4. History Sidebar Drawer */}
      <HistorySidebar
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
        chats={chats}
        activeChatId={currentChat?.id}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsHistorySidebarOpen(false);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Backdrop for History Sidebar when open */}
      {isHistorySidebarOpen && (
        <div
          onClick={() => setIsHistorySidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs transition-opacity pointer-events-auto"
        />
      )}

      {/* 5. User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          reloadChats();
        }}
      />

      {/* 6. Pull-Out Document Reader Drawer */}
      {selectedSource && (
        <DocumentDrawer
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
          onInspectNode={(label) => {
            setSelectedSource(null);
            setIsGraphOpen(true);
          }}
        />
      )}

      {/* 7. Legal Knowledge Graph Modal */}
      {isGraphOpen && currentResearch && (
        <KnowledgeGraphModal
          nodes={currentResearch.graphNodes}
          edges={currentResearch.graphEdges}
          onClose={() => setIsGraphOpen(false)}
          activeDomain={activeDomain}
        />
      )}

      {/* 8. Self-Learning RAG Intelligence & Ingested Corpus Explorer */}
      <SelfLearningModal
        isOpen={isSelfLearningOpen}
        onClose={() => setIsSelfLearningOpen(false)}
        onSelectQuery={(q) => startResearch(q)}
      />
    </div>
  );
}
