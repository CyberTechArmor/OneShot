# OneShot: Collaborative Intelligence Development Platform

## CID Framework - Phase 3: Stack

---

## 3.1 Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ONESHOT TECH STACK                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FRONTEND                    BACKEND                    INFRASTRUCTURE      │
│  ─────────                   ───────                    ──────────────      │
│  Next.js 14+                 Next.js API Routes         Vercel              │
│  React 18+                   tRPC                       Cloudflare R2       │
│  TypeScript                  Prisma ORM                 Neon PostgreSQL     │
│  Tailwind CSS                NextAuth.js                Upstash Redis       │
│  shadcn/ui                   Zod Validation             GitHub Actions      │
│                                                                             │
│  REAL-TIME                   AI/ML                      VOICE               │
│  ─────────                   ─────                      ─────               │
│  LiveKit                     Anthropic Claude           ElevenLabs          │
│  Socket.io                   OpenAI (fallback)          Deepgram (STT)      │
│  Pusher (fallback)           LangChain                  Web Speech API      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.2 Frontend Stack

### 3.2.1 Core Framework

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Next.js** | 14+ | React Framework | App Router, Server Components, API Routes, Edge Runtime |
| **React** | 18+ | UI Library | Concurrent features, Suspense, Server Components support |
| **TypeScript** | 5+ | Type Safety | Compile-time error catching, better DX, self-documenting |

### 3.2.2 Styling & UI

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Tailwind CSS** | Utility-first CSS | Rapid development, consistent design, small bundle |
| **shadcn/ui** | Component Library | Accessible, customizable, copy-paste components |
| **Radix UI** | Primitive Components | Underlying primitives for shadcn, accessibility built-in |
| **Framer Motion** | Animations | Smooth transitions, gesture support |
| **Lucide React** | Icons | Consistent icon set, tree-shakeable |

### 3.2.3 State & Data Management

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **TanStack Query** | Server State | Caching, background updates, optimistic updates |
| **Zustand** | Client State | Lightweight, simple API, no boilerplate |
| **React Hook Form** | Form Management | Performance, validation integration |
| **Zod** | Schema Validation | TypeScript-first, runtime validation |

