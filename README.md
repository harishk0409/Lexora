Lexora

Lexora is a legal research assistant built for Indian law. The idea behind the project is simple: instead of searching through different legal documents and case references manually, Lexora brings the relevant information together in one place.

The project uses Retrieval-Augmented Generation (RAG) to retrieve relevant legal material first and then use an AI model to generate a structured response based on those sources.

Lexora is mainly focused on Indian statutes, case law, constitutional provisions, and legal procedures.

«Lexora — The Living Law Archive»

What Lexora Does

Legal Code Cross-Referencing

Lexora provides references between the older Indian criminal-law framework and the newer laws that replaced it.

The current corpus includes:

- Indian Penal Code (IPC)
- Bharatiya Nyaya Sanhita (BNS)
- Code of Criminal Procedure (CrPC)
- Bharatiya Nagarik Suraksha Sanhita (BNSS)

The goal is to make it easier to identify corresponding provisions and understand changes between the older and newer frameworks.

RAG-Based Legal Research

The main part of Lexora is its RAG pipeline.

When a user enters a legal question, the system does not directly ask the AI model to answer from its general knowledge. Instead, it first searches the available legal corpus and retrieves relevant statutes and case references.

The basic flow is:

1. User enters a legal research question.
2. The query is processed by the application.
3. Relevant statutes and case precedents are retrieved.
4. The retrieved content is ranked based on relevance.
5. The relevant information is assembled into a context.
6. The context is sent to Gemini.
7. Gemini generates a structured response using the retrieved material.
8. User feedback can be used to improve citation relevance for future searches.

This approach is intended to keep the generated answers connected to the legal material available in the corpus instead of relying entirely on the model's general knowledge.

Legal Dossiers

Lexora allows a research query to be organized as a legal dossier.

A dossier can contain:

- Legal issues
- Relevant statutory provisions
- Judicial precedents
- Legal reasoning
- Citations
- Follow-up research

This makes it possible to keep related research together instead of treating every search as a separate question.

Precedent Timeline

The precedent timeline displays relevant judicial decisions in chronological order.

This can be useful when researching how a particular legal principle has developed over time or when later decisions have modified or interpreted an earlier decision.

Procedural Checklists

Lexora also includes structured checklists for common legal procedures.

Examples include:

- Bail procedures
- Trial procedures
- Procedural safeguards
- Evidentiary requirements
- Statutory compliance

These checklists are intended to help users organize their research and identify important procedural points.

Precedent Knowledge Graph

The knowledge graph provides a visual way to explore relationships between different legal authorities.

It can be used to connect:

- Cases
- Statutes
- Constitutional provisions
- Legal principles
- Precedents

The purpose is to make connections between authorities easier to explore than through a normal list of search results.

Citation Feedback

Lexora has a basic feedback mechanism for citation relevance.

When a user marks a cited authority as useful or not useful, that feedback can be stored and used to adjust the relevance weight of the authority.

Over time, this can help the retrieval system prioritize sources that have been more useful for similar research queries.

This is currently a simple relevance-weighting approach and can be expanded into a more advanced learning or ranking system in the future.

Courtroom Audio

Lexora also includes an optional interface feature with subtle courtroom-inspired sounds.

These can include:

- Gavel sounds
- Document and page sounds
- Archive-style audio cues

This feature is only for the user interface experience and has no effect on the legal retrieval or AI analysis.

Project Structure

Lexora
│
├── server.ts
│   └── Express backend and API gateway
│
├── server/
│   ├── corpus/
│   │   └── legalCorpus.ts
│   │       └── Legal statutes, precedents and constitutional material
│   │
│   └── rag/
│       ├── ragEngine.ts
│       │   └── Retrieval and Gemini AI pipeline
│       │
│       └── learningStore.ts
│           └── Citation relevance and feedback storage
│
├── src/
│   ├── App.tsx
│   │   └── Main application
│   │
│   ├── components/
│   │   ├── ResearchWorkspace.tsx
│   │   │   └── Legal research and dossier interface
│   │   │
│   │   ├── HistorySidebar.tsx
│   │   │   └── Research history
│   │   │
│   │   ├── DocumentDrawer.tsx
│   │   │   └── Legal document viewer
│   │   │
│   │   └── KnowledgeGraphModal.tsx
│   │       └── Precedent relationship visualization
│   │
│   └── types.ts
│       └── TypeScript type definitions
│
├── public/
│   └── Static assets
│
├── data/
│   └── Application data
│
├── package.json
└── README.md

How the RAG Pipeline Works

The current research flow can be summarized as:

User Query
    │
    ▼
Query Processing
    │
    ▼
Legal Corpus Search
    │
    ├───────────────┐
    ▼               ▼
