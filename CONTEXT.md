# OneShot

## Purpose

OneShot is a voice-first platform that productizes the Collaborative Intelligence Development (CID) framework. It captures discovery conversations—primarily via voice—and guides users through structured Discovery → Design → Stack phases, producing implementation-ready handoff packages for AI coding agents like Claude Code.

The platform solves the problem of lossy, fragmented requirements gathering where verbal discussions fail to flow into structured documentation, leading to projects being built wrong due to incomplete or misunderstood requirements.

## System Overview

OneShot is a single-tenant web application with these core components:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React)                           │
│  Dashboard │ Voice/Text Chat │ Document Editor │ Settings       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Express)                       │
│  Auth │ Projects │ Conversations │ Documents │ AI │ Admin       │
└─────────────────────────────────────────────────────────────────┘
          │                   │                     │
          ▼                   ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌────────────────┐
│  PostgreSQL  │    │   AI Vendors     │    │   ElevenLabs   │
│  (Data)      │    │  Claude/OpenAI   │    │   STT + TTS    │
└──────────────┘    └──────────────────┘    └────────────────┘
```

**Voice Pipeline:** User speaks → ElevenLabs STT → Claude AI → ElevenLabs TTS → User hears

**CID Flow:** Each project progresses through Discovery → Design → Stack phases, with each phase producing structured output documents. The Build phase happens externally in Claude Code using a generated handoff prompt.

## Key Constraints

- **Voice is the differentiator**: Text-only would be indistinguishable from using an LLM directly. Voice conversation must feel smooth and natural.
- **Single-tenant architecture**: Multi-instance scaling via subdomains rather than SaaS multi-tenancy. Simpler architecture, easier self-hosting.
- **CID skills built into AI**: Discovery, Design, and Stack prompts are embedded in the system. Only the Build prompt is generated as output.
- **ElevenLabs single-vendor dependency**: Accepted risk for v1; voice abstraction layer enables future vendor swap.
- **Token tracking required**: Per session, per phase, per project—stored in database, visible in UI.
- **LiveKit deferred to v1.1**: Architecture prepared in v1 but multi-user video not implemented.

## Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript (strict mode)
- **Backend Framework**: Express
- **ORM**: Drizzle
- **Validation**: Zod
- **Testing**: Vitest
- **Frontend**: React (responsive design)
- **Database**: PostgreSQL 16+
- **Infrastructure**: Docker with Docker Compose
- **Reverse Proxy**: Caddy (default) or Traefik
- **Default Port**: 5090

## Project Structure

```
oneshot/
├── CONTEXT.md                    # This file - root context
├── constraints.yaml              # Architectural invariants
├── docker-compose.yml            # Container orchestration
├── install.sh                    # Interactive installation script
├── docs/
│   ├── discovery/                # Discovery phase documentation
│   ├── design/                   # Design specifications
│   │   ├── openapi.yaml          # API contract
│   │   └── trust-boundaries.yaml # Security zones
│   ├── adr/                      # Architecture Decision Records
│   └── integrations/             # External system contracts
├── src/
│   ├── api/                      # Express routes and middleware
│   │   └── CONTEXT.md
│   ├── db/                       # Drizzle schema and migrations
│   │   ├── CONTEXT.md
│   │   └── schema.ts
│   ├── domain/                   # Business logic
│   │   └── CONTEXT.md
│   └── lib/                      # Shared utilities
│       └── CONTEXT.md
└── client/                       # React frontend
    └── CONTEXT.md
```

## Human-Sovereign Decisions

These decisions require human judgment and cannot be delegated:

- Voice conversation UX flow and quality standards
- AI vendor selection and fallback strategies
- Token budget policies and cost thresholds
- User role definitions and permission boundaries
- Data retention and privacy policies
- Licensing terms (Sustainable Use License)
- Architecture changes (single-tenant → multi-tenant)

## Getting Started

```bash
# Clone and install
git clone https://github.com/fractionate/oneshot.git
cd oneshot
./install.sh

# The install script prompts for:
# - Reverse proxy: on (default) or off
# - Domain: required if proxy enabled
# - Port: 5090 (default)
# - AI vendor API keys
# - ElevenLabs API key and voice ID
# - SMTP settings for magic links

# Start the application
docker compose up -d

# Access at http://localhost:5090 or https://your-domain.com
```

## Configuration

All configuration via environment variables (`.env` file):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5090 | Application port |
| `PROXY_ENABLED` | true | Enable reverse proxy |
| `PROXY_DOMAIN` | - | Domain for SSL (required if proxy) |
| `DATABASE_URL` | - | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | - | Claude API key |
| `ANTHROPIC_MODEL` | claude-opus-4-5-20250514 | Model identifier |
| `OPENAI_API_KEY` | - | OpenAI API key (optional) |
| `ELEVENLABS_API_KEY` | - | ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | - | Voice for TTS |
| `SMTP_HOST` | - | SMTP server for magic links |

---

*Design Phase: 2026-01-05*
*Owner: Thomas (Fractionate LLC)*
