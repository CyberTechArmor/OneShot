# OneShot: Collaborative Intelligence Development Platform

## CID Framework - Phase 4: Build

---

## 4.1 Project Structure

```
oneshot/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Lint, type-check, test
│   │   ├── deploy-preview.yml     # Preview deployments
│   │   └── deploy-production.yml  # Production deployment
│   └── PULL_REQUEST_TEMPLATE.md
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── seed.ts                    # Seed data
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── og-image.png
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth route group
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/           # Dashboard route group
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx       # Projects list
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx   # Project detail
│   │   │   │       ├── discovery/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── files/
│   │   │   │           └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx         # Dashboard layout with sidebar
│   │   │
│   │   ├── (session)/             # LiveKit session routes
│   │   │   ├── session/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Live session page
│   │   │   └── join/
│   │   │       └── [token]/
│   │   │           └── page.tsx   # Join via invite link
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── trpc/
│   │   │   │   └── [trpc]/
│   │   │   │       └── route.ts
│   │   │   ├── voice/
│   │   │   │   ├── synthesize/
│   │   │   │   │   └── route.ts
│   │   │   │   └── transcribe/
│   │   │   │       └── route.ts
│   │   │   ├── livekit/
│   │   │   │   ├── token/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   └── ai/
│   │   │       └── discovery/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   ├── globals.css
│   │   └── providers.tsx          # Client providers
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── user-menu.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── project-grid.tsx
│   │   │   ├── project-card.tsx
│   │   │   ├── new-project-card.tsx
│   │   │   └── empty-state.tsx
│   │   │
│   │   ├── discovery/
│   │   │   ├── discovery-chat.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-item.tsx
│   │   │   ├── message-input.tsx
│   │   │   ├── voice-button.tsx
│   │   │   └── voice-overlay.tsx
│   │   │
│   │   ├── session/
│   │   │   ├── session-room.tsx
│   │   │   ├── participant-list.tsx
│   │   │   ├── participant-card.tsx
│   │   │   ├── session-controls.tsx
│   │   │   ├── recording-indicator.tsx
│   │   │   └── invite-modal.tsx
│   │   │
│   │   └── shared/
│   │       ├── loading-spinner.tsx
│   │       ├── avatar.tsx
│   │       ├── error-boundary.tsx
│   │       └── empty-placeholder.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── db.ts                  # Prisma client
│   │   ├── redis.ts               # Upstash Redis client
│   │   ├── trpc/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── routers/
│   │   │       ├── index.ts
│   │   │       ├── user.ts
│   │   │       ├── project.ts
│   │   │       ├── conversation.ts
│   │   │       └── session.ts
│   │   ├── ai/
│   │   │   ├── client.ts          # AI provider client
│   │   │   ├── discovery.ts       # Discovery AI logic
│   │   │   └── prompts.ts         # System prompts
│   │   ├── voice/
│   │   │   ├── elevenlabs.ts      # ElevenLabs client
│   │   │   ├── deepgram.ts        # Deepgram client
│   │   │   └── web-speech.ts      # Web Speech API wrapper
│   │   ├── livekit/
│   │   │   ├── server.ts          # LiveKit server SDK
│   │   │   └── client.ts          # LiveKit client helpers
│   │   ├── storage/
│   │   │   └── r2.ts              # Cloudflare R2 client
│   │   └── utils/
│   │       ├── cn.ts              # Class name utility
│   │       ├── format.ts          # Formatting utilities
│   │       └── validation.ts      # Shared validators
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-projects.ts
│   │   ├── use-discovery.ts
│   │   ├── use-voice.ts
│   │   ├── use-livekit.ts
│   │   └── use-media-query.ts
│   │
│   ├── stores/
│   │   ├── ui-store.ts            # UI state (sidebar, modals)
│   │   ├── voice-store.ts         # Voice recording state
│   │   └── session-store.ts       # LiveKit session state
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── database.ts
│   │   └── discovery.ts
│   │
│   └── config/
│       ├── site.ts                # Site metadata
│       ├── navigation.ts          # Navigation config
│       └── constants.ts           # App constants
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   └── discovery/
│       ├── 01-DISCOVERY.md
│       ├── 02-DESIGN.md
│       ├── 03-STACK.md
│       ├── 04-BUILD.md
│       └── 05-SECURITY.md
│
├── .env.example
├── .env.local                     # Local environment (gitignored)
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── components.json                # shadcn/ui config
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4.2 Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// =====================
// AUTH MODELS
// =====================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// =====================
// USER MODEL
// =====================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Preferences stored as JSON
  preferences   Json      @default("{}")

  // Relations
  accounts      Account[]
  sessions      Session[]
  ownedProjects Project[]
  memberships   ProjectMember[]
  messages      Message[]
  hostedSessions LiveSession[]

  @@index([email])
}

// =====================
// PROJECT MODELS
// =====================

model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  icon        String?       @default("📁")
  status      ProjectStatus @default(DISCOVERY)
  progress    Int           @default(0)
  settings    Json          @default("{}")

  ownerId     String
  owner       User          @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  members       ProjectMember[]
  conversations Conversation[]
  files         ProjectFile[]
  sessions      LiveSession[]
  documents     DiscoveryDocument[]

  @@index([ownerId])
  @@index([status])
}

enum ProjectStatus {
  DISCOVERY
  IN_PROGRESS
  COMPLETED
  ARCHIVED
}

model ProjectMember {
  id        String   @id @default(cuid())
  role      MemberRole @default(MEMBER)
  joinedAt  DateTime @default(now())

  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([projectId])
  @@index([userId])
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

model ProjectFile {
  id          String   @id @default(cuid())
  name        String
  type        FileType
  storagePath String
  sizeBytes   Int
  mimeType    String?
  metadata    Json     @default("{}")

  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([projectId])
  @@index([type])
}

enum FileType {
  RECORDING
  TRANSCRIPT
  DOCUMENT
  EXPORT
  ATTACHMENT
}

// =====================
// CONVERSATION MODELS
// =====================

model Conversation {
  id        String             @id @default(cuid())
  type      ConversationType   @default(CHAT)
  status    ConversationStatus @default(ACTIVE)
  metadata  Json               @default("{}")

  projectId String
  project   Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)

  startedAt DateTime           @default(now())
  endedAt   DateTime?

  // Relations
  messages  Message[]

  @@index([projectId])
  @@index([status])
}

enum ConversationType {
  CHAT
  VOICE
  MEETING
}

enum ConversationStatus {
  ACTIVE
  PAUSED
  COMPLETED
}

model Message {
  id             String      @id @default(cuid())
  content        String      @db.Text
  senderType     SenderType
  voiceAudioUrl  String?
  metadata       Json        @default("{}")

  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  senderId       String?
  sender         User?       @relation(fields: [senderId], references: [id], onDelete: SetNull)

  createdAt      DateTime    @default(now())

  @@index([conversationId])
  @@index([senderId])
  @@index([createdAt])
}

enum SenderType {
  USER
  AI
  SYSTEM
}

// =====================
// LIVE SESSION MODELS
// =====================

model LiveSession {
  id            String        @id @default(cuid())
  livekitRoomId String        @unique
  inviteToken   String        @unique @default(cuid())
  status        SessionStatus @default(WAITING)
  settings      Json          @default("{}")

  projectId     String
  project       Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)

  hostId        String
  host          User          @relation(fields: [hostId], references: [id], onDelete: Cascade)

  startedAt     DateTime      @default(now())
  endedAt       DateTime?

  // Relations
  recordings    Recording[]

  @@index([projectId])
  @@index([hostId])
  @@index([inviteToken])
}

enum SessionStatus {
  WAITING
  ACTIVE
  ENDED
}

model Recording {
  id              String          @id @default(cuid())
  storagePath     String
  durationSeconds Int?
  transcriptPath  String?
  status          RecordingStatus @default(PROCESSING)

  sessionId       String
  session         LiveSession     @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  createdAt       DateTime        @default(now())

  @@index([sessionId])
}

enum RecordingStatus {
  PROCESSING
  READY
  FAILED
}

// =====================
// DISCOVERY DOCUMENT
// =====================

model DiscoveryDocument {
  id            String         @id @default(cuid())
  version       Int            @default(1)
  content       Json           // Structured discovery content
  status        DocumentStatus @default(DRAFT)
  exportFormats String[]       @default([])

  projectId     String
  project       Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)

  generatedAt   DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([projectId])
  @@index([status])
}

enum DocumentStatus {
  DRAFT
  REVIEW
  APPROVED
}
```

