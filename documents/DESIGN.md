---
name: The Ledger
description: A tactile noir investigation workspace where human evidence and agent actions meet.
---

<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

# Design System: The Ledger

## 1. Overview

**Creative North Star: "The Midnight Evidence Desk"**

The interface is a controlled investigative workspace viewed under a desk lamp: physical evidence occupies the brightest, most tactile area, while agent activity lives in a darker, exact machine layer around it. The contrast makes the central premise understandable within 30 seconds. The human reads documents; the agent operates the archive; the screen lets both parties observe the same investigation.

Atmosphere must support first-pass legibility. Noir appears through sharp light boundaries, restrained materials, typography, and composition rather than decorative grime or a generic vintage filter. The workspace is tense, tactile, and precise, but familiar controls and concise language keep it usable for judges opening the demo for the first time.

The primary desktop composition should make the investigative sequence unmistakable: evidence first, prompt and agent controls second, live tool activity third. On narrower screens these regions stack in that same order. Motion is responsive rather than theatrical and never delays access to the task.

**Key Characteristics:**
- A near-black application shell framing bright physical evidence.
- Clearly different component forms for human-readable evidence and agent-generated activity.
- Restrained color with brass reserved for meaningful interaction.
- Dense, observable tool activity without dashboard clutter.
- Crisp rectangular geometry, controlled irregularity only on simulated paper edges.

## 2. Colors

The palette is nearly monochrome, with cold structural color, luminous evidence paper, and one scarce brass signal. Exact OKLCH values will be resolved during implementation and verified against WCAG 2.2 AA.

### Primary
- **Deep Harbor:** `[to be resolved during implementation]`. A desaturated cobalt-indigo derived from weathered steel at dusk. Use it subtly in structural surfaces, selected states, and focus treatment, not as a large decorative field.

### Secondary
- **Desk Brass:** `[to be resolved during implementation]`. The sole interactive accent for primary actions, active investigation states, and important links. Keep it below 10% of any screen.

### Tertiary
- **Dried Blood:** `[to be resolved during implementation]`. A semantic color only for failed accusations, errors, or the final case state. It is never decorative and never competes with Desk Brass for routine actions.

### Neutral
- **Projection Black:** `[to be resolved during implementation]`. The application background and strongest surrounding darkness.
- **Archive Charcoal:** `[to be resolved during implementation]`. Panels, navigation, and inactive machine surfaces.
- **Evidence Stock:** `[to be resolved during implementation]`. A parchment-like document surface used only for physical evidence, never as the global page background.
- **Carbon Ink:** `[to be resolved during implementation]`. Primary text on Evidence Stock.
- **Chalk:** `[to be resolved during implementation]`. Primary text on dark surfaces.
- **Graphite:** `[to be resolved during implementation]`. Secondary text and dividers, chosen to retain readable contrast.

### Named Rules

**The Lamp Rule.** Evidence Stock is the brightest substantial area on the screen. It creates the desk-lamp focal point and directs the eye before any accent color does.

**The One Signal Rule.** Desk Brass is the only routine action accent and occupies no more than 10% of a screen. Dried Blood is strictly semantic.

**The Parchment Boundary Rule.** Parchment belongs to evidence objects only. The body background is near-black, never cream, sand, beige, or paper.

## 3. Typography

**Display Font:** `[assertive serif pairing to be chosen at implementation]`  
**Body Font:** `[high-legibility sans-serif to be chosen at implementation]`  
**Label/Mono Font:** `[technical monospace to be chosen at implementation]`

**Character:** The serif gives evidence and case titles editorial authority without becoming ornamental. The sans-serif makes instructions and controls immediately readable. The monospace marks agent operations as structured machine output, creating a categorical distinction from evidence rather than a color-only distinction.

### Hierarchy
- **Display:** A fixed desktop scale with strong weight contrast, reserved for the case title and terminal resolution. Never used for controls.
- **Headline:** Used for evidence groups and major workspace regions. Headings use balanced wrapping and must not overflow at narrower widths.
- **Title:** Used for individual evidence names, log event summaries, and concise panel titles.
- **Body:** Optimized for immediate reading with a 65 to 75 character line length for prose. Evidence transcription may be shorter to preserve document composition.
- **Label:** Compact sans-serif for UI metadata and short statuses. Uppercase is allowed only for brief labels of four words or fewer.
- **Machine Output:** Monospace for tool names, arguments, evidence keys, timestamps, and results. Long values wrap safely rather than causing horizontal page overflow.

### Named Rules

**The Two Readers Rule.** Serif identifies material the human reads; monospace identifies work the agent performs. Sans-serif mediates between them through navigation, instructions, and controls.

**The Interface Restraint Rule.** Display typography is forbidden in buttons, labels, data, and routine UI. Familiar product typography must disappear into the task.

## 4. Elevation

The system is flat by default. Depth comes from tonal separation, overlap, paper thickness, crisp borders, and directional light localized to physical evidence. Dark application panels do not float in a stack of shadows. Evidence may use a restrained directional shadow to imply paper on a desk, while focus states use a high-contrast outline rather than glow.

### Named Rules

**The Physical-Only Shadow Rule.** Shadows describe paper, tickets, and photographs as physical objects. Console panels, buttons, and navigation remain structurally flat.

**The State-Only Motion Rule.** Motion lasts approximately 150 to 220 milliseconds and communicates hover, focus, tool progress, evidence expansion, or accusation outcome. No orchestrated page-load sequence is permitted. Reduced-motion mode replaces movement with immediate state changes or a short crossfade.

## 6. Do's and Don'ts

### Do:
- **Do** place the evidence workspace at the visual and keyboard start of the investigation.
- **Do** preserve the sequence evidence, console and prompt actions, then System Log at every responsive layout.
- **Do** distinguish evidence and agent activity through material, typography, component structure, and language rather than color alone.
- **Do** keep evidence details readable on first inspection and cap prose at 65 to 75 characters per line.
- **Do** display tool name, arguments, result, state, and timestamp in a consistent System Log event structure.
- **Do** use `aria-live="polite"` for new System Log events and provide descriptive alt text for every evidence image.
- **Do** provide visible keyboard focus and non-color status cues for every interactive state.
- **Do** reference the lighting discipline of *Double Indemnity*, 1940s police case files, and the investigative clarity of *Return of the Obra Dinn* without copying their surface style.

### Don't:
- **Don't** build a generic SaaS dashboard or fill the workspace with repetitive, identical cards.
- **Don't** use cyberpunk neon terminals, purple gradients, heavy glow, or full-saturation accents on inactive states.
- **Don't** use a sepia vintage theme park treatment or generic stock-photo “vintage” filters.
- **Don't** use glassmorphism, decorative blur, or translucent panels as the default material.
- **Don't** use playful rounded UI, bubble buttons, pill-shaped containers, or soft toy-like controls.
- **Don't** use detective clip art, emoji, literal fedora icons, or magnifying-glass motifs as decoration.
- **Don't** copy the story, evidence, visual identity, or surface treatment of Netlify's “The Archive”; it is an architecture reference only.
- **Don't** use a colored side-stripe border, gradient text, decorative page-load motion, or a hero-metric template.
- **Don't** put display fonts in UI labels, buttons, tool data, or System Log entries.
- **Don't** obscure evidence with texture, distressing, low contrast, extreme rotation, or torn edges that interfere with text.
- **Don't** use Desk Brass decoratively. If more than one in ten visible elements carries it, the accent has lost its purpose.
