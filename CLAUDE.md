# Portfolio Website - Louis Desgrée

## Quick Reference
- Dev server: `npm run dev` (Vite, port 5173)
- Build: `npm run build` (outputs to /dist)
- Preview build: `npm run preview`

## Project Architecture
Static single-page portfolio. Vite + vanilla JS + CSS custom properties.
No framework. GSAP for scroll animations. Pure Canvas 2D for mathematical visuals.
Bilingual EN/FR with language toggle.

## File Map

### Core
- `index.html` — HTML skeleton, all sections, SVG grain filter, Google Fonts
- `src/main.js` — Entry point: imports CSS, initializes all modules, wires events
- `src/data/content.js` — **ALL text content in EN+FR** (single source of truth for copy)
- `src/i18n.js` — Language switching, localStorage persistence, browser detection

### Mathematical Visualizations (`src/canvas/`)
- `clifford-attractor.js` — Signature hero visual. Density-buffer pixel rendering of Clifford attractor
- `attractor-params.js` — Parameter management: base values, time drift, scroll/mouse reactivity
- `voronoi.js` — Section divider tessellations (lazy-loaded via IntersectionObserver)
- `canvas-utils.js` — HiDPI setup, resize handling, color utilities

### Components (`src/components/`)
- `hero.js` — (logic in main.js) Attractor canvas + name overlay + param display
- `about.js` — About section content rendering
- `experience.js` — Timeline with coordinate labels `[idx, year]`
- `skills.js` — Constellation graph: force-clustered nodes (Tech/Comm/Luxury)
- `projects.js` — Project cards with `p(n)` notation and tech tags
- `education.js` — Education cards
- `contact.js` — Contact info with language labels
- `nav.js` — Fixed side navigation with scroll-spy

### Styles (`src/styles/`)
- `variables.css` — **Design system**: Fibonacci type scale, 5-level dark palette, golden accent
- `reset.css` — Minimal CSS reset
- `base.css` — All section styles, nav, hero, timeline, cards, responsive
- `grain.css` — SVG feTurbulence film grain overlay

### Utilities (`src/utils/`)
- `scroll-manager.js` — GSAP ScrollTrigger: staggered reveals for timeline, cards, paragraphs

## Key Design Decisions
See also: the plan file at `../.claude/plans/starry-swinging-marble.md`

1. **Clifford Strange Attractor** as signature visual (not generic particles)
   - Equation: `x' = sin(a*y) - cos(b*x)`, `y' = sin(c*x) - cos(d*y)`
   - Base params: `a=-1.7, b=1.8, c=-1.9, d=-0.4` (butterfly pattern)
   - Density buffer with log-scale rendering for dynamic range
   - Parameters drift over time, react to scroll position and mouse
2. **Fibonacci type scale**: 16 / 26 / 42 / 68 / 110px
3. **Golden-angle accent**: warm gold `hsl(42, 65%, 55%)`
4. **5 depth levels of near-black** (not flat #000): void → deep → surface → raised → line
5. **No frameworks**: vanilla JS + Canvas 2D demonstrates engineering skill
6. **Bilingual**: all text in `content.js` as `{ en: '...', fr: '...' }`

## How to Modify Content

### Change text
Edit `src/data/content.js`. All text is centralized there with EN/FR variants.

### Add a new experience
Add an object to the `experiences` array in `content.js`:
```js
{
  role:    { en: '...', fr: '...' },
  company: 'COMPANY',
  location:{ en: '...', fr: '...' },
  date:    'YYYY',
  desc:    { en: '...', fr: '...' },
}
```

### Add a project
Add to the `projects` array in `content.js`:
```js
{
  title: { en: '...', fr: '...' },
  desc:  { en: '...', fr: '...' },
  tags:  ['Tag1', 'Tag2'],
  link:  'https://...' // or null
}
```

### Change attractor parameters
Edit `src/canvas/attractor-params.js` — `BASE` object.
Known good values: `a=-1.7, b=1.8, c=-1.9, d=-0.4`

### Change colors
Edit `src/styles/variables.css` — CSS custom properties.

## Dependencies
- `vite` (bundler, dev only)
- `gsap` (animation + ScrollTrigger, runtime)
- No other runtime dependencies

## Deployment
`npm run build` produces a static `/dist` folder.
Deploy to Vercel, Netlify, or GitHub Pages.
