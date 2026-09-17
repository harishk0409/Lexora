import { LegalResearchResponse, EvidenceSource, LegalDomain, GraphNode, GraphEdge } from '../types';

export const PRESET_RESEARCH_DOSSIERS: Record<string, LegalResearchResponse> = {
  'contract-section-10': {
    id: 'contract-section-10',
    query: 'Essential elements of a valid contract',
    domain: 'Contract',
    jurisdiction: 'Common Law / Indian Contract Act, 1872',
    timestamp: 'Document Folio #1872-IX-10',
    dossierId: 'LEX-ICA-1872-S10',
    holdingSummary: 'Under statutory contract doctrine, an agreement becomes an enforceable contract only if made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and not expressly declared void.',
    statutoryFramework: {
      title: 'Indian Contract Act, 1872 — Chapter II (Of Contracts, Voidable Contracts & Void Agreements)',
      provisions: [
        {
          code: 'Section 10',
          title: 'What agreements are contracts',
          act: 'Indian Contract Act, 1872',
          analysis: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.'
        },
        {
          code: 'Section 14',
          title: 'Free Consent Defined',
          act: 'Indian Contract Act, 1872',
          analysis: 'Consent is said to be free when it is not caused by coercion (s. 15), undue influence (s. 16), fraud (s. 17), misrepresentation (s. 18), or mistake (ss. 20, 21, 22).'
        },
        {
          code: 'Section 23',
          title: 'What considerations and objects are lawful',
          act: 'Indian Contract Act, 1872',
          analysis: 'The consideration or object of an agreement is lawful unless forbidden by law, or of such nature that it would defeat the provisions of any law, or is fraudulent, or implies injury to the person or property of another, or regarded as immoral or opposed to public policy.'
        }
      ]
    },
    judicialReasoning: [
      {
        stepNumber: 'I',
        doctrine: 'Consensus ad Idem & Mutuality of Assent',
        explanation: 'The foundation of contractual obligation requires a meeting of the minds. The parties must agree upon the same thing in the same sense. In the absence of true agreement (subject to objective interpretation), an apparent contract is non est factum.',
        citationKey: 'Carlill v. Carbolic Smoke Ball Co. [1893] 1 QB 256',
        statutoryAnchor: 'Section 13 & 14'
      },
      {
        stepNumber: 'II',
        doctrine: 'Legal Competence of the Parties',
        explanation: 'Parties must possess contractual capacity under Section 11: attaining the age of majority according to the law to which they are subject, sound mind (Section 12), and not disqualified from contracting by any applicable statute.',
        citationKey: 'Mohori Bibee v. Dharmodas Ghose (1903) 30 IA 114',
        statutoryAnchor: 'Section 11 & 12'
      },
      {
        stepNumber: 'III',
        doctrine: 'Quid Pro Quo & Lawful Consideration',
        explanation: 'Consideration must move at the desire of the promisor, whether executed or executory. While inadequacy of consideration does not void the agreement, absence of consideration renders it nudum pactum unless saved by statutory exceptions.',
        citationKey: 'Currie v. Misa (1875) LR 10 Ex 153',
        statutoryAnchor: 'Section 2(d) & Section 25'
      },
      {
        stepNumber: 'IV',
        doctrine: 'Intention to Create Binding Legal Relations',
        explanation: 'In commercial bargains, an intention to create legal relations is rebuttably presumed; in purely domestic or social arrangements, the burden lies heavy on the proponent to demonstrate an enforceable pactum.',
        citationKey: 'Balfour v. Balfour [1919] 2 KB 571',
        statutoryAnchor: 'Common Law Doctrine'
      }
    ],
    comparativePrecedents: [
      {
        caseName: 'Mohori Bibee v. Dharmodas Ghose',
        citation: '(1903) ILR 30 Cal 539 (PC)',
        year: 1903,
        court: 'Privy Council',
        ratioDecidendi: 'An agreement entered into by a minor is void ab initio, and Section 64/65 restitution cannot be compelled against an incompetent party.',
        distinctionOrHolding: 'Definitive precedent establishing strict incapacity of minors.',
        relevanceScore: 96
      },
      {
        caseName: 'Carlill v. Carbolic Smoke Ball Co.',
        citation: '[1893] 1 QB 256',
        year: 1893,
        court: 'Court of Appeal (UK)',
        ratioDecidendi: 'An offer made to the world at large (unilateral offer) ripens into a binding contract upon performance of the specified condition without prior communication of acceptance.',
        distinctionOrHolding: 'Landmark on unilateral offers & consideration by performance.',
        relevanceScore: 92
      },
      {
        caseName: 'Satyabrata Ghose v. Mugneeram Bangur & Co.',
        citation: '1954 AIR 44 / 1954 SCR 310',
        year: 1954,
        court: 'Supreme Court of India',
        ratioDecidendi: 'Examines doctrine of frustration under Section 56 and the sanctity of performance when contract remains capable of execution.',
        distinctionOrHolding: 'Standard for supervening impossibility and contractual survival.',
        relevanceScore: 88
      }
    ],
    proceduralGuidance: [
      'Ascertain whether the communication constituted an invitation to treat or an unconditional offer.',
      'Audit competency verifications: verify age, corporate charter authority (ultra vires check), and board resolutions.',
      'Check for vitiating elements: determine if consent was obtained under economic duress or fiduciary inequality.',
      'Confirm consideration adequacy is stated and that consideration is neither illegal nor contrary to public order.'
    ],
    keyTerminology: [
      {
        term: 'Consensus ad Idem',
        translationOrMeaning: 'Meeting of the minds',
        significance: 'Both contracting parties must assent to identical terms with reciprocal intent.'
      },
      {
        term: 'Nudum Pactum',
        translationOrMeaning: 'A bare promise without consideration',
        significance: 'Unenforceable at law unless executed under seal or recognized statutory exception.'
      },
      {
        term: 'Void ab Initio',
        translationOrMeaning: 'Void from the very inception',
        significance: 'Nullity in legal contemplation; confers no enforceable rights or title.'
      }
    ],
    evidenceSources: [
      {
        id: 'ev-ica-s10',
        title: 'Indian Contract Act, 1872',
        authority: 'Imperial Legislative Council / Law Commission Codification',
        sectionOrCitation: 'Section 10 — Agreements Declared as Contracts',
        relevance: 96,
        year: 1872,
        type: 'statute',
        page: 'P. 7, Cl. 10',
        jurisdiction: 'India (Common Law Tradition)',
        summary: 'Statutory threshold criteria requiring capacity, free consent, lawful consideration, and non-void classification.',
        fullPassage: 'Section 10: All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void. Nothing herein contained shall affect any law in force in India, and not hereby repealed, by which any contract is required to be made in writing or in the presence of witnesses, or any law relating to the registration of documents.',
        highlightedQuote: 'made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object',
        keyPrinciples: ['Free consent requirement', 'Competency under statutory age', 'Lawful object mandate'],
        tags: ['Statute', 'Enforceability', 'Core Doctrine']
      },
      {
        id: 'ev-mohori-bibee',
        title: 'Mohori Bibee v. Dharmodas Ghose',
        authority: 'Judicial Committee of the Privy Council',
        sectionOrCitation: '(1903) 30 I.A. 114 : ILR 30 Cal 539',
        relevance: 93,
        year: 1903,
        type: 'case',
        page: 'Judgment Vol. 30, Page 121',
        jurisdiction: 'Privy Council',
        summary: 'Decisive ruling that a minor has no contractual capacity; contracts executed with minors are void ab initio, not merely voidable.',
        fullPassage: 'Looking at Section 11, their Lordships are satisfied that the Act makes it essential that all contracting parties should be competent to contract, and especially provides that a person who by reason of infancy is incompetent to contract cannot make a contract within the meaning of the Act. The question whether a contract is void or voidable presupposes the existence of a contract within the meaning of the Act, which cannot arise in the case of an infant.',
        highlightedQuote: 'a person who by reason of infancy is incompetent to contract cannot make a contract within the meaning of the Act',
        keyPrinciples: ['Minority contracts void ab initio', 'Statutory incapacity cannot be waived', 'Section 65 does not apply to non-contracts'],
        tags: ['Capacity', 'Landmark Precedent', 'Privy Council']
      },
      {
        id: 'ev-carlill',
        title: 'Carlill v. Carbolic Smoke Ball Co.',
        authority: 'Court of Appeal, England & Wales',
        sectionOrCitation: '[1893] 1 Q.B. 256 (CA)',
        relevance: 89,
        year: 1893,
        type: 'case',
        page: 'Law Reports [1893] 1 QB, Page 269',
        jurisdiction: 'England & Wales (Common Law)',
        summary: 'Establishment of unilateral contracts, objective intention through deposit of security, and acceptance by conduct.',
        fullPassage: 'It was argued that you cannot contract with all the world; but it is not a contract made with all the world. There is the fallacy of the argument. It is an offer made to all the world; and why should not an offer be made to all the world which is to ripen into a contract with anybody who comes forward and performs the condition? It is an offer to become liable to any one who, before it is retracted, performs the condition.',
        highlightedQuote: 'an offer made to all the world which is to ripen into a contract with anybody who comes forward and performs the condition',
        keyPrinciples: ['Unilateral contracts valid', 'Intention manifested by deposited surety', 'Notification of acceptance dispensed with'],
        tags: ['Offer & Acceptance', 'Intention', 'Court of Appeal']
      },
      {
        id: 'ev-ansons-treatise',
        title: "Anson's Principles of the Law of Contract",
        authority: 'Sir William R. Anson / Oxford University Press (31st Ed.)',
        sectionOrCitation: 'Part I, Chapter 2: The Elements of Contract',
        relevance: 84,
        year: 2020,
        type: 'treatise',
        page: 'Folio 42, § 2.14',
        jurisdiction: 'Anglo-American Jurisprudence',
        summary: 'Scholarly treatise synthesizing modern considerations of contractual will, mutuality, and regulatory constraints.',
        fullPassage: 'A contract is a promise or set of promises which the law will enforce. The quintessential prerequisites consist of agreement resulting from offer and acceptance, accompanied by an intention to create legal relations, supported by consideration, entered into by parties of sufficient legal capacity, and untainted by illegality or public policy prohibitions.',
        highlightedQuote: 'The quintessential prerequisites consist of agreement resulting from offer and acceptance, accompanied by an intention to create legal relations',
        keyPrinciples: ['Doctrinal taxonomy of contract formation', 'Presumption in commercial dealings'],
        tags: ['Treatise', 'Doctrine', 'Oxford Law']
      }
    ],
    graphNodes: [
      { id: 'q-root', label: 'Query: Valid Contract Elements', type: 'query', domain: 'Contract', description: 'Core inquiry on contractual formation prerequisites', x: 50, y: 15 },
      { id: 'c-consensus', label: 'Consensus ad Idem', type: 'concept', domain: 'Contract', description: 'Reciprocal assent upon the same terms', x: 25, y: 35 },
      { id: 'c-capacity', label: 'Contractual Capacity', type: 'concept', domain: 'Contract', description: 'Legal competence by age and sanity', x: 50, y: 35 },
      { id: 'c-consideration', label: 'Lawful Consideration', type: 'concept', domain: 'Contract', description: 'Quid pro quo not contrary to public policy', x: 75, y: 35 },
      { id: 's-sec10', label: 'Section 10 ICA', type: 'section', domain: 'Contract', description: 'Statutory codification of contract enforceability', x: 35, y: 55 },
      { id: 's-sec14', label: 'Section 14 Free Consent', type: 'section', domain: 'Contract', description: 'Absence of coercion, undue influence, fraud', x: 65, y: 55 },
      { id: 'act-ica', label: 'Indian Contract Act, 1872', type: 'act', domain: 'Contract', description: 'Principal codifying statute', x: 50, y: 75 },
      { id: 'case-mohori', label: 'Mohori Bibee Precedent', type: 'case', domain: 'Contract', description: 'Minor incapacity renders agreement void ab initio', x: 30, y: 90 },
      { id: 'case-carlill', label: 'Carlill v. Carbolic', type: 'case', domain: 'Contract', description: 'Unilateral offer and objective intent', x: 70, y: 90 }
    ],
    graphEdges: [
      { source: 'q-root', target: 'c-consensus', relationship: 'subsumes' },
      { source: 'q-root', target: 'c-capacity', relationship: 'requires' },
      { source: 'q-root', target: 'c-consideration', relationship: 'mandates' },
      { source: 'c-capacity', target: 's-sec10', relationship: 'codified in' },
      { source: 'c-consensus', target: 's-sec14', relationship: 'operationalized by' },
      { source: 's-sec10', target: 'act-ica', relationship: 'part of' },
      { source: 's-sec14', target: 'act-ica', relationship: 'part of' },
      { source: 'c-capacity', target: 'case-mohori', relationship: 'interpreted by' },
      { source: 'c-consensus', target: 'case-carlill', relationship: 'tested in' }
    ]
  },

  'constitution-article-21': {
    id: 'constitution-article-21',
    query: 'Explain Article 21',
    domain: 'Constitution',
    jurisdiction: 'Constitutional Law / Supreme Court of India',
    timestamp: 'Constitutional Roll #Art21-SC-J',
    dossierId: 'LEX-CONST-ART21',
    holdingSummary: 'Article 21 guarantees that "No person shall be deprived of his life or personal liberty except according to procedure established by law." Through evolutionary interpretation, "procedure" must be just, fair, and reasonable, transforming the clause into a fountainhead of fundamental human rights.',
    statutoryFramework: {
      title: 'Constitution of India — Part III (Fundamental Rights)',
      provisions: [
        {
          code: 'Article 21',
          title: 'Protection of life and personal liberty',
          act: 'Constitution of India',
          analysis: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.'
        },
        {
          code: 'Article 14',
          title: 'Equality before law',
          act: 'Constitution of India',
          analysis: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India (intertwined with Art. 21 via the Golden Triangle).'
        },
        {
          code: 'Article 19',
          title: 'Protection of certain rights regarding freedom of speech, etc.',
          act: 'Constitution of India',
          analysis: 'Encompasses fundamental freedoms; forms the triadic constitutional bedrock with Articles 14 and 21.'
        }
      ]
    },
    judicialReasoning: [
      {
        stepNumber: 'I',
        doctrine: 'Substantive Due Process & The Golden Triangle',
        explanation: 'In Maneka Gandhi, the Supreme Court overruled the narrow positivist view of A.K. Gopalan. Any procedure curtailing personal liberty under Article 21 cannot be arbitrary, fanciful, or oppressive; it must satisfy the test of fairness and reason under Articles 14 and 19.',
        citationKey: 'Maneka Gandhi v. Union of India (1978) 1 SCC 248',
        statutoryAnchor: 'Articles 14, 19, 21'
      },
      {
        stepNumber: 'II',
        doctrine: 'Life with Human Dignity Beyond Mere Animal Existence',
        explanation: '"Life" is not confined to physical survival or vegetable existence. It encompasses the right to live with human dignity, access to livelihood, health, clean environment, and sheltered repose.',
        citationKey: 'Francis Coralie Mullin v. Administrator, UT of Delhi (1981) 1 SCC 608',
        statutoryAnchor: 'Article 21 Jurisprudence'
      },
      {
        stepNumber: 'III',
        doctrine: 'Informational Privacy as an Inalienable Constitutional Right',
        explanation: 'A nine-judge bench unanimously established that the right to privacy is an intrinsic part of the right to life and personal liberty under Article 21, foundational across spatial, informational, and decisional realms.',
        citationKey: 'K.S. Puttaswamy (Retd.) v. Union of India (2017) 10 SCC 1',
        statutoryAnchor: 'Article 21 & Part III Matrix'
      }
    ],
    comparativePrecedents: [
      {
        caseName: 'Maneka Gandhi v. Union of India',
        citation: '1978 AIR 597 : (1978) 1 SCC 248',
        year: 1978,
        court: 'Supreme Court of India (7-Judge Bench)',
        ratioDecidendi: 'Procedure established by law under Article 21 must be right, just, and fair, and not arbitrary; Part III articles are mutually reinforcing.',
        distinctionOrHolding: 'Overruled A.K. Gopalan; inaugurated substantive due process.',
        relevanceScore: 98
      },
      {
        caseName: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
        citation: '(2017) 10 SCC 1',
        year: 2017,
        court: 'Supreme Court of India (9-Judge Bench)',
        ratioDecidendi: 'Privacy is a fundamental right originating from dignity, autonomy, and liberty guaranteed by Article 21 and Part III.',
        distinctionOrHolding: 'Definitive precedent establishing informational & bodily privacy.',
        relevanceScore: 95
      },
      {
        caseName: 'Francis Coralie Mullin v. Administrator',
        citation: '(1981) 1 SCC 608',
        year: 1981,
        court: 'Supreme Court of India',
        ratioDecidendi: 'Right to life includes the right to live with human dignity and all that goes along with it, including bare necessities.',
        distinctionOrHolding: 'Expanded scope to qualitative dignity beyond biological survival.',
        relevanceScore: 90
      }
    ],
    proceduralGuidance: [
      'Subject any state encroachment to the Proportionality Test: legitimate state aim, rational nexus, necessity (least restrictive alternative), and balancing of interests.',
      'Check whether the impugned executive or legislative act violates non-arbitrariness under Article 14.',
      'Evaluate whether natural justice (audi alteram partem) was afforded prior to curtailing liberty.'
    ],
    keyTerminology: [
      {
        term: 'Audi Alteram Partem',
        translationOrMeaning: 'Hear the other side',
        significance: 'Core principle of natural justice embedded within just and fair procedure.'
      },
      {
        term: 'Substantive Due Process',
        translationOrMeaning: 'Judicial review of the inherent fairness and justice of law itself',
        significance: 'Ensures laws are not merely procedurally passed but substantively just.'
      },
      {
        term: 'Proportionality Test',
        translationOrMeaning: 'Four-pronged standard to evaluate restrictions on fundamental rights',
        significance: 'Legality, Legitimate Goal, Suitability, Necessity, and Strict Proportionality.'
      }
    ],
    evidenceSources: [
      {
        id: 'ev-art-21-text',
        title: 'Constitution of India, 1950',
        authority: 'Constituent Assembly of India',
        sectionOrCitation: 'Article 21 — Protection of Life and Personal Liberty',
        relevance: 98,
        year: 1950,
        type: 'constitutional',
        page: 'Part III, Art. 21',
        jurisdiction: 'Republic of India',
        summary: 'Text of the fundamental constitutional guarantee safeguarding bodily liberty and existence.',
        fullPassage: 'Article 21. No person shall be deprived of his life or personal liberty except according to procedure established by law.',
        highlightedQuote: 'No person shall be deprived of his life or personal liberty except according to procedure established by law',
        keyPrinciples: ['Inalienable human right', 'State restraint', 'Universal protection for citizens and aliens alike'],
        tags: ['Constitution', 'Part III', 'Fundamental Rights']
      },
      {
        id: 'ev-maneka-gandhi',
        title: 'Maneka Gandhi v. Union of India',
        authority: 'Supreme Court of India (Constitution Bench)',
        sectionOrCitation: '(1978) 1 SCC 248 : AIR 1978 SC 597',
        relevance: 95,
        year: 1978,
        type: 'case',
        page: 'SCC Vol. 1, Page 280',
        jurisdiction: 'Supreme Court of India',
        summary: 'The watershed judgment that interlinked Articles 14, 19, and 21 and introduced substantive fairness into Indian jurisprudence.',
        fullPassage: 'The principle of reasonableness, which legally as well as philosophically, is an essential element of equality or non-arbitrariness pervades Article 14 like a brooding omnipresence and the procedure contemplated by Article 21 must answer the test of reasonableness in order to be in conformity with Article 14. It must be "right and just and fair" and not arbitrary, fanciful or oppressive; otherwise, it would be no procedure at all.',
        highlightedQuote: 'The procedure contemplated by Article 21 must answer the test of reasonableness... It must be right and just and fair and not arbitrary, fanciful or oppressive',
        keyPrinciples: ['Interconnection of fundamental rights', 'Procedure must be just, fair and reasonable', 'Natural justice reading into statutes'],
        tags: ['Landmark', 'Due Process', 'Golden Triangle']
      },
      {
        id: 'ev-puttaswamy',
        title: 'Justice K.S. Puttaswamy v. Union of India',
        authority: 'Supreme Court of India (9-Judge Bench)',
        sectionOrCitation: '(2017) 10 SCC 1',
        relevance: 92,
        year: 2017,
        type: 'case',
        page: 'Vol. 10, Paragraph 298',
        jurisdiction: 'Supreme Court of India',
        summary: 'Universal affirmation of privacy as a core constitutional entitlement anchored in dignity and liberty.',
        fullPassage: 'Privacy is the constitutional core of human dignity. Privacy has both positive and negative contents. The negative content restricts the State from committing an intrusion upon the life and personal liberty of a citizen. Its positive content imposes an obligation on the State to take all necessary measures to protect the privacy of the individual.',
        highlightedQuote: 'Privacy is the constitutional core of human dignity... anchored in the freedoms guaranteed by Part III',
        keyPrinciples: ['Informational privacy', 'Bodily autonomy', 'Standard of strict scrutiny / proportionality'],
        tags: ['Privacy', 'En Banc', 'Human Dignity']
      }
    ],
    graphNodes: [
      { id: 'q-art21', label: 'Query: Article 21 Jurisprudence', type: 'query', domain: 'Constitution', description: 'Inquiry on constitutional right to life and liberty', x: 50, y: 15 },
      { id: 'c-dueprocess', label: 'Just, Fair & Reasonable Procedure', type: 'concept', domain: 'Constitution', description: 'Substantive fairness benchmark', x: 30, y: 35 },
      { id: 'c-dignity', label: 'Human Dignity & Privacy', type: 'concept', domain: 'Constitution', description: 'Qualitative right to human existence', x: 70, y: 35 },
      { id: 's-art21', label: 'Article 21 Text', type: 'section', domain: 'Constitution', description: 'Protection of life & personal liberty', x: 50, y: 55 },
      { id: 'act-const', label: 'Constitution of India (Part III)', type: 'act', domain: 'Constitution', description: 'Supreme constitutional Charter', x: 50, y: 75 },
      { id: 'case-maneka', label: 'Maneka Gandhi (1978)', type: 'case', domain: 'Constitution', description: 'Golden Triangle doctrine synthesis', x: 25, y: 90 },
      { id: 'case-puttaswamy', label: 'Puttaswamy En Banc (2017)', type: 'case', domain: 'Constitution', description: 'Privacy as fundamental human right', x: 75, y: 90 }
    ],
    graphEdges: [
      { source: 'q-art21', target: 'c-dueprocess', relationship: 'investigates' },
      { source: 'q-art21', target: 'c-dignity', relationship: 'encompasses' },
      { source: 'c-dueprocess', target: 's-art21', relationship: 'interprets' },
      { source: 'c-dignity', target: 's-art21', relationship: 'informs' },
      { source: 's-art21', target: 'act-const', relationship: 'codified in' },
      { source: 'c-dueprocess', target: 'case-maneka', relationship: 'established by' },
      { source: 'c-dignity', target: 'case-puttaswamy', relationship: 'reaffirmed in' }
    ]
  },

  'criminal-anticipatory-bail': {
    id: 'criminal-anticipatory-bail',
    query: 'What is anticipatory bail?',
    domain: 'Criminal',
    jurisdiction: 'Criminal Procedure Code / High Courts & Supreme Court',
    timestamp: 'Crown / State Gazette #CrPC-S438',
    dossierId: 'LEX-CRPC-S438',
    holdingSummary: 'Anticipatory bail under Section 438 CrPC (now Section 482 of Bharatiya Nagarik Suraksha Sanhita, 2023) is a pre-arrest protective direction granted by the Court of Session or High Court, ensuring that in the event of an arrest on accusation of having committed a non-bailable offence, the applicant shall be released on bail upon reasonable conditions.',
    statutoryFramework: {
      title: 'Code of Criminal Procedure, 1973 — Section 438 (Direction for grant of bail to person apprehending arrest)',
      provisions: [
        {
          code: 'Section 438(1)',
          title: 'Apprehension of Arrest for Non-Bailable Offence',
          act: 'Code of Criminal Procedure, 1973',
          analysis: 'Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section.'
        },
        {
          code: 'Section 438(2)',
          title: 'Mandatory Conditions on Bail',
          act: 'Code of Criminal Procedure, 1973',
          analysis: 'Court may impose conditions: making oneself available for interrogation, not tampering with evidence, not leaving the country without permission, and conditions under Section 437(3).'
        }
      ]
    },
    judicialReasoning: [
      {
        stepNumber: 'I',
        doctrine: 'Reasonable Apprehension of Imminent Deprivation of Liberty',
        explanation: 'Anticipatory bail cannot be sought on a vague suspicion or phantom threat. The applicant must demonstrate a tangible reason to believe based on existing FIR, complaint, or overt investigative steps.',
        citationKey: 'Gurbaksh Singh Sibbia v. State of Punjab (1980) 2 SCC 565',
        statutoryAnchor: 'Section 438(1)'
      },
      {
        stepNumber: 'II',
        doctrine: 'No Inherent Time Limit on Pre-Arrest Protection',
        explanation: 'The Supreme Court ruled that protection granted under Section 438 should not routinely be limited to a fixed timeframe or until the filing of the charge sheet; it generally continues till the conclusion of the trial unless special circumstances warrant truncation.',
        citationKey: 'Sushila Aggarwal v. State (NCT of Delhi) (2020) 5 SCC 1',
        statutoryAnchor: 'Constitution Bench Precedent'
      },
      {
        stepNumber: 'III',
        doctrine: 'Balancing Personal Liberty Against Investigative Sanctity',
        explanation: 'The court must balance the applicant’s fundamental right to personal freedom against the legitimate demands of effective police interrogation, custodial requirements, gravity of offense, and potential witness tampering.',
        citationKey: 'Arnesh Kumar v. State of Bihar (2014) 8 SCC 273',
        statutoryAnchor: 'Section 41 CrPC Guidelines'
      }
    ],
    comparativePrecedents: [
      {
        caseName: 'Gurbaksh Singh Sibbia v. State of Punjab',
        citation: '(1980) 2 SCC 565',
        year: 1980,
        court: 'Supreme Court of India (5-Judge Bench)',
        ratioDecidendi: 'Section 438 must be interpreted broadly in light of Article 21; wide judicial discretion should not be shackled by judicially invented rigid fetters.',
        distinctionOrHolding: 'Magna Carta of anticipatory bail jurisprudence.',
        relevanceScore: 97
      },
      {
        caseName: 'Sushila Aggarwal v. State (NCT of Delhi)',
        citation: '(2020) 5 SCC 1',
        year: 2020,
        court: 'Supreme Court of India (5-Judge Bench)',
        ratioDecidendi: 'Confirmed Sibbia; held that anticipatory bail does not end automatically upon filing of chargesheet or summoning by trial court.',
        distinctionOrHolding: 'Resolved conflicting judicial opinions on duration of pre-arrest bail.',
        relevanceScore: 94
      },
      {
        caseName: 'Arnesh Kumar v. State of Bihar',
        citation: '(2014) 8 SCC 273',
        year: 2014,
        court: 'Supreme Court of India',
        ratioDecidendi: 'Arrest should not be made routinely for offences punishable with imprisonment up to 7 years without satisfying Section 41 conditions.',
        distinctionOrHolding: 'Restraint on mechanized police arrests.',
        relevanceScore: 90
      }
    ],
    proceduralGuidance: [
      'Draft petition invoking concurrent jurisdiction under Section 438 before Sessions Court or directly before High Court with compelling urgency.',
      'Affidavit must affirm applicant has clean antecedents and will join investigation whenever summoned.',
      'Surrender passport or provide undertaking not to leave territorial jurisdiction without prior leave.',
      'Anticipate and counter allegations of need for custodial discovery under Section 27 Evidence Act.'
    ],
    keyTerminology: [
      {
        term: 'Prima Facie',
        translationOrMeaning: 'On its first appearance / face of it',
        significance: 'Evaluation of evidence at the threshold stage without conducting a mini-trial.'
      },
      {
        term: 'Custodial Interrogation',
        translationOrMeaning: 'Interrogation while subject to physical police detention',
        significance: 'Primary ground of state opposition when seeking discovery of weapon or documents.'
      },
      {
        term: 'Ex Facie Malice',
        translationOrMeaning: 'Malice patent on the face of the record',
        significance: 'Strongest ground for granting anticipatory bail when prosecution is motivated by vendetta.'
      }
    ],
    evidenceSources: [
      {
        id: 'ev-crpc-438',
        title: 'Code of Criminal Procedure, 1973',
        authority: 'Parliament of India / Ministry of Law',
        sectionOrCitation: 'Section 438 — Direction for grant of bail to person apprehending arrest',
        relevance: 97,
        year: 1973,
        type: 'statute',
        page: 'Chapter XXXIII, Section 438',
        jurisdiction: 'India',
        summary: 'Statutory authority conferring equitable jurisdiction on Sessions Court and High Court.',
        fullPassage: 'Section 438. (1) Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail; and that Court may, after considering the nature and gravity of accusation and antecedents, either reject or grant direction.',
        highlightedQuote: 'Where any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence',
        keyPrinciples: ['Concurrent jurisdiction', 'Discretionary judicial prerogative', 'Reason to believe standard'],
        tags: ['Statute', 'CrPC', 'Liberty Shield']
      },
      {
        id: 'ev-sibbia',
        title: 'Gurbaksh Singh Sibbia v. State of Punjab',
        authority: 'Supreme Court of India (Constitution Bench)',
        sectionOrCitation: '(1980) 2 SCC 565 : 1980 AIR 1632',
        relevance: 94,
        year: 1980,
        type: 'case',
        page: 'Judgment Vol. 2, Page 578',
        jurisdiction: 'Supreme Court of India',
        summary: 'Landmark ruling establishing that Section 438 is an extraordinary protection of Article 21 rights.',
        fullPassage: 'The high purpose of Section 438 is to prevent humiliating arrests and victimization of innocent citizens under malicious criminal processes. A society which cherishes freedom cannot view with equanimity the spectacle of persons being deprived of their liberty on accusations which are later proved to be unfounded.',
        highlightedQuote: 'The high purpose of Section 438 is to prevent humiliating arrests and victimization of innocent citizens',
        keyPrinciples: ['Equitable jurisdiction', 'No straitjacket restrictions', 'Cooperation with investigation'],
        tags: ['Precedent', 'Constitution Bench', 'Liberty']
      }
    ],
    graphNodes: [
      { id: 'q-bail', label: 'Query: Anticipatory Bail Jurisprudence', type: 'query', domain: 'Criminal', description: 'Inquiry on pre-arrest liberty safeguards', x: 50, y: 15 },
      { id: 'c-apprehension', label: 'Reasonable Apprehension', type: 'concept', domain: 'Criminal', description: 'Objective basis for fearing imminent arrest', x: 25, y: 35 },
      { id: 'c-discretion', label: 'Judicial Balancing Discretion', type: 'concept', domain: 'Criminal', description: 'Weighing liberty against custodial needs', x: 75, y: 35 },
      { id: 's-sec438', label: 'Section 438 CrPC', type: 'section', domain: 'Criminal', description: 'Statutory pre-arrest bail enactment', x: 50, y: 55 },
      { id: 'act-crpc', label: 'Code of Criminal Procedure, 1973', type: 'act', domain: 'Criminal', description: 'Procedural criminal statute', x: 50, y: 75 },
      { id: 'case-sibbia', label: 'Sibbia v. State of Punjab', type: 'case', domain: 'Criminal', description: 'Constitution Bench landmark guidance', x: 25, y: 90 },
      { id: 'case-sushila', label: 'Sushila Aggarwal (2020)', type: 'case', domain: 'Criminal', description: 'Indefinite duration precedent', x: 75, y: 90 }
    ],
    graphEdges: [
      { source: 'q-bail', target: 'c-apprehension', relationship: 'predicated on' },
      { source: 'q-bail', target: 'c-discretion', relationship: 'invokes' },
      { source: 'c-apprehension', target: 's-sec438', relationship: 'statutory condition in' },
      { source: 'c-discretion', target: 's-sec438', relationship: 'guided by' },
      { source: 's-sec438', target: 'act-crpc', relationship: 'enacted within' },
      { source: 'c-discretion', target: 'case-sibbia', relationship: 'codified in' },
      { source: 's-sec438', target: 'case-sushila', relationship: 'expanded by' }
    ]
  },

  'case-law-negligence': {
    id: 'case-law-negligence',
    query: 'Find cases concerning negligence',
    domain: 'Torts',
    jurisdiction: 'Common Law / Tort Law & Appellate Precedents',
    timestamp: 'Tort Docket #NEGL-COMM-1932',
    dossierId: 'LEX-TORT-NEGL',
    holdingSummary: 'The modern tort of negligence requires the plaintiff to establish three conjunctive elements: (1) a legal duty of care owed by the defendant, (2) a breach of that standard of care by failing to act as a reasonable person would, and (3) consequential damage resulting directly and foreseeably from that breach (causation and non-remoteness).',
    statutoryFramework: {
      title: 'Common Law Foundations & Civil Liability Precedents',
      provisions: [
        {
          code: 'Neighbour Principle',
          title: 'Donoghue v. Stevenson (1932)',
          act: 'Common Law of Torts',
          analysis: 'You must take reasonable care to avoid acts or omissions which you can reasonably foresee would be likely to injure your neighbour.'
        },
        {
          code: 'Caparo Three-Stage Test',
          title: 'Caparo Industries plc v. Dickman (1990)',
          act: 'Appellate Tort Doctrine',
          analysis: 'Foreseeability of harm, proximity of relationship, and whether it is fair, just, and reasonable to impose liability.'
        }
      ]
    },
    judicialReasoning: [
      {
        stepNumber: 'I',
        doctrine: 'The Neighbour Principle & Duty of Care',
        explanation: 'Lord Atkin formulated the universal duty test: persons who are so closely and directly affected by my act that I ought reasonably to have them in contemplation as being so affected when directing my mind to the acts or omissions in question.',
        citationKey: 'Donoghue v. Stevenson [1932] AC 562 (HL)',
        statutoryAnchor: 'House of Lords'
      },
      {
        stepNumber: 'II',
        doctrine: 'The Objective Standard of the Reasonable Person',
        explanation: 'Breach occurs when conduct falls below the standard of the "man on the Clapham omnibus" or a reasonably prudent person under like circumstances. In specialized vocations, the Bolam test governs professional standard.',
        citationKey: 'Blyth v. Birmingham Waterworks Co. (1856) / Bolam v. Friern [1957]',
        statutoryAnchor: 'Standard of Care'
      },
      {
        stepNumber: 'III',
        doctrine: 'Causation in Fact & Remoteness of Damage',
        explanation: 'The claimant must satisfy the "but for" test (causa sine qua non) and demonstrate that the type of damage was reasonably foreseeable, not an extraordinarily remote consequence.',
        citationKey: 'The Wagon Mound (No. 1) [1961] AC 388 (PC)',
        statutoryAnchor: 'Remoteness of Damage'
      }
    ],
    comparativePrecedents: [
      {
        caseName: 'Donoghue v. Stevenson',
        citation: '[1932] AC 562',
        year: 1932,
        court: 'House of Lords',
        ratioDecidendi: 'A manufacturer owes a legal duty of care to the ultimate consumer of goods where there is no reasonable opportunity for intermediate examination.',
        distinctionOrHolding: 'Inception of modern product liability & the universal neighbour principle.',
        relevanceScore: 99
      },
      {
        caseName: 'Caparo Industries plc v. Dickman',
        citation: '[1990] 2 AC 605',
        year: 1990,
        court: 'House of Lords',
        ratioDecidendi: 'Formulated the three-stage test for novel duty situations: foreseeability, proximity, and fairness/justice/reasonableness.',
        distinctionOrHolding: 'Standard tripartite test governing modern duty of care.',
        relevanceScore: 94
      },
      {
        caseName: 'Overseas Tankship (UK) Ltd v. Morts Dock (The Wagon Mound No. 1)',
        citation: '[1961] AC 388',
        year: 1961,
        court: 'Privy Council',
        ratioDecidendi: 'The test of remoteness is reasonable foreseeability of the kind of damage suffered, rejecting the broad direct consequence rule in Re Polemis.',
        distinctionOrHolding: 'Modern rule of remoteness.',
        relevanceScore: 91
      }
    ],
    proceduralGuidance: [
      'Categorize whether the claim falls into an established duty category (manufacturer-consumer, motorist-pedestrian, employer-employee) or novel duty territory.',
      'Compile expert witness evidence establishing the professional standard of care where technical negligence is pleaded.',
      'Segregate factual causation (but-for test) from legal causation (novus actus interveniens and remoteness).'
    ],
    keyTerminology: [
      {
        term: 'Causa Sine Qua Non',
        translationOrMeaning: 'Cause without which it could not be',
        significance: 'The indispensable causal link without which the injury would not have occurred.'
      },
      {
        term: 'Res Ipsa Loquitur',
        translationOrMeaning: 'The thing speaks for itself',
        significance: 'Evidentiary presumption of negligence when the accident is of a kind that does not happen without breach.'
      },
      {
        term: 'Novus Actus Interveniens',
        translationOrMeaning: 'A new intervening act',
        significance: 'Breaks the chain of causation, exonerating the initial tortfeasor from subsequent consequences.'
      }
    ],
    evidenceSources: [
      {
        id: 'ev-donoghue',
        title: 'Donoghue v. Stevenson',
        authority: 'House of Lords (Judicial Committee)',
        sectionOrCitation: '[1932] UKHL 100 : [1932] AC 562',
        relevance: 99,
        year: 1932,
        type: 'case',
        page: 'AC Vol. 1932, Page 580',
        jurisdiction: 'United Kingdom (Common Law Precedent)',
        summary: 'Seminal ginger beer snail case establishing the common law tort of negligence and manufacturer liability.',
        fullPassage: 'The rule that you are to love your neighbour becomes in law, you must not injure your neighbour; and the lawyer’s question, Who is my neighbour? receives a restricted reply. You must take reasonable care to avoid acts or omissions which you can reasonably foresee would be likely to injure your neighbour.',
        highlightedQuote: 'You must take reasonable care to avoid acts or omissions which you can reasonably foresee would be likely to injure your neighbour',
        keyPrinciples: ['Neighbour principle', 'Manufacturer duty of care', 'Absence of privity requirement in tort'],
        tags: ['Foundational', 'House of Lords', 'Duty of Care']
      },
      {
        id: 'ev-caparo',
        title: 'Caparo Industries plc v. Dickman',
        authority: 'House of Lords',
        sectionOrCitation: '[1990] 2 AC 605 : [1990] 1 All ER 568',
        relevance: 94,
        year: 1990,
        type: 'case',
        page: 'Folio 605, Per Lord Bridge',
        jurisdiction: 'United Kingdom',
        summary: 'Defined the 3-step test limiting indeterminate liability in pure economic loss and novel duty categories.',
        fullPassage: 'What is required is not merely foreseeability of harm, but a relationship of proximity or neighbourhood, and that the court considers it fair, just and reasonable that the law should impose a duty of a given scope upon the one party for the benefit of the other.',
        highlightedQuote: 'foreseeability of harm... a relationship of proximity... and fair, just and reasonable that the law should impose a duty',
        keyPrinciples: ['Tripartite test', 'Economic loss boundaries', 'Proximity necessity'],
        tags: ['Precedent', 'Proximity', 'House of Lords']
      }
    ],
    graphNodes: [
      { id: 'q-negligence', label: 'Query: Negligence Doctrine', type: 'query', domain: 'Torts', description: 'Tortious liability for unintentional breach', x: 50, y: 15 },
      { id: 'c-duty', label: 'Duty of Care', type: 'concept', domain: 'Torts', description: 'Legal obligation to avoid foreseeable harm', x: 25, y: 35 },
      { id: 'c-breach', label: 'Standard & Breach', type: 'concept', domain: 'Torts', description: 'Conduct falling below reasonable person standard', x: 50, y: 35 },
      { id: 'c-damage', label: 'Causation & Remoteness', type: 'concept', domain: 'Torts', description: 'Direct foreseeable harm resulting from breach', x: 75, y: 35 },
      { id: 's-neighbour', label: 'Neighbour Principle', type: 'section', domain: 'Torts', description: 'Universal test formulated by Lord Atkin', x: 35, y: 55 },
      { id: 's-caparo-test', label: 'Caparo 3-Stage Test', type: 'section', domain: 'Torts', description: 'Foreseeability, Proximity, Fairness', x: 65, y: 55 },
      { id: 'act-tort-cl', label: 'Common Law of Torts', type: 'act', domain: 'Torts', description: 'Judge-made civil obligation framework', x: 50, y: 75 },
      { id: 'case-donoghue', label: 'Donoghue v. Stevenson (1932)', type: 'case', domain: 'Torts', description: 'The landmark ginger beer snail judgment', x: 30, y: 90 },
      { id: 'case-wagon', label: 'The Wagon Mound (1961)', type: 'case', domain: 'Torts', description: 'Reasonable foreseeability of type of harm', x: 70, y: 90 }
    ],
    graphEdges: [
      { source: 'q-negligence', target: 'c-duty', relationship: 'requires' },
      { source: 'q-negligence', target: 'c-breach', relationship: 'requires' },
      { source: 'q-negligence', target: 'c-damage', relationship: 'requires' },
      { source: 'c-duty', target: 's-neighbour', relationship: 'grounded in' },
      { source: 'c-duty', target: 's-caparo-test', relationship: 'refined by' },
      { source: 's-neighbour', target: 'act-tort-cl', relationship: 'part of' },
      { source: 's-caparo-test', target: 'act-tort-cl', relationship: 'part of' },
      { source: 's-neighbour', target: 'case-donoghue', relationship: 'formulated in' },
      { source: 'c-damage', target: 'case-wagon', relationship: 'defined by' }
    ]
  }
};

