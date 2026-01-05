# OneShot: Collaborative Intelligence Development Platform

## CID Framework - Phase 1: Discovery

---

## 1.1 Project Vision

**OneShot** is a Collaborative Intelligence Development Platform that transforms the software discovery and planning process into an interactive, AI-assisted experience. It enables teams to collaboratively define, discuss, and document project requirements through real-time voice and text conversations, producing structured discovery documents ready for development handoff.

### Mission Statement
> Democratize the software discovery process by combining AI intelligence with human collaboration, making professional-grade project planning accessible to everyone.

---

## 1.2 Problem Statement

### Current Challenges
1. **Fragmented Discovery Process**: Teams use multiple disconnected tools (docs, meetings, chat) to gather requirements
2. **Lost Context**: Valuable insights from discovery conversations are lost or poorly documented
3. **Collaboration Barriers**: Remote teams struggle to align on project vision in real-time
4. **Developer Handoff Friction**: Discovery outputs rarely translate directly to actionable development specs
5. **Accessibility**: Voice-first interactions are underutilized in project planning tools

### OneShot Solution
A unified platform where discovery conversations (voice or text) are captured, structured, and transformed into comprehensive project documentation - all in real-time with collaborative capabilities.

---

## 1.3 Target Users

### Primary Personas

#### 1. **Project Initiator (Sarah)**
- **Role**: Entrepreneur, Product Manager, or Business Owner
- **Goal**: Transform an idea into a structured project plan
- **Pain Point**: Has vision but lacks technical translation skills
- **OneShot Value**: AI-assisted discovery that asks the right questions

#### 2. **Technical Lead (Marcus)**
- **Role**: Senior Developer, Tech Lead, or CTO
- **Goal**: Receive clear, actionable specs from stakeholders
- **Pain Point**: Ambiguous requirements lead to rework
- **OneShot Value**: Structured output ready for sprint planning

#### 3. **Collaborative Team Member (Alex)**
- **Role**: Designer, Developer, or Stakeholder
- **Goal**: Participate in discovery sessions and provide input
- **Pain Point**: Scheduling conflicts and timezone challenges
- **OneShot Value**: Async participation + recorded sessions

---

## 1.4 Core User Stories

### Authentication & Onboarding
```
US-001: As a new user, I want to sign up with email/OAuth so I can create my account
US-002: As a returning user, I want to sign in quickly so I can access my projects
US-003: As a user, I want to set up my profile and preferences on first login
```

### Dashboard & Navigation
```
US-010: As a user, I want to see all my projects as cards on the dashboard
US-011: As a user, I want to collapse/expand the left sidebar for more screen space
US-012: As a user, I want to search and filter my projects
US-013: As a user, I want to see project status and last activity at a glance
US-014: As a new user, I want to see a "+" card prompting me to create my first project
```

### Project Creation & Discovery
```
US-020: As a user, I want to click "+" to start a new project discovery conversation
US-021: As a user, I want the AI to guide me through discovery with smart questions
US-022: As a user, I want to type my responses in a chat interface
US-023: As a user, I want to speak my responses using voice input
US-024: As a user, I want to hear AI responses via ElevenLabs voice synthesis
US-025: As a user, I want to switch between voice and text modes seamlessly
```

### Real-time Collaboration (LiveKit)
```
US-030: As a user, I want to start a real-time discovery meeting
US-031: As a user, I want to generate a shareable link for my discovery session
US-032: As a user, I want to invite team members via email or link
US-033: As a participant, I want to join a discovery session via shared link
US-034: As a host, I want to see who is in the session
US-035: As a participant, I want to contribute via voice or text in real-time
US-036: As a host, I want to record the discovery session
US-037: As a host, I want to pause/resume recording
```

### Project Files & Documentation
```
US-040: As a user, I want all discovery conversations saved to my project folder
US-041: As a user, I want session recordings stored in my project
US-042: As a user, I want to view transcripts of voice conversations
US-043: As a user, I want to export discovery documents in multiple formats
US-044: As a developer, I want to receive structured specs from discovery output
```

### Project Management
```
US-050: As a user, I want to organize projects into folders/categories
US-051: As a user, I want to archive completed projects
US-052: As a user, I want to duplicate a project as a template
US-053: As a user, I want to share project access with team members
```

---

## 1.5 Feature Priority Matrix

| Feature | Priority | Complexity | MVP |
|---------|----------|------------|-----|
| User Authentication | P0 | Medium | Yes |
| Dashboard with Project Cards | P0 | Low | Yes |
| Chat-based Discovery | P0 | Medium | Yes |
| AI Discovery Guidance | P0 | High | Yes |
| Voice Input (ElevenLabs) | P1 | Medium | Yes |
| Voice Output (ElevenLabs) | P1 | Medium | Yes |
| LiveKit Integration | P1 | High | Yes |
| Session Recording | P1 | Medium | Yes |
| Shareable Session Links | P1 | Medium | Yes |
| Project File Storage | P0 | Medium | Yes |
| Document Export | P2 | Low | No |
| Team Management | P2 | Medium | No |
| Templates | P3 | Low | No |

---

## 1.6 Success Metrics

### North Star Metric
**Discovery Sessions Completed** - Number of projects that reach a complete discovery document

### Supporting Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| User Activation | 60% complete first discovery | Users who finish onboarding |
| Session Completion | 70% | Sessions that produce documents |
| Collaboration Rate | 40% | Sessions with 2+ participants |
| Voice Adoption | 50% | Sessions using voice features |
| Developer Handoff Success | 80% | Documents marked "complete" |

---

## 1.7 Assumptions & Risks

### Assumptions
1. Users prefer guided discovery over blank-page documentation
2. Voice interaction reduces friction for non-technical users
3. Real-time collaboration improves discovery quality
4. AI can effectively structure discovery conversations

### Risks & Mitigations
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Voice API latency | High | Medium | Implement optimistic UI, fallback to text |
| LiveKit complexity | Medium | Medium | Start with basic rooms, iterate |
| AI hallucination | High | Low | Structured prompts, user validation |
| Storage costs | Medium | High | Implement quotas, tiered pricing |

---

## 1.8 Competitive Landscape

| Competitor | Strengths | Gaps OneShot Fills |
|------------|-----------|-------------------|
| Notion | Flexible docs | No guided discovery, no voice |
| Miro | Visual collaboration | No AI guidance, no structured output |
| Loom | Async video | No real-time, no AI processing |
| ChatGPT | AI conversation | No project management, no collaboration |
| Figma | Real-time design | No discovery focus, no voice |

**OneShot Differentiator**: The only platform combining AI-guided discovery + voice interaction + real-time collaboration + structured developer output.

---

## 1.9 Glossary

| Term | Definition |
|------|------------|
| Discovery Session | A conversation (text/voice) to define project requirements |
| Discovery Document | Structured output from a discovery session |
| Project Folder | Container for all project-related files and recordings |
| CID Framework | Collaborative Intelligence Development methodology |
| Handoff | Transition of discovery output to development team |

---

*Document Version: 1.0*
*Created: January 2026*
*Status: Discovery Phase Complete*
