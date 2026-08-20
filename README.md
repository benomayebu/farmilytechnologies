# FARMILY website

Marketing site for FARMILY — Next.js (App Router), TypeScript, Tailwind CSS v4, exported as static HTML/CSS/JS for Hostinger hosting.

## Develop

```bash
npm install
npm run dev
```

Visit http://localhost:3000. Note: the contact form posts to `/contact-handler.php`, which only runs on a real PHP server — locally it will show the graceful error state (`Something went wrong...`) since Next's dev server doesn't execute PHP. That's expected; it works once deployed to Hostinger.

## Content

Page copy lives in `src/lib/content/*.ts`, one file per page — edit those rather than hunting through JSX for wording changes.

## Before going live

- **Logo**: drop the real FARMILY barn logo file into `public/` (e.g. `public/logo.svg` or `.png`) and swap it into `src/components/icons/index.tsx` (`BarnMark`) or reference it directly with `next/image` in `Header.tsx` / `Footer.tsx`. The current mark is a simplified placeholder.
- **Research page DOI link**: `src/lib/content/research.ts` has a `#` placeholder for `citation.href` — replace with the live Springer DOI link before publishing.
- **Contact form sender address**: `public/contact-handler.php` sends `From: no-reply@farmilytechnologies.com`. Point this at a real mailbox on your Hostinger domain (or set up that alias) — mail servers are more likely to deliver mail whose `From` matches the sending domain.

## Build & deploy (Hostinger)

```bash
npm run build
```

This produces a fully static site in `out/`. Upload the **contents** of `out/` (not the folder itself) to your Hostinger `public_html/` directory via File Manager or FTP — `contact-handler.php` is already included in `out/` since anything in `public/` is copied through at build time; just confirm it lands at the root alongside `index.html`.

Point your `farmilytechnologies.com` domain at that hosting in Hostinger's domain settings if it isn't already.
