# InspectOS Gas — Design Brainstorm

## Context
Gas Installation Inspection tool for DGEG (Direção-Geral de Energia e Geologia)-accredited EIG (Entidade Inspetora de Gás) inspectors working under DL 97/2017 and Lei 59/2018. The tool must feel authoritative, safety-focused, and field-ready on mobile devices.

---

<response>
<text>
## Idea 1 — "Segurança Industrial" (Industrial Safety Aesthetic)

**Design Movement**: Industrial Safety / Technical Documentation

**Core Principles**:
1. High-contrast safety communication — critical information stands out immediately
2. Status-driven interface — every element communicates its compliance state
3. Structured authority — the tool feels like an official regulatory instrument
4. Zero ambiguity — defect classifications are unmistakable through color and iconography

**Color Philosophy**:
- Primary: Deep navy blue (#1B3A5C) — authority, trust, technical precision
- Safety amber (#F59E0B) for warnings/Type B defects
- Safety red (#DC2626) for critical/Type G defects  
- Safety green (#16A34A) for approved/compliant items
- Neutral slate backgrounds for card surfaces

**Layout Paradigm**: Vertical stepper with status indicators on the left rail. Main content area with card-based inspection forms. Persistent compliance status bar at top showing current verdict (Aprovado/Condicionado/Reprovado). Bottom mobile navigation for quick section switching.

**Signature Elements**:
1. Compliance verdict badge — large, color-coded (green/amber/red) always visible
2. Defect counter chips — showing A/B/G counts in the header
3. Gas flame icon motif — subtle, professional

**Typography System**: Outfit (700/800) for headings, Source Sans 3 (400/500/600) for body, JetBrains Mono for values
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idea 2 — "Ficha Técnica" (Technical Data Sheet)

**Design Movement**: Swiss Engineering / Technical Blueprint

**Core Principles**:
1. Grid precision — every element aligned to a strict modular grid
2. Data density — maximize information per screen without clutter
3. Monochromatic authority with strategic color accents
4. Form follows function — no decorative elements

**Color Philosophy**:
- Primary: Charcoal (#2D3748) with electric blue (#3B82F6) accents
- Background: Cool white (#F8FAFC) with subtle blue-grey tints
- Status colors follow ISO safety standards exactly

**Layout Paradigm**: Tabbed interface with horizontal section tabs. Dense form layouts with 2-3 column grids on tablet. Collapsible inspection groups within each section.

**Signature Elements**:
1. Blueprint-style section dividers with thin ruled lines
2. Stamp-style compliance verdict
3. Technical reference numbers on every form field

**Typography System**: Space Grotesk for headings, IBM Plex Sans for body, IBM Plex Mono for values
</text>
<probability>0.05</probability>
</response>

<response>
<text>
## Idea 3 — "Chama Segura" (Safe Flame)

**Design Movement**: Modern Utility / Portuguese Institutional

**Core Principles**:
1. Warm authority — professional but approachable
2. Progressive disclosure — complex data revealed in layers
3. Contextual guidance — help text and references always available
4. Bilingual clarity — Portuguese primary, English secondary

**Color Philosophy**:
- Primary: Deep petroleum blue (#0F4C75) — gas industry standard
- Accent: Warm amber (#E8A317) — representing controlled flame
- Success: Forest green (#15803D)
- Danger: Vermillion red (#DC2626)
- Background: Warm off-white (#FAFAF5)

**Layout Paradigm**: Card-stack navigation with sidebar inspection summary. Sticky compliance verdict with defect breakdown. Progressive form sections that expand as you complete them.

**Signature Elements**:
1. Flame-gradient accent bar at the top (blue to amber, subtle)
2. Official-looking section headers with DGEG reference numbers
3. Stamp/seal element for the final inspection verdict

**Typography System**: Outfit (600/700) for headings, Source Sans 3 (400/500) for body, JetBrains Mono for values
</text>
<probability>0.07</probability>
</response>

---

## Selected Approach: Idea 1 — "Segurança Industrial" (Industrial Safety Aesthetic)

This approach best matches the safety-critical nature of gas installation inspection. The industrial safety palette with navy blue primary and safety-standard amber/red/green accents creates immediate visual authority and unmistakable defect communication.
