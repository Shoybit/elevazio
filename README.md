# Elevazio — Real Estate & Construction Group

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

## Environment

There are no secrets in this project and no server-side runtime
configuration. One public variable exists; see `.env.example`:

| Variable                 | Purpose                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | Canonical https origin. Feeds `metadataBase`, canonical links, `sitemap.xml`, `robots.txt` and JSON-LD `@id`s. Falls back to `https://elevazio.com` if unset or malformed. |

`.env*` is git-ignored (with `.env.example` opted back in), along with
`*.pem`, `*.key`, `*.crt`, `*.p12`, `credentials*` and `secrets*`. Nothing
secret should ever be given a `NEXT_PUBLIC_` prefix — those values are inlined
into the client bundle.

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
| `--color-ink`          | `#4B4B4B` | Body copy (8.7:1 on canvas)          |
| `--color-ink-light`    | `#6E6E6E` | Secondary copy (5.1:1 on canvas)     |
| `--color-canvas`       | `#FFFFFF` | Page background (21:1 with black)    |
| `--color-surface`      | `#F5F5F5` | Cards, stat plates                   |
| `--color-surface-warm` | `#F6F3EC` | Cream section background             |
| `--color-line`         | `#E0E0E0` | Hairlines and borders                |

`--color-ink-light` was `#8A8A8A`, which measured 3.45:1 on `--color-canvas`
and 3.12:1 on `--color-surface-warm` — below the 4.5:1 WCAG 2.1 AA threshold
for body text. It is now `#6E6E6E`, which clears AA on all three light
surfaces. `npm run qa:contrast` re-derives these numbers from the running page
so the token cannot silently regress.

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

- Page container: two widths, matching the reference — a `content` column capped
  at `1470px` for section copy and grids, and a `shell` inset of `35px` used by
  the header pill and the footer card
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
                             BackToTop, MotionProvider, StructuredData
    sections/                one component per homepage band
      About/                 inner-page sections
      News/NewsFeed.tsx      news index + topic filter
    ui/                      Container, Button, Brand, Eyebrow, Reveal,
                             TextReveal, ScrollTextReveal, Counter, Magnetic,
                             CornerNotch
    icons/                   CircularText, BuildingLineArt, SocialIcon

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
monolithic component. `Magnetic` and `CornerNotch` are kept as design-system
primitives for reference-fidelity work; neither is currently mounted, and both
are inert without a consumer.

### Client / server split

Server components by default. `"use client"` appears only where interactivity
demands it: the header (mobile dialog), hero (scroll parallax), the services
and difference bands (parallax), the sticky project gallery, the testimonial
carousel, the contact form, counters, reveals, the scroll progress bar and the
back-to-top control. `SiteFooter`, `BlogGrid`, `Partners`, `Team` and the whole
`app/` tree render as static HTML.

## Navigation

The primary nav is a flat list of real page routes — `Home`, `Services`,
`Projects`, `About`, `News`, `Contact`, plus `Privacy` and `Terms` — with no
dropdown panels and no `#section` links standing in for pages. `Home` is
omitted on `/`, where it would only link to the URL the visitor is already on.
`interaction-qa.mjs` derives the expected set from `sitemap.xml`, so the header
and the published route list cannot drift apart silently.

---

## Motion

- Scroll entrances: `Reveal` (transform + opacity only, compositor-friendly)
- Word-by-word masked headline reveals: `TextReveal`
- Hero background + copy parallax, and a sticky stacked project gallery
- Two continuous marquees (the partner strip and the news strip) are pure CSS,
  so they run on the compositor, pause on hover **and** on keyboard focus, and
  stop under `prefers-reduced-motion`
- Reading-progress hairline pinned to the top

Two invariants the marquees depend on, both asserted by `npm run qa:motion`:

- the track's trailing padding equals its `gap`, so `translateX(-50%)` lands
  exactly back on the first copy instead of jumping half a gap on each wrap
- the duration is set inline, because a `var()` reached through a `@theme`
  token resolves in that token's context — a per-element `--marquee-duration`
  never reaches the `animation` shorthand

**Reduced motion.** No component branches on the media query during render —
that would break hydration. Instead `<MotionConfig reducedMotion="user">` disables
transform animations in JS, and a CSS rule neutralises the `data-motion-transform`
offsets. Server and client markup stay byte-identical, and `<html>` carries no
`suppressHydrationWarning`.

