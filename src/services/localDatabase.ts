import { ChatSession, UserProfile, LegalDomain, LegalResearchResponse } from '../types';

/**
 * Lexora Local Database (LocalDB)
 * 
 * Provides robust client-side storage partitioned by unique User ID.
 * Primary engine: Browser IndexedDB (high capacity, async, structured clone).
 * Fallback engine: Namespaced LocalStorage (if IndexedDB is disabled/blocked in sandboxes).
 */

const DB_NAME = 'LexoraUserLocalDB';
const DB_VERSION = 1;

export interface UserSearchRecord {
  id: string;
  userId: string;
  query: string;
  domain: LegalDomain;
  timestamp: string;
}

export interface UserBookmarkRecord {
  id: string;
  userId: string;
  dossierId: string;
  title: string;
  domain: LegalDomain;
  savedAt: string;
}

class LocalDatabaseManager {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private isIndexedDBAvailable: boolean;

  constructor() {
    this.isIndexedDBAvailable = typeof window !== 'undefined' && 'indexedDB' in window;
    if (this.isIndexedDBAvailable) {
      this.initIndexedDB();
    }
  }

  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // 1. Dockets / Chats store
          if (!db.objectStoreNames.contains('dockets')) {
            const docketStore = db.createObjectStore('dockets', { keyPath: 'id' });
            docketStore.createIndex('userId', 'userId', { unique: false });
            docketStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          }

          // 2. Search History store
          if (!db.objectStoreNames.contains('search_history')) {
            const searchStore = db.createObjectStore('search_history', { keyPath: 'id' });
            searchStore.createIndex('userId', 'userId', { unique: false });
            searchStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          // 3. Bookmarks store
          if (!db.objectStoreNames.contains('bookmarks')) {
            const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
            bookmarkStore.createIndex('userId', 'userId', { unique: false });
          }

          // 4. User Profiles store
          if (!db.objectStoreNames.contains('user_profiles')) {
            db.createObjectStore('user_profiles', { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (e) => {
          console.warn('[LocalDB] IndexedDB open error, falling back to LocalStorage:', e);
          resolve(null);
        };
      } catch (err) {
        console.warn('[LocalDB] IndexedDB initialization exception, using LocalStorage fallback:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  // ==========================================================
  // LOCALSTORAGE FALLBACK HELPERS
  // ==========================================================

  private getLsKey(userId: string, collection: string): string {
    return `lexora_localdb_${userId || 'guest'}_${collection}`;
  }

  private getFromLs<T>(userId: string, collection: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.getLsKey(userId, collection));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToLs<T>(userId: string, collection: string, items: T[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.getLsKey(userId, collection), JSON.stringify(items));
    } catch (e) {
      console.warn('[LocalDB] LocalStorage write quota reached:', e);
    }
  }

  // ==========================================================
  // USER PROFILES
  // ==========================================================

  async saveUserProfile(user: UserProfile): Promise<void> {
    const db = await this.initIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction('user_profiles', 'readwrite');
        tx.objectStore('user_profiles').put(user);
        tx.oncomplete = () => resolve();
        tx.onerror = () => {
          this.saveToLs(user.id, 'profile', [user]);
          resolve();
        };
      });
    } else {
      this.saveToLs(user.id, 'profile', [user]);
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const db = await this.initIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction('user_profiles', 'readonly');
        const req = tx.objectStore('user_profiles').get(userId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => {
          const fallback = this.getFromLs<UserProfile>(userId, 'profile');
          resolve(fallback[0] || null);
        };
      });
    } else {
      const fallback = this.getFromLs<UserProfile>(userId, 'profile');
      return fallback[0] || null;
    }
  }

  // ==========================================================
  // DOCKETS & CHAT HISTORY PER USER
  // ==========================================================