### 3.2.4 Frontend Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",

    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",

    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-popover": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",

    "framer-motion": "^10.0.0",
    "lucide-react": "^0.300.0",

    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",

    "@livekit/components-react": "^1.4.0",
    "livekit-client": "^1.15.0",

    "date-fns": "^2.30.0",
    "sonner": "^1.2.0"
  }
}
```

---

## 3.3 Backend Stack

### 3.3.1 API Layer

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Next.js API Routes** | HTTP Endpoints | Co-located with frontend, serverless |
| **tRPC** | Type-safe API | End-to-end type safety, no code generation |
| **Zod** | Validation | Shared schemas between client/server |

### 3.3.2 Authentication

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **NextAuth.js v5** | Auth Framework | OAuth providers, JWT/session support, Next.js native |
| **Providers** | OAuth | Google, GitHub, Email Magic Link |

```typescript
// Auth Configuration
const authConfig = {
  providers: [
    Google({ clientId, clientSecret }),
    GitHub({ clientId, clientSecret }),
    Email({ server, from }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
```

### 3.3.3 Database & ORM

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Prisma** | ORM | Type-safe queries, migrations, schema management |
| **Neon PostgreSQL** | Primary Database | Serverless Postgres, branching, auto-scaling |
| **Upstash Redis** | Cache/Sessions | Serverless Redis, rate limiting, real-time presence |

### 3.3.4 Backend Dependencies

```json
{
  "dependencies": {
    "@trpc/server": "^10.45.0",
    "@trpc/client": "^10.45.0",
    "@trpc/react-query": "^10.45.0",
    "@trpc/next": "^10.45.0",

    "next-auth": "^5.0.0-beta.0",
    "@auth/prisma-adapter": "^1.0.0",

    "@prisma/client": "^5.7.0",
    "@neondatabase/serverless": "^0.6.0",
    "@upstash/redis": "^1.27.0",
    "@upstash/ratelimit": "^1.0.0",

    "livekit-server-sdk": "^1.2.0",

    "@anthropic-ai/sdk": "^0.10.0",
    "openai": "^4.20.0",
    "langchain": "^0.1.0"
  },
  "devDependencies": {
    "prisma": "^5.7.0"
  }
}
```

---

## 3.4 AI/ML Integration

### 3.4.1 Primary AI Provider: Anthropic Claude

```typescript
// AI Service Configuration
const aiConfig = {
  primary: {
    provider: "anthropic",
    model: "claude-3-opus-20240229",
    fallbackModel: "claude-3-sonnet-20240229",
    maxTokens: 4096,
    temperature: 0.7,
  },
  fallback: {
    provider: "openai",
    model: "gpt-4-turbo-preview",
    maxTokens: 4096,
  },
};
```

### 3.4.2 Discovery AI System Prompt

```typescript
const discoverySystemPrompt = `
You are OneShot's Discovery AI, an expert at guiding users through
software project discovery sessions. Your role is to:

1. Ask thoughtful, probing questions to understand the project vision
2. Help users articulate their requirements clearly
3. Identify potential challenges and edge cases
4. Structure conversations into actionable discovery documents

Guidelines:
- Ask one focused question at a time
- Acknowledge and summarize user responses before moving forward
- Cover these topics progressively:
  • Project overview and goals
  • Target users and personas
  • Core features and functionality
  • Technical requirements and constraints
  • Success metrics and KPIs
  • Timeline and resource considerations

Always be encouraging but thorough. Your goal is to produce a
comprehensive discovery document that developers can use to
begin implementation.
`;
```

### 3.4.3 AI Response Processing

```typescript
interface AIDiscoveryResponse {
  message: string;           // Response to user
  metadata: {
    topic: string;           // Current discovery topic
    progress: number;        // 0-100 completion estimate
    nextTopics: string[];    // Upcoming topics
    extractedInfo: {         // Structured data extracted
      features?: string[];
      requirements?: string[];
      constraints?: string[];
    };
  };
}
```

---

## 3.5 Voice Integration

### 3.5.1 ElevenLabs (Text-to-Speech)

```typescript
// ElevenLabs Configuration
const elevenlabsConfig = {
  apiKey: process.env.ELEVENLABS_API_KEY,
  defaultVoice: "rachel",    // Professional female voice
  voiceOptions: [
    { id: "rachel", name: "Rachel", style: "Professional" },
    { id: "josh", name: "Josh", style: "Friendly" },
    { id: "bella", name: "Bella", style: "Warm" },
  ],
  settings: {
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.0,
    speakerBoost: true,
  },
  outputFormat: "mp3_44100_128",
};

// Voice Synthesis Service
interface VoiceSynthesisService {
  synthesize(text: string, voiceId?: string): Promise<ArrayBuffer>;
  streamSynthesize(text: string, voiceId?: string): ReadableStream;
}
```

### 3.5.2 Speech-to-Text Options

| Provider | Use Case | Rationale |
|----------|----------|-----------|
| **Deepgram** | Primary STT | Real-time streaming, high accuracy, affordable |
| **Web Speech API** | Fallback | Browser-native, no cost, privacy-friendly |
| **OpenAI Whisper** | Batch Processing | High accuracy for recordings |

```typescript
// STT Configuration
const sttConfig = {
  primary: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
    punctuate: true,
    interimResults: true,
  },
  fallback: {
    provider: "webspeech",
    language: "en-US",
    continuous: true,
  },
};
```

---

## 3.6 Real-time Communication (LiveKit)

### 3.6.1 LiveKit Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      LIVEKIT INTEGRATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Client (Browser)                LiveKit Cloud                 │
│   ────────────────                ─────────────                 │
│                                                                 │
│   ┌─────────────────┐            ┌─────────────────┐           │
│   │  LiveKit React  │◄──────────▶│  LiveKit SFU    │           │
│   │   Components    │   WebRTC   │  Media Server   │           │
│   └────────┬────────┘            └────────┬────────┘           │
│            │                              │                     │
│            │                              │                     │
│   ┌────────▼────────┐            ┌────────▼────────┐           │
│   │   Audio Track   │            │   Recording     │           │
│   │   Management    │            │   (Egress)      │           │
│   └─────────────────┘            └─────────────────┘           │
│                                                                 │
│   OneShot Server                                                │
│   ──────────────                                                │
│   ┌─────────────────┐                                          │
│   │  LiveKit Server │  Generate tokens, manage rooms            │
│   │      SDK        │  Handle webhooks, process recordings      │
│   └─────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.6.2 LiveKit Configuration

```typescript
// LiveKit Server Configuration
const livekitConfig = {
  host: process.env.LIVEKIT_URL,
  apiKey: process.env.LIVEKIT_API_KEY,
  apiSecret: process.env.LIVEKIT_API_SECRET,

  roomDefaults: {
    emptyTimeout: 300,         // 5 minutes
    maxParticipants: 10,
    metadata: JSON.stringify({
      type: "discovery",
    }),
  },

  recordingConfig: {
    output: {
      s3: {
        bucket: process.env.R2_BUCKET,
        accessKey: process.env.R2_ACCESS_KEY,
        secret: process.env.R2_SECRET_KEY,
        endpoint: process.env.R2_ENDPOINT,
      },
    },
    preset: "H264_720P_30",
  },
};

// Token Generation
async function generateLiveKitToken(
  roomName: string,
  participantName: string,
  isHost: boolean
): Promise<string> {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: "4h",
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: isHost,
    roomRecord: isHost,
  });

  return at.toJwt();
}
```

### 3.6.3 LiveKit React Components Usage

```tsx
// Discovery Session Component
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
  ControlBar,
} from "@livekit/components-react";