---

## Accessibility

- Semantic landmarks, one `<h1>` per page, ordered headings
- Full keyboard support: focus-trapped mobile dialog, `Escape` to close, focus
  restoration, visible focus rings
- Skip link, `aria-label` on every icon-only control, associated `<label>`s
- Every tab stop paints a visible focus indicator. The contact form's underline
  inputs set `outline-none`, so they re-declare `focus-visible` explicitly
  (including `outline-solid`, because `outline-none` and `outline-2` share the
  same `--tw-outline-style` variable and would otherwise cancel out)
- The news topic filter is a real `<button>` group with `aria-pressed`; the
  duplicated half of each marquee is `aria-hidden` and out of the tab order
- The testimonial carousel suspends autoplay on hover, on focus and while the
  tab is hidden (WCAG 2.2.2)
- `prefers-reduced-motion` fully honoured
- All meaningful images have descriptive `alt`; decorative art is `aria-hidden`

`npm run qa:keyboard` walks every tab stop on each route and asserts these
properties, so a regression in any of them is caught rather than assumed.

## SEO

Per-page metadata with title templates, canonical URLs, Open Graph and Twitter
cards; `sitemap.xml`, `robots.txt`; JSON-LD `Organization` / `WebSite` /
`ItemList` graph injected from `src/components/layout/StructuredData.tsx`. The
inline JSON-LD is serialised with every `<` escaped to its `<` unicode
sequence, so no schema.org value can break out of the `<script>` element.

## Security

`next.config.ts` sets a response baseline on every route:

| Header                    | Value                                                      |
| ------------------------- | ---------------------------------------------------------- |
| `Content-Security-Policy` | `default-src 'self'`; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'`; `form-action 'self'`; no third-party sources |
| `X-Content-Type-Options`  | `nosniff`                                                   |
| `X-Frame-Options`         | `DENY` (covers user agents that predate `frame-ancestors`)  |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`                            |
| `Cross-Origin-Opener-Policy` | `same-origin`                                             |
| `Permissions-Policy`      | camera / microphone / geolocation / payment / usb denied     |

The policy is the static "without nonces" form Next.js documents: nonces would
force dynamic rendering and give up static generation, CDN caching and TTFB for
a site with no user-generated content. `script-src` keeps `'unsafe-inline'`
because Next.js emits inline bootstrap scripts; the load-bearing directives are
`object-src`, `base-uri`, `frame-ancestors` and a `default-src` that refuses
anything unlisted. `style-src-attr 'unsafe-inline'` is scoped to the `style`
*attribute* Motion writes, so it does not re-open `<style>` elements.
`'unsafe-eval'` and the HMR websocket are added in development only. HSTS is
left to the hosting layer, which is the only place that knows whether the origin
is served over HTTPS.

There is no authentication, no API route, no server action, no cookie and no
browser storage in this project, so CORS, CSRF, rate limiting and cookie flags
are not applicable. All imagery is served from `public/`, so
`images.remotePatterns` is deliberately absent — there is no host allow-list to
widen and no SSRF surface on the optimiser. The contact form is a
client-side-only demo: it declares `method="post"` so a submit that lands before
hydration cannot put a visitor's name, email and phone number into a query
string, and from there into server logs, browser history and any `Referer`.

## Performance

Measured on the production build with `npm run qa:vitals`:

| Metric                   | Desktop 1440×950 | Mobile 390×844 |
| ------------------------ | ---------------- | -------------- |
| First Contentful Paint   | 0.30 s           | 0.28 s         |
| Largest Contentful Paint | 0.77 s           | 0.53 s         |
| Cumulative Layout Shift  | **0.0000**       | **0.0000**     |
| TTFB                     | 0.020 s          | 0.019 s        |
| Long tasks (>50 ms)      | 0                | 0              |
| Transferred (full walk)  | 2.1 MiB          | 1.7 MiB        |

These are single-run figures from a warm local `next start` on a developer
machine, not a throttled lab measurement, so treat them as a regression
baseline rather than a claim about field performance. The full page is walked
before reading them, so the transfer figure covers every lazy image the visitor
would eventually pull.

Everything below the fold is lazy-loaded through `next/image` with explicit
`sizes`; fonts are self-hosted; images are served as AVIF/WebP with immutable
cache headers. `preload` — the Next.js 16 replacement for the deprecated
`priority` prop — is reserved for the LCP image and the mastheads, and the
wordmark carries a `sizes` hint so a 90px-wide logo does not pull a 1920px
variant out of the responsive set.

---

## QA harnesses

Playwright scripts drive a real Chromium against a running server.

```bash
# Rebuild + start a production server and wait until every stylesheet resolves
npm run qa:serve -- 3314