  async saveDocket(userId: string, docket: ChatSession): Promise<void> {
    const safeDocket = { ...docket, userId: userId || docket.userId || 'guest' };
    
    // Save to LocalStorage immediately as reliable duplicate
    const currentLs = this.getFromLs<ChatSession>(safeDocket.userId, 'dockets');
    const existingIndex = currentLs.findIndex(c => c.id === safeDocket.id);
    if (existingIndex >= 0) {
      currentLs[existingIndex] = safeDocket;
    } else {
      currentLs.unshift(safeDocket);
    }
    this.saveToLs(safeDocket.userId, 'dockets', currentLs);

    // Save to IndexedDB if available
    const db = await this.initIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction('dockets', 'readwrite');
        tx.objectStore('dockets').put(safeDocket);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }
  }

  async getDockets(userId: string): Promise<ChatSession[]> {
    const effectiveUserId = userId || 'guest';
    const db = await this.initIndexedDB();

    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction('dockets', 'readonly');
        const store = tx.objectStore('dockets');
        const index = store.index('userId');
        const req = index.getAll(effectiveUserId);

        req.onsuccess = () => {
          let list: ChatSession[] = req.result || [];
          if (list.length === 0) {
            // Check fallback
            list = this.getFromLs<ChatSession>(effectiveUserId, 'dockets');
          }
          // Sort newest updated first
          list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
          resolve(list);
        };

        req.onerror = () => {
          const fallback = this.getFromLs<ChatSession>(effectiveUserId, 'dockets');
          resolve(fallback);
        };
      });
    } else {
      const list = this.getFromLs<ChatSession>(effectiveUserId, 'dockets');
      list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      return list;
    }
  }

  async deleteDocket(userId: string, docketId: string): Promise<void> {
    const effectiveUserId = userId || 'guest';
    
    // Remove from LocalStorage
    const current = this.getFromLs<ChatSession>(effectiveUserId, 'dockets');
    const updated = current.filter(c => c.id !== docketId);
    this.saveToLs(effectiveUserId, 'dockets', updated);

    // Remove from IndexedDB
    const db = await this.initIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction('dockets', 'readwrite');
        tx.objectStore('dockets').delete(docketId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }
  }

  // ==========================================================
  // SEARCH QUERY HISTORY PER USER
  // ==========================================================

  async logSearch(userId: string, query: string, domain: LegalDomain): Promise<void> {
    if (!query || !query.trim()) return;
    const effectiveUserId = userId || 'guest';
    const record: UserSearchRecord = {
      id: `srch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: effectiveUserId,
      query: query.trim(),
      domain: domain || 'Criminal',
      timestamp: new Date().toISOString()
    };

    const current = this.getFromLs<UserSearchRecord>(effectiveUserId, 'search_history');
    // Remove duplicate queries, keep newest
    const filtered = current.filter(s => s.query.toLowerCase() !== query.trim().toLowerCase());
    filtered.unshift(record);
    this.saveToLs(effectiveUserId, 'search_history', filtered.slice(0, 30));

    const db = await this.initIndexedDB();
    if (db) {
      const tx = db.transaction('search_history', 'readwrite');
      tx.objectStore('search_history').put(record);
    }
  }

  async getSearchHistory(userId: string): Promise<UserSearchRecord[]> {
    const effectiveUserId = userId || 'guest';
    return this.getFromLs<UserSearchRecord>(effectiveUserId, 'search_history');
  }

  // ==========================================================
  // BOOKMARKS PER USER
  // ==========================================================

  async toggleBookmark(userId: string, dossierId: string, title: string, domain: LegalDomain): Promise<boolean> {
    const effectiveUserId = userId || 'guest';
    const current = this.getFromLs<UserBookmarkRecord>(effectiveUserId, 'bookmarks');
    const exists = current.some(b => b.dossierId === dossierId);

    let updated: UserBookmarkRecord[];
    let isBookmarked: boolean;

    if (exists) {
      updated = current.filter(b => b.dossierId !== dossierId);
      isBookmarked = false;
    } else {
      updated = [{
        id: `bmk_${dossierId}`,
        userId: effectiveUserId,
        dossierId,
        title,
        domain,
        savedAt: new Date().toISOString()
      }, ...current];
      isBookmarked = true;
    }

    this.saveToLs(effectiveUserId, 'bookmarks', updated);

    const db = await this.initIndexedDB();
    if (db) {
      const tx = db.transaction('bookmarks', 'readwrite');
      const store = tx.objectStore('bookmarks');
      if (isBookmarked) {
        store.put(updated[0]);
      } else {
        store.delete(`bmk_${dossierId}`);
      }
    }

    return isBookmarked;
  }

  async getBookmarks(userId: string): Promise<UserBookmarkRecord[]> {
    const effectiveUserId = userId || 'guest';
    return this.getFromLs<UserBookmarkRecord>(effectiveUserId, 'bookmarks');
  }

  async isBookmarked(userId: string, dossierId: string): Promise<boolean> {
    const bookmarks = await this.getBookmarks(userId);
    return bookmarks.some(b => b.dossierId === dossierId);
  }

  // ==========================================================
  // EXPORT & SYNC UTILITIES
  // ==========================================================

  /**
   * Generates a complete JSON backup of all user data stored in the localdb
   */
  async exportUserData(userId: string): Promise<string> {
    const effectiveUserId = userId || 'guest';
    const [dockets, searchHistory, bookmarks, profile] = await Promise.all([
      this.getDockets(effectiveUserId),
      this.getSearchHistory(effectiveUserId),
      this.getBookmarks(effectiveUserId),
      this.getUserProfile(effectiveUserId)
    ]);

    const backup = {
      version: '1.0',
      database: DB_NAME,
      exportedAt: new Date().toISOString(),
      user: profile || { id: effectiveUserId, role: 'Counsel' },
      metrics: {
        totalDockets: dockets.length,
        totalSearches: searchHistory.length,
        totalBookmarks: bookmarks.length
      },
      dockets,
      searchHistory,
      bookmarks
    };

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Syncs and merges dockets received from the remote server into the user's LocalDB
   */
  async syncRemoteDockets(userId: string, remoteDockets: ChatSession[]): Promise<ChatSession[]> {
    const effectiveUserId = userId || 'guest';
    const localDockets = await this.getDockets(effectiveUserId);
    const map = new Map<string, ChatSession>();

    // Put local first
    for (const d of localDockets) {
      map.set(d.id, d);
    }

    // Overwrite or add with remote dockets if newer or present
    for (const r of remoteDockets) {
      const existing = map.get(r.id);
      if (!existing) {
        map.set(r.id, r);
        await this.saveDocket(effectiveUserId, r);
      } else {
        // Compare updatedAt
        const remoteTime = new Date(r.updatedAt || 0).getTime();
        const localTime = new Date(existing.updatedAt || 0).getTime();
        if (remoteTime >= localTime) {
          map.set(r.id, r);
          await this.saveDocket(effectiveUserId, r);
        }
      }
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    return merged;
  }
}

export const localDB = new LocalDatabaseManager();
