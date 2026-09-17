import { GoogleGenAI } from '@google/genai';
import { LEGAL_CORPUS, LegalChunk } from '../corpus/legalCorpus.js';
import { learningStore, MinedEdge } from './learningStore.js';
import type { LegalResearchResponse, LegalDomain, EvidenceSource, GraphNode, GraphEdge } from '../../src/types.js';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (geminiClient) return geminiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 0 && apiKey !== 'MY_GEMINI_API_KEY') {
    geminiClient = new GoogleGenAI({ apiKey });
    return geminiClient;
  }
  return null;
}

export interface ScoredChunk {
  chunk: LegalChunk;
  score: number;
  learnedMultiplier: number;
  matchedKeywords: string[];
}

/**
 * Hybrid retrieval: Combines statutory identifier matching, keyword BM25-style overlap,
 * learned intent affinity, and continuous weight adaptation.
 */
export function searchCorpus(query: string, domainFilter?: string, topK = 4): ScoredChunk[] {
  const qLower = query.toLowerCase();
  const qTokens = qLower
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  const learningState = learningStore.getState();
  const scoredList: ScoredChunk[] = [];

  for (const chunk of LEGAL_CORPUS) {
    // If domain filter is specified and not 'All', lightly prefer or filter
    let domainBonus = 0;
    if (domainFilter && domainFilter !== 'All' && chunk.domain.toLowerCase() === domainFilter.toLowerCase()) {
      domainBonus = 0.25;
    }

    let rawScore = 0;
    const matchedKeywords: string[] = [];

    // 1. Exact statutory identifier check (e.g. "302", "300", "21", "498A", "370", "34", "rule 3")
    const secOrArtLower = chunk.sectionOrArticle.toLowerCase();
    for (const token of qTokens) {
      if (secOrArtLower.includes(token)) {
        rawScore += 1.8;
        matchedKeywords.push(token);
      }
    }

    // 2. Keyword & Title overlap
    const titleLower = chunk.title.toLowerCase();
    for (const token of qTokens) {
      if (titleLower.includes(token)) {
        rawScore += 0.8;
        matchedKeywords.push(token);
      }
    }

    // 3. Domain keyTerms matching
    for (const kt of chunk.keyTerms) {
      const ktLower = kt.toLowerCase();
      if (qLower.includes(ktLower)) {
        rawScore += 1.2;
        matchedKeywords.push(kt);
      } else {
        for (const token of qTokens) {
          if (ktLower.includes(token)) {
            rawScore += 0.4;
            matchedKeywords.push(token);
          }
        }
      }
    }

    // 4. Content token frequency
    const contentLower = chunk.content.toLowerCase();
    for (const token of qTokens) {
      if (contentLower.includes(token)) {
        rawScore += 0.2;
      }
    }

    // 5. Self-learning intent mapping bonus
    for (const token of qTokens) {
      const boostedIds = learningState.intentKeywordBoosts[token] || [];
      if (boostedIds.includes(chunk.id)) {
        rawScore += 0.65;
        matchedKeywords.push(`[learned: ${token}]`);
      }
    }

    // 6. Base importance + domain bonus
    rawScore += (chunk.importanceWeight * 0.2) + domainBonus;

    // 7. Apply dynamic learned weight multiplier
    const learnedMultiplier = learningStore.getSectionWeight(chunk.id, 1.0);
    const finalScore = rawScore * learnedMultiplier;

    if (rawScore > 0.35) {
      scoredList.push({
        chunk,
        score: Number(finalScore.toFixed(3)),
        learnedMultiplier,
        matchedKeywords: Array.from(new Set(matchedKeywords))
      });
    }
  }

  // Sort descending by final score
  scoredList.sort((a, b) => b.score - a.score);

  // If no good match, return top importance chunks as fallback
  if (scoredList.length === 0) {
    return LEGAL_CORPUS.slice(0, topK).map(chunk => ({
      chunk,
      score: 1.0,
      learnedMultiplier: learningStore.getSectionWeight(chunk.id, 1.0),
      matchedKeywords: ['default-corpus']
    }));
  }

  return scoredList.slice(0, topK);
}

/**
 * Autonomous Concept-Edge Mining:
 * When a query touches multiple interconnected provisions across different statutes
 * (e.g. IPC vs Constitution vs IT Act), discover and register new relational edges.
 */
