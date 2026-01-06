# Problem Statement: OneShot

## Who has this problem?

Product owners, founders, consultants, and project stakeholders who need to translate ideas into buildable specifications. Secondary: developers and AI coding agents who receive requirements and build from them.

## What is the problem?

The process of moving from concept to code requires structured discovery, but current approaches are fragmented and lossy:

- Discovery conversations happen verbally but get captured incompletely (or not at all)
- Requirements live in scattered documents, chat logs, and people's heads
- Handoff to developers (human or AI) lacks the structured context needed for accurate implementation
- The CID methodology exists but requires manual prompt-chaining and discipline to execute consistently
- Non-technical stakeholders struggle to articulate technical needs; technical people miss business context
- Collaborative discovery (multiple stakeholders) is especially difficult to capture coherently

## Why does this matter?

- Projects get built wrong due to incomplete/misunderstood requirements (rework costs time and money)
- Tribal knowledge gets lost between discovery and implementation
- AI coding agents perform poorly without structured, comprehensive context
- The gap between "what stakeholders said" and "what developers understood" compounds through every phase

## How is it solved today?

Manual execution of the CID framework: running discovery prompts, copying outputs to design prompts, then to stack prompts, then feeding everything to build prompts. This works but requires discipline, is error-prone, and doesn't capture verbal conversations natively.

---

*Discovery Phase: Approved*
*Date: 2026-01-05*
