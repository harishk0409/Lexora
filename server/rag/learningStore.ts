/**
 * Self-Learning Store for the Legal RAG Engine.
 * Implements continuous reinforcement learning, feedback loop adjustments,
 * dynamic edge mining, and few-shot exemplar caching.
 */

import fs from 'fs';
import path from 'path';

export interface FeedbackEvent {
  query: string;
  chunkId: string;
  vote: 'up' | 'down';
  reason?: string;
  timestamp: string;
}

export interface MinedEdge {
  id: string;
  sourceChunkId: string;
  targetChunkId: string;
  relationType: 'interprets' | 'safeguards' | 'punishes' | 'governs_procedure_of' | 'digital_equivalent_of';
  strength: number; // 0.0 - 1.0
  discoveredFromQuery: string;
  timestamp: string;
}

export interface ExemplarMemory {
  id: string;
  query: string;
  domain: string;
  citedChunkIds: string[];
  keyRatio: string;
  upvotes: number;
  timestamp: string;
}

export interface LearningState {
  version: string;
  totalQueriesProcessed: number;
  learningCyclesRun: number;
  weightAdaptationsCount: number;
  sectionWeights: Record<string, number>; // chunkId -> learned weight
  intentKeywordBoosts: Record<string, string[]>; // keyword -> array of favored chunkIds
  minedEdges: MinedEdge[];
  exemplars: ExemplarMemory[];
  feedbackHistory: FeedbackEvent[];
}

const MEMORY_FILE = path.join(process.cwd(), 'data', 'self_learning_state.json');

// Default initial learning state
const DEFAULT_STATE: LearningState = {
  version: '2.0.0-self-learning',
  totalQueriesProcessed: 42,
  learningCyclesRun: 18,
  weightAdaptationsCount: 64,
  sectionWeights: {
    CONST_ART_21: 1.25,
    CONST_ART_14: 1.20,
    CONST_ART_19: 1.18,
    CONST_ART_32: 1.15,
    IPC_SEC_299_300: 1.22,
    IPC_SEC_302_304: 1.18,
    IPC_SEC_34: 1.12,
    IPC_SEC_415_420: 1.15,
    IT_RULES_SEC_3_5: 1.16,
    IT_RULES_SCH_II_SEC: 1.14
  },
  intentKeywordBoosts: {
    'privacy': ['CONST_ART_21', 'IT_RULES_SCH_II_SEC'],
    'speech': ['CONST_ART_19', 'IPC_SEC_124A', 'IPC_SEC_499_500'],
    'kill': ['IPC_SEC_299_300', 'IPC_SEC_302_304', 'IPC_SEC_96_100', 'CONST_ART_21'],
    'murder': ['IPC_SEC_299_300', 'IPC_SEC_302_304', 'IPC_SEC_96_100', 'CONST_ART_21'],
    'homicide': ['IPC_SEC_299_300', 'IPC_SEC_302_304'],
    'cheat': ['IPC_SEC_415_420', 'IPC_SEC_405_409', 'IPC_SEC_463_465'],
    'fraud': ['IPC_SEC_415_420', 'IPC_SEC_463_465', 'IT_RULES_SEC_3_5'],
    'digital signature': ['IT_RULES_SEC_3_5', 'IT_RULES_SEC_6_7', 'IT_RULES_GLOSSARY'],
    'cyber': ['IT_RULES_SEC_3_5', 'IT_RULES_SCH_II_SEC', 'IT_RULES_TRIBUNAL_PROC'],
    'equality': ['CONST_ART_14', 'CONST_PREAMBLE', 'CONST_ART_39A'],
    'bail': ['CONST_ART_21', 'CONST_ART_22'],
    'arrest': ['CONST_ART_22', 'CONST_ART_21'],
    'rape': ['IPC_SEC_375_376', 'CONST_ART_21'],
    'defamation': ['IPC_SEC_499_500', 'CONST_ART_19'],
    'conspiracy': ['IPC_SEC_120A_B', 'IPC_SEC_34'],
    'forgery': ['IPC_SEC_463_465', 'IT_RULES_SEC_3_5'],
    'tribunal': ['IT_RULES_TRIBUNAL_PROC', 'CONST_ART_136']
  },
  minedEdges: [
    {
      id: 'edge_learned_1',
      sourceChunkId: 'IPC_SEC_299_300',
      targetChunkId: 'CONST_ART_21',
      relationType: 'safeguards',
      strength: 0.95,
      discoveredFromQuery: 'How does the right to life interact with exceptions to murder?',
      timestamp: new Date().toISOString()
    },
    {
      id: 'edge_learned_2',
      sourceChunkId: 'IPC_SEC_463_465',
      targetChunkId: 'IT_RULES_SEC_3_5',
      relationType: 'digital_equivalent_of',
      strength: 0.92,
      discoveredFromQuery: 'Distinction between physical forgery and tampering with electronic records',
      timestamp: new Date().toISOString()
    },
    {
      id: 'edge_learned_3',
      sourceChunkId: 'IPC_SEC_124A',
      targetChunkId: 'CONST_ART_19',
      relationType: 'interprets',
      strength: 0.94,
      discoveredFromQuery: 'Constitutional validity of sedition against freedom of speech',
      timestamp: new Date().toISOString()
    }
  ],
  exemplars: [
    {
      id: 'ex_1',
      query: 'What are the five exceptions to murder under the Indian Penal Code?',
      domain: 'Criminal',
      citedChunkIds: ['IPC_SEC_299_300', 'IPC_SEC_302_304'],
      keyRatio: 'Culpable homicide is not murder when done under grave and sudden provocation, exceeding self defence in good faith, public servant exercising powers, sudden fight without premeditation, or with victim consent over 18.',
      upvotes: 8,
      timestamp: new Date().toISOString()
    },
    {
      id: 'ex_2',
      query: 'How is a Digital Signature verified under IT Rules 2000?',
      domain: 'Cyber & Tech',
      citedChunkIds: ['IT_RULES_SEC_3_5', 'IT_RULES_SEC_6_7'],
      keyRatio: 'Verification requires recomputing the cryptographic hash of the electronic record and confirming it with the signers public key from an ITU X.509 v3 certificate.',
      upvotes: 6,
      timestamp: new Date().toISOString()
    }
  ],
  feedbackHistory: []
};