function mineRelationalEdges(query: string, chunks: LegalChunk[]): MinedEdge[] {
  const mined: MinedEdge[] = [];
  if (chunks.length < 2) return mined;

  for (let i = 0; i < chunks.length; i++) {
    for (let j = i + 1; j < chunks.length; j++) {
      const c1 = chunks[i];
      const c2 = chunks[j];

      let relation: MinedEdge['relationType'] | null = null;
      if (c1.sourceDoc === 'Constitution of India' && c2.sourceDoc === 'Indian Penal Code') {
        relation = 'safeguards';
      } else if (c1.sourceDoc === 'Indian Penal Code' && c2.sourceDoc === 'Constitution of India') {
        relation = 'interprets';
      } else if (c1.sourceDoc === 'Indian Penal Code' && c2.sourceDoc === 'Information Technology Rules') {
        relation = 'digital_equivalent_of';
      } else if (c1.domain === c2.domain) {
        relation = 'governs_procedure_of';
      }

      if (relation) {
        const edge = learningStore.addMinedEdge({
          sourceChunkId: c1.id,
          targetChunkId: c2.id,
          relationType: relation,
          strength: 0.90,
          discoveredFromQuery: query
        });
        mined.push(edge);
      }
    }
  }
  return mined;
}

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite'
];

async function generateWithModelFallback(
  ai: GoogleGenAI,
  prompt: string
): Promise<{ text: string; modelUsed: string } | null> {
  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: modelName };
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isUnavailableOrRateLimit =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        console.warn(`[Gemini RAG] Model ${modelName} attempt ${attempt} failed:`, errMsg);

        if (isUnavailableOrRateLimit && attempt < 2) {
          // Brief backoff before re-trying or falling back
          await new Promise(res => setTimeout(res, 600 * attempt));
          continue;
        }
        // Move to next candidate model in fallback chain
        break;
      }
    }
  }
  return null;
}

/**
 * Core RAG Generation Pipeline:
 * 1. Retrieve most relevant statutory chunks from the authoritative corpus.
 * 2. Augment prompt with few-shot exemplars and learned weights.
 * 3. Invoke Gemini model with automatic fallback and retry for high demand spikes.
 * 4. Record learning feedback and return full structured response.
 */
