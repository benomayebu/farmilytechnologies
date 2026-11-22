# Priority 0 change log

Branch `design-a11y-fixes`, six commits on top of `main` (537f7e0). Lint and build pass after every commit.

| Item | Commit | What changed |
|---|---|---|
| 0.1 | d42f408 | Text-carrying teal fills now use teal-deep (7.81:1) with an ink hover (14.32:1). Teal link hovers now go to ink. |
| 0.2 | 9c808f3 | Contrast floor: ink/70 on light backgrounds, paper/60 on ink, paper/70 on ink-soft. About 20 failing pairs fixed. Decorative numerals are aria-hidden at 3.56:1. New `--wheat-light` token. The invisible pairing check circle is fixed. See `contrast.md`. |
| 0.3 | a388805 | One h1 per page, no skipped levels. Eyebrow `as="h2"`, a screen-reader-only "What FARMILY does" h2, Solution pillars become h3, About and Contact get h2s. See `heading-outline.txt`. |
| 0.4 | 34d4f20 | Menu button has aria-expanded and aria-controls. Escape closes the menu and returns focus. The menu closes on route change. The closed panel is `inert`. Skip link added, `main#main`, aria-current on nav, --ease-out on the panel. Global focus ring: teal-deep on light, wheat on dark. |
| 0.5 | 1fdfca2 | `<noscript>` style shows all Reveal and hero content. The contact form posts to Formspree without JavaScript. |
| 0.6 | 50e14ba | Logo via next/image at displayed size with `preload`. 106 KB becomes about 6 KB. Layout shift 0. |

## Keyboard walk-through (what I saw)

Tabbed through Home, Solution, About, Research and Contact at 1440px, and Home at 390px, in Chromium.

- First Tab: "Skip to main content" appears top left as a dark pill with a ring. Enter moves focus to the page content, and the next Tab lands on the first link or control in the page.
- Desktop order: skip link, logo, Home, Solution, About, Research, Contact, "Talk to us", then page content, then the footer links. That's 18 to 30 stops per page, and every one shows a ring: teal-deep on the cream header and sections, wheat on the dark hero, closing band, segments, timeline panel and footer.
- Mobile, menu closed: the menu links are not reachable. Enter on the menu button opens it (aria-expanded becomes true), and Tab moves into Home, Solution, and so on. Escape closes it and focus returns to the button. Tapping a link, or pressing the browser's Back button with the menu open, closes it.
- The only stop without a ring is `nextjs-portal`, the Next.js dev-tools button. It exists only on the dev server, not on the live site.
- Known side effect until item 3.3: the ring fades in over about 200ms, because `transition-all` and `transition-colors` also animate outline colour. Removing `transition-all` in 3.3 makes it appear instantly on buttons.

## Checks after Priority 0

- Text hidden with JavaScript off: 0 on all five pages (it was 16, 30, 9, 3 and 7).
- Horizontal scroll at 320px: none on any page (unchanged).
- Reduced motion, reduced transparency and increased contrast rules: untouched.
- Screenshots were taken at 1440px and 390px for all five pages. They are kept locally, not in this repo.

## Not done, and why

- The faint text in the video poster and frames is part of the video file, so it can't be fixed in code.
- No SVG logo exists. The PNG is used as it is and was not redrawn.
