# Scope Boundaries: OneShot

## In Scope (v1)

### Core Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Email/password registration and login |
| **Magic Link Auth** | Passwordless login via email; SMTP configurable in admin settings |
| **Project Management** | Create, view, edit, delete projects |
| **Dashboard** | Card view and list view toggle |
| **Search & Filter** | Search projects by name, filter by status/phase |

### Discovery Experience

| Feature | Description |
|---------|-------------|
| **Text Chat** | Type messages, AI responds with CID-style discovery questions |
| **Voice Chat** | ElevenLabs STT → Claude → ElevenLabs TTS |
| **Transcript Persistence** | Voice conversations saved as text |
| **CID Workflow** | Discovery → Design → Stack phases with built-in prompts |
| **Build Prompt Generation** | Generated from three phase outputs for Claude Code |

### Document Management

| Feature | Description |
|---------|-------------|
| **Document Viewing** | View discovery/design/stack outputs in-app |
| **Document Editing** | Basic rich text editor |
| **Version History** | Track edits over time |
| **Export Formats** | Markdown, PDF, DOCX |
| **Project Download** | Zip bundle of all documents |

### AI & Voice

| Feature | Description |
|---------|-------------|
| **Multi-Vendor AI** | Anthropic (default), OpenAI, local model endpoint |
| **Token Tracking** | Per session, per phase, per project totals |
| **ElevenLabs Integration** | STT and TTS for voice conversations |

### Administration

| Feature | Description |
|---------|-------------|
| **User Roles** | Super admin (first user), admin, regular user |
| **User Management** | Super admin can promote/remove users |
| **AI Configuration** | API keys, model selection, local endpoint |
| **SMTP Configuration** | For magic link emails |
| **Storage Configuration** | Local or S3-compatible |

### Deployment

| Feature | Description |
|---------|-------------|
| **Docker Deployment** | Single install script + GitHub-built container |
| **Reverse Proxy** | Default on, auto-SSL with Caddy/Traefik |
| **Configurable Port** | Default 5090, ENV-based |
| **Responsive Design** | Mobile-friendly, desktop-optimized |

### Architecture Preparation

| Feature | Description |
|---------|-------------|
| **LiveKit Ready** | Data models and API structure prepared for v1.1 |
| **Project Invites** | Schema ready for collaborative features |

---

## Deferred (v1.1 / Future)

### Immediate Priority (v1.1)

| Feature | Rationale |
|---------|-----------|
| **LiveKit Multi-User Sessions** | Architecture prepared in v1; shareable link, 2+ participants |
| **Session Recording** | WebM with separate tracks; depends on LiveKit |

### Near-Term Future

| Feature | Rationale |
|---------|-----------|
| **Project Invite System** | User invites others via email/link |
| **Dark Mode** | UI polish after core functionality |
| **Download as Zip** | Bundle all documents for offline use |

### Long-Term Future

| Feature | Rationale |
|---------|-----------|
| **Community Projects** | Moderators, open access toggle; after core is stable |
| **GitHub Integration** | Push docs to repo |
| **Template Customization** | Users modify CID prompts; after v1 validates workflow |
| **Multi-Language Support** | UI and AI in non-English languages |

---

## Not Planned (Explicitly Excluded)

| Feature | Rationale |
|---------|-----------|
| **SaaS Multi-Tenancy** | Single-tenant by design; multi-instance via subdomains |
| **Payment/Subscription** | Not monetizing v1 |
| **Mobile Native Apps** | Responsive web sufficient |
| **In-App Code Generation** | Build phase happens in Claude Code, not OneShot |
| **Shared/Pooled API Keys** | Users provide their own keys |
| **OAuth/SSO Providers** | Email/password + magic link sufficient for v1 |
| **Email Notifications** | Status visible in UI; no push notifications |
| **Real-Time Collaborative Editing** | One editor at a time for v1 |

---

## Assumptions

| Assumption | Risk if Invalid | Mitigation |
|------------|-----------------|------------|
| ElevenLabs API (STT + TTS) remains available and stable | Core feature breaks | Monitor status; abstract interface for future vendor swap |
| Users have their own Anthropic/OpenAI API keys | Users cannot proceed | Clear onboarding; link to API key signup |
| SMTP provider available for magic links | Auth limited | Fall back to password-only |
| LiveKit self-hosted documentation is accurate | v1.1 delays | Validate with existing implementation |
| PostgreSQL performs adequately for version history | Performance issues | Implement pruning strategy if needed |
| Modern browsers only (Chrome, Firefox, Safari, Edge) | Layout/feature issues | No IE11/legacy support |

---

*Approved: 2026-01-05*