export async function generateLegalResearch(query: string, domainFilter?: string): Promise<LegalResearchResponse> {
  const scored = searchCorpus(query, domainFilter, 5);
  const retrievedChunks = scored.map(s => s.chunk);
  const retrievedIds = retrievedChunks.map(c => c.id);

  // Autonomous edge mining
  mineRelationalEdges(query, retrievedChunks);

  // Record query processing in self-learning store
  learningStore.recordQueryProcessed(query, retrievedIds);

  const exemplars = learningStore.getRelevantExemplars(query, 1);
  const ai = getGeminiClient();

  const primaryDomain: LegalDomain = (retrievedChunks[0]?.domain as LegalDomain) || 'Constitution';

  // Construct context string
  const contextString = retrievedChunks
    .map(
      (c, idx) =>
        `[SOURCE ${idx + 1}] Document: ${c.sourceDoc} | Section/Article: ${c.sectionOrArticle} | Title: ${c.title}\nText: ${c.content}\nCross-References: ${c.crossReferences.join(', ')}`
    )
    .join('\n\n');

  let exemplarPrompt = '';
  if (exemplars.length > 0) {
    exemplarPrompt = `\n[VERIFIED PREVIOUS EXEMPLAR]:\nQuery: "${exemplars[0].query}"\nKey Ratio: ${exemplars[0].keyRatio}\n`;
  }

  if (ai) {
    try {
      const prompt = `You are Lexora, an advanced Legal Jurisprudence Intelligence and Research Terminal.
Analyze the following legal research query using ONLY the authoritative statutory provisions provided in the context below.

QUERY: "${query}"

CONTEXT PROVISIONS:
${contextString}
${exemplarPrompt}

INSTRUCTIONS:
Produce a comprehensive legal analysis formatted as a STRICT JSON OBJECT conforming to the following TypeScript interface:
{
  "holdingSummary": "Clear, authoritative 2-3 sentence legal holding answering the user query directly.",
  "statutoryFramework": {
    "title": "Primary Statutory Framework Header",
    "provisions": [
      {
        "code": "e.g. IPC Section 300 or Constitution Article 21",
        "title": "Provision Title",
        "act": "Indian Penal Code, 1860 or Constitution of India",
        "analysis": "Specific doctrinal application to the query"
      }
    ]
  },
  "judicialReasoning": [
    {
      "stepNumber": "I",
      "doctrine": "Doctrinal Name (e.g. Mens Rea / Due Process / Reasonable Classification)",
      "explanation": "Deep legal reasoning",
      "citationKey": "Citation key"
    }
  ],
  "comparativePrecedents": [
    {
      "caseName": "Key Leading Landmark Case Name",
      "citation": "AIR / SCC Citation",
      "year": 1978,
      "court": "Supreme Court of India",
      "ratioDecidendi": "Core holding of the bench",
      "distinctionOrHolding": "Application to present issue",
      "relevanceScore": 95
    }
  ],
  "proceduralGuidance": [
    "Step 1 procedural advice",
    "Step 2 evidentiary requirement",
    "Step 3 jurisdictional route"
  ],
  "keyTerminology": [
    {
      "term": "Latin or technical term",
      "translationOrMeaning": "Definition",
      "significance": "Relevance to case"
    }
  ],
  "evidenceSources": [
    {
      "id": "src_1",
      "title": "Title of provision",
      "authority": "Legislative / Constitutional",
      "sectionOrCitation": "Art. 21 / Sec. 302",
      "relevance": 96,
      "year": 1950,
      "type": "constitutional",
      "summary": "Summary of excerpt",
      "fullPassage": "Full text passage",
      "highlightedQuote": "Crucial sentence",
      "keyPrinciples": ["Principle 1", "Principle 2"],
      "jurisdiction": "Republic of India",
      "tags": ["Tag1", "Tag2"]
    }
  ]
}

Return ONLY the raw JSON object, without markdown code fences or conversational prose.`;

      const genResult = await generateWithModelFallback(ai, prompt);

      if (genResult && genResult.text) {
        let cleanJson = genResult.text.trim();
        if (cleanJson.startsWith('```json')) {
          cleanJson = cleanJson.slice(7);
        } else if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.slice(3);
        }
        if (cleanJson.endsWith('```')) {
          cleanJson = cleanJson.slice(0, -3);
        }
        cleanJson = cleanJson.trim();

        const parsed = JSON.parse(cleanJson);
        const dossierNum = Math.floor(1000 + Math.random() * 9000);

        // Build graph nodes from retrieved chunks
        const graphNodes: GraphNode[] = [
          {
            id: 'query_root',
            label: query.slice(0, 32) + (query.length > 32 ? '...' : ''),
            type: 'query',
            domain: primaryDomain,
            description: query
          },
          ...retrievedChunks.map(c => ({
            id: c.id,
            label: c.sectionOrArticle,
            type: (c.sourceDoc === 'Constitution of India' ? 'act' : 'section') as GraphNode['type'],
            domain: (c.domain as LegalDomain) || primaryDomain,
            description: c.title
          }))
        ];

        const graphEdges: GraphEdge[] = retrievedChunks.map(c => ({
          source: 'query_root',
          target: c.id,
          relationship: 'retrieved_authority'
        }));

        // Cross-reference edges
        for (let i = 0; i < retrievedChunks.length; i++) {
          for (const ref of retrievedChunks[i].crossReferences) {
            if (retrievedChunks.some(rc => rc.id === ref)) {
              graphEdges.push({
                source: retrievedChunks[i].id,
                target: ref,
                relationship: 'cross_cites'
              });
            }
          }
        }

        return {
          id: `lex_${Date.now()}`,
          query,
          domain: primaryDomain,
          jurisdiction: 'Supreme Court of India / High Courts of States',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
          dossierId: `DOSSIER #${dossierNum}-${primaryDomain.slice(0, 3).toUpperCase()}`,
          holdingSummary: parsed.holdingSummary || 'Authoritative analysis based on the retrieved statutory framework.',
          statutoryFramework: parsed.statutoryFramework || {
            title: 'Governing Statutory Framework',
            provisions: retrievedChunks.map(c => ({
              code: c.sectionOrArticle,
              title: c.title,
              act: c.sourceDoc,
              analysis: c.content.slice(0, 160) + '...'
            }))
          },
          judicialReasoning: parsed.judicialReasoning || [],
          comparativePrecedents: parsed.comparativePrecedents || [],
          proceduralGuidance: parsed.proceduralGuidance || [],
          keyTerminology: parsed.keyTerminology || [],
          evidenceSources: parsed.evidenceSources || buildFallbackEvidenceSources(retrievedChunks),
          graphNodes,
          graphEdges,
          selfLearningTelemetry: {
            retrievalScore: scored[0]?.score || 1.0,
            chunksEvaluated: LEGAL_CORPUS.length,
            adaptationCount: learningStore.getState().weightAdaptationsCount,
            activeWeights: Object.fromEntries(scored.map(s => [s.chunk.id, s.learnedMultiplier])),
            minedEdgesCount: learningStore.getState().minedEdges.length,
            exemplarBoostApplied: exemplars.length > 0,
            retrievedChunkTitles: retrievedChunks.map(c => `${c.sectionOrArticle}: ${c.title}`)
          }
        };
      }
    } catch (apiErr) {
      console.warn('Gemini synthesis error, falling back to deterministic RAG engine:', apiErr);
    }
  }

  // High-fidelity fallback synthesizer using retrieved chunks
  return buildLocalRagResponse(query, primaryDomain, scored, exemplars.length > 0);
}

