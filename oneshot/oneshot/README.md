# OneShot

**Voice-first platform for Collaborative Intelligence Development (CID)**

OneShot captures discovery conversations—primarily via voice—and guides users through structured Discovery → Design → Stack phases, producing implementation-ready handoff packages for AI coding agents.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/fractionate/oneshot.git
cd oneshot

# Run interactive installation
./install.sh

# Or manual setup:
cp .env.example .env
# Edit .env with your API keys
docker compose up -d
```

The first user to register becomes super_admin.

## Features

- **Voice-First Interaction**: ElevenLabs STT → AI → TTS pipeline for natural conversation
- **CID Workflow**: Structured Discovery → Design → Stack → Build phases
- **AI Vendor Support**: Anthropic Claude (recommended) and OpenAI GPT
- **Document Generation**: Markdown, PDF, DOCX export
- **Token Tracking**: Per-session, per-phase, per-project cost visibility
- **Self-Hosted**: Single-tenant architecture for data privacy

## Requirements

- Docker and Docker Compose
- At least one AI vendor API key (Anthropic or OpenAI)
- ElevenLabs API key for voice features
- SMTP server for magic link authentication (optional)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Express)                       │
└─────────────────────────────────────────────────────────────────┘
          │                   │                     │
          ▼                   ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌────────────────┐
│  PostgreSQL  │    │   AI Vendors     │    │   ElevenLabs   │
│  (Data)      │    │  Claude/OpenAI   │    │   STT + TTS    │
└──────────────┘    └──────────────────┘    └────────────────┘
```

## Configuration

See `.env.example` for all configuration options.

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secure random string (32+ chars) |
| `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` | AI vendor API key |

### Recommended

| Variable | Description |
|----------|-------------|
| `ELEVENLABS_API_KEY` | Voice features |
| `ELEVENLABS_VOICE_ID` | TTS voice ID |
| `SMTP_*` | Magic link authentication |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Generate database migration
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Project Structure

```
oneshot/
├── src/
│   ├── api/           # Express routes and middleware
│   ├── db/            # Drizzle schema and migrations
│   ├── lib/           # Shared utilities
│   │   ├── ai/        # AI vendor abstraction
│   │   ├── voice/     # Voice vendor abstraction
│   │   ├── storage/   # Storage abstraction
│   │   └── auth/      # Authentication utilities
│   └── domain/        # Business logic
├── client/            # React frontend
├── docs/
│   ├── adr/           # Architecture Decision Records
│   ├── design/        # Design specifications
│   └── integrations/  # External API contracts
└── drizzle/           # Database migrations
```

## Technology Stack

- **Runtime**: Node.js 22, TypeScript (strict mode)
- **Backend**: Express, Drizzle ORM, Zod
- **Database**: PostgreSQL 16
- **Frontend**: React, Vite, Tailwind CSS
- **Testing**: Vitest
- **Infrastructure**: Docker, Caddy

## License

Sustainable Use License - See LICENSE.md

## Contributing

See CONTRIBUTING.md for development guidelines.

---

Built with the [CID Framework](https://github.com/fractionate/cid) by [Fractionate LLC](https://fractionate.com)
