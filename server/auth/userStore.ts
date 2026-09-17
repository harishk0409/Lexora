import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { LegalResearchResponse, LegalDomain } from '../../src/types.js';

export interface StoredUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface ChatTurn {
  id: string;
  question: string;
  timestamp: string;
  domain: LegalDomain;
  research: LegalResearchResponse;
  feedback?: 'up' | 'down' | null;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  turns: ChatTurn[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CHATS_DIR = path.join(DATA_DIR, 'chats');

// In-memory active tokens mapping: token -> userId
const tokenToUserId = new Map<string, string>();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function ensureStorageDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHATS_DIR)) {
    fs.mkdirSync(CHATS_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    // Seed default counsel demo user
    const salt = crypto.randomBytes(16).toString('hex');
    const demoUser: StoredUser = {
      id: 'usr_demo_counsel',
      username: 'counsel_sharma',
      passwordHash: hashPassword('lexora123', salt),
      salt,
      name: 'Adv. R. Sharma (Supreme Court of India)',
      role: 'Senior Advocate',
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify([demoUser], null, 2), 'utf-8');
  }
}

function readUsers(): StoredUser[] {
  ensureStorageDirs();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  ensureStorageDirs();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function getUserChatsFilePath(userId: string): string {
  // sanitize userId to avoid path traversal
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(CHATS_DIR, `${safeId}_chats.json`);
}

function readUserChats(userId: string): ChatSession[] {
  ensureStorageDirs();
  const filePath = getUserChatsFilePath(userId);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeUserChats(userId: string, chats: ChatSession[]) {
  ensureStorageDirs();
  const filePath = getUserChatsFilePath(userId);
  fs.writeFileSync(filePath, JSON.stringify(chats, null, 2), 'utf-8');
}

export const userStore = {
  init() {
    ensureStorageDirs();
  },

  register(username: string, password: string, name?: string, role?: string) {
    ensureStorageDirs();
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters');
    }

    const users = readUsers();
    if (users.some(u => u.username === cleanUsername)) {
      throw new Error('A counsel account with this username already exists.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      username: cleanUsername,
      passwordHash: hashPassword(password, salt),
      salt,
      name: name?.trim() || `Adv. ${cleanUsername}`,
      role: role?.trim() || 'Counsel at Law',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    const token = crypto.randomBytes(32).toString('hex');
    tokenToUserId.set(token, newUser.id);

    return {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    };
  },

  login(username: string, password: string) {
    ensureStorageDirs();
    const cleanUsername = username.trim().toLowerCase();
    const users = readUsers();
    const user = users.find(u => u.username === cleanUsername);

    if (!user) {
      throw new Error('Invalid username or password.');
    }

    const computed = hashPassword(password, user.salt);
    if (computed !== user.passwordHash) {
      throw new Error('Invalid username or password.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    tokenToUserId.set(token, user.id);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    };
  },

  getUserByToken(token: string) {
    if (!token) return null;
    const userId = tokenToUserId.get(token);
    if (!userId) return null;

    const users = readUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    };
  },

  logout(token: string) {
    if (token) {
      tokenToUserId.delete(token);
    }
  },

  // ================= Chat Session Methods =================

  getChats(userId: string): ChatSession[] {
    const chats = readUserChats(userId);
    // Sort descending by updatedAt
    return chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getChatById(userId: string, chatId: string): ChatSession | null {
    const chats = readUserChats(userId);
    return chats.find(c => c.id === chatId) || null;
  },

  createChat(userId: string, title?: string, initialTurn?: ChatTurn): ChatSession {
    const chats = readUserChats(userId);
    const now = new Date().toISOString();
    const cleanTitle = title?.trim() || initialTurn?.question.slice(0, 45) || 'New Legal Docket';

    const newChat: ChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      title: cleanTitle,
      createdAt: now,
      updatedAt: now,
      turns: initialTurn ? [initialTurn] : []
    };

    chats.unshift(newChat);
    writeUserChats(userId, chats);
    return newChat;
  },

  addTurn(userId: string, chatId: string, turn: ChatTurn): ChatSession {
    const chats = readUserChats(userId);
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      throw new Error('Chat docket not found');
    }

    chat.turns.push(turn);
    chat.updatedAt = new Date().toISOString();

    // Auto-update title if it was placeholder
    if (chat.title === 'New Legal Docket' || !chat.title) {
      chat.title = turn.question.slice(0, 45) + (turn.question.length > 45 ? '...' : '');
    }

    writeUserChats(userId, chats);
    return chat;
  },

  deleteChat(userId: string, chatId: string): boolean {
    const chats = readUserChats(userId);
    const filtered = chats.filter(c => c.id !== chatId);
    if (filtered.length === chats.length) {
      return false;
    }
    writeUserChats(userId, filtered);
    return true;
  },

  updateChatTitle(userId: string, chatId: string, newTitle: string): ChatSession {
    const chats = readUserChats(userId);
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      throw new Error('Chat docket not found');
    }
    chat.title = newTitle.trim() || chat.title;
    chat.updatedAt = new Date().toISOString();
    writeUserChats(userId, chats);
    return chat;
  },

  updateTurnFeedback(userId: string, chatId: string, turnId: string, vote: 'up' | 'down') {
    const chats = readUserChats(userId);
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const turn = chat.turns.find(t => t.id === turnId);
      if (turn) {
        turn.feedback = vote;
        writeUserChats(userId, chats);
      }
    }
  }
};
