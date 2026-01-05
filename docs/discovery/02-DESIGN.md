# OneShot: Collaborative Intelligence Development Platform

## CID Framework - Phase 2: Design

---

## 2.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │  Mobile PWA │  │ Voice Agent │  │  LiveKit UI │        │
│  │  (Next.js)  │  │  (Next.js)  │  │ (ElevenLabs)│  │  (React)    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js API Routes / tRPC                         │   │
│  │         Authentication │ Rate Limiting │ Request Validation          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  AUTH SERVICE   │    │   CORE SERVICES     │    │ REAL-TIME SERVICES  │
├─────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│  • NextAuth.js  │    │  • Project Service  │    │  • LiveKit Server   │
│  • OAuth 2.0    │    │  • Discovery Engine │    │  • WebSocket Hub    │
│  • JWT Tokens   │    │  • AI Orchestrator  │    │  • Presence System  │
│  • Session Mgmt │    │  • File Service     │    │  • Recording Svc    │
└─────────────────┘    └─────────────────────┘    └─────────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INTEGRATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  ElevenLabs  │  │   OpenAI /   │  │   LiveKit    │  │   Storage    │    │
│  │  Voice API   │  │   Anthropic  │  │   Cloud      │  │   (S3/R2)    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │    PostgreSQL    │  │      Redis       │  │   Object Store   │          │
│  │   (Neon/Supabase)│  │   (Upstash)      │  │ (Cloudflare R2)  │          │
│  │                  │  │                  │  │                  │          │
│  │  • Users         │  │  • Sessions      │  │  • Recordings    │          │
│  │  • Projects      │  │  • Rate Limits   │  │  • Transcripts   │          │
│  │  • Conversations │  │  • Presence      │  │  • Documents     │          │
│  │  • Permissions   │  │  • Cache         │  │  • Exports       │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.2 UI/UX Design Specifications

