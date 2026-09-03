# Product

## Register

product

## Users

Primary users are challenge judges and desktop testers, most likely using ChatGPT desktop or Chrome with WebMCP enabled. On first viewing, they need to understand the human-agent information asymmetry within 30 seconds, then solve or follow the case without lengthy onboarding. First-pass legibility and a clear investigative sequence take priority over thematic depth.

## Product Purpose

The Ledger demonstrates why structured WebMCP access matters through a single 1947 noir murder case. The human reads physical evidence that the agent cannot see, while the agent queries a locked archive that the human cannot access. Success means the collaboration model is immediately understandable, agent activity remains visible, and a tester can follow the evidence chain through a supported final accusation.

## Brand Personality

Tense, tactile, precise. The interface should carry the controlled contrast and material presence of classic film noir without becoming theatrical. Evidence should feel handled and physical; agent activity should feel exact, procedural, and observable.

## Anti-references

Do not resemble a generic SaaS dashboard, a cyberpunk neon terminal, or a sepia vintage theme park. Avoid glassmorphism, playful rounded UI, detective clip art or literal fedora and magnifying-glass motifs, repetitive card grids, and generic stock-photo “vintage” filters. Do not copy the story, evidence, visual identity, or surface treatment of Netlify's “The Archive”; it is an architecture reference only.

## Design Principles

1. Make the asymmetry legible: distinguish what the human reads from what the agent does through component form, typography, and interaction, not color alone.
2. Explain by showing: the evidence workspace and live tool activity should communicate the premise within 30 seconds without a long onboarding sequence.
3. Preserve investigative focus: establish a clear path from evidence, to prompt and agent controls, to the live system log and final accusation.
4. Use atmosphere in service of evidence: noir character may create tension, but must never reduce legibility or obscure actionable details.
5. Make every agent action observable: tool names, arguments, outcomes, and terminal state should be concise, readable, and visibly connected to the investigation.

## Accessibility & Inclusion

Target WCAG 2.2 AA with proportional effort appropriate to the submission deadline. Support complete keyboard navigation, visible focus states, non-color-dependent meaning, sufficient text contrast, and reduced-motion preferences. Use `aria-live="polite"` for live System Log updates. Give every evidence image descriptive alt text that preserves solvability. Define focus order by the investigative flow: evidence, console and prompt-copy actions, then System Log. Prioritize these baseline requirements and the core demo flow over accessibility gold-plating beyond the challenge's scope.