function DiscoverySession({ token, serverUrl, roomName }) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
    >
      <RoomAudioRenderer />
      <ParticipantsList />
      <DiscoveryChat />
      <SessionControls />
    </LiveKitRoom>
  );
}
```

---

## 3.7 Infrastructure & Deployment

### 3.7.1 Hosting: Vercel

```yaml
# vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### 3.7.2 Database: Neon PostgreSQL

```typescript
// Database Configuration
const dbConfig = {
  provider: "neon",
  connectionString: process.env.DATABASE_URL,
  pooling: {
    enabled: true,
    maxConnections: 10,
  },
  branching: {
    enabled: true,
    previewBranches: true,
  },
};
```

### 3.7.3 Object Storage: Cloudflare R2

```typescript
// R2 Configuration
const storageConfig = {
  provider: "cloudflare-r2",
  buckets: {
    recordings: "oneshot-recordings",
    documents: "oneshot-documents",
    avatars: "oneshot-avatars",
  },
  publicUrl: process.env.R2_PUBLIC_URL,
  maxFileSize: 500 * 1024 * 1024, // 500MB for recordings
};
```

### 3.7.4 CI/CD: GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 3.8 Environment Configuration

### 3.8.1 Environment Variables

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://...@neon.tech/oneshot

# Redis
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# AI
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Voice
ELEVENLABS_API_KEY=...
DEEPGRAM_API_KEY=...

# LiveKit
LIVEKIT_URL=wss://...livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...

# Storage
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=oneshot-storage
R2_PUBLIC_URL=https://...r2.cloudflarestorage.com
```

---

## 3.9 Third-Party Service Costs (Estimated)

| Service | Tier | Est. Monthly Cost | Notes |
|---------|------|-------------------|-------|
| Vercel | Pro | $20 | Hosting, edge functions |
| Neon | Launch | $19 | PostgreSQL, auto-suspend |
| Upstash | Pay-as-you-go | $10 | Redis, rate limiting |
| Cloudflare R2 | Free tier + usage | $5-20 | Storage, egress |
| LiveKit | Growth | $50-100 | Real-time audio, recording |
| ElevenLabs | Creator | $22 | Text-to-speech |
| Deepgram | Pay-as-you-go | $20-50 | Speech-to-text |
| Anthropic | Pay-as-you-go | $50-200 | AI processing |
| **Total** | | **$196-441** | |

---

## 3.10 Development Tools

### 3.10.1 Required Tools

```bash
# Node.js version
node >= 20.0.0

# Package manager
pnpm >= 8.0.0

# Database tools
prisma >= 5.0.0

# Development
- VS Code with recommended extensions
- ESLint + Prettier
- TypeScript strict mode
```

### 3.10.2 Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "mikestead.dotenv",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Stack Definition Complete*