---

## 4.3 Implementation Roadmap

### Phase 1: Foundation (Sprint 1-2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: FOUNDATION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sprint 1: Project Setup & Auth                                             │
│  ─────────────────────────────                                              │
│  □ Initialize Next.js 14 project with TypeScript                            │
│  □ Configure Tailwind CSS + shadcn/ui                                       │
│  □ Set up Prisma with Neon PostgreSQL                                       │
│  □ Implement NextAuth.js with OAuth providers                               │
│  □ Create auth pages (signin, signup)                                       │
│  □ Set up tRPC with basic routers                                           │
│  □ Configure ESLint, Prettier, Husky                                        │
│  □ Set up GitHub Actions CI pipeline                                        │
│                                                                             │
│  Sprint 2: Core Layout & Dashboard                                          │
│  ─────────────────────────────────                                          │
│  □ Build responsive layout (header, sidebar)                                │
│  □ Implement collapsible sidebar                                            │
│  □ Create dashboard page with project grid                                  │
│  □ Build project card component                                             │
│  □ Create "new project" card/modal                                          │
│  □ Implement empty state for new users                                      │
│  □ Add user menu and settings page                                          │
│  □ Deploy to Vercel (staging)                                               │
│                                                                             │
│  Deliverables:                                                              │
│  ✓ Working auth flow                                                        │
│  ✓ Dashboard with project cards                                             │
│  ✓ Basic project CRUD                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Discovery Chat (Sprint 3-4)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASE 2: DISCOVERY CHAT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sprint 3: Chat Interface                                                   │
│  ────────────────────────                                                   │
│  □ Build chat interface layout                                              │
│  □ Create message components (user, AI, system)                             │
│  □ Implement message input with send button                                 │
│  □ Set up conversation data model                                           │
│  □ Build message persistence (save to DB)                                   │
│  □ Add typing indicators                                                    │
│  □ Implement message streaming UI                                           │
│  □ Add conversation history loading                                         │
│                                                                             │
│  Sprint 4: AI Integration                                                   │
│  ────────────────────────                                                   │
│  □ Integrate Anthropic Claude API                                           │
│  □ Create discovery system prompt                                           │
│  □ Implement streaming responses                                            │
│  □ Build conversation context management                                    │
│  □ Add topic tracking and progress                                          │
│  □ Create discovery document generation                                     │
│  □ Implement export functionality (MD, JSON)                                │
│  □ Add error handling and rate limiting                                     │
│                                                                             │
│  Deliverables:                                                              │
│  ✓ Working chat-based discovery                                             │
│  ✓ AI-guided conversation                                                   │
│  ✓ Discovery document generation                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 3: Voice Integration (Sprint 5-6)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASE 3: VOICE INTEGRATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sprint 5: Speech-to-Text                                                   │
│  ────────────────────────                                                   │
│  □ Integrate Deepgram streaming STT                                         │
│  □ Build voice recording button component                                   │
│  □ Implement Web Speech API fallback                                        │
│  □ Create voice recording state management                                  │
│  □ Add real-time transcription display                                      │
│  □ Handle microphone permissions                                            │
│  □ Add voice activity detection                                             │
│  □ Test cross-browser compatibility                                         │
│                                                                             │
│  Sprint 6: Text-to-Speech                                                   │
│  ────────────────────────                                                   │
│  □ Integrate ElevenLabs API                                                 │
│  □ Build voice synthesis service                                            │
│  □ Create audio playback component                                          │
│  □ Add voice selection settings                                             │
│  □ Implement streaming audio playback                                       │
│  □ Add voice mode toggle (text/voice)                                       │
│  □ Create voice overlay UI                                                  │
│  □ Optimize for latency                                                     │
│                                                                             │
│  Deliverables:                                                              │
│  ✓ Full voice input/output                                                  │
│  ✓ Seamless text/voice switching                                            │
│  ✓ Voice settings customization                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 4: Real-time Collaboration (Sprint 7-8)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 4: REAL-TIME COLLABORATION                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sprint 7: LiveKit Integration                                              │
│  ─────────────────────────────                                              │
│  □ Set up LiveKit Cloud account                                             │
│  □ Implement token generation API                                           │
│  □ Build session room component                                             │
│  □ Create participant list UI                                               │
│  □ Add audio track management                                               │
│  □ Implement mute/unmute controls                                           │
│  □ Build session controls component                                         │
│  □ Handle participant join/leave events                                     │
│                                                                             │
│  Sprint 8: Collaboration Features                                           │
│  ─────────────────────────────                                              │
│  □ Create shareable invite links                                            │
│  □ Build invite modal component                                             │
│  □ Implement join via link flow                                             │
│  □ Add session recording (LiveKit Egress)                                   │
│  □ Set up R2 storage for recordings                                         │
│  □ Create recording playback                                                │
│  □ Add transcript generation from recordings                                │
│  □ Implement session chat alongside voice                                   │
│                                                                             │
│  Deliverables:                                                              │
│  ✓ Real-time voice sessions                                                 │
│  ✓ Invite links and join flow                                               │
│  ✓ Session recording and playback                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 5: Polish & Launch (Sprint 9-10)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASE 5: POLISH & LAUNCH                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sprint 9: File Management & Export                                         │
│  ──────────────────────────────────                                         │
│  □ Build project files view                                                 │
│  □ Implement file upload/download                                           │
│  □ Create document export (PDF, MD, JSON)                                   │
│  □ Add file preview functionality                                           │
│  □ Implement storage quotas                                                 │
│  □ Build notifications system                                               │
│  □ Add email notifications                                                  │
│  □ Create activity feed                                                     │
│                                                                             │
│  Sprint 10: Testing & Launch                                                │
│  ───────────────────────────                                                │
│  □ Write unit tests (70% coverage)                                          │
│  □ Create integration tests                                                 │
│  □ Set up E2E tests with Playwright                                         │
│  □ Performance optimization                                                 │
│  □ Security audit                                                           │
│  □ Create documentation                                                     │
│  □ Set up monitoring (Sentry, Vercel Analytics)                             │
│  □ Production deployment                                                    │
│                                                                             │
│  Deliverables:                                                              │
│  ✓ Complete file management                                                 │
│  ✓ Full test coverage                                                       │
│  ✓ Production-ready deployment                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.4 Key Component Implementations