function buildFallbackEvidenceSources(chunks: LegalChunk[]): EvidenceSource[] {
  return chunks.map((c, i) => ({
    id: `src_${c.id}`,
    title: `${c.sourceDoc} — ${c.sectionOrArticle}`,
    authority: c.sourceDoc === 'Constitution of India' ? 'Constitutional Law' : 'Statutory Act',
    sectionOrCitation: c.sectionOrArticle,
    relevance: Math.min(99, Math.max(78, 98 - i * 4)),
    year: c.sourceDoc === 'Indian Penal Code' ? 1860 : c.sourceDoc === 'Constitution of India' ? 1950 : 2000,
    type: c.sourceDoc === 'Constitution of India' ? 'constitutional' : 'statute',
    summary: `${c.title}: ${c.content.slice(0, 140)}...`,
    fullPassage: c.content,
    highlightedQuote: c.content.slice(0, 180) + '...',
    keyPrinciples: c.keyTerms,
    jurisdiction: 'Republic of India',
    tags: [c.domain, c.sourceDoc]
  }));
}

function buildLocalRagResponse(
  query: string,
  domain: LegalDomain,
  scored: ScoredChunk[],
  exemplarUsed: boolean
): LegalResearchResponse {
  const topChunk = scored[0].chunk;
  const secondaryChunks = scored.slice(1).map(s => s.chunk);
  const allRetrieved = [topChunk, ...secondaryChunks];

  const dossierNum = Math.floor(1000 + Math.random() * 9000);

  const graphNodes: GraphNode[] = [
    {
      id: 'query_root',
      label: query.length > 28 ? query.slice(0, 26) + '...' : query,
      type: 'query',
      domain,
      description: query
    },
    ...allRetrieved.map(c => ({
      id: c.id,
      label: c.sectionOrArticle,
      type: (c.sourceDoc === 'Constitution of India' ? 'act' : 'section') as GraphNode['type'],
      domain: (c.domain as LegalDomain) || domain,
      description: c.title
    }))
  ];

  const graphEdges: GraphEdge[] = allRetrieved.map(c => ({
    source: 'query_root',
    target: c.id,
    relationship: 'statutory_basis'
  }));

  for (let i = 0; i < allRetrieved.length; i++) {
    for (const ref of allRetrieved[i].crossReferences) {
      if (allRetrieved.some(r => r.id === ref)) {
        graphEdges.push({
          source: allRetrieved[i].id,
          target: ref,
          relationship: 'cross_references'
        });
      }
    }
  }

  return {
    id: `lex_${Date.now()}`,
    query,
    domain,
    jurisdiction: 'Supreme Court of India / High Courts of States',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
    dossierId: `DOSSIER #${dossierNum}-${domain.slice(0, 3).toUpperCase()}`,
    holdingSummary: `Under the authoritative framework of ${topChunk.sourceDoc} (${topChunk.sectionOrArticle}: ${topChunk.title}), ${topChunk.content.slice(0, 190)}... This provision stands reinforced by interconnected jurisprudence across ${secondaryChunks.map(c => c.sectionOrArticle).join(', ')}.`,
    statutoryFramework: {
      title: `${topChunk.sourceDoc} & Allied Statutory Provisions`,
      provisions: allRetrieved.map(c => ({
        code: c.sectionOrArticle,
        title: c.title,
        act: c.sourceDoc,
        analysis: `Governs ${c.title.toLowerCase()}. Enforces legal mandates: ${c.content.slice(0, 140)}...`
      }))
    },
    judicialReasoning: [
      {
        stepNumber: 'I',
        doctrine: 'Statutory Primacy & Textual Harmonisation',
        explanation: `Under ${topChunk.sectionOrArticle}, the plain meaning of the statute controls the adjudication, prohibiting any derogation from express statutory safeguards.`,
        citationKey: topChunk.sectionOrArticle,
        statutoryAnchor: topChunk.title
      },
      {
        stepNumber: 'II',
        doctrine: 'Constitutional Conformance & Proportionality',
        explanation: `All penal and regulatory provisions are construed in strict harmony with Part III of the Constitution (Articles 14, 19, and 21), ensuring procedure established by law is fair, just, and non-arbitrary.`,
        citationKey: 'Constitution of India, Art. 21',
        statutoryAnchor: 'Protection of Life and Liberty'
      },
      {
        stepNumber: 'III',
        doctrine: 'Procedural Compliance & Jurisdictional Integrity',
        explanation: `Enforcement of rights and liabilities requires strict adherence to statutory limitation, forum competence, and appellate hierarchy.`,
        citationKey: 'Supreme Court of India',
        statutoryAnchor: 'Article 141 Binding Law'
      }
    ],
    comparativePrecedents: [
      {
        caseName: 'State of Maharashtra v. Mayer Hans George',
        citation: '1965 AIR 722, 1965 SCR (1) 123',
        year: 1965,
        court: 'Supreme Court of India',
        ratioDecidendi: 'Mens rea is an essential ingredient of a criminal offence unless the statute by express words or necessary implication excludes it.',
        distinctionOrHolding: 'Essential threshold for establishing guilt under penal provisions.',
        relevanceScore: 94
      },
      {
        caseName: 'Maneka Gandhi v. Union of India',
        citation: '1978 AIR 597, 1978 SCR (2) 621',
        year: 1978,
        court: 'Supreme Court of India',
        ratioDecidendi: 'Procedure established by law under Article 21 must be just, fair, and reasonable, and not fanciful, oppressive, or arbitrary.',
        distinctionOrHolding: 'Informs statutory interpretation and procedural fairness across all legal disciplines.',
        relevanceScore: 97
      }
    ],
    proceduralGuidance: [
      `Confirm jurisdictional standing and territorial competence under ${topChunk.sectionOrArticle}.`,
      'Collate primary documentary evidence, electronic records authenticated with digital signatures where applicable, and witness depositions.',
      'Exhaust statutory alternative remedies before filing writ petitions under Article 32 or Article 226.'
    ],
    keyTerminology: [
      {
        term: 'Mens Rea',
        translationOrMeaning: 'Guilty mind or wrongful criminal intention.',
        significance: 'Required element under Indian criminal jurisprudence unless explicitly excluded.'
      },
      {
        term: 'Stare Decisis',
        translationOrMeaning: 'To stand by decisions and not disturb that which is settled.',
        significance: 'Enforced via Article 141 of the Constitution as binding law for all courts.'
      },
      {
        term: 'Ubi Jus Ibi Remedium',
        translationOrMeaning: 'Where there is a right, there is a remedy.',
        significance: 'Core foundation of constitutional writ jurisdiction under Articles 32 and 226.'
      }
    ],
    evidenceSources: buildFallbackEvidenceSources(allRetrieved),
    graphNodes,
    graphEdges,
    selfLearningTelemetry: {
      retrievalScore: scored[0]?.score || 1.0,
      chunksEvaluated: LEGAL_CORPUS.length,
      adaptationCount: learningStore.getState().weightAdaptationsCount,
      activeWeights: Object.fromEntries(scored.map(s => [s.chunk.id, s.learnedMultiplier])),
      minedEdgesCount: learningStore.getState().minedEdges.length,
      exemplarBoostApplied: exemplarUsed,
      retrievedChunkTitles: allRetrieved.map(c => `${c.sectionOrArticle}: ${c.title}`)
    }
  };
}
