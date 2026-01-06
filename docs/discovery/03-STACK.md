# OneShot - Technology Stack

## CID Framework Phase 3: Stack Selection

---

## 1. Stack Overview

### 1.1 Architecture Summary
```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js 14 (App Router)                       │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │   │
│  │  │   React   │  │ TailwindCSS│  │  Zustand  │  │React Query│    │   │
│  │  │    18     │  │     +      │  │  (State)  │  │  (Cache)  │    │   │
│  │  │           │  │  shadcn/ui │  │           │  │           │    │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              Next.js API Routes + tRPC (optional)                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            BACKEND                                       │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│  │   Supabase │  │  Vercel   │  │  Vercel   │  │ Upstash   │            │
│  │  (Auth +   │  │    AI     │  │   Blob    │  │  Redis    │            │
│  │  Database) │  │   SDK     │  │ (Storage) │  │ (Queue)   │            │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│  │ ElevenLabs│  │  LiveKit  │  │  OpenAI/  │  │  Resend   │            │
│  │  (Voice)  │  │  (WebRTC) │  │ Anthropic │  │  (Email)  │            │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

### 2.1 Framework: Next.js 14 (App Router)

**Selection Rationale:**
| Criteria | Next.js 14 | Create React App | Remix | Nuxt |
|----------|-----------|------------------|-------|------|
| SSR/SSG Support | ✅ Excellent | ❌ None | ✅ Good | ✅ Good |
| API Routes | ✅ Built-in | ❌ None | ✅ Built-in | ✅ Built-in |
| Deployment | ✅ Vercel native | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual |
| Ecosystem | ✅ Largest | ✅ Large | ⚠️ Growing | ⚠️ Vue only |
| Performance | ✅ Excellent | ⚠️ Good | ✅ Excellent | ✅ Good |

**Key Benefits:**
- Server Components for optimal performance
- Built-in API routes eliminate separate backend need
- Vercel deployment with zero-config
- Excellent TypeScript support
- React Server Actions for mutations

### 2.2 UI Framework: TailwindCSS + shadcn/ui

**Selection Rationale:**
| Criteria | shadcn/ui | Material UI | Chakra UI | Ant Design |
|----------|-----------|-------------|-----------|------------|
| Customization | ✅ Full control | ⚠️ Theme-based | ⚠️ Theme-based | ⚠️ Limited |
| Bundle Size | ✅ Minimal | ❌ Large | ⚠️ Medium | ❌ Large |
| Accessibility | ✅ Radix-based | ✅ Built-in | ✅ Built-in | ⚠️ Partial |
| Design Quality | ✅ Modern | ⚠️ Material | ✅ Modern | ⚠️ Enterprise |
| Learning Curve | ✅ Low | ⚠️ Medium | ✅ Low | ⚠️ Medium |

**Key Benefits:**
- Copy-paste components (own the code)
- Built on Radix UI primitives (accessibility)
- Tailwind-native styling
- Easy to customize and extend
- No vendor lock-in

### 2.3 State Management: Zustand + React Query

**Selection Rationale:**
| Criteria | Zustand | Redux Toolkit | Jotai | Recoil |
|----------|---------|---------------|-------|--------|
| Boilerplate | ✅ Minimal | ⚠️ Medium | ✅ Minimal | ⚠️ Medium |
| Bundle Size | ✅ ~2KB | ❌ ~40KB | ✅ ~3KB | ⚠️ ~20KB |
| Learning Curve | ✅ Easy | ⚠️ Steep | ✅ Easy | ⚠️ Medium |
| DevTools | ✅ Available | ✅ Excellent | ⚠️ Basic | ⚠️ Basic |
| TypeScript | ✅ Excellent | ✅ Excellent | ✅ Good | ⚠️ Good |

**Architecture:**
```typescript
// Client State: Zustand
// - UI state (sidebar open/closed)
// - Session state (current project, user preferences)
// - Transient state (form data, modals)

