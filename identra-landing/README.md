# Identra Landing Page

Premium, motion-aware landing page for **Identra — The OS That Remembers**.

This repository contains the source code for Identra’s public-facing landing experience.  
The landing page is designed as a **calm, engineered, security-grade interface** that reflects the same principles as the Identra desktop application and backend architecture.

This is **not** a marketing-heavy SaaS site.  
It is a **product credibility surface**.

---

## 🎯 Purpose

The landing page exists to:

- Clearly explain what Identra is (and what it is not)
- Establish trust with security-conscious users
- Showcase the product experience without gimmicks
- Provide a clean download path for the desktop app
- Align visually and philosophically with Identra’s OS-level design

---

## 🧱 Page Architecture (UX Strategy)

The page is treated as a **single continuous experience**, not stacked static sections.

High-level flow:
1. Immersive Hero (authority + curiosity)
2. Problem → Insight (editorial morph, scroll-driven)
3. How Identra Works (pinned scroll walkthrough)
4. Product Experience (dynamic UI evolution)
5. Security & Trust (low-motion, high-clarity)
6. Differentiation (positioning reset)
7. Download & Platform Support
8. Minimal Footer

Layout patterns, typography roles, and motion intensity vary intentionally across sections to avoid fatigue and repetition.

---

## 🎨 Design System Summary

### Color Philosophy
- Dark, muted base tones
- Single restrained accent color
- No pure white sections
- Subtle grain and depth layers
- Security-grade contrast ratios

### Typography System
A **three-role system**, used intentionally:

- **Display font**  
  Used only for hero headlines, section openers, and vision statements.

- **UI / Body font**  
  Used for all long-form text, navigation, and buttons.

- **Monospace font**  
  Used sparingly for shortcuts, commands, and technical cues (`⌘ K`, architecture hints).

Typography usage varies by section to signal context and hierarchy.

### Motion Principles
- Motion communicates **state change**, not decoration
- Scroll-based transitions only
- GPU-friendly properties (`opacity`, `transform`)
- No infinite loops, no heavy parallax
- Reduced-motion preferences respected

---

## 🛠️ Tech Stack (Aligned with Identra Core)

This landing page intentionally uses the **same frontend philosophy and tooling** as the Identra desktop client to maintain consistency across the ecosystem.

### Core Framework
- **Next.js (14+)**
  - App Router
  - Static export compatible (`output: 'export'`)
  - Required for Tauri asset bundling parity

### Styling
- **Tailwind CSS v3.4+**
  - Utility-first, predictable, scalable
  - Enables precise control over spacing, color, and typography
- **shadcn/ui**
  - Used selectively for base components
  - Heavily customized (no default styles)

### Animation & Motion
- **Framer Motion**
  - Scroll-driven transitions
  - Section-level animation control
  - Used sparingly and intentionally
- **Lenis (optional)**
  - Smooth scrolling only if performance remains unaffected

### Fonts
- Display Font: `Clash Display` / `General Sans` / `Satoshi`
- UI Font: `Inter` (SF Pro parity)
- Mono Font: `JetBrains Mono` / `IBM Plex Mono`

Fonts are loaded locally or via controlled sources to avoid layout shifts.

### Icons
- **Lucide React**
  - Clean, consistent, OS-friendly iconography

---

