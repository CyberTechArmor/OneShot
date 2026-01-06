# Risk Register: OneShot

## Risk Scoring Matrix

|  | Low Impact | Medium Impact | High Impact |
|--|------------|---------------|-------------|
| **High Likelihood** | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High |
| **Low Likelihood** | Low | Low | Medium |

---

## Active Risks

| ID | Category | Risk | Likelihood | Impact | Score | Mitigation | Owner | Status |
|----|----------|------|------------|--------|-------|------------|-------|--------|
| R1 | Dependency | ElevenLabs API becomes unavailable, slow, or prohibitively expensive | Low | High | Medium | Monitor ElevenLabs status; abstract voice interface for future vendor swap; **no immediate fallback (accepted risk)** | Product | Accepted |
| R2 | Technical | Voice round-trip latency degrades under real-world conditions | Low | High | Medium | Already prototyped successfully; monitor latency metrics in production; optimize prompt length if needed | Dev | Monitoring |
| R3 | Technical | Claude context window exceeded during long discovery sessions | Medium | Medium | Medium | Implement conversation summarization strategy; warn user when approaching limits; track token usage in real-time | Dev | Open |
| R4 | Technical | Token costs accumulate unexpectedly on verbose sessions | Medium | Low | Low | Token tracking per session/phase (planned); display cost estimates to user; consider token budgets per project | Dev | Open |
| R5 | Technical | LiveKit self-hosted setup complexity | Low | Low | Low | Small scale (1-4 concurrent users) simplifies requirements; TURN server likely unnecessary; prioritize simplest config; reference existing working implementation | Dev | Open |
| R6 | Integration | Multiple system integration (ElevenLabs + LiveKit + AI vendors + S3 + SMTP) increases complexity | Medium | Medium | Medium | Integrate incrementally; voice-first, then storage, then LiveKit (v1.1); solid abstraction layers | Dev | Open |
| R7 | Technical | Version history bloats database over time | Low | Low | Low | Implement retention policy or pruning strategy if needed; PostgreSQL handles moderate scale well | Dev | Open |
| R8 | Technical | Document export (PDF/DOCX) quality or formatting issues | Low | Low | Low | Use proven libraries (e.g., Pandoc, pdf-lib); test across document types | Dev | Open |
| R9 | Timeline | Scope is fixed ("done is done") but timeline may extend | Medium | Low | Low | Accepted; no external deadline pressure; track progress for visibility | Product | Accepted |
| R10 | Dependency | AI vendor API changes (Anthropic, OpenAI) break integration | Low | Medium | Low | Abstract AI interface; monitor changelogs; version-pin API clients | Dev | Open |

---

## Risk Categories

### Accepted Risks (No Immediate Mitigation)

| ID | Risk | Rationale |
|----|------|-----------|
| R1 | Single vendor dependency on ElevenLabs | Core product bet; voice is the differentiator |
| R9 | Timeline flexibility | No external deadline; quality prioritized |

### Needs Strategy Before Build

| ID | Risk | Required Action |
|----|------|-----------------|
| R3 | Context window limits | Define summarization/chunking approach during Design phase |

### Monitor During Build

| ID | Risk | Monitoring Approach |
|----|------|---------------------|
| R2 | Voice latency | Test under various network conditions |
| R5 | LiveKit setup | Validate against existing implementation early |
| R6 | Integration complexity | Incremental integration approach |

---

## Risk Response Strategies

| Strategy | Description | Applied To |
|----------|-------------|------------|
| **Accept** | Risk is acknowledged, no active mitigation | R1, R9 |
| **Mitigate** | Actions to reduce likelihood or impact | R2, R3, R4, R6, R10 |
| **Monitor** | Track and respond if risk materializes | R5, R7, R8 |
| **Transfer** | Shift risk to third party | None |
| **Avoid** | Eliminate the risk by changing approach | None |

---

## Risk Review Schedule

| Review Type | Frequency | Participants |
|-------------|-----------|--------------|
| Risk scan | Each phase completion | Dev |
| Full review | Monthly during active development | Product + Dev |
| Ad-hoc | When new risks identified | As needed |

---

*Last Updated: 2026-01-05*
*Next Review: Design Phase Completion*
