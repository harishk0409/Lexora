import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateLegalResearch, searchCorpus } from './server/rag/ragEngine.js';
import { learningStore } from './server/rag/learningStore.js';
import { LEGAL_CORPUS } from './server/corpus/legalCorpus.js';
import { userStore } from './server/auth/userStore.js';

dotenv.config();

userStore.init();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // RAG API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Lexora RAG Backend',
      corpusSize: LEGAL_CORPUS.length,
      selfLearningActive: true
    });
  });

  // Query RAG pipeline
  app.post('/api/rag/query', async (req, res) => {
    try {
      const { query, domain } = req.body;
      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const result = await generateLegalResearch(query.trim(), domain);
      res.json(result);
    } catch (err: any) {
      console.error('RAG query processing failed:', err);
      res.status(500).json({
        error: 'Failed to process legal research query',
        details: err?.message || String(err)
      });
    }
  });

  // Self-learning feedback loop
  app.post('/api/rag/feedback', (req, res) => {
    try {
      const { query, chunkId, vote, reason } = req.body;
      if (!chunkId || (vote !== 'up' && vote !== 'down')) {
        return res.status(400).json({ error: 'Valid chunkId and vote ("up"|"down") required' });
      }

      const outcome = learningStore.applyFeedback({
        query: query || '',
        chunkId,
        vote,
        reason,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: `Self-learning model updated: weight for ${chunkId} adjusted to ${outcome.newWeight}`,
        ...outcome
      });
    } catch (err: any) {
      console.error('Feedback processing error:', err);
      res.status(500).json({ error: 'Failed to record learning feedback' });
    }
  });

  // Self-learning telemetry and corpus stats
  app.get('/api/rag/stats', (req, res) => {
    try {
      const state = learningStore.getState();
      const topWeighted = Object.entries(state.sectionWeights)
        .map(([chunkId, weight]) => {
          const chunk = LEGAL_CORPUS.find(c => c.id === chunkId);
          return {
            chunkId,
            weight,
            title: chunk ? `${chunk.sectionOrArticle}: ${chunk.title}` : chunkId
          };
        })
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 8);

      res.json({
        version: state.version,
        totalQueriesProcessed: state.totalQueriesProcessed,
        learningCyclesRun: state.learningCyclesRun,
        weightAdaptationsCount: state.weightAdaptationsCount,
        corpusCount: LEGAL_CORPUS.length,
        minedEdgesCount: state.minedEdges.length,
        exemplarsCount: state.exemplars.length,
        topWeightedSections: topWeighted
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve telemetry stats' });
    }
  });

  // Browse authoritative legal corpus chunks
  app.get('/api/rag/corpus', (req, res) => {
    try {
      const search = (req.query.search as string) || '';
      const domain = req.query.domain as string;

      if (!search && !domain) {
        return res.json({
          total: LEGAL_CORPUS.length,
          chunks: LEGAL_CORPUS.map(c => ({
            id: c.id,
            sourceDoc: c.sourceDoc,
            domain: c.domain,
            sectionOrArticle: c.sectionOrArticle,
            title: c.title,
            keyTerms: c.keyTerms,
            crossReferences: c.crossReferences,
            currentWeight: learningStore.getSectionWeight(c.id, c.importanceWeight)
          }))
        });
      }

      const results = searchCorpus(search || '', domain, 15);
      res.json({
        total: results.length,
        chunks: results.map(r => ({
          ...r.chunk,
          relevanceScore: r.score,
          learnedMultiplier: r.learnedMultiplier,
          matchedKeywords: r.matchedKeywords
        }))
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to query corpus' });
    }
  });

  // ==========================================
  // AUTHENTICATION & MULTI-USER CHAT ROUTES
  // ==========================================

  const getAuthUser = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    return userStore.getUserByToken(token);
  };

  // Register new counsel user
  app.post('/api/auth/register', (req, res) => {
    try {
      const { username, password, name, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      const result = userStore.register(username, password, name, role);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Registration failed' });
    }
  });

  // Login existing counsel user
  app.post('/api/auth/login', (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      const result = userStore.login(username, password);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(401).json({ error: err?.message || 'Login failed' });
    }
  });

  // Get current counsel profile
  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    res.json({ user });
  });

  // Logout counsel
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      userStore.logout(token);
    }
    res.json({ success: true });
  });

  // List all chat dockets for authenticated user
  app.get('/api/chats', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in to view chat history.' });
    }
    const chats = userStore.getChats(user.id);
    res.json({ chats });
  });

  // Create new chat docket
  app.post('/api/chats', async (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in to create a docket.' });
    }

    try {
      const { title, initialQuery, domain } = req.body;
      let initialTurn = undefined;

      if (initialQuery && typeof initialQuery === 'string' && initialQuery.trim()) {
        const research = await generateLegalResearch(initialQuery.trim(), domain);
        initialTurn = {
          id: `turn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          question: initialQuery.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
          domain: research.domain || domain || 'Criminal',
          research,
          feedback: null
        };
      }

      const chat = userStore.createChat(user.id, title, initialTurn);
      res.json({ chat });
    } catch (err: any) {
      console.error('Failed to create chat:', err);
      res.status(500).json({ error: 'Failed to create chat docket', details: err?.message || String(err) });
    }
  });

  // Get specific chat docket
  app.get('/api/chats/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const chat = userStore.getChatById(user.id, req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat docket not found.' });
    }
    res.json({ chat });
  });

  // Ask multiple questions in 1 chat (append turn)
  app.post('/api/chats/:id/turns', async (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    try {
      const { question, domain } = req.body;
      if (!question || typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({ error: 'Question text is required.' });
      }

      const chat = userStore.getChatById(user.id, req.params.id);
      if (!chat) {
        return res.status(404).json({ error: 'Chat docket not found.' });
      }

      // Generate RAG response for this question (optionally including context from prior questions)
      const contextualQuery = chat.turns.length > 0 
        ? `${question.trim()} (Context from prior query: ${chat.turns[chat.turns.length - 1].question})`
        : question.trim();

      const research = await generateLegalResearch(question.trim(), domain || (chat.turns[0]?.domain));

      const newTurn = {
        id: `turn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        question: question.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
        domain: research.domain || domain || 'Criminal',
        research,
        feedback: null
      };

      const updatedChat = userStore.addTurn(user.id, req.params.id, newTurn);
      res.json({ chat: updatedChat, newTurn });
    } catch (err: any) {
      console.error('Failed to add turn to chat:', err);
      res.status(500).json({ error: 'Failed to process inquiry', details: err?.message || String(err) });
    }
  });

  // Rename chat docket
  app.patch('/api/chats/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty.' });
    }
    try {
      const updatedChat = userStore.updateChatTitle(user.id, req.params.id, title);
      res.json({ chat: updatedChat });
    } catch (err: any) {
      res.status(404).json({ error: err?.message || 'Failed to update title' });
    }
  });

  // Delete chat docket
  app.delete('/api/chats/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const success = userStore.deleteChat(user.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Chat docket not found.' });
    }
    res.json({ success: true, message: 'Chat docket deleted.' });
  });

  // Update turn feedback in chat
  app.post('/api/chats/:id/turns/:turnId/feedback', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const { vote } = req.body;
    if (vote !== 'up' && vote !== 'down') {
      return res.status(400).json({ error: 'Vote must be up or down.' });
    }
    userStore.updateTurnFeedback(user.id, req.params.id, req.params.turnId, vote);
    res.json({ success: true });
  });

  // ==========================================
  // VITE MIDDLEWARE / PRODUCTION STATIC FALLBACK
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lexora Legal AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