### 4.4.1 Discovery Chat Component

```tsx
// src/components/discovery/discovery-chat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useDiscovery } from "@/hooks/use-discovery";
import { useVoice } from "@/hooks/use-voice";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { VoiceOverlay } from "./voice-overlay";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Users } from "lucide-react";

interface DiscoveryChatProps {
  projectId: string;
  conversationId?: string;
}

export function DiscoveryChat({ projectId, conversationId }: DiscoveryChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voiceMode, setVoiceMode] = useState(false);

  const {
    messages,
    isLoading,
    isAiTyping,
    sendMessage,
    startNewConversation,
  } = useDiscovery(projectId, conversationId);

  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    synthesize,
  } = useVoice();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle voice message
  const handleVoiceMessage = async () => {
    if (isRecording) {
      const finalTranscript = await stopRecording();
      if (finalTranscript) {
        await sendMessage(finalTranscript);
      }
    } else {
      await startRecording();
    }
  };

  // Handle text message
  const handleSendMessage = async (content: string) => {
    const response = await sendMessage(content);
    if (voiceMode && response) {
      await synthesize(response.content);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Discovery Session</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={voiceMode ? "default" : "outline"}
            size="sm"
            onClick={() => setVoiceMode(!voiceMode)}
          >
            {voiceMode ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            <span className="ml-2">{voiceMode ? "Voice On" : "Voice Off"}</span>
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Collaborate
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList
          messages={messages}
          isAiTyping={isAiTyping}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Overlay (when recording) */}
      {isRecording && (
        <VoiceOverlay
          transcript={transcript}
          onStop={handleVoiceMessage}
        />
      )}

      {/* Input */}
      <MessageInput
        onSend={handleSendMessage}
        onVoice={handleVoiceMessage}
        isLoading={isLoading}
        isRecording={isRecording}
        voiceMode={voiceMode}
      />
    </div>
  );
}
```

