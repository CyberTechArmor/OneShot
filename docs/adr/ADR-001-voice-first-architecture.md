# ADR-001: Voice-First Architecture

## Status

Accepted

## Context

OneShot is designed to productize the CID (Collaborative Intelligence Development) framework. The core question was: what differentiates OneShot from simply using Claude or ChatGPT directly?

Text-based chat with an AI for structured discovery is valuable, but users can already do this with existing tools. The discovery phase in particular involves a lot of verbal discussion—stakeholders naturally talk through ideas before writing them down.

Key observations from the problem space:
- Discovery conversations happen verbally but get captured incompletely
- Non-technical stakeholders struggle to articulate technical needs in writing
- Voice is more natural for brainstorming and exploration
- Existing tools don't capture verbal discussions and flow them into documentation

## Decision

OneShot will be voice-first: the primary interaction mode is voice conversation, with text as a fallback. The voice pipeline consists of:

1. User speaks → ElevenLabs STT → text transcript
2. Transcript → AI (Claude/OpenAI) → text response
3. Response → ElevenLabs TTS → user hears

Voice is not optional—it's the core differentiator. The prototype successfully demonstrated smooth conversational flow with this pipeline.

## Rationale

Voice-first makes OneShot distinct and valuable:

1. **Natural discovery flow**: Stakeholders can talk through ideas as they would in a meeting
2. **Capture that was lost**: Verbal discussions now automatically become structured documentation
3. **Lower barrier to entry**: Non-technical users don't need to write well-structured prompts
4. **Differentiation**: Text-only would be redundant with using Claude.ai directly

The ElevenLabs prototype validated that latency is acceptable for conversational UX.

## Consequences

**Positive:**
- Clear product differentiation
- More natural discovery experience
- Better capture of verbal stakeholder input
- Aligns with how people naturally brainstorm

**Negative:**
- Additional complexity (STT + TTS integration)
- Vendor dependency on ElevenLabs
- Higher per-interaction cost (voice API calls)
- Requires microphone access in browser

**Neutral:**
- Text chat remains available as fallback
- All voice interactions stored as transcripts

## Alternatives Considered

### Text-Only (Like Claude.ai)
Simple to build, but provides no differentiation. Users can already do structured discovery with prompt templates in Claude.ai.

**Rejected because:** No value proposition over existing tools.

### Voice as Optional Enhancement
Voice available but not the primary mode. Focus on text with voice as an add-on.

**Rejected because:** Reduces the platform's identity and differentiator; voice becomes an afterthought rather than a feature.

### Multiple Voice Vendors
Support Whisper, Google, AssemblyAI, etc. alongside ElevenLabs.

**Rejected because:** Adds complexity for v1; abstraction layer allows future expansion. Accept single-vendor risk initially.

## Task Classification (CID)

- **Decision Type**: Human-Sovereign
- **Novelty**: 2 - Voice-first is uncommon but not unprecedented
- **Risk**: 2 - Significant if voice UX is poor, but prototype mitigated
- **Future AI Delegation**: Voice integration implementation can be AI-delegated after UX is validated

## Related

**Constraints:**
- Creates: ARCH-002 (voice vendor abstraction)

**ADRs:**
- Related: ADR-002 (ElevenLabs single vendor)

**Compliance:**
- None (voice data not regulated in v1)

---

*Decision Date: 2026-01-05*
*Decision Maker: Thomas (Product Owner)*
