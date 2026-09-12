# Spaciaz — Real Estate & Construction Group

A premium marketing site for a real-estate developer, built with **Next.js 16 (App
Router)**, **TypeScript**, **Tailwind CSS v4**, **Motion** (Framer Motion) and
**next/image**.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build and run:

```bash
npm run build
npm start
```

Quality gates:

```bash
npm run typecheck    # tsc --noEmit, strict
npm run lint         # eslint
```

---

## Design system

All tokens live in `src/app/globals.css` inside a Tailwind v4 `@theme` block, so
they resolve as ordinary utilities (`bg-primary`, `text-h2`, `rounded-xl`,
`ease-out-expo`, …) instead of being scattered magic numbers.

### Colours

| Token                | Value     | Role                                |
| -------------------- | --------- | ----------------------------------- |
| `--color-primary`      | `#E4ED64` | Brand lime — CTAs, accents, outlines |
| `--color-primary-hover`| `#CDD55A` | Hover state                          |
| `--color-accent`       | `#000000` | Headings, dark surfaces              |
| `--color-ink`          | `#4B4B4B` | Body copy                            |
| `--color-ink-light`    | `#8A8A8A` | Secondary copy                       |
| `--color-surface`      | `#F5F5F5` | Cards, stat plates                   |
| `--color-surface-warm` | `#F6F3EC` | Cream section background             |
| `--color-line`         | `#E0E0E0` | Hairlines and borders                |

### Typography

Two self-hosted families via `next/font/local` (`src/styles/fonts.ts`) — no
external font requests, no layout shift:

- **Switzer** (400/600) — body, UI labels
- **Involve** (600/700) — every heading, via the `font-display` utility

| Token             | Size                       | Notes                            |
| ----------------- | -------------------------- | -------------------------------- |
| `text-display`    | `clamp(60px, 6.5vmax, 90px)` | 52px ≤767px — the hero H1       |
| `text-h2`         | 70 → 64 → 56 → 42px        | Steps at 1200/1024/767 so line breaks stay stable |
| `text-h3`         | `clamp(36px, 5vmax, 52px)` |                                    |
| `text-h4`         | `clamp(30px, 4.5vmax, 36px)`|                                   |
| `text-h5` / `h6`  | 26px / 20px                |                                    |
| `text-stat`       | 60px (48 ≤880, 44 ≤767)    | Counters                          |
| `text-quote`      | 48px (36 ≤767)             | Testimonial pull quotes           |
| `eyebrow`         | 12px / 600 / uppercase     | The animated pill labels          |

### Layout

- Page container: `max-width: 1290px`, 30px gutters (15px ≤767px)
- Section rhythm: 150px desktop → 100px ≤1200px → 60px mobile
- Signature radii: 20px cards, 25–30px plates, 80px header/footer pills
- The quarter-round "corner notch" is `src/components/ui/CornerNotch.tsx`

---

## Architecture

```
src/
  app/                       routes (all statically prerendered)
    layout.tsx               fonts, metadata, MotionConfig, skip link
    page.tsx                 homepage composition
    about|services|projects|news|contact|privacy|terms
    sitemap.ts robots.ts not-found.tsx globals.css

  components/
    layout/                  SiteHeader, SiteFooter, PageShell, ScrollProgress,
                             MotionProvider, StructuredData
    sections/                one component per homepage band
      About/                 inner-page sections
    ui/                      Container, Button, Eyebrow, Reveal, TextReveal,
                             ScrollTextReveal, Counter, Magnetic, CornerNotch
    icons/                   CircularText, QuotePlate, SocialIcon

  config/                    site, navigation, services, projects, stats,
                             differentiators, team + posts
  lib/utils.ts               cn(), formatNumber()
  styles/fonts.ts            next/font/local definitions
  assets/fonts/              Switzer + Involve woff2

scripts/                     QA harnesses (see below)
public/images/               optimised photography, brand marks, social glyphs
```

Content lives in `src/config/*` as typed data, so swapping copy never touches
markup. Every section composes the shared primitives — no page is a single
monolithic component.

### Client / server split

Server components by default. `"use client"` appears only where interactivity
demands it: the header (menus), hero (scroll parallax), sticky project panels,
testimonial carousel, contact form, counters, reveals, and the scroll progress
bar. Everything else renders as static HTML.

---

## Motion

- Scroll entrances: `Reveal` (transform + opacity only, compositor-friendly)
- Word-by-word masked headline reveals: `TextReveal`
- Hero background + copy parallax, and a sticky stacked project gallery
- Continuous marquees (the eyebrow pill and the partner strip) are pure CSS
- Magnetic hover on the primary footer CTA
- Reading-progress hairline pinned to the top

**Reduced motion.** No component branches on the media query during render —
that would break hydration. Instead `<MotionConfig reducedMotion="user">` disables
transform animations in JS, and a CSS rule neutralises the `data-motion-transform`
offsets. Server and client markup stay byte-identical.

---

## Accessibility

- Semantic landmarks, one `<h1>` per page, ordered headings
- Full keyboard support: focus-trapped mobile dialog, `Escape` to close, focus
  restoration, keyboard-operable dropdowns, visible focus rings
- Skip link, `aria-label` on every icon-only control, associated `<label>`s
- `prefers-reduced-motion` fully honoured
- All meaningful images have descriptive `alt`; decorative art is `aria-hidden`

## SEO

Per-page metadata with title templates, canonical URLs, Open Graph and Twitter
cards; `sitemap.xml`, `robots.txt`; JSON-LD `Organization` / `WebSite` /
`ItemList` graph injected from `src/components/layout/StructuredData.tsx`.

## Performance

Measured on the production build at 1440×950:

| Metric            | Value    |
| ----------------- | -------- |
| First Contentful Paint | ~0.44 s |
| Largest Contentful Paint | ~1.7 s |
| Cumulative Layout Shift | **0.000** |
| Hero image        | AVIF, preloaded, `fetchPriority="high"` |

Everything below the fold is lazy-loaded through `next/image` with explicit
`sizes`; fonts are self-hosted; images are served as AVIF/WebP with immutable
cache headers.

---

## QA harnesses

Two Playwright scripts drive a real Chromium against a running server.

```bash
# Rebuild + start a production server and wait until every stylesheet resolves
npm run qa:serve -- 3314

# Responsive sweep: viewport-height slices at 320 → 2560, plus overflow,
# console-error and off-viewport-element audits
npm run qa:visual -- http://localhost:3314/ .qa
npm run qa:visual -- http://localhost:3314/ .qa 390,1440   # subset

# Interaction, accessibility and reduced-motion checks
npm run qa:interaction -- http://localhost:3314/ .qa

# Spot-check a single route
npm run qa:shoot -- http://localhost:3314/ .qa /about 1440x950
```

Output lands in `.qa/` (git-ignored): `report.txt` plus per-viewport slices.
`report.txt` is rewritten after every viewport, so an interrupted sweep still
leaves the results collected so far. Set `CHROME_PATH` to point at a different
Chromium/Chrome binary.

Both QA scripts exit non-zero when they find a problem, so they can gate CI.
Renderer teardown is bounded: shutting down real Chrome costs ~15s bare and
longer after a capture run, so the close is capped rather than awaited forever.
If the cap is hit, the run still ends on time and any orphaned renderer
processes this run created are reaped, so repeated runs cannot pile up. A slow
shutdown is reported on stderr but never changes the verdict, because the audit
is already written by that point.