### 4.4.2 Voice Hook

```tsx
// src/hooks/use-voice.ts
"use client";

import { useState, useCallback, useRef } from "react";
import { useVoiceStore } from "@/stores/voice-store";

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const { selectedVoice } = useVoiceStore();

  // Start recording with Deepgram streaming
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Connect to Deepgram WebSocket
      wsRef.current = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true`,
        ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!]
      );

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.channel?.alternatives?.[0]?.transcript) {
          setTranscript((prev) =>
            data.is_final
              ? prev + data.channel.alternatives[0].transcript + " "
              : prev
          );
        }
      };

      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
        }
      };

      mediaRecorderRef.current.start(250); // Send chunks every 250ms
      setIsRecording(true);
      setTranscript("");
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }

      if (wsRef.current) {
        wsRef.current.close();
      }

      setIsRecording(false);

      // Small delay to ensure final transcript is received
      setTimeout(() => {
        resolve(transcript.trim());
      }, 500);
    });
  }, [transcript]);

  // Synthesize text to speech with ElevenLabs
  const synthesize = useCallback(
    async (text: string) => {
      try {
        setIsPlaying(true);

        const response = await fetch("/api/voice/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voiceId: selectedVoice }),
        });

        if (!response.ok) throw new Error("Synthesis failed");

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } catch (error) {
        console.error("Failed to synthesize:", error);
        setIsPlaying(false);
      }
    },
    [selectedVoice]
  );

  return {
    isRecording,
    transcript,
    isPlaying,
    startRecording,
    stopRecording,
    synthesize,
  };
}
```

### 4.4.3 LiveKit Session Component

```tsx
// src/components/session/session-room.tsx
"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";
import { useState } from "react";
import { ParticipantList } from "./participant-list";
import { SessionControls } from "./session-controls";
import { DiscoveryChat } from "../discovery/discovery-chat";
import { InviteModal } from "./invite-modal";

