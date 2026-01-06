# Success Criteria: OneShot

## MoSCoW Prioritization

### Must Have (Launch Blockers)

| ID | Criteria | Measurement | Status |
|----|----------|-------------|--------|
| M1 | User can create a project and enter a discovery conversation | Project creation completes, chat interface loads | Pending |
| M2 | Discovery conversation works via text chat | User can type messages, AI responds with CID-style discovery questions | Pending |
| M3 | Discovery conversation works via voice (ElevenLabs) | User can speak, AI responds audibly, conversation flows naturally | Pending |
| M4 | Dashboard displays all user's projects | Card view and list view toggle, shows project name/status/last updated | Pending |
| M5 | AI vendor configuration with Anthropic default | Settings allow API key entry, model selection; Anthropic pre-selected | Pending |
| M6 | Support for multiple AI vendors | OpenAI, Anthropic, configurable endpoint for local models | Pending |
| M7 | Discovery phase produces structured output document | Markdown file matching CID discovery template, accessible in project | Pending |
| M8 | Chained workflow: Discovery → Design → Stack | Each phase completion spawns new chat with previous output + next phase prompt | Pending |
| M9 | Build handoff package generated | All three phase documents + Claude Code prompt available for copy/download | Pending |
| M10 | Documents are viewable and editable | Basic rich text editing within the platform | Pending |
| M11 | Conversation transcript saved | Full text transcript of voice sessions persisted to project | Pending |
| M12 | Responsive design (mobile-friendly) | All features accessible on mobile; optimized for desktop | Pending |
| M13 | User authentication and basic management | Sign up, sign in, super admin can promote/remove users | Pending |
| M14 | Email/password and magic link authentication | SMTP configurable in admin settings | Pending |
| M15 | Installation supports configurable port and optional reverse proxy | ENV-based configuration, reverse proxy on by default | Pending |
| M16 | Architecture prepared for LiveKit integration | Data models, API structure ready for multi-user sessions | Pending |
| M17 | Project search and filtering | Search by name, filter by status/phase | Pending |
| M18 | Document version history | Track edits over time | Pending |
| M19 | Export: Markdown, PDF, DOCX | Per document or full project | Pending |
| M20 | Token tracking | Per session, per phase, per project totals stored in database | Pending |

### Should Have (Expected, Strong Pressure)

| ID | Criteria | Measurement | Status |
|----|----------|-------------|--------|
| S1 | Multi-user voice/video sessions (LiveKit) | Shareable link, 2+ participants in real-time — **immediate v1.1 priority** | Deferred |
| S2 | Project invite system | User can invite others to their project via email/link | Pending |
| S3 | Session recording (audio/video) | WebM format, separate tracks, combined on playback | Deferred |
| S4 | Download project as zip | All documents bundled for offline use | Pending |
| S5 | Dark mode | UI supports light/dark theme toggle | Deferred |

### Could Have (Desirable)

| ID | Criteria | Measurement | Status |
|----|----------|-------------|--------|
| C1 | Community projects with moderators | Project owners can designate moderators, open access toggle | Future |
| C2 | GitHub integration | Push docs to repo | Future |
| C3 | Template customization | Users can modify CID prompts/templates | Future |
| C4 | Multi-language support | UI and AI conversations in non-English languages | Future |

### Won't Have (v1 Exclusions)

| ID | Criteria | Rationale |
|----|----------|-----------|
| W1 | Full SaaS multi-tenancy | Single-tenant architecture; multi-instance via subdomains |
| W2 | Payment/subscription management | Internal tool first; monetization later |
| W3 | Mobile native apps | Responsive web covers mobile needs for v1 |
| W4 | AI-driven build phase (code generation in-app) | Handoff to Claude Code; build happens outside OneShot |

---

## Summary

| Priority | Count |
|----------|-------|
| Must Have | 20 |
| Should Have | 5 |
| Could Have | 4 |
| Won't Have | 4 |

---

*Approved: 2026-01-05*