### 2.2.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌──────┐  OneShot                              [Search] [🔔] [Avatar ▼]   │
│  │ Logo │                                                                   │
└──┴──────┴───────────────────────────────────────────────────────────────────┘
│          │                                                                   │
│  [≡]     │                    MAIN CONTENT AREA                             │
│          │                                                                   │
│ ┌──────┐ │  ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🏠   │ │  │                                                             │ │
│ │Home  │ │  │                                                             │ │
│ └──────┘ │  │                                                             │ │
│ ┌──────┐ │  │                      DASHBOARD VIEW                         │ │
│ │ 📁   │ │  │                    (Project Cards Grid)                     │ │
│ │Proj  │ │  │                                                             │ │
│ └──────┘ │  │                                                             │ │
│ ┌──────┐ │  │                                                             │ │
│ │ ⚙️   │ │  │                                                             │ │
│ │Set   │ │  │                                                             │ │
│ └──────┘ │  └─────────────────────────────────────────────────────────────┘ │
│          │                                                                   │
│  [◀]     │                                                                   │
│ Collapse │                                                                   │
└──────────┴───────────────────────────────────────────────────────────────────┘
```

### 2.2.2 Dashboard - Project Cards Grid

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  My Projects                                          [+ New Project]       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  🎨 E-Commerce  │  │  📱 Mobile App  │  │  🤖 AI Chatbot  │             │
│  │     Platform    │  │    Redesign     │  │    Integration  │             │
│  │                 │  │                 │  │                 │             │
│  │  Last: 2h ago   │  │  Last: 1d ago   │  │  Last: 3d ago   │             │
│  │  ●●●○ 75%       │  │  ●●○○ 50%       │  │  ●○○○ 25%       │             │
│  │                 │  │                 │  │                 │             │
│  │  [👥 3] [📄 5]  │  │  [👥 2] [📄 3]  │  │  [👥 1] [📄 2]  │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │                 │                                                        │
│  │       ＋        │   Empty State: "Start your first project"             │
│  │                 │                                                        │
│  │  Create New     │                                                        │
│  │    Project      │                                                        │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2.3 Discovery Chat Interface

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard          New Project Discovery         [🎤] [👥] [⚙️] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │ 🤖 OneShot                                           10:30 AM │  │   │
│  │  │                                                               │  │   │
│  │  │ Welcome to your project discovery session! I'm here to help  │  │   │
│  │  │ you define your project vision, requirements, and scope.     │  │   │
│  │  │                                                               │  │   │
│  │  │ Let's start with the basics: What would you like to build?   │  │   │
│  │  │                                                 [🔊 Listen]   │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                                              👤 You  10:32 AM │  │   │
│  │  │                                                               │  │   │
│  │  │ I want to build a task management app for remote teams...    │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │ 🤖 OneShot                                           10:32 AM │  │   │
│  │  │                                                               │  │   │
│  │  │ Great! A task management app for remote teams. Let me ask    │  │   │
│  │  │ some follow-up questions to understand your vision better:   │  │   │
│  │  │                                                               │  │   │
│  │  │ 1. Who are the primary users of this app?                    │  │   │
│  │  │ 2. What makes remote team task management challenging?       │  │   │
│  │  │ 3. Are there existing tools your team uses today?            │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [🎤]  Type your message or press mic to speak...          [Send ➤] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [Voice Mode: OFF]  [Recording: OFF]  [Participants: 1]                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2.4 Real-time Collaboration View (LiveKit Session)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Discovery Session: E-Commerce Platform        [🔴 REC] [Share 🔗] [End ✕] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────┐  ┌──────────────────────┐ │
│  │                                              │  │   PARTICIPANTS       │ │
│  │                                              │  │  ┌────────────────┐  │ │
│  │                                              │  │  │ 🟢 Sarah (Host)│  │ │
│  │           CHAT / DISCOVERY VIEW              │  │  │    🎤 Speaking │  │ │
│  │           (Same as 2.2.3)                    │  │  └────────────────┘  │ │
│  │                                              │  │  ┌────────────────┐  │ │
│  │                                              │  │  │ 🟢 Marcus      │  │ │
│  │                                              │  │  │    🔇 Muted    │  │ │
│  │                                              │  │  └────────────────┘  │ │
│  │                                              │  │  ┌────────────────┐  │ │
│  │                                              │  │  │ 🟢 Alex        │  │ │
│  │                                              │  │  │    🔇 Muted    │  │ │
│  │                                              │  │  └────────────────┘  │ │
│  │                                              │  │                      │ │
│  │                                              │  │  [+ Invite More]     │ │
│  │                                              │  │                      │ │
│  │                                              │  ├──────────────────────┤ │
│  │                                              │  │   SESSION INFO       │ │
│  │                                              │  │                      │ │
│  │                                              │  │   Duration: 23:45    │ │
│  │                                              │  │   Messages: 47       │ │
│  │                                              │  │   Topics: 5          │ │
│  └──────────────────────────────────────────────┘  └──────────────────────┘ │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ [🎤 Unmute]  Type or speak...                              [Send ➤] │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.3 Data Models

### 2.3.1 Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      USER        │       │     PROJECT      │       │   CONVERSATION   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ email            │       │ owner_id (FK)    │───┐   │ project_id (FK)  │
│ name             │       │ name             │   │   │ type (chat/voice)│
│ avatar_url       │       │ description      │   │   │ status           │
│ created_at       │       │ status           │   │   │ started_at       │
│ updated_at       │       │ created_at       │   │   │ ended_at         │
│ preferences      │       │ updated_at       │   │   │ created_at       │
└────────┬─────────┘       └────────┬─────────┘   │   └────────┬─────────┘
         │                          │             │            │
         │ 1:N                      │ 1:N         │            │ 1:N
         │                          │             │            │
         ▼                          ▼             │            ▼
┌──────────────────┐       ┌──────────────────┐   │   ┌──────────────────┐
│  PROJECT_MEMBER  │       │   PROJECT_FILE   │   │   │     MESSAGE      │
├──────────────────┤       ├──────────────────┤   │   ├──────────────────┤
│ id (PK)          │       │ id (PK)          │   │   │ id (PK)          │
│ project_id (FK)  │       │ project_id (FK)  │   │   │ conversation_id  │
│ user_id (FK)     │       │ name             │   │   │ sender_type      │
│ role             │       │ type             │   │   │ sender_id        │
│ joined_at        │       │ storage_path     │   │   │ content          │
│ permissions      │       │ size_bytes       │   │   │ voice_audio_url  │
└──────────────────┘       │ created_at       │   │   │ created_at       │
                           └──────────────────┘   │   │ metadata         │
                                                  │   └──────────────────┘
                                                  │
┌──────────────────┐       ┌──────────────────┐   │   ┌──────────────────┐
│     SESSION      │       │    RECORDING     │   │   │ DISCOVERY_DOC    │
├──────────────────┤       ├──────────────────┤   │   ├──────────────────┤
│ id (PK)          │       │ id (PK)          │   │   │ id (PK)          │
│ project_id (FK)  │◄──────│ session_id (FK)  │   └──▶│ project_id (FK)  │
│ host_id (FK)     │       │ storage_path     │       │ version          │
│ livekit_room_id  │       │ duration_seconds │       │ content (JSON)   │
│ invite_token     │       │ transcript_path  │       │ status           │
│ status           │       │ status           │       │ generated_at     │
│ started_at       │       │ created_at       │       │ export_formats   │
│ ended_at         │       └──────────────────┘       └──────────────────┘
│ settings         │
└──────────────────┘
```

