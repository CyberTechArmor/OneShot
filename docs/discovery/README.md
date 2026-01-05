# OneShot - CID Framework Discovery Documentation

## Collaborative Intelligence Development Platform

This documentation represents the complete discovery phase output for **OneShot**, generated using the CID (Collaborative Intelligence Development) Framework.

---

## Document Index

| Phase | Document | Description |
|-------|----------|-------------|
| 1 | [01-DISCOVERY.md](./01-DISCOVERY.md) | Project vision, user stories, feature priorities |
| 2 | [02-DESIGN.md](./02-DESIGN.md) | System architecture, UI/UX specs, data models |
| 3 | [03-STACK.md](./03-STACK.md) | Technology choices, integrations, dependencies |
| 4 | [04-BUILD.md](./04-BUILD.md) | Project structure, implementation roadmap |
| 5 | [05-SECURITY.md](./05-SECURITY.md) | Security requirements, compliance, audit logging |

---

## Project Summary

### What is OneShot?

OneShot is a **Collaborative Intelligence Development Platform** that transforms the software discovery and planning process into an interactive, AI-assisted experience.

### Key Features

- **AI-Guided Discovery**: Chat or voice conversations with AI that asks the right questions
- **Voice Integration**: ElevenLabs text-to-speech and Deepgram speech-to-text
- **Real-time Collaboration**: LiveKit-powered sessions with shareable invite links
- **Session Recording**: Capture and transcribe discovery meetings
- **Structured Output**: Generate developer-ready discovery documents

### Target Users

1. **Project Initiators** - Transform ideas into structured project plans
2. **Technical Leads** - Receive clear, actionable specs from stakeholders
3. **Collaborative Teams** - Participate in discovery sessions remotely

---

## Technology Stack Overview

```
Frontend:  Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
Backend:   Next.js API Routes, tRPC, Prisma ORM, NextAuth.js
Database:  Neon PostgreSQL, Upstash Redis
AI:        Anthropic Claude, OpenAI (fallback)
Voice:     ElevenLabs (TTS), Deepgram (STT)
Real-time: LiveKit
Storage:   Cloudflare R2
Hosting:   Vercel
```

---

## Implementation Roadmap

| Phase | Sprints | Focus |
|-------|---------|-------|
| 1 | 1-2 | Foundation (Auth, Dashboard, Project CRUD) |
| 2 | 3-4 | Discovery Chat (Chat UI, AI Integration) |
| 3 | 5-6 | Voice Integration (STT, TTS) |
| 4 | 7-8 | Real-time Collaboration (LiveKit, Recording) |
| 5 | 9-10 | Polish & Launch (Files, Testing, Deployment) |

---

## Getting Started (For Developers)

After receiving this discovery documentation:

1. **Review all documents** in order (01 through 05)
2. **Set up the project** using the structure in [04-BUILD.md](./04-BUILD.md)
3. **Configure environment** variables per [03-STACK.md](./03-STACK.md)
4. **Follow the implementation roadmap** sprint by sprint
5. **Implement security measures** from [05-SECURITY.md](./05-SECURITY.md)

---

## Document Status

| Document | Version | Status |
|----------|---------|--------|
| 01-DISCOVERY | 1.0 | Complete |
| 02-DESIGN | 1.0 | Complete |
| 03-STACK | 1.0 | Complete |
| 04-BUILD | 1.0 | Complete |
| 05-SECURITY | 1.0 | Complete |

**Generated**: January 2026
**Framework**: CID (Collaborative Intelligence Development)

---

*This documentation was generated through an AI-assisted discovery session and is ready for developer handoff.*