# Everything that gates a release, in order (each exits non-zero on failure).
# Every script defaults to http://localhost:3314, so `npm run qa:serve -- 3314`
# followed by `npm run qa:all` needs no further arguments.
npm run qa:all

# Dependency health: every declared package is imported or explicitly
# justified, plus `npm audit`. Runs without a server.
npm run qa:packages

# Dead code: unreferenced exports, `@theme` tokens that emit no utility,
# duplicate DOM ids, dangling aria references, internal links with no page
npm run qa:deadcode -- http://localhost:3314

# Per-route regression sweep: one <h1>, no heading skips, no empty label pills,
# no stretched next/image bitmaps, no cursor-pointer on a non-control, no
# horizontal overflow, clean console/network — across every route plus a
# deliberate 404
npm run qa:routes -- http://localhost:3314

# Motion invariants: both marquees animate at their configured duration, pause
# on hover/focus, wrap seamlessly, and stop under prefers-reduced-motion
npm run qa:motion -- http://localhost:3314

# Design-token contrast against WCAG 2.1 AA, read from the running page
npm run qa:contrast -- http://localhost:3314

# Keyboard navigation: tab order matches DOM order, every stop is rendered and
# paints a focus indicator, nothing focusable sits inside aria-hidden, the skip
# link is the first stop and moves focus into <main>
npm run qa:keyboard -- http://localhost:3314

# Response-header baseline: CSP directives, nosniff, framing, referrer,
# permissions, cache partitioning, and that the CSP is not blocking Next itself
npm run qa:security -- http://localhost:3314

# Overflow / console-error audit across every breakpoint, no screenshots
npm run qa:overflow -- http://localhost:3314/

# Interaction, accessibility and reduced-motion checks
npm run qa:interaction -- http://localhost:3314/ .qa

# Paint and layout-shift figures quoted in the Performance section
npm run qa:vitals -- http://localhost:3314 / 1440 950

# Asset integrity: every referenced path resolves with exact case (a
# case-mismatched path is fine on Windows and a hard 404 on Linux). Unreferenced
# files are reported as info, not failures.
npm run qa:assets -- http://localhost:3314

# Responsive sweep with per-viewport screenshot slices
npm run qa:visual -- http://localhost:3314/ .qa
npm run qa:visual -- http://localhost:3314/ .qa 390,1440   # subset

# Spot-check a single route
npm run qa:shoot -- http://localhost:3314/ .qa /about 1440x950

# Print every section's document offset, to aim targeted screenshots
node scripts/sections.mjs http://localhost:3314/

# Capture one section (or one scroll offset) for side-by-side review
node scripts/peek.mjs http://localhost:3314/ .qa services "#services" 1920 950
node scripts/peek.mjs http://localhost:3314/ .qa hero "@0" 1920 950

# Capture the open mobile menu (only reachable after a click)
node scripts/menu-shot.mjs http://localhost:3314/ .qa 390 844

# Header + hero feature cards at one width (add `hover` to capture mid-interaction)
node scripts/hero-shot.mjs http://localhost:3314/ .qa 1440 950

# Service cards at rest, mid-hover and settled, with geometry assertions
node scripts/hover-shot.mjs http://localhost:3314/ .qa 1440 950
```

Output lands in `.qa/` (git-ignored): `report.txt` plus per-viewport slices.
`report.txt` is rewritten after every viewport, so an interrupted sweep still
leaves the results collected so far. Set `CHROME_PATH` to point at a different
Chromium/Chrome binary.

Every QA script exits non-zero when it finds a problem, so they can gate CI.
Renderer teardown is bounded: shutting down real Chrome costs ~15s bare and
longer after a capture run, so the close is capped rather than awaited forever.
If the cap is hit, the run still ends on time and any orphaned renderer
processes this run created are reaped, so repeated runs cannot pile up. A slow
shutdown is reported on stderr but never changes the verdict, because the audit
is already written by that point.
