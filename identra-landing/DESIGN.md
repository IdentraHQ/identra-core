# Identra Landing Page — Section Design & Motion Specification

This document defines **how each landing page section is designed, animated, and composed**.
It acts as a single source of truth for layout, motion behavior, and visual intent.

The landing page is treated as a **continuous experience**, not a set of stacked blocks.

---

## Global Design Rules

These rules apply to **every section**:

### Motion
- Motion communicates **state change**, never decoration
- Only GPU-safe properties:
  - `opacity`
  - `transform`
  - very subtle `scale`
- Animation duration: `300–600ms`
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Never animate more than **3 elements at once**
- Respect `prefers-reduced-motion`

### Layout
- No repeated layouts back-to-back
- Avoid card grids unless explicitly stated
- Use whitespace aggressively
- Sections may visually merge via motion instead of dividers

### Backgrounds
- Dark base tones only
- Subtle grain/noise overlay
- Soft radial lighting (low opacity)
- No bright gradients, no pure white sections

---

## 1. Hero Section — Immersive Entry

### Purpose
Establish authority, seriousness, and curiosity within the first 5 seconds.

### Layout
- Full viewport height
- Center-left aligned content
- No visible section boundary below

### Typography
- Display font for headline
- Body font for subtext
- Monospace font for micro cues (`⌘ K`)

### Motion
- On load:
  - Headline fades in + slight upward motion
  - Subtext follows with short delay
- Background light subtly shifts position on scroll

### Visual Notes
- Minimal UI
- No illustrations or screenshots
- Hero must feel calm and deliberate

---

## 2. Problem → Insight Section (Editorial Morph)

### Purpose
Align with user pain, then reframe the problem without selling.

### Layout
- Single column, wide margins
- Appears as a continuation of the hero

### Content Behavior
- Statements replace each other as user scrolls
- No stacked paragraphs
- One idea per viewport moment

### Motion
- Scroll-driven text replacement
- Fade-out → fade-in only
- No background change until final insight appears

### Visual Notes
- Feels editorial, not SaaS
- No cards, no icons

---

## 3. How Identra Works — Architecture Walkthrough

### Purpose
Explain complexity without overwhelming.

### Layout
- Pinned scroll section
- Visual area stays fixed
- Text changes per scroll segment

### Content Structure
- Three conceptual steps:
  1. Local context capture
  2. Local memory & embeddings
  3. Encrypted cloud reasoning

### Typography
- Body font dominant
- Monospace font for technical labels only

### Motion
- Text slides in/out horizontally
- Visual transitions are minimal
- No looping or continuous motion

### Visual Notes
- This section signals engineering depth
- Should feel “explained”, not “marketed”

---

## 4. Product Experience — Dynamic Showcase

### Purpose
Make the product tangible without overwhelming detail.

### Layout
- Split layout:
  - One side: evolving UI mock / representation
  - Other side: concise explanations

### Content
- Ghost Overlay
- Deep Work Console
- Memory recall behavior

### Motion
- Scroll-driven UI evolution
- Elements appear/disappear instead of stacking
- No carousel behavior

### Visual Notes
- UI visuals should feel OS-native
- No heavy shadows or glassmorphism here

---

## 5. Security & Trust — Anchor Section

### Purpose
Convert skepticism into confidence.

### Layout
- Centered, narrow content
- Increased vertical spacing
- Reduced visual density

### Typography
- Body font only
- Slightly heavier weights
- No display font dominance

### Motion
- Minimal:
  - Simple fade-in
  - No scroll tricks

### Visual Notes
- This section intentionally slows the user
- Calm, grounded, precise

---

## 6. Differentiation — Positioning Reset

### Purpose
Prevent mental comparison with generic AI tools.

### Layout
- Contrast-driven layout
- Clean comparison blocks or rows
- Slight background shift for attention reset

### Typography
- Body font
- Short, factual statements

### Motion
- Staggered fade-in
- No hover-heavy interactions

### Visual Notes
- Clinical, not emotional
- Feels analytical and confident

---

## 7. Download & CTA — Conversion Point

### Purpose
Allow action without pressure.

### Layout
- Simple, focused
- Clear platform buttons
- No competing elements

### Typography
- Body font only
- No dramatic headlines

### Motion
- Subtle entrance animation
- No hover gimmicks

### Visual Notes
- Calm confidence
- Reinforce privacy and ownership

---

## 8. Footer — Quiet Exit

### Purpose
End the experience without distraction.

### Layout
- Minimal
- No grids
- No visual noise

### Content
- Documentation
- Security
- GitHub
- Contact

### Motion
- None or near-zero

---

## Design Quality Bar

A section is considered **done** only if:
- It does not feel static
- It does not feel flashy
- It does not feel generic
- It matches Identra’s security-first, OS-level identity

If a section draws attention to itself instead of the product,
it needs to be simplified.

---

## Final Note

This landing page is part of the **Identra platform**, not a marketing experiment.

Design decisions here must:
- Scale with the product
- Align with desktop UI
- Maintain trust with technical users