// Dynamic fallback generator for any user custom query
export function generateMockResearch(query: string, domainHint?: LegalDomain): LegalResearchResponse {
  const clean = query.trim().toLowerCase();

  if (clean.includes('contract') || clean.includes('section 10') || clean.includes('valid contract')) {
    return PRESET_RESEARCH_DOSSIERS['contract-section-10'];
  }
  if (clean.includes('article 21') || clean.includes('constitution') || clean.includes('life') || clean.includes('liberty')) {
    return PRESET_RESEARCH_DOSSIERS['constitution-article-21'];
  }
  if (clean.includes('bail') || clean.includes('anticipatory') || clean.includes('criminal') || clean.includes('438')) {
    return PRESET_RESEARCH_DOSSIERS['criminal-anticipatory-bail'];
  }
  if (clean.includes('negligence') || clean.includes('tort') || clean.includes('duty of care') || clean.includes('donoghue')) {
    return PRESET_RESEARCH_DOSSIERS['case-law-negligence'];
  }

  // Generate synthetic structured research response matching the custom query
  const domain: LegalDomain = domainHint || (
    clean.includes('crime') || clean.includes('penal') ? 'Criminal' :
    clean.includes('property') || clean.includes('land') || clean.includes('lease') ? 'Property' :
    clean.includes('company') || clean.includes('corporate') || clean.includes('merger') ? 'Corporate' :
    clean.includes('constitution') || clean.includes('right') ? 'Constitution' :
    'Case Law'
  );

  const codeId = Math.floor(1000 + Math.random() * 9000);

  return {
    id: `dyn-${codeId}`,
    query: query,
    domain: domain,
    jurisdiction: 'Supreme Court & Appellate High Courts Jurisprudence',
    timestamp: `Archival Record #${codeId}`,
    dossierId: `LEX-${domain.toUpperCase().slice(0, 4)}-${codeId}`,
    holdingSummary: `Comprehensive inquiry into "${query}": The governing jurisprudence balances statutory directives with evolving judicial ratios, mandating strict compliance with due process, statutory interpretation canons, and constitutional imperatives.`,
    statutoryFramework: {
      title: `${domain} Law Codification & Legislative Architecture`,
      provisions: [
        {
          code: `Section ${Math.floor(Math.random() * 80 + 1)}`,
          title: `Primary Operative Enactment regarding ${query.slice(0, 30)}`,
          act: `${domain} Codification Act`,
          analysis: `Statutory mandate specifying substantive obligations, procedural timelines, and exceptions recognized by appellate courts.`
        },
        {
          code: `Rule ${Math.floor(Math.random() * 20 + 1)}(b)`,
          title: 'Procedural Compliance & Safeguards',
          act: 'Appellate Rules of Practice',
          analysis: 'Evidentiary benchmarks required to sustain a prima facie action before judicial tribunals.'
        }
      ]
    },
    judicialReasoning: [
      {
        stepNumber: 'I',
        doctrine: 'Literal & Purposive Harmonious Construction',
        explanation: 'Statutes must be construed according to their plain grammatical tenor unless such reading yields manifest absurdity, in which case the purposive mischief rule applies to advance legislative objective.',
        citationKey: 'Heydon’s Case (1584) / Principles of Statutory Interpretation',
        statutoryAnchor: 'Statutory Interpretation Canon'
      },
      {
        stepNumber: 'II',
        doctrine: 'Substantive Compliance & Natural Justice',
        explanation: `In evaluating claims arising under ${domain.toLowerCase()} doctrines, tribunals must afford procedural fairness (audi alteram partem) and avoid arbitrary administrative or contractual overreach.`,
        citationKey: 'Union of India v. Tulsiram Patel (1985) 3 SCC 398',
        statutoryAnchor: 'Constitutional Standard'
      },
      {
        stepNumber: 'III',
        doctrine: 'Doctrine of Stare Decisis & Judicial Discipline',
        explanation: 'Lower courts and coordinate benches remain strictly bound by authoritative precedents of larger benches under Article 141 and common law precedent hierarchy.',
        citationKey: 'Bengal Immunity Co. v. State of Bihar [1955] 2 SCR 603',
        statutoryAnchor: 'Stare Decisis Doctrine'
      }
    ],
    comparativePrecedents: [
      {
        caseName: 'State of Maharashtra v. Mayer Hans George',
        citation: '1965 AIR 722 : [1965] 1 SCR 123',
        year: 1965,
        court: 'Supreme Court of India',
        ratioDecidendi: 'Examines the presumption of mens rea in statutory enactments and strict liability demarcations.',
        distinctionOrHolding: 'Authoritative ruling on mens rea and legislative silence.',
        relevanceScore: 91
      },
      {
        caseName: 'Associated Provincial Picture Houses v. Wednesbury Corp.',
        citation: '[1948] 1 KB 223',
        year: 1948,
        court: 'Court of Appeal (UK)',
        ratioDecidendi: 'A standard of unreasonableness so outrageous in its defiance of logic that no sensible person could have arrived at it.',
        distinctionOrHolding: 'Universal threshold for judicial review of discretionary actions.',
        relevanceScore: 87
      }
    ],
    proceduralGuidance: [
      'Examine whether the dispute triggers statutory limitation thresholds under applicable Limitation enactments.',
      'Check jurisdictional locus standi and whether alternate administrative remedies must be exhausted first.',
      'Gather documentary corroboration before formulating petition pleadings.'
    ],
    keyTerminology: [
      {
        term: 'Stare Decisis',
        translationOrMeaning: 'To stand by things decided',
        significance: 'The doctrine that precedent must be followed for legal certainty.'
      },
      {
        term: 'Ratio Decidendi',
        translationOrMeaning: 'The reason for the decision',
        significance: 'The core legal principle upon which the judicial outcome rests.'
      },
      {
        term: 'Obiter Dictum',
        translationOrMeaning: 'Said in passing',
        significance: 'Non-binding judicial observation persuasive in subsequent analogical arguments.'
      }
    ],
    evidenceSources: [
      {
        id: `ev-${codeId}-1`,
        title: `${domain} Statutory Digest & Annotations`,
        authority: 'Central Legislative Assembly / Appellate Commission',
        sectionOrCitation: `Chapter IV, Provision §${Math.floor(Math.random() * 50 + 1)}`,
        relevance: 93,
        year: 2018,
        type: 'statute',
        page: 'Folio 114, Sub-clause (2)',
        jurisdiction: 'National Jurisprudence',
        summary: `Codified parameters governing ${query}, outlining evidentiary burdens and statutory exemptions.`,
        fullPassage: `Every individual seeking judicial relief under this chapter shall demonstrate compliance with the mandatory covenants herein set forth. The court may in its equitable discretion dispense with technical formalisms where substantial justice dictates.`,
        highlightedQuote: 'court may in its equitable discretion dispense with technical formalisms where substantial justice dictates',
        keyPrinciples: ['Substantive justice primacy', 'Presumption of regularity', 'Exhaustion of statutory avenues'],
        tags: [domain, 'Statute', 'Legislative Text']
      },
      {
        id: `ev-${codeId}-2`,
        title: 'Appellate Benchmark Judgment',
        authority: 'Supreme Court Appellate Division',
        sectionOrCitation: `[${2000 + Math.floor(Math.random() * 24)}] SCC Rep. 412`,
        relevance: 88,
        year: 2021,
        type: 'case',
        page: 'Para 44, Per Majority',
        jurisdiction: 'Apex Court',
        summary: `Leading interpretation establishing the contemporary standard regarding ${query}.`,
        fullPassage: `We are of the considered opinion that law cannot remain static while society moves forward. The doctrine must be interpreted dynamically to protect substantive rights while maintaining commercial and legal certainty.`,
        highlightedQuote: 'law cannot remain static while society moves forward... must be interpreted dynamically',
        keyPrinciples: ['Dynamic purposive construction', 'Balancing equities', 'Binding ratio'],
        tags: [domain, 'Apex Court', 'Precedent']
      }
    ],
    graphNodes: [
      { id: 'q-dyn-root', label: `Query: ${query.slice(0, 24)}...`, type: 'query', domain: domain, description: query, x: 50, y: 15 },
      { id: 'c-dyn-1', label: 'Primary Legal Canon', type: 'concept', domain: domain, description: 'Core doctrinal test', x: 30, y: 35 },
      { id: 'c-dyn-2', label: 'Equitable Boundaries', type: 'concept', domain: domain, description: 'Judicial discretion and balance', x: 70, y: 35 },
      { id: 's-dyn-1', label: 'Governing Codification', type: 'section', domain: domain, description: 'Statutory basis', x: 50, y: 55 },
      { id: 'act-dyn', label: `${domain} Jurisprudence`, type: 'act', domain: domain, description: 'Statutory Body', x: 50, y: 75 },
      { id: 'case-dyn-1', label: 'Leading Landmark Precedent', type: 'case', domain: domain, description: 'Authoritative ruling', x: 30, y: 90 },
      { id: 'case-dyn-2', label: 'Coordinate Bench Ruling', type: 'case', domain: domain, description: 'Affirmative holding', x: 70, y: 90 }
    ],
    graphEdges: [
      { source: 'q-dyn-root', target: 'c-dyn-1', relationship: 'raises' },
      { source: 'q-dyn-root', target: 'c-dyn-2', relationship: 'balances' },
      { source: 'c-dyn-1', target: 's-dyn-1', relationship: 'rooted in' },
      { source: 'c-dyn-2', target: 's-dyn-1', relationship: 'constrains' },
      { source: 's-dyn-1', target: 'act-dyn', relationship: 'enacted in' },
      { source: 'c-dyn-1', target: 'case-dyn-1', relationship: 'adjudicated by' },
      { source: 'c-dyn-2', target: 'case-dyn-2', relationship: 'applied in' }
    ]
  };
}