### 2.3.2 Core Schema Definitions

```typescript
// User
interface User {
  id: string;                    // UUID
  email: string;                 // Unique
  name: string;
  avatarUrl?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    voiceEnabled: boolean;
    defaultVoice: string;        // ElevenLabs voice ID
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Project
interface Project {
  id: string;                    // UUID
  ownerId: string;               // FK -> User
  name: string;
  description?: string;
  icon?: string;                 // Emoji or icon key
  status: 'discovery' | 'in_progress' | 'completed' | 'archived';
  progress: number;              // 0-100
  settings: {
    isPublic: boolean;
    allowAnonymousJoin: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Conversation (Discovery Chat/Voice Session)
interface Conversation {
  id: string;
  projectId: string;             // FK -> Project
  type: 'chat' | 'voice' | 'meeting';
  status: 'active' | 'paused' | 'completed';
  startedAt: Date;
  endedAt?: Date;
  metadata: {
    messageCount: number;
    participantCount: number;
    topicsCovered: string[];
  };
}

// Message
interface Message {
  id: string;
  conversationId: string;        // FK -> Conversation
  senderType: 'user' | 'ai' | 'system';
  senderId?: string;             // FK -> User (if senderType is 'user')
  content: string;
  voiceAudioUrl?: string;        // S3/R2 URL for voice message
  metadata: {
    voiceDuration?: number;
    sentiment?: string;
    topics?: string[];
  };
  createdAt: Date;
}

// Session (LiveKit Real-time Meeting)
interface Session {
  id: string;
  projectId: string;             // FK -> Project
  hostId: string;                // FK -> User
  livekitRoomId: string;         // LiveKit room identifier
  inviteToken: string;           // Unique shareable token
  status: 'waiting' | 'active' | 'ended';
  startedAt: Date;
  endedAt?: Date;
  settings: {
    recordingEnabled: boolean;
    maxParticipants: number;
    allowAnonymous: boolean;
  };
}

// Discovery Document (Generated Output)
interface DiscoveryDocument {
  id: string;
  projectId: string;             // FK -> Project
  version: number;
  content: {
    projectOverview: string;
    problemStatement: string;
    targetUsers: UserPersona[];
    features: Feature[];
    technicalRequirements: string[];
    constraints: string[];
    successMetrics: Metric[];
  };
  status: 'draft' | 'review' | 'approved';
  generatedAt: Date;
  exportFormats: ('md' | 'pdf' | 'json')[];
}
```

---

## 2.4 API Design

### 2.4.1 RESTful Endpoints Overview

