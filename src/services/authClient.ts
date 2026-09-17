import { UserProfile, ChatSession, ChatTurn, LegalDomain, LegalResearchResponse } from '../types';
import { localDB } from './localDatabase';

const TOKEN_KEY = 'lexora_auth_token';
const USER_KEY = 'lexora_auth_user';

export const authClient = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setSession(token: string, user: UserProfile) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCachedUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async getMe(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        this.clearSession();
        return null;
      }
      const data = await res.json();
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      return null;
    } catch {
      return this.getCachedUser();
    }
  },

  async register(username: string, password: string, name?: string, role?: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name, role })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    this.setSession(data.token, data.user);
    // Persist user profile to local database partition
    await localDB.saveUserProfile(data.user);
    return data;
  },

  async login(username: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }
    this.setSession(data.token, data.user);
    // Persist user profile to local database partition
    await localDB.saveUserProfile(data.user);
    return data;
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // ignore network error on logout
      }
    }
    this.clearSession();
  },

  // ================= Chats API with LocalDB Sync =================

  async getChats(): Promise<ChatSession[]> {
    const user = this.getCachedUser();
    const userId = user?.id || 'guest';
    const token = this.getToken();

    if (!token) {
      // Offline / guest mode: load strictly from LocalDB partition
      return localDB.getDockets(userId);
    }

    try {
      const res = await fetch('/api/chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        // Fall back to client-side LocalDB if server is unavailable
        return localDB.getDockets(userId);
      }
      const data = await res.json();
      const remoteChats: ChatSession[] = data.chats || [];

      // Sync and merge into user's local database
      return await localDB.syncRemoteDockets(userId, remoteChats);
    } catch {
      // Offline fallback: load from LocalDB
      return localDB.getDockets(userId);
    }
  },

  async createChat(initialQuery?: string, domain?: LegalDomain, title?: string): Promise<ChatSession> {
    const user = this.getCachedUser();
    const userId = user?.id || 'guest';
    const token = this.getToken();

    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ initialQuery, domain, title })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to initialize docket');
    }

    const createdChat: ChatSession = data.chat;
    // Persist directly into local database
    await localDB.saveDocket(userId, createdChat);
    if (initialQuery) {
      await localDB.logSearch(userId, initialQuery, domain || 'Criminal');
    }

    return createdChat;
  },

  async getChat(chatId: string): Promise<ChatSession> {
    const user = this.getCachedUser();
    const userId = user?.id || 'guest';
    const token = this.getToken();

    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Docket not found');
      }
      await localDB.saveDocket(userId, data.chat);
      return data.chat;
    } catch (err) {
      // Fallback: check localdb
      const localDockets = await localDB.getDockets(userId);
      const found = localDockets.find(d => d.id === chatId);
      if (found) return found;
      throw err;
    }
  },

  async addTurnToChat(chatId: string, question: string, domain?: LegalDomain): Promise<{ chat: ChatSession; newTurn: ChatTurn }> {
    const user = this.getCachedUser();
    const userId = user?.id || 'guest';
    const token = this.getToken();

    const res = await fetch(`/api/chats/${chatId}/turns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ question, domain })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to process follow-up inquiry');
    }

    // Persist updated docket and search query to local database
    await localDB.saveDocket(userId, data.chat);
    await localDB.logSearch(userId, question, domain || 'Criminal');

    return data;
  },

  async deleteChat(chatId: string): Promise<boolean> {
    const user = this.getCachedUser();
    const userId = user?.id || 'guest';
    const token = this.getToken();

    // Delete from LocalDB immediately
    await localDB.deleteDocket(userId, chatId);

    if (token) {
      try {
        const res = await fetch(`/api/chats/${chatId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.ok;
      } catch {
        return true;
      }
    }
    return true;
  },

  async renameChat(chatId: string, title: string): Promise<ChatSession> {
    const token = this.getToken();
    const res = await fetch(`/api/chats/${chatId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to rename docket');
    }
    return data.chat;
  }
};
