# Japan Company Intelligence

> **Signals from Japan, before the market sees them.**

A research-platform landing site that maps global investment themes —
semiconductors, space, AI, defense — onto the companies and regions driving
them across Japan, for an English-speaking investor audience (funds,
institutional investors, family offices, corporates).

Built as a **static site**: Vite + React + Tailwind CSS. No SSR, API routes,
server actions, or database — `npm run build` outputs plain static files to
`dist/`, deployable to any static host (Vercel) or via FTP (Lolipop).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Deploy

**Vercel** — import the repo; framework preset *Vite* is auto-detected
(build `npm run build`, output `dist`).

**Lolipop (FTP)** — run `npm run build` and upload the **contents of `dist/`**
to the public directory. Asset paths are relative (`base: './'`), so it works
at a domain root or in a subdirectory.

## Structure

```
src/
  data.js              # themes, regions, layers, sample signal — all content
  hooks.js             # reduced-motion + reveal-on-scroll helpers
  App.jsx              # page composition
  components/
    Hero.jsx           # the FV: themes orbit -> Japan -> regional beacons
    JapanMap.jsx       # shared stylized SVG map (hero + explorer)
    InteractiveMap.jsx # region x theme explorer
    ...                # WhatWeSee, ThreeLenses, SampleSignal, WhyJapan, Access, Footer
```

The first-view animation respects `prefers-reduced-motion` and resolves
straight to its final state for users who opt out.

> For information purposes only. Nothing here constitutes investment advice.
> Company figures shown are illustrative.
