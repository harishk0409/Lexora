export type LegalDomain = 
  | 'Constitution' 
  | 'Criminal' 
  | 'Contract' 
  | 'Property' 
  | 'Torts' 
  | 'Corporate' 
  | 'Case Law';

export interface EvidenceSource {
  id: string;
  title: string;
  authority: string;
  sectionOrCitation: string;
  relevance: number; // 0 - 100
  year: number;
  type: 'statute' | 'case' | 'treatise' | 'constitutional';
  page?: number | string;
  summary: string;
  fullPassage: string;
  highlightedQuote: string;
  keyPrinciples: string[];
  jurisdiction: string;
  tags: string[];
}

export interface StatutoryProvision {
  code: string;
  title: string;
  act: string;
  analysis: string;
}

export interface JudicialReasoningStep {
  stepNumber: string; // Roman numerals e.g. "I", "II"
  doctrine: string;
  explanation: string;
  citationKey: string;
  statutoryAnchor?: string;
}

export interface ComparativePrecedent {
  caseName: string;
  citation: string;
  year: number;
  court: string;
  ratioDecidendi: string;
  distinctionOrHolding: string;
  relevanceScore: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'query' | 'concept' | 'section' | 'act' | 'case' | 'judgment';
  domain: LegalDomain;
  description: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export interface LegalResearchResponse {
  id: string;
  query: string;
  domain: LegalDomain;
  jurisdiction: string;
  timestamp: string;
  dossierId: string;
  holdingSummary: string;
  statutoryFramework: {
    title: string;
    provisions: StatutoryProvision[];
  };
  judicialReasoning: JudicialReasoningStep[];
  comparativePrecedents: ComparativePrecedent[];
  proceduralGuidance: string[];
  keyTerminology: {
    term: string;
    translationOrMeaning: string;
    significance: string;
  }[];
  evidenceSources: EvidenceSource[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  selfLearningTelemetry?: {
    retrievalScore: number;
    chunksEvaluated: number;
    adaptationCount: number;
    activeWeights: Record<string, number>;
    minedEdgesCount: number;
    exemplarBoostApplied: boolean;
    retrievedChunkTitles: string[];
  };
}

export interface RagFeedbackPayload {
  query: string;
  chunkId: string;
  vote: 'up' | 'down';
  reason?: string;
}

export interface RagTelemetryStats {
  version: string;
  totalQueriesProcessed: number;
  learningCyclesRun: number;
  weightAdaptationsCount: number;
  corpusCount: number;
  minedEdgesCount: number;
  exemplarsCount: number;
  topWeightedSections: { chunkId: string; weight: number; title: string }[];
}

export type ResearchStage = 'idle' | 'exploring' | 'connecting' | 'assembling' | 'forming' | 'completed';

export interface UserProfile {
  id: string;
  username: string;
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