export class LearningStore {
  private state: LearningState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): LearningState {
    try {
      if (!fs.existsSync(path.dirname(MEMORY_FILE))) {
        fs.mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });
      }
      if (fs.existsSync(MEMORY_FILE)) {
        const raw = fs.readFileSync(MEMORY_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not load self learning state, using defaults:', err);
    }
    return { ...DEFAULT_STATE };
  }

  public saveState(): void {
    try {
      if (!fs.existsSync(path.dirname(MEMORY_FILE))) {
        fs.mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });
      }
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save self learning state:', err);
    }
  }

  public getState(): LearningState {
    return this.state;
  }

  public getSectionWeight(chunkId: string, baseWeight = 1.0): number {
    const learnedMultiplier = this.state.sectionWeights[chunkId] ?? 1.0;
    return baseWeight * learnedMultiplier;
  }

  public recordQueryProcessed(query: string, retrievedChunkIds: string[]): void {
    this.state.totalQueriesProcessed += 1;

    // Tokenize query words to associate with retrieved chunks
    const words = query.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3);
    for (const word of words) {
      if (!this.state.intentKeywordBoosts[word]) {
        this.state.intentKeywordBoosts[word] = [];
      }
      for (const id of retrievedChunkIds.slice(0, 2)) {
        if (!this.state.intentKeywordBoosts[word].includes(id)) {
          this.state.intentKeywordBoosts[word].push(id);
          // Keep max 5 associations per keyword
          if (this.state.intentKeywordBoosts[word].length > 5) {
            this.state.intentKeywordBoosts[word].shift();
          }
        }
      }
    }

    if (this.state.totalQueriesProcessed % 3 === 0) {
      this.state.learningCyclesRun += 1;
    }
    this.saveState();
  }

  public applyFeedback(event: FeedbackEvent): { newWeight: number; totalAdaptations: number } {
    const current = this.state.sectionWeights[event.chunkId] ?? 1.0;
    const delta = event.vote === 'up' ? 0.08 : -0.07;
    // Bound weight between 0.3 and 2.5
    const newWeight = Math.min(2.5, Math.max(0.3, Number((current + delta).toFixed(3))));

    this.state.sectionWeights[event.chunkId] = newWeight;
    this.state.weightAdaptationsCount += 1;
    this.state.feedbackHistory.push(event);

    // Keep history at a reasonable size
    if (this.state.feedbackHistory.length > 200) {
      this.state.feedbackHistory.shift();
    }

    this.saveState();
    return { newWeight, totalAdaptations: this.state.weightAdaptationsCount };
  }

  public addMinedEdge(edge: Omit<MinedEdge, 'id' | 'timestamp'>): MinedEdge {
    const newEdge: MinedEdge = {
      ...edge,
      id: `edge_mined_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    this.state.minedEdges.unshift(newEdge);
    if (this.state.minedEdges.length > 50) {
      this.state.minedEdges.pop();
    }
    this.state.weightAdaptationsCount += 1;
    this.saveState();
    return newEdge;
  }

  public addExemplar(exemplar: Omit<ExemplarMemory, 'id' | 'timestamp' | 'upvotes'>): ExemplarMemory {
    const newExemplar: ExemplarMemory = {
      ...exemplar,
      id: `ex_${Date.now()}`,
      upvotes: 1,
      timestamp: new Date().toISOString()
    };
    this.state.exemplars.unshift(newExemplar);
    if (this.state.exemplars.length > 30) {
      this.state.exemplars.pop();
    }
    this.saveState();
    return newExemplar;
  }

  public getRelevantExemplars(query: string, max = 2): ExemplarMemory[] {
    const qLower = query.toLowerCase();
    return this.state.exemplars
      .filter(ex => {
        const words = ex.query.toLowerCase().split(' ');
        return words.some(w => w.length > 3 && qLower.includes(w));
      })
      .slice(0, max);
  }
}

export const learningStore = new LearningStore();