```
Authentication
├── POST   /api/auth/signup           # Create account
├── POST   /api/auth/signin           # Sign in
├── POST   /api/auth/signout          # Sign out
├── GET    /api/auth/session          # Get current session
└── POST   /api/auth/refresh          # Refresh token

Users
├── GET    /api/users/me              # Get current user
├── PATCH  /api/users/me              # Update profile
└── GET    /api/users/:id             # Get user by ID

Projects
├── GET    /api/projects              # List user's projects
├── POST   /api/projects              # Create project
├── GET    /api/projects/:id          # Get project details
├── PATCH  /api/projects/:id          # Update project
├── DELETE /api/projects/:id          # Delete project
├── GET    /api/projects/:id/members  # List project members
└── POST   /api/projects/:id/members  # Add member

Conversations
├── GET    /api/projects/:id/conversations     # List conversations
├── POST   /api/projects/:id/conversations     # Start new conversation
├── GET    /api/conversations/:id              # Get conversation
├── PATCH  /api/conversations/:id              # Update status
└── GET    /api/conversations/:id/messages     # Get messages

Messages
├── POST   /api/conversations/:id/messages     # Send message
└── POST   /api/conversations/:id/voice        # Send voice message

Sessions (LiveKit)
├── POST   /api/projects/:id/sessions          # Create session
├── GET    /api/sessions/:id                   # Get session details
├── POST   /api/sessions/:id/join              # Join session
├── POST   /api/sessions/:id/leave             # Leave session
├── POST   /api/sessions/:id/recording/start   # Start recording
├── POST   /api/sessions/:id/recording/stop    # Stop recording
└── GET    /api/sessions/invite/:token         # Join via invite

Voice (ElevenLabs)
├── POST   /api/voice/synthesize               # Text to speech
└── POST   /api/voice/transcribe               # Speech to text

Discovery Documents
├── GET    /api/projects/:id/discovery         # Get discovery doc
├── POST   /api/projects/:id/discovery/generate # Generate from conversation
└── GET    /api/projects/:id/discovery/export  # Export document
```

### 2.4.2 WebSocket Events

```typescript
// Client -> Server
interface ClientEvents {
  'conversation:join': { conversationId: string };
  'conversation:leave': { conversationId: string };
  'message:send': { content: string; voiceData?: ArrayBuffer };
  'voice:start': {};
  'voice:stop': {};
  'typing:start': {};
  'typing:stop': {};
}

// Server -> Client
interface ServerEvents {
  'conversation:joined': { participants: Participant[] };
  'message:new': { message: Message };
  'message:ai_typing': { conversationId: string };
  'message:ai_complete': { message: Message };
  'voice:transcription': { text: string; isFinal: boolean };
  'voice:synthesis': { audioData: ArrayBuffer };
  'participant:joined': { participant: Participant };
  'participant:left': { participantId: string };
  'typing:update': { userId: string; isTyping: boolean };
}
```

---

## 2.5 Component Architecture

### 2.5.1 Frontend Component Tree

```
App
├── Providers
│   ├── AuthProvider
│   ├── ThemeProvider
│   ├── VoiceProvider (ElevenLabs)
│   └── RealtimeProvider (LiveKit)
│
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── NotificationBell
│   │   └── UserMenu
│   │
│   ├── Sidebar (Collapsible)
│   │   ├── NavItem (Home)
│   │   ├── NavItem (Projects)
│   │   ├── NavItem (Settings)
│   │   └── CollapseToggle
│   │
│   └── MainContent
│
├── Pages
│   ├── Dashboard
│   │   ├── ProjectGrid
│   │   │   ├── ProjectCard
│   │   │   └── NewProjectCard
│   │   └── EmptyState
│   │
│   ├── Project
│   │   ├── ProjectHeader
│   │   ├── ProjectTabs
│   │   ├── ConversationList
│   │   └── FileList
│   │
│   ├── Discovery (Chat Interface)
│   │   ├── DiscoveryHeader
│   │   │   ├── BackButton
│   │   │   ├── Title
│   │   │   └── ActionButtons (Voice, Collab, Settings)
│   │   ├── MessageList
│   │   │   ├── AIMessage
│   │   │   └── UserMessage
│   │   ├── MessageInput
│   │   │   ├── TextInput
│   │   │   ├── VoiceButton
│   │   │   └── SendButton
│   │   └── VoiceOverlay (when active)
│   │
│   ├── Session (LiveKit Meeting)
│   │   ├── SessionHeader
│   │   ├── ChatPanel
│   │   ├── ParticipantPanel
│   │   │   ├── ParticipantCard
│   │   │   └── InviteButton
│   │   ├── SessionControls
│   │   │   ├── MuteButton
│   │   │   ├── RecordButton
│   │   │   └── EndButton
│   │   └── SessionInfo
│   │
│   └── Settings
│       ├── ProfileSettings
│       ├── VoiceSettings
│       └── NotificationSettings
│
└── Shared
    ├── Button
    ├── Input
    ├── Modal
    ├── Toast
    ├── Avatar
    ├── Card
    └── LoadingSpinner
```

