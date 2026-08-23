# Arabic (MSA) + RTL localization

## Purpose

The client (targeting UAE audiences, including the Hub71/ADGM ecosystem) wants the FARMILY marketing site available in Modern Standard Arabic, so Arabic-speaking visitors can read it in their language rather than only English.

## Decisions from brainstorming

- **Translation source:** AI-drafted MSA, written now for all pages, in the site's existing honest/non-overselling tone. Flagged for a native-speaker and legal review before being treated as final — the same caveat already given for the English Privacy/Terms pages.
- **Scope:** all 7 pages get an Arabic version (Home, Solution, About, Research, Contact, Privacy, Terms) — nothing stays English-only.
- **Legal precedence:** Privacy and Terms each get a short added clause, in both languages, stating the English text governs if the two versions ever differ.
- **URL structure:** English stays unprefixed and unchanged (`/`, `/solution`, `/about`, ...). Arabic lives under `/ar` (`/ar`, `/ar/solution`, `/ar/about`, ...). Chosen over prefixing everything (`/en/...`) because it preserves every URL already live and shared, and over a separate subdomain because that would split SEO authority and add DNS/cert overhead for no real benefit at this scale.
- **i18n mechanism:** hand-rolled dictionaries extending the existing `src/lib/content/*.ts` pattern — no new npm dependency (e.g. no `next-intl`). This site's content is static marketing copy across 7 pages; a library built for pluralization/ICU formatting is more machinery than the problem needs, and it breaks from the project's existing minimal-footprint approach.
- **Language switcher:** the segmented pill toggle (EN | AR) design approved during brainstorming, placed in the header's nav row and mirrored in the mobile menu panel. Each page links to its exact counterpart in the other locale.
- **Hero illustration:** stays visually fixed left-to-right on both locales — it represents a shipment's physical journey, not reading order, so it is explicitly pinned with `dir="ltr"` regardless of the surrounding page direction.

## Architecture

### Routing

- Move all existing route files under a `src/app/[locale]/` segment: `src/app/[locale]/page.tsx`, `src/app/[locale]/solution/page.tsx`, `src/app/[locale]/about/page.tsx`, `src/app/[locale]/research/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/terms/page.tsx`.
- The root layout (`<html>`/`<body>`) moves to `src/app/[locale]/layout.tsx`. It reads the `locale` param and sets:
  - `lang={locale}`
  - `dir={locale === "ar" ? "rtl" : "ltr"}`
  - locale-appropriate font variables on `<html>` (see Fonts below)
- `generateStaticParams` returns `[{ locale: "en" }, { locale: "ar" }]` so both are statically generated at build time (consistent with the site's existing fully-static output).
- A `middleware.ts` at the project root rewrites requests: `/` and its subpaths are internally rewritten to `/en` (the URL bar stays clean — no `/en` ever shown), while `/ar` and its subpaths pass through as-is. This is what keeps existing English URLs unchanged while adding an explicit `/ar` prefix only for Arabic.
- `sitemap.ts` is updated to emit both locale variants of every route.
- Each page's `generateMetadata`/`metadata` gets an `alternates.languages` entry pointing at its counterpart in the other locale (SEO `hreflang`).

### Content

- Each file in `src/lib/content/` (`home.ts`, `solution.ts`, `about.ts`, `research.ts`, `legal.ts`) is restructured so every existing named export becomes an object keyed by locale, e.g. `export const hero = { en: { headline: "...", ... }, ar: { headline: "...", ... } };`. Pages read the active variant as `hero[locale]`. This keeps the existing named-export shape pages already import, just adds the locale key — no page needs to change its import list, only its property access.
- I write the full MSA translation for every page's copy now, matching tone (direct, honest, not overselling) and preserving the same structure/length balance as the English original where natural in Arabic.
- `legal.ts` (Privacy/Terms) gets the added precedence clause in both languages.

### Fonts

- Fraunces and Public Sans (current `--font-display`/`--font-body`) have no Arabic glyph coverage.
- Add an Arabic pairing via `next/font/google`: a serif/display face for headings (Noto Naskh Arabic, to echo Fraunces's editorial weight) and a clean sans for body copy (Noto Sans Arabic).
- These load only when `locale === "ar"`; the CSS custom properties `--font-display`/`--font-body` are set per-locale on `<html>` (or a data attribute drives which font stack applies), so English pages take no bundle-size hit from the Arabic fonts and vice versa.

### RTL layout

- Setting `dir="rtl"` on `<html>` automatically mirrors flexbox/grid row layouts (nav, cards, most of this site's structure), which covers the majority of the work for free.
- Where Tailwind utilities encode a physical direction (`ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`, `left-`, `right-` on absolutely-positioned elements), swap to the logical equivalents (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) so they auto-flip with `dir`, auditing each component touched.
- Icons with directional meaning (the `ArrowRight` used in `Button.tsx` and inline CTA links) get `rtl:rotate-180` (or `rtl:-scale-x-100`, whichever renders correctly) so the arrow points toward reading-end in both directions.
- The hero's `ColdChainIllustration` wrapper gets an explicit `dir="ltr"` override, isolating it from the page's `dir="rtl"` context so the truck/warehouse scene never mirrors.
- `Reveal`'s entrance animation (vertical `translateY`) and `Parallax`'s pointer-offset math (symmetric around center) are already direction-agnostic — verified during design, no changes expected, but re-checked visually on the Arabic pages during testing.
- Mobile menu's height-based (`grid-template-rows`) open/close transition is vertical — unaffected by RTL.

### Language switcher

- A small client component rendering the EN/AR pill, added to `Header.tsx`'s desktop nav row and to the mobile menu panel.
- Needs the current path (via `usePathname`, already used in `Header.tsx`) to compute the equivalent path in the other locale (strip/add the `/ar` prefix) so switching languages keeps the visitor on the same page rather than bouncing to the homepage.

## Testing

- Playwright screenshots of all 7 Arabic pages at the same breakpoint set as the responsiveness spec, checking: Arabic text renders with no missing-glyph ("tofu") boxes, layout mirrors correctly, the switcher round-trips both directions, the hero illustration stays LTR, and the contact form (Formspree) is usable with RTL text alignment.
- `npm run build` / `npm run lint` clean, as with every prior change in this project.
- Console-error check on each locale/page combination.

## Out of scope

- No change to Formspree's backend handling — same endpoint, same field names, just RTL-aware label/input alignment.
- No professional/legal review of the Arabic translation itself — flagged to the client as a follow-up before treating the copy (especially Privacy/Terms) as final.
- No Arabic-specific Open Graph image.
- No language auto-detection/redirect based on browser locale — visitors choose explicitly via the switcher; this avoids surprising a visitor who followed an English link.

## Sequencing

Ships after the responsiveness audit spec, so the Arabic pages inherit an already-verified responsive foundation instead of needing the same fixes applied twice.