// Server State: React Query (TanStack Query)
// - API data caching
// - Background refetching
// - Optimistic updates
// - Pagination/infinite scroll
```

---

## 3. Backend Stack

### 3.1 Database & Auth: Supabase

**Selection Rationale:**
| Criteria | Supabase | Firebase | PlanetScale | Neon |
|----------|----------|----------|-------------|------|
| PostgreSQL | ✅ Native | ❌ NoSQL | ✅ MySQL | ✅ Native |
| Auth Built-in | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Real-time | ✅ Native | ✅ Native | ❌ No | ❌ No |
| Row-level Security | ✅ Yes | ⚠️ Rules | ❌ No | ❌ No |
| Storage | ✅ Included | ✅ Included | ❌ No | ❌ No |
| Pricing | ✅ Generous | ⚠️ Complex | ✅ Good | ✅ Good |

**Key Features Used:**
- **Auth**: Email/password, OAuth (Google, GitHub)
- **Database**: PostgreSQL with RLS policies
- **Real-time**: Live subscriptions for collaboration
- **Storage**: Project files and recordings
- **Edge Functions**: Serverless processing

### 3.2 AI Integration: Vercel AI SDK

**Selection Rationale:**
| Criteria | Vercel AI SDK | LangChain | Direct API |
|----------|---------------|-----------|------------|
| Streaming | ✅ Built-in | ✅ Built-in | ⚠️ Manual |
| React Hooks | ✅ Native | ❌ None | ❌ None |
| Multi-provider | ✅ Yes | ✅ Yes | ❌ No |
| Edge Runtime | ✅ Optimized | ⚠️ Possible | ⚠️ Possible |
| Bundle Size | ✅ Light | ❌ Heavy | ✅ Light |

**AI Providers:**
```typescript
// Primary: Anthropic Claude (discovery conversations)
// - Claude 3.5 Sonnet for fast responses
// - Claude 3 Opus for complex analysis

// Secondary: OpenAI (fallback + specific tasks)
// - GPT-4 Turbo for document generation
// - Whisper for transcription (meeting recordings)
```

### 3.3 File Storage: Vercel Blob + Supabase Storage

**Usage Split:**
| Content Type | Storage | Reason |
|--------------|---------|--------|
| User uploads | Supabase Storage | RLS integration |
| Generated docs | Vercel Blob | Edge delivery |
| Meeting recordings | Supabase Storage | Large files, longer retention |
| Static assets | Vercel Edge | CDN distribution |

---

## 4. External Service Integrations

### 4.1 Voice: ElevenLabs

**Integration Architecture:**
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Browser    │───▶│  WebSocket   │───▶│  ElevenLabs  │
│  (Audio In)  │    │   Server     │    │     API      │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                    │
       │                   ▼                    │
       │            ┌──────────────┐            │
       │            │   AI Model   │            │
       │            │  Processing  │            │
       │            └──────────────┘            │
       │                   │                    │
       ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Browser    │◀───│  WebSocket   │◀───│  ElevenLabs  │
│ (Audio Out)  │    │   Server     │    │   (TTS)      │
└──────────────┘    └──────────────┘    └──────────────┘
```

**API Usage:**
- **Speech-to-Text**: Real-time transcription via WebSocket
- **Text-to-Speech**: AI response vocalization
- **Voice Cloning** (Future): Custom AI voice per project

**Cost Considerations:**
| Tier | Characters/Month | Cost | Use Case |
|------|-----------------|------|----------|
| Starter | 30,000 | $5 | Development |
| Creator | 100,000 | $22 | MVP Launch |
| Pro | 500,000 | $99 | Growth |
| Scale | 2M+ | $330+ | Scale |

### 4.2 Real-time Meetings: LiveKit

**Integration Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                         LiveKit Cloud                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    LiveKit Server                          │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │  │
│  │  │  Room   │  │  Track  │  │ Record  │  │  Egress │      │  │
│  │  │ Manager │  │ Router  │  │ Service │  │ Service │      │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ Client  │    │ Client  │    │ Client  │    │   AI    │
   │    1    │    │    2    │    │    3    │    │ Agent   │
   └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

**Key Features:**
- **Room Management**: Create/join discovery sessions
- **Track Publishing**: Audio/video/screen share
- **Recording**: Automatic meeting capture
- **AI Agent**: LiveKit Agents for AI participation

