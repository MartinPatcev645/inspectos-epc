# InspectOS EPC Assessment Tool — Design Brainstorm

## Context
A mobile-first, tablet-optimised field tool for ADENE-certified energy experts (Peritos Qualificados) performing EPC (Energy Performance Certificate / Certificado Energético) assessments under Portugal's SCE (Sistema de Certificação Energética) system. Must be professional, fast, and usable in the field with gloves or one hand.

---

<response>
<idea>

## Idea 1: "Technical Blueprint" — Industrial Precision Design

**Design Movement**: Swiss Industrial Design meets technical drafting aesthetics. Think engineering blueprints, measurement instruments, and precision tools.

**Core Principles**:
1. Instrument-grade clarity — every element reads like a calibrated gauge
2. Hierarchical density — pack information tightly but with clear visual hierarchy
3. Tactile feedback — every interaction feels like operating a precision instrument
4. Status-first — the current state of the assessment is always immediately visible

**Color Philosophy**: Dark forest green (#1a5c38) as the authority color — evoking Portuguese regulatory seriousness. Paired with warm off-white (#f8f6f1) for paper-like card surfaces, and amber (#d4a017) for warnings/estimates. The green-to-red energy scale uses the official EU EPC gradient.

**Layout Paradigm**: Vertical scroll with fixed top instrument bar showing the live energy rating, progress, and section navigation. Each section is a full-width card that expands/collapses like an accordion — mimicking a field clipboard. Left edge has a colored status strip per section.

**Signature Elements**:
1. "Gauge needle" energy rating display — a semicircular gauge that moves from F (red) to A+ (dark green) as data is entered
2. Section status strips — thin colored bars on the left edge of each card (green=complete, amber=partial, grey=not started)
3. Blueprint grid pattern as subtle background texture on the main canvas

**Interaction Philosophy**: Deliberate, confirmatory interactions. Inputs have clear active states with green borders. Dropdowns pre-populate with common Portuguese building data. Each section has a "Confirm & Continue" action that validates before advancing.

**Animation**: Smooth gauge needle animation on rating changes (spring physics). Section transitions slide vertically. Progress bar fills with a liquid-like ease. Status indicators pulse briefly when updated.

**Typography System**: "DM Sans" for headings (geometric, technical feel) paired with "Source Sans 3" for body text (highly legible at small sizes on mobile). Monospace "JetBrains Mono" for numerical values and calculations to reinforce the technical/measurement context.

</idea>
<probability>0.07</probability>
<text>Industrial precision design inspired by engineering blueprints and measurement instruments, with gauge-style energy rating display and accordion-based field clipboard layout.</text>
</response>

---

<response>
<idea>

## Idea 2: "Field Commander" — Military-Grade Field Operations UI

**Design Movement**: Tactical operations UI meets data-dense dashboard design. Inspired by military field equipment interfaces and aviation cockpit displays.

**Core Principles**:
1. Glanceability — critical information readable in under 2 seconds
2. One-hand operability — all primary actions reachable with thumb on mobile
3. Environmental resilience — high contrast for outdoor/bright conditions
4. Mission-structured — the assessment is a "mission" with clear phases and completion

**Color Philosophy**: Deep navy (#0f1729) background with bright emerald (#00c853) for positive/complete states, creating extreme contrast for outdoor visibility. Warm amber (#ffab00) for warnings. The dark background reduces glare in bright field conditions. Energy classes use saturated neon versions of the EU scale.

**Layout Paradigm**: Bottom-anchored navigation tabs (thumb-reachable) with a persistent top status bar. Content area uses a single-column card stack. The energy rating floats as a persistent badge in the top-right corner. Sections are accessed via bottom tab bar, not scrolling.

**Signature Elements**:
1. Hexagonal energy class badge — glowing, color-coded, always visible
2. "Mission progress" horizontal timeline at the top showing all 9 sections as connected nodes
3. Data confidence indicators — small icons (✓/⚠/✗) inline with every data field

**Interaction Philosophy**: Quick-tap optimised. Large touch targets (min 48px). Preset value chips that can be tapped instead of typed. Swipe between sections. Haptic-style visual feedback on interactions.

**Animation**: Badge pulses on rating change. Section nodes light up sequentially on the progress timeline. Cards enter with a quick fade-up. Confidence indicators animate with a brief scale bounce.

**Typography System**: "Space Grotesk" for headings (technical, modern) paired with "Inter" for body (maximum legibility). Tabular numbers throughout for aligned data columns.

</idea>
<probability>0.05</probability>
<text>Military-grade tactical field UI with dark background for outdoor visibility, bottom-anchored navigation, and hexagonal energy class badges.</text>
</response>

---

<response>
<idea>

## Idea 3: "Cartografia Energética" — Portuguese Modernist Document Design

**Design Movement**: Portuguese modernist graphic design meets official document aesthetics. Inspired by the clean, authoritative look of Portuguese government documents and azulejo geometric patterns, but with contemporary digital refinement.

**Core Principles**:
1. Document authority — the tool feels like an official instrument, not a casual app
2. Bilingual clarity — Portuguese and English labels coexist without clutter
3. Progressive disclosure — show only what's needed for the current step
4. Printable fidelity — what you see on screen matches the final report output

**Color Philosophy**: Deep institutional green (#1a5c38) as the primary brand color — directly matching ADENE's regulatory authority. Crisp white (#ffffff) card surfaces with subtle warm grey (#f5f5f0) page background. Muted teal (#2d8a6e) for secondary actions. The energy scale uses the exact EU EPC color codes. Thin green borders and dividers create a "form document" feel.

**Layout Paradigm**: Vertical stepper layout — a left-side vertical progress rail with numbered steps, and the main content area showing the current section as a structured form. On mobile, the stepper collapses to a top progress indicator. The energy rating sits in a persistent floating card in the bottom-right (desktop) or top banner (mobile).

**Signature Elements**:
1. Geometric border patterns inspired by azulejo tiles — used sparingly as section dividers and the report header
2. Official-looking section headers with green background bars and white text, numbered like government form sections
3. The energy rating displayed as a vertical color bar (A+ to F) with a pointer indicating current class — matching the official Portuguese EPC certificate visual format

**Interaction Philosophy**: Form-like progression. Tab through fields naturally. Smart defaults pre-fill based on Portuguese building stock data. Each section validates on completion and shows a summary before advancing. The tool respects the inspector's expertise — defaults are suggestions, never forced.

**Animation**: Subtle vertical slide transitions between sections. The energy rating pointer animates smoothly along the color bar. Progress rail steps fill with a gentle cascade. Form fields have a brief highlight animation when auto-populated.

**Typography System**: "Outfit" for headings (clean, geometric, authoritative) paired with "Source Sans 3" for body and form labels (excellent legibility, professional). Section numbers use "Outfit" at heavy weight. Bilingual labels use the body font at reduced size and muted color for the secondary language.

</idea>
<probability>0.08</probability>
<text>Portuguese modernist document design with vertical stepper layout, azulejo-inspired geometric accents, and official EPC certificate-style energy rating display.</text>
</response>

---

## Selected Approach: Idea 3 — "Cartografia Energética"

This approach best serves the target users (ADENE-certified Peritos Qualificados) because:
1. The document-authority aesthetic builds trust and matches the regulatory context
2. The vertical stepper mirrors the actual inspection workflow
3. The official EPC certificate-style rating display is immediately familiar to inspectors
4. The bilingual label system is native to the design, not bolted on
5. The form-like interaction model matches how inspectors already think about data collection
6. Print fidelity means the report section will look professional without additional styling