export const SUGGESTED_RESEARCH_PROMPTS = [
  {
    domain: 'PENAL CODE' as const,
    title: 'What are the five exceptions to murder under IPC Section 300?',
    sectionSnippet: 'Section 300 • Indian Penal Code, 1860',
    accentColor: '#b84255',
    keyTerms: ['Grave & Sudden Provocation', 'Private Defence', 'Sudden Fight']
  },
  {
    domain: 'CONSTITUTION' as const,
    title: 'How does Article 21 protect life and personal liberty against arbitrary state action?',
    sectionSnippet: 'Part III • Constitution of India',
    accentColor: '#d4af37',
    keyTerms: ['Substantive Due Process', 'Dignity', 'Maneka Gandhi']
  },
  {
    domain: 'CYBER LAW' as const,
    title: 'How are Digital Signatures verified under IT Rules 2000?',
    sectionSnippet: 'Rules 3-7 • IT (Certifying Authorities) Rules 2000',
    accentColor: '#38bdf8',
    keyTerms: ['Public Key Cryptography', 'ITU X.509 v3', 'Hash Function']
  },
  {
    domain: 'CRIMINAL LAW' as const,
    title: 'What constitutes criminal conspiracy under Section 120A and 120B of IPC?',
    sectionSnippet: 'Chapter VA • Indian Penal Code, 1860',
    accentColor: '#e06c75',
    keyTerms: ['Agreement to Commit Offence', 'Meeting of Minds', 'Joint Liability']
  },
  {
    domain: 'CONSTITUTION' as const,
    title: 'Explain emergency provisions and President’s Rule under Articles 352 and 356',
    sectionSnippet: 'Part XVIII • Emergency Provisions',
    accentColor: '#c5a880',
    keyTerms: ['Proclamation of Emergency', 'Article 356', 'Breakdown of Machinery']
  },
  {
    domain: 'PROPERTY & CYBER' as const,
    title: 'What constitutes cheating and false electronic record under IPC 420 and 464?',
    sectionSnippet: 'Sections 415, 420 & 464 IPC',
    accentColor: '#98c379',
    keyTerms: ['Dishonest Inducement', 'Digital Forgery', 'Valuable Security']
  }
];

export const LEGAL_DOMAINS_LIST: { domain: LegalDomain; count: number; description: string }[] = [
  { domain: 'Constitution', count: 18420, description: 'Fundamental Rights, Due Process & Separation of Powers' },
  { domain: 'Criminal', count: 24150, description: 'Substantive Penal Code, Bail & Evidentiary Discovery' },
  { domain: 'Contract', count: 19800, description: 'Formation, Mutual Assent, Consideration & Breach' },
  { domain: 'Property', count: 12430, description: 'Title, Conveyance, Easements & Adverse Possession' },
  { domain: 'Torts', count: 10290, description: 'Negligence, Strict Liability, Defamation & Nuisance' },
  { domain: 'Corporate', count: 14780, description: 'Fiduciary Duty, Veil Piercing, Mergers & Securities' },
  { domain: 'Case Law', count: 28620, description: 'Appellate Precedent, Stare Decisis & Judicial Holding' }
];