Statutes        Case Precedents
    │               │
    └───────┬───────┘
            ▼
     Relevance Ranking
            │
            ▼
     Context Assembly
            │
            ▼
        Gemini AI
            │
            ▼
   Structured Response
            │
            ▼
      User Feedback
            │
            ▼
   Relevance Weight Update

Technology Used

Frontend

- React
- TypeScript
- Vite
- HTML/CSS
- Responsive UI components

Backend

- Node.js
- Express
- TypeScript

AI

- Google Gemini API
- Retrieval-Augmented Generation (RAG)

Data and Retrieval

- Structured legal corpus
- Citation relevance weighting
- Research history
- User feedback

Getting Started

Requirements

Before running the project, make sure you have:

- Node.js 18 or later
- npm or Bun
- A Google Gemini API key

Clone the Repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

Replace "YOUR_USERNAME" and "YOUR_REPOSITORY" with your GitHub username and repository name.

Install Dependencies

Using npm:

npm install

Or using Bun:

bun install

Configure Gemini

Create a ".env" file in the root directory.

GEMINI_API_KEY=your_gemini_api_key_here

Do not upload the ".env" file to GitHub.

Add the following to ".gitignore":

.env
node_modules/
dist/

Run the Project

Start the development server with:

npm run dev

Or, if you are using Bun:

bun run dev

The terminal will display the local URL where the application is running.

Building for Production

Create the production build using:

npm run build

Then start the production server using:

npm start

Deployment

Lexora can be deployed on platforms that support Node.js applications.

The general deployment process is:

GitHub Repository
        │
        ▼
Deployment Platform
        │
        ├── Install dependencies
        ├── Configure environment variables
        ├── Build application
        └── Start Node.js server

The Gemini API key needs to be added as an environment variable on the deployment platform:

GEMINI_API_KEY=your_gemini_api_key

Data and Privacy

Lexora may handle information such as:

- Research queries
- Research sessions
- Retrieved legal authorities
- User feedback
- Citation relevance information

The current project is primarily intended for development and research.

For a production deployment, persistent data should be stored in a properly secured database instead of relying only on local storage.

If the application is used with sensitive legal information, additional security measures such as authentication, access control, encryption, and appropriate data-retention policies should be implemented.

Main Files

File| Description
"server.ts"| Backend entry point and API gateway
"server/corpus/legalCorpus.ts"| Stores the legal corpus and statutory data
"server/rag/ragEngine.ts"| Handles retrieval and Gemini AI processing
"server/rag/learningStore.ts"| Stores citation feedback and relevance weights
"src/App.tsx"| Main frontend application
"src/components/ResearchWorkspace.tsx"| Main legal research interface
"src/components/HistorySidebar.tsx"| Research history and previous queries
"src/components/DocumentDrawer.tsx"| Legal document viewer
"src/components/KnowledgeGraphModal.tsx"| Knowledge graph visualization
"src/types.ts"| TypeScript type definitions

Project Objective

The main objective of Lexora is to build a single workspace for researching Indian law.

A typical research process can involve searching through statutes, judgments, amendments, and other legal references separately. Lexora tries to simplify this process by retrieving relevant material and presenting it together with an AI-generated explanation.

The project also explores how RAG can be combined with structured legal data, citation ranking, feedback, timelines, and knowledge graphs to create a more useful legal research workflow.

Future Improvements

There are several areas where Lexora can be expanded.

Some of the planned or possible improvements are:

- Integration with larger and verified Indian legal databases
- Semantic vector search
- Better statute-to-statute mapping
- More advanced case-law retrieval
- Automatic citation verification
- Source reliability indicators
- User authentication
- Secure cloud database
- PDF and document ingestion
- Upload and analysis of case-law documents
- More advanced legal knowledge graphs
- Tracking amendments and different versions of legislation
- Multilingual Indian legal research
- Role-based access control
- Audit logs for research activity

Current Limitations

Lexora is still under development.

The quality of the results depends heavily on the legal documents available in the corpus. A larger and properly verified legal database would be required for a production-level system.

The AI-generated response should also not be treated as automatically correct just because RAG is being used. Retrieved sources still need to be checked, and the system needs reliable source documents and citation verification.

Legal Disclaimer

Lexora is an AI-assisted legal research project and is not a replacement for a qualified legal professional.

Information generated by the application should be independently checked against authoritative sources such as official legislation, government publications, court judgments, and authenticated legal databases.

Lexora should not be used as the sole basis for legal decisions, pleadings, litigation strategy, or professional legal advice.

Project Status

🚧 Active Development

Lexora is currently being developed as a research and development project focused on AI-assisted legal research using Retrieval-Augmented Generation.

The architecture and features may change as development continues.

License

This project is currently intended for educational and research purposes.