---

## 2.6 User Flow Diagrams

### 2.6.1 New User Onboarding Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│   Sign Up   │────▶│   Verify    │────▶│   Profile   │
│    Page     │     │    Form     │     │    Email    │     │    Setup    │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Start     │◀────│  Dashboard  │◀────│   Welcome   │◀────│  Voice      │
│  Discovery  │     │  (Empty)    │     │    Tour     │     │  Prefs      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 2.6.2 Discovery Session Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DISCOVERY SESSION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
           ┌───────────────┐               ┌───────────────┐
           │  Solo Session │               │ Collab Session│
           │   (Chat/Voice)│               │   (LiveKit)   │
           └───────┬───────┘               └───────┬───────┘
                   │                               │
                   │         ┌─────────────────────┤
                   │         │                     │
                   │         ▼                     ▼
                   │    ┌─────────┐           ┌─────────┐
                   │    │ Generate│           │  Share  │
                   │    │  Link   │           │  Link   │
                   │    └────┬────┘           └────┬────┘
                   │         │                     │
                   │         └──────────┬──────────┘
                   │                    │
                   ▼                    ▼
           ┌───────────────────────────────────────┐
           │           Active Discovery            │
           │  ┌─────────────────────────────────┐  │
           │  │ AI asks guided questions        │  │
           │  │ User responds (text/voice)      │  │
           │  │ AI synthesizes and follows up   │  │
           │  │ Topics are tracked              │  │
           │  │ Recording captures everything   │  │
           │  └─────────────────────────────────┘  │
           └───────────────────┬───────────────────┘
                               │
                               ▼
           ┌───────────────────────────────────────┐
           │         Session Complete              │
           │  ┌─────────────────────────────────┐  │
           │  │ ✓ Conversation saved            │  │
           │  │ ✓ Recording saved (if enabled)  │  │
           │  │ ✓ Transcript generated          │  │
           │  │ ✓ Discovery doc generated       │  │
           │  └─────────────────────────────────┘  │
           └───────────────────┬───────────────────┘
                               │
                               ▼
           ┌───────────────────────────────────────┐
           │         Developer Handoff             │
           │  ┌─────────────────────────────────┐  │
           │  │ Export as Markdown / PDF / JSON │  │
           │  │ Share with development team     │  │
           │  │ Track implementation progress   │  │
           │  └─────────────────────────────────┘  │
           └───────────────────────────────────────┘
```

---

## 2.7 Design System

### 2.7.1 Color Palette

```
Primary Colors
├── Primary:      #6366F1 (Indigo 500)
├── Primary Dark: #4F46E5 (Indigo 600)
└── Primary Light:#818CF8 (Indigo 400)

Neutral Colors
├── Background:   #FFFFFF (Light) / #0F172A (Dark)
├── Surface:      #F8FAFC (Light) / #1E293B (Dark)
├── Border:       #E2E8F0 (Light) / #334155 (Dark)
└── Text:         #1E293B (Light) / #F1F5F9 (Dark)

Semantic Colors
├── Success:      #10B981 (Emerald 500)
├── Warning:      #F59E0B (Amber 500)
├── Error:        #EF4444 (Red 500)
└── Info:         #3B82F6 (Blue 500)

AI Colors
├── AI Message:   #F0F9FF (Light) / #1E3A5F (Dark)
└── AI Accent:    #06B6D4 (Cyan 500)
```

### 2.7.2 Typography

```
Font Family: Inter (Primary), System UI (Fallback)

Headings
├── H1: 32px / 40px line-height / 700 weight
├── H2: 24px / 32px line-height / 600 weight
├── H3: 20px / 28px line-height / 600 weight
└── H4: 16px / 24px line-height / 600 weight

Body
├── Large:  18px / 28px line-height / 400 weight
├── Base:   16px / 24px line-height / 400 weight
├── Small:  14px / 20px line-height / 400 weight
└── XSmall: 12px / 16px line-height / 400 weight
```

### 2.7.3 Spacing Scale

```
4px  (1)  - Tight spacing
8px  (2)  - Element spacing
12px (3)  - Component padding
16px (4)  - Section spacing
24px (6)  - Card padding
32px (8)  - Section gaps
48px (12) - Large sections
64px (16) - Page margins
```

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Design Phase Complete*
