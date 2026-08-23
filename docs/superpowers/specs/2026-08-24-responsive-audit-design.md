# Responsiveness audit & fixes

## Purpose

The client wants confidence the FARMILY marketing site displays correctly on every device an actual visitor uses — iPhones, iPads, laptops, desktops. No specific breakage has been reported; this is a proactive, systematic pass rather than a fix for a known bug.

## Scope

All 7 live pages: Home, Solution, About, Research, Contact, Privacy, Terms.

All shared components that render on multiple pages: `Header`, `Footer`, `ContactForm`, `PageHero`, `ProductPreview`, `ColdChainIllustration` (hero background), `Parallax`, `Reveal`.

Out of scope: no new features, no content changes, no visual redesign — only layout/sizing/spacing fixes so existing designs render correctly at every width.

## Breakpoints

Checked via Playwright, using both named device emulation and raw viewport widths:

| Target | Width | Notes |
|---|---|---|
| iPhone SE / small phone | 375px | Tightest realistic phone width |
| Modern iPhone | 390–430px | iPhone 14/15 class |
| iPad portrait | 768px | Common tablet breakpoint, also mid-size window |
| iPad landscape / small laptop | 1024px | |
| Laptop / desktop | 1280–1440px | Already the primary tested width from prior work |
| Large desktop | 1920px | Verify content doesn't over-stretch or look sparse |

## What "correct" means at each breakpoint

- No horizontal overflow / no horizontal scrollbar on `<body>`.
- No clipped, overlapping, or awkwardly-wrapping text (headings especially — large `font-display` sizes are the highest risk).
- Touch targets (nav links, buttons, form inputs, the mobile menu button) are at least 44×44px, consistent with Apple HIG.
- Form inputs render at ≥16px font size, so iOS Safari doesn't auto-zoom on focus.
- Images and the hero/product illustrations scale proportionally without distortion or falling off-canvas.
- The header's mobile menu (hamburger ↔ full nav) switches at a sensible breakpoint and both states are fully usable.
- Spacing/padding scales down sensibly on narrow viewports rather than collapsing elements together or leaving excessive dead space.

One thing that needs no work: the hero's pointer-parallax (`Parallax.tsx`) is already gated behind `(hover: hover) and (pointer: fine)`, so it's already inert on touch devices — confirmed in the prior session, no regression risk here.

## Process

For each of the 7 pages:
1. Screenshot at each breakpoint in the table above (Playwright).
2. Visually review each screenshot against the "correct" criteria.
3. Fix any issue found using Tailwind responsive utilities (`sm:`/`md:`/`lg:`/`xl:` prefixes), following the project's existing responsive patterns rather than introducing new ones.
4. Re-screenshot the fixed breakpoint to confirm.

After all pages pass: run `npm run build` and `npm run lint`, confirm both are clean, then commit and push (triggering the existing Vercel auto-deploy).

## Testing

Playwright screenshots at every breakpoint × every page (42 screenshots minimum: 7 pages × 6 breakpoints), reviewed visually. Console-error checking on each page load, as done in prior verification passes. No automated visual-regression tooling is being introduced — this is a manual audit-and-fix pass, consistent with how prior UI work in this project has been verified.

## Sequencing

This spec ships first, independently of the Arabic localization work — it's the foundation the Arabic pages will be built on, so fixing responsiveness issues once here avoids duplicating the fix across two locales later.
