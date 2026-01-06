# OneShot Discovery Documentation

## CID Framework - Collaborative Intelligence Development

---

## Overview

OneShot is a **Collaborative Intelligence Development Platform** that transforms the software development discovery process into a collaborative, AI-assisted experience. Through real-time voice conversations, intelligent document generation, and multi-participant sessions, OneShot enables teams to articulate, refine, and document project requirements through natural dialogue.

---

## Documentation Index

| Phase | Document | Description |
|-------|----------|-------------|
| 1 | [Discovery](./01-DISCOVERY.md) | Project vision, users, requirements, and success metrics |
| 2 | [Design](./02-DESIGN.md) | UI/UX architecture, wireframes, component hierarchy, design system |
| 3 | [Stack](./03-STACK.md) | Technology selection, rationale, and cost analysis |
| 4 | [Build](./04-BUILD.md) | Project structure, database schema, API routes, implementation milestones |
| 5 | [Security](./05-SECURITY.md) | Security requirements, authentication, authorization, compliance |

---

## Quick Reference

### Core Features
- **Dashboard**: Project cards grid with collapsible sidebar
- **Discovery Chat**: AI-powered conversational interface
- **Voice Integration**: ElevenLabs speech-to-text and text-to-speech
- **Real-time Meetings**: LiveKit video/audio collaboration
- **Document Generation**: Structured developer handoff documents

### Technology Stack
```
Frontend:     Next.js 14 + React 18 + TypeScript
Styling:      TailwindCSS + shadcn/ui
State:        Zustand + React Query
Backend:      Supabase (Auth + PostgreSQL + Storage)
AI:           Vercel AI SDK (Anthropic Claude / OpenAI)
Voice:        ElevenLabs API
Meetings:     LiveKit Cloud
Email:        Resend
Deployment:   Vercel
```

### Key Integrations
| Service | Purpose |
|---------|---------|
| Supabase | Authentication, database, real-time, storage |
| ElevenLabs | Voice transcription and synthesis |
| LiveKit | Real-time video/audio meetings |
| Anthropic/OpenAI | AI-powered discovery conversations |
| Resend | Transactional emails |

---

## User Journey

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Sign Up    │───▶│  Dashboard   │───▶│  Create      │───▶│  Discovery   │
│              │    │  (Projects)  │    │  Project (+) │    │  Session     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                    │
                         ┌──────────────────────────────────────────┤
                         │                                          │
                         ▼                                          ▼
                  ┌──────────────┐                          ┌──────────────┐
                  │    Chat      │                          │   Meeting    │
                  │   (Text)     │                          │   (LiveKit)  │
                  └──────────────┘                          └──────────────┘
                         │                                          │
                         │         ┌──────────────┐                 │
                         └────────▶│   Voice      │◀────────────────┘
                                   │ (ElevenLabs) │
                                   └──────────────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │   Generate   │
                                   │   Document   │
                                   └──────────────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │   Developer  │
                                   │   Handoff    │
                                   └──────────────┘
```

---

## Implementation Milestones

| # | Milestone | Key Deliverables |
|---|-----------|------------------|
| 1 | Foundation | Auth, protected routes, CI/CD |
| 2 | Dashboard | Sidebar, project grid, CRUD |
| 3 | Discovery Chat | AI conversation, streaming, persistence |
| 4 | Voice | ElevenLabs STT/TTS integration |
| 5 | Meetings | LiveKit rooms, recording, invites |
| 6 | Documents | AI generation, export, versioning |

---

## Status

| Attribute | Value |
|-----------|-------|
| Version | 1.0 |
| Created | 2026-01-06 |
| Status | **Draft - Pending Review** |
| Next Step | Developer review and approval |

---

## Handoff Notes

This discovery documentation is intended to provide developers with:

1. **Clear understanding** of the project vision and goals
2. **User-centered design** with wireframes and user flows
3. **Technology decisions** with rationale for each choice
4. **Implementation roadmap** with concrete milestones
5. **Security requirements** to build secure-by-default

### Getting Started for Developers

1. Review all documentation in order (01 → 05)
2. Set up development environment per [Stack](./03-STACK.md)
3. Follow project structure in [Build](./04-BUILD.md)
4. Implement security measures per [Security](./05-SECURITY.md)
5. Begin with Milestone 1: Foundation

---

*For questions or clarifications, refer to the discovery session recordings (if available) or contact the project owner.*
