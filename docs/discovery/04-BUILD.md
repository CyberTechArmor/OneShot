# OneShot - Build Plan

## CID Framework Phase 4: Build

---

## 1. Project Structure

### 1.1 Directory Layout
```
oneshot/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Lint, test, typecheck
│   │   └── deploy.yml          # Production deployment
│   └── PULL_REQUEST_TEMPLATE.md
├── .husky/
│   ├── pre-commit              # lint-staged
│   └── commit-msg              # commitlint
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── og-image.png
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth route group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/        # Protected route group
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   ├── page.tsx        # Dashboard home (projects grid)
│   │   │   ├── projects/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── discovery/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── discovery/
│   │   │   ├── voice/
│   │   │   └── meetings/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── page-container.tsx
│   │   ├── dashboard/
│   │   │   ├── project-grid.tsx
│   │   │   ├── project-card.tsx
│   │   │   ├── new-project-card.tsx
│   │   │   └── empty-state.tsx
│   │   ├── discovery/
│   │   │   ├── chat-interface.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-input.tsx
│   │   │   ├── voice-toggle.tsx
│   │   │   └── ai-message.tsx
│   │   ├── meeting/
│   │   │   ├── video-grid.tsx
│   │   │   ├── participant-tile.tsx
│   │   │   ├── meeting-controls.tsx
│   │   │   └── invite-modal.tsx
│   │   └── shared/
│   │       ├── loading.tsx
│   │       ├── error-boundary.tsx
│   │       └── empty-state.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   ├── middleware.ts   # Auth middleware
│   │   │   └── types.ts        # Generated types
│   │   ├── ai/
│   │   │   ├── discovery-agent.ts
│   │   │   ├── document-generator.ts
│   │   │   └── prompts/
│   │   │       ├── discovery.ts
│   │   │       └── document.ts
│   │   ├── voice/
│   │   │   ├── elevenlabs.ts
│   │   │   └── audio-processor.ts
│   │   ├── meeting/
│   │   │   ├── livekit.ts
│   │   │   └── recording.ts
│   │   └── utils/
│   │       ├── cn.ts           # Class name merger
│   │       ├── format.ts
│   │       └── validation.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-projects.ts
│   │   ├── use-discovery.ts
│   │   ├── use-voice.ts
│   │   └── use-meeting.ts
│   ├── stores/
│   │   ├── ui-store.ts         # UI state (sidebar, modals)
│   │   ├── session-store.ts    # Session state
│   │   └── discovery-store.ts  # Discovery conversation state
│   ├── types/
│   │   ├── project.ts
│   │   ├── discovery.ts
│   │   ├── user.ts
│   │   └── api.ts
│   └── config/
│       ├── site.ts
│       ├── navigation.ts
│       └── constants.ts
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── seed.sql
│   └── config.toml
├── emails/
│   ├── welcome.tsx
│   ├── invite.tsx
│   └── document-ready.tsx
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local
├── .eslintrc.js
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 2. Database Schema

### 2.1 Core Tables
```sql
-- Users (managed by Supabase Auth, extended with profile)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Members (for collaboration)
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Discovery Sessions
CREATE TABLE discovery_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  mode TEXT DEFAULT 'chat' CHECK (mode IN ('chat', 'voice', 'meeting')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Discovery Messages
CREATE TABLE discovery_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES discovery_sessions(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai', 'system')),
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting Sessions (LiveKit)
CREATE TABLE meeting_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_session_id UUID NOT NULL REFERENCES discovery_sessions(id) ON DELETE CASCADE,
  livekit_room_name TEXT NOT NULL UNIQUE,
  invite_code TEXT UNIQUE,
  recording_url TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Meeting Participants
CREATE TABLE meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meeting_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  guest_name TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ
);

-- Discovery Documents (generated outputs)
CREATE TABLE discovery_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id UUID REFERENCES discovery_sessions(id),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Attachments
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Row Level Security Policies
```sql
-- Profiles: Users can only see/edit their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects: Users can see projects they own or are members of
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (
    owner_id = auth.uid() OR
    id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update projects"
  ON projects FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete projects"
  ON projects FOR DELETE
  USING (owner_id = auth.uid());

-- Similar policies for other tables...
```

### 2.3 Database Functions
```sql
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-add owner as project member
CREATE OR REPLACE FUNCTION handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_new_project();
```

---

## 3. API Routes

### 3.1 Authentication
```
POST   /api/auth/signup         # Create account
POST   /api/auth/login          # Sign in
POST   /api/auth/logout         # Sign out
POST   /api/auth/reset-password # Request reset
POST   /api/auth/callback       # OAuth callback
```

### 3.2 Projects
```
GET    /api/projects            # List user's projects
POST   /api/projects            # Create project
GET    /api/projects/:id        # Get project details
PATCH  /api/projects/:id        # Update project
DELETE /api/projects/:id        # Delete project
```

### 3.3 Discovery
```
POST   /api/discovery/sessions          # Start session
GET    /api/discovery/sessions/:id      # Get session
POST   /api/discovery/sessions/:id/messages  # Send message
GET    /api/discovery/sessions/:id/messages  # Get messages
POST   /api/discovery/sessions/:id/complete  # End session
POST   /api/discovery/sessions/:id/generate  # Generate document
```

### 3.4 Voice (ElevenLabs)
```
POST   /api/voice/transcribe    # Speech-to-text
POST   /api/voice/synthesize    # Text-to-speech
WS     /api/voice/stream        # Real-time voice stream
```

### 3.5 Meetings (LiveKit)
```
POST   /api/meetings/create     # Create room
POST   /api/meetings/token      # Get access token
GET    /api/meetings/:id        # Get meeting info
POST   /api/meetings/:id/record # Start recording
DELETE /api/meetings/:id        # End meeting
```

---

## 4. Implementation Milestones

### 4.1 Milestone 1: Foundation
**Goal**: Basic infrastructure and authentication

| Task | Description | Components |
|------|-------------|------------|
| 1.1 | Project setup | Next.js, TypeScript, Tailwind, shadcn/ui |
| 1.2 | Supabase integration | Auth, database, storage |
| 1.3 | Authentication flows | Login, signup, password reset |
| 1.4 | Base layout | Root layout, auth layout |
| 1.5 | Environment setup | Dev, staging, production configs |

**Deliverables**:
- [ ] Working authentication
- [ ] Protected routes
- [ ] User profile management
- [ ] CI/CD pipeline

### 4.2 Milestone 2: Dashboard
**Goal**: Project management interface

| Task | Description | Components |
|------|-------------|------------|
| 2.1 | Dashboard layout | Sidebar, header, main content |
| 2.2 | Projects grid | Project cards, empty state |
| 2.3 | Project CRUD | Create, read, update, delete |
| 2.4 | Project detail view | Tabs, overview, settings |
| 2.5 | Navigation | Routing, breadcrumbs |

**Deliverables**:
- [ ] Collapsible sidebar
- [ ] Project cards grid
- [ ] New project card (+)
- [ ] Project detail pages

### 4.3 Milestone 3: Discovery Chat
**Goal**: AI-powered discovery conversations

| Task | Description | Components |
|------|-------------|------------|
| 3.1 | Chat interface | Message list, input, streaming |
| 3.2 | AI integration | Vercel AI SDK, prompts |
| 3.3 | Message persistence | Database storage, history |
| 3.4 | Discovery flow | Guided conversation structure |
| 3.5 | Session management | Start, resume, complete |

**Deliverables**:
- [ ] Chat-style interface
- [ ] AI conversation with streaming
- [ ] Conversation history
- [ ] Session persistence

### 4.4 Milestone 4: Voice Integration
**Goal**: ElevenLabs voice input/output

| Task | Description | Components |
|------|-------------|------------|
| 4.1 | Voice capture | Browser audio API |
| 4.2 | Speech-to-text | ElevenLabs transcription |
| 4.3 | Text-to-speech | AI response vocalization |
| 4.4 | Voice toggle UI | Enable/disable voice mode |
| 4.5 | Real-time streaming | WebSocket communication |

**Deliverables**:
- [ ] Voice input toggle
- [ ] Real-time transcription
- [ ] AI voice responses
- [ ] Voice/text mode switching

### 4.5 Milestone 5: Collaborative Meetings
**Goal**: LiveKit real-time meetings

| Task | Description | Components |
|------|-------------|------------|
| 5.1 | LiveKit setup | Room management, tokens |
| 5.2 | Video grid | Participant tiles, layout |
| 5.3 | Meeting controls | Mute, video, screen share |
| 5.4 | Invite system | Shareable links, guest access |
| 5.5 | Recording | Session capture, storage |

**Deliverables**:
- [ ] Real-time video/audio
- [ ] Shareable invite links
- [ ] Meeting recording
- [ ] Guest participation

### 4.6 Milestone 6: Document Generation
**Goal**: Discovery document output

| Task | Description | Components |
|------|-------------|------------|
| 6.1 | Document schema | Structure, sections |
| 6.2 | Generation engine | AI-powered synthesis |
| 6.3 | Document viewer | Rendered output |
| 6.4 | Export options | PDF, Markdown |
| 6.5 | Version history | Track changes |

**Deliverables**:
- [ ] Structured discovery document
- [ ] AI-generated content
- [ ] Document export
- [ ] Version management

---

## 5. Development Workflow

### 5.1 Git Workflow
```
main          ─────●─────────●─────────●───────── (production)
               ↑        ↑         ↑
staging       ─────●────●────●────●────●───────── (pre-production)
               ↑    ↑    ↑    ↑    ↑
feature/*     ──●──●    ●    ●    ●────────────── (development)
```

### 5.2 Branch Naming
```
feature/       # New features
bugfix/        # Bug fixes
hotfix/        # Production fixes
refactor/      # Code improvements
docs/          # Documentation
```

### 5.3 Commit Convention
```
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
style:    # Formatting
refactor: # Code restructure
test:     # Tests
chore:    # Maintenance
```

### 5.4 PR Requirements
- [ ] Passes all CI checks
- [ ] Has tests for new functionality
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] TypeScript strict mode passing

---

## 6. Testing Strategy

### 6.1 Unit Tests (Vitest)
```typescript
// Component tests
// Hook tests
// Utility function tests
// Store tests
```

### 6.2 Integration Tests
```typescript
// API route tests
// Database operation tests
// Service integration tests
```

### 6.3 E2E Tests (Playwright)
```typescript
// Authentication flows
// Project creation flow
// Discovery session flow
// Meeting flow
```

### 6.4 Coverage Targets
| Type | Target |
|------|--------|
| Unit | 80% |
| Integration | 70% |
| E2E | Critical paths |

---

## 7. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Vercel Analytics |
| FID | < 100ms | Vercel Analytics |
| CLS | < 0.1 | Vercel Analytics |
| TTFB | < 200ms | Vercel Analytics |
| Bundle Size | < 200KB (initial) | Build output |
| API Response | < 200ms (p95) | Axiom |

---

*Document Version: 1.0*
*Created: 2026-01-06*
*Status: Draft - Pending Review*