**React Integration:**
```typescript
// Using @livekit/components-react
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

// Room token generated server-side
// Participant management via LiveKit hooks
// Recording triggered via API
```

### 4.3 Email: Resend

**Use Cases:**
- Welcome emails
- Password reset
- Session invitations
- Document ready notifications

**Selection Rationale:**
| Criteria | Resend | SendGrid | Postmark | AWS SES |
|----------|--------|----------|----------|---------|
| Developer UX | ✅ Excellent | ⚠️ Good | ✅ Good | ⚠️ Complex |
| React Email | ✅ Native | ❌ No | ❌ No | ❌ No |
| Pricing | ✅ Generous | ⚠️ Complex | ⚠️ Per email | ✅ Cheap |
| Deliverability | ✅ High | ✅ High | ✅ Highest | ⚠️ Variable |

---

## 5. Infrastructure

### 5.1 Deployment: Vercel

**Configuration:**
```
├── Production
│   ├── Branch: main
│   ├── Domain: oneshot.app
│   └── Environment: Production
├── Staging
│   ├── Branch: staging
│   ├── Domain: staging.oneshot.app
│   └── Environment: Preview
└── Development
    ├── Branch: * (PRs)
    ├── Domain: *.vercel.app
    └── Environment: Preview
```

**Vercel Features Used:**
- Edge Functions (API routes)
- Edge Config (feature flags)
- Analytics (Web Vitals)
- Speed Insights
- Cron Jobs (scheduled tasks)

### 5.2 Monitoring & Observability

| Tool | Purpose | Integration |
|------|---------|-------------|
| Vercel Analytics | Web Vitals, performance | Built-in |
| Sentry | Error tracking | SDK |
| PostHog | Product analytics | SDK |
| Axiom | Log aggregation | Vercel integration |

### 5.3 Development Tools

| Tool | Purpose |
|------|---------|
| TypeScript | Type safety |
| ESLint | Code quality |
| Prettier | Code formatting |
| Husky | Git hooks |
| lint-staged | Pre-commit checks |
| Vitest | Unit testing |
| Playwright | E2E testing |

---

## 6. Package Manifest

### 6.1 Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",

    "@supabase/supabase-js": "^2.42.0",
    "@supabase/ssr": "^0.3.0",

    "ai": "^3.1.0",
    "@ai-sdk/anthropic": "^0.0.30",
    "@ai-sdk/openai": "^0.0.30",

    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",

    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.32.0",

    "@livekit/components-react": "^2.1.0",
    "livekit-client": "^2.1.0",

    "resend": "^3.2.0",
    "@react-email/components": "^0.0.17",

    "zod": "^3.23.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.372.0"
  }
}
```

### 6.2 Development Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",

    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "@typescript-eslint/eslint-plugin": "^7.7.0",

    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",

    "husky": "^9.0.0",
    "lint-staged": "^15.2.0",

    "vitest": "^1.5.0",
    "@testing-library/react": "^15.0.0",
    "playwright": "^1.43.0",

    "@sentry/nextjs": "^7.110.0",
    "posthog-js": "^1.121.0"
  }
}
```

---

## 7. Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=https://oneshot.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# LiveKit
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=

# Email
RESEND_API_KEY=

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Feature Flags (Vercel Edge Config)
EDGE_CONFIG=
```

---

## 8. Cost Estimation (Monthly)

### 8.1 Development Phase
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| ElevenLabs | Starter | $5 |
| LiveKit | Free | $0 |
| Anthropic | Pay-as-go | ~$20 |
| **Total** | | **~$25/mo** |

### 8.2 MVP Launch (100 users)
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| ElevenLabs | Creator | $22 |
| LiveKit | Starter | $50 |
| Anthropic | Pay-as-go | ~$100 |
| Resend | Free | $0 |
| **Total** | | **~$217/mo** |

### 8.3 Growth Phase (1000 users)
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| ElevenLabs | Pro | $99 |
| LiveKit | Growth | $150 |
| Anthropic | Pay-as-go | ~$500 |
| Resend | Pro | $20 |
| **Total** | | **~$814/mo** |

---

*Document Version: 1.0*
*Created: 2026-01-06*
*Status: Draft - Pending Review*