interface SessionRoomProps {
  token: string;
  serverUrl: string;
  projectId: string;
  sessionId: string;
  isHost: boolean;
}

export function SessionRoom({
  token,
  serverUrl,
  projectId,
  sessionId,
  isHost,
}: SessionRoomProps) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      className="h-full"
    >
      <RoomAudioRenderer />

      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <DiscoveryChat projectId={projectId} />

          {/* Controls */}
          <SessionControls
            isHost={isHost}
            sessionId={sessionId}
            onInvite={() => setShowInvite(true)}
          />
        </div>

        {/* Participants Sidebar */}
        <div className="w-64 border-l bg-muted/30">
          <ParticipantList onInvite={() => setShowInvite(true)} />
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        open={showInvite}
        onOpenChange={setShowInvite}
        sessionId={sessionId}
      />
    </LiveKitRoom>
  );
}
```

---

## 4.5 API Implementation Examples

### 4.5.1 tRPC Router - Projects

```typescript
// src/lib/trpc/routers/project.ts
import { z } from "zod";
import { router, protectedProcedure } from "../server";
import { TRPCError } from "@trpc/server";

export const projectRouter = router({
  // List user's projects
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        OR: [
          { ownerId: ctx.session.user.id },
          { members: { some: { userId: ctx.session.user.id } } },
        ],
      },
      include: {
        _count: { select: { members: true, conversations: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  // Create project
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        icon: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "OWNER",
            },
          },
        },
      });
    }),

  // Get project by ID
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.id,
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } },
          ],
        },
        include: {
          members: { include: { user: true } },
          conversations: { orderBy: { startedAt: "desc" }, take: 5 },
          documents: { orderBy: { generatedAt: "desc" }, take: 1 },
        },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return project;
    }),

  // Update project
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        status: z.enum(["DISCOVERY", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
      const project = await ctx.db.project.findFirst({
        where: { id, ownerId: ctx.session.user.id },
      });

      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.project.update({
        where: { id },
        data,
      });
    }),

  // Delete project
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });

      if (!project) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.project.delete({ where: { id: input.id } });
    }),
});
```

### 4.5.2 AI Discovery API Route

```typescript
// src/app/api/ai/discovery/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DISCOVERY_SYSTEM_PROMPT = `You are OneShot's Discovery AI...`; // Full prompt from stack doc

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId, message } = await req.json();

  // Get conversation history
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: { orderBy: { createdAt: "asc" }, take: 50 },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Build messages array for Claude
  const messages = conversation.messages.map((m) => ({
    role: m.senderType === "USER" ? "user" : "assistant",
    content: m.content,
  }));

  messages.push({ role: "user", content: message });

  // Create streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 4096,
          system: DISCOVERY_SYSTEM_PROMPT,
          messages,
          stream: true,
        });

        let fullResponse = "";

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            fullResponse += event.delta.text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }

        // Save messages to database
        await db.message.createMany({
          data: [
            {
              conversationId,
              content: message,
              senderType: "USER",
              senderId: session.user.id,
            },
            {
              conversationId,
              content: fullResponse,
              senderType: "AI",
            },
          ],
        });

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("AI error:", error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

---

## 4.6 Testing Strategy

### 4.6.1 Test Structure

```
tests/
├── unit/
│   ├── lib/
│   │   ├── ai/discovery.test.ts
│   │   ├── voice/elevenlabs.test.ts
│   │   └── utils/format.test.ts
│   └── components/
│       ├── discovery-chat.test.tsx
│       └── project-card.test.tsx
│
├── integration/
│   ├── api/
│   │   ├── projects.test.ts
│   │   ├── conversations.test.ts
│   │   └── sessions.test.ts
│   └── trpc/
│       └── routers.test.ts
│
└── e2e/
    ├── auth.spec.ts
    ├── dashboard.spec.ts
    ├── discovery.spec.ts
    └── session.spec.ts
```

### 4.6.2 Testing Tools

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing, fast execution |
| **React Testing Library** | Component testing |
| **MSW** | API mocking |
| **Playwright** | E2E testing |
| **Prisma** | Database testing with test containers |

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Build Phase Complete*
