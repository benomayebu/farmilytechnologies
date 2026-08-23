# Responsive Audit & Touch-Target Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Confirm the FARMILY site (7 pages) renders correctly on iPhone/iPad/laptop/desktop widths, and fix the concrete touch-target sizing issues found during the audit.

**Architecture:** No new dependencies or new files. The audit (already run once during planning) found zero layout/overflow bugs — the existing Tailwind responsive classes already handle every breakpoint cleanly. The only real issue is a handful of tap targets (one icon button, five inline text links) rendering smaller than the ~44px comfortable-tap guideline used elsewhere in this project (see `apple-design` skill, §10). Each task adds Tailwind padding utilities to one existing file; a final task re-runs the audit script to confirm.

**Tech Stack:** Next.js 16 (App Router) + Tailwind CSS v4, verified with Playwright (Chromium) — same toolchain used for every prior verification pass in this project. No test runner exists in this repo (no Jest/Vitest) and none is being added; verification here follows the project's established pattern of a scripted Playwright check + visual screenshot review + `npm run build` / `npm run lint`.

---

### Task 1: Enlarge the mobile menu button's tap target

**Files:**
- Modify: `src/components/Header.tsx:74-81`

The hamburger/close button currently has no padding, so its clickable box is exactly the icon's rendered size (28×28px — confirmed via `getBoundingClientRect()` during the audit). Apple HIG (already the standard this project follows — see `.claude/skills/apple-design/SKILL.md` §10) calls for ~44×44px. Adding `p-2` (8px each side) brings the box to 28+16=44px; `-mr-2` compensates so the icon's visual right edge stays flush with where it was (otherwise the added padding would shift the icon 8px left of the container's edge).

- [ ] **Step 1: Confirm the current tap-target size (baseline)**

Run (from the project root, with the dev server running — start it first with `npm run dev` in a background shell if it isn't already running):

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const box = await page.locator('header button[aria-label]').boundingBox();
  console.log('menu button box:', box);
  await browser.close();
})();
"
```

Expected: `width: 28, height: 28` (or similar — under 44).

- [ ] **Step 2: Apply the fix**

In `src/components/Header.tsx`, change:

```tsx
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="text-ink transition-transform duration-150 active:scale-90 md:hidden"
        >
```

to:

```tsx
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 text-ink transition-transform duration-150 active:scale-90 md:hidden"
        >
```

- [ ] **Step 3: Re-run the check to confirm the fix**

Run the same script as Step 1.
Expected: `width: 44, height: 44`.

- [ ] **Step 4: Visual check — confirm the icon still sits flush with the header's right edge**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/header-check.png' });
  await browser.close();
})();
"
```

Open `/tmp/header-check.png` (via the Read tool) and confirm the hamburger icon looks the same as before — same visual position, just a larger invisible tap area around it.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx
git commit -m "Enlarge mobile menu button tap target to 44x44px"
```

---

### Task 2: Enlarge footer link tap targets

**Files:**
- Modify: `src/components/Footer.tsx:31-41` (nav links), `src/components/Footer.tsx:43-51` (email link), `src/components/Footer.tsx:60-67` (Privacy/Terms links)

Three groups of links in the footer render with only their text's natural line-height as the tap area (20px for the `text-sm` nav/email links, 16px for the `text-xs` Privacy/Terms links) — no padding. All three groups are already flex children (`nav` is `flex flex-wrap`, the legal row is `flex gap-5`), so padding added to each link grows its own box without disturbing the surrounding layout.

- [ ] **Step 1: Confirm current tap-target sizes (baseline)**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  for (const text of ['Home', 'Privacy Policy', 'benjamin.omayebu@farmilytechnologies.com']) {
    const el = page.locator(\`footer a:has-text('\${text}')\`).first();
    console.log(text, await el.boundingBox());
  }
  await browser.close();
})();
"
```

Expected: heights around 16-20px for all three.

- [ ] **Step 2: Apply the fix to the nav links**

In `src/components/Footer.tsx`, change:

```tsx
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-paper/70 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>
```

to:

```tsx
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-paper/70 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>
```

- [ ] **Step 3: Apply the fix to the email link**

In the same file, change:

```tsx
          <a
            href="mailto:benjamin.omayebu@farmilytechnologies.com"
            className="mt-1 inline-block text-paper transition-colors hover:text-wheat"
          >
```

to:

```tsx
          <a
            href="mailto:benjamin.omayebu@farmilytechnologies.com"
            className="mt-1 inline-block py-3 text-paper transition-colors hover:text-wheat"
          >
```

- [ ] **Step 4: Apply the fix to the Privacy/Terms links**

In the same file, change:

```tsx
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-paper/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper/80">
              Terms of Use
            </Link>
          </div>
```

to:

```tsx
          <div className="flex gap-5">
            <Link href="/privacy" className="py-3 transition-colors hover:text-paper/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="py-3 transition-colors hover:text-paper/80">
              Terms of Use
            </Link>
          </div>
```

- [ ] **Step 5: Re-run the check to confirm the fix**

Run the same script as Step 1.
Expected: heights around 40-44px for all three (the `text-xs` Privacy/Terms links land around 40px since their base line-height is smaller; the `text-sm` links land at 44px).

- [ ] **Step 6: Visual check**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/footer-check.png' });
  await browser.close();
})();
"
```

Open `/tmp/footer-check.png` and confirm the footer still looks visually balanced — no overlapping rows, no awkward extra whitespace.

- [ ] **Step 7: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "Enlarge footer link tap targets"
```

---

### Task 3: Enlarge the Research page citation link's tap target

**Files:**
- Modify: `src/app/research/page.tsx:33-40`

- [ ] **Step 1: Apply the fix**

Change:

```tsx
            <a
              href={citation.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
            >
```

to:

```tsx
            <a
              href={citation.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 py-3 text-sm font-medium text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
            >
```

- [ ] **Step 2: Confirm the fix**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/research', { waitUntil: 'networkidle' });
  const box = await page.locator('a', { hasText: 'Read the published chapter' }).boundingBox();
  console.log('citation link box:', box);
  await browser.close();
})();
"
```

Expected: height around 44px (was 20px).

- [ ] **Step 3: Commit**

```bash
git add src/app/research/page.tsx
git commit -m "Enlarge Research page citation link tap target"
```

---

### Task 4: Enlarge the Contact page "Prefer email?" link's tap target

**Files:**
- Modify: `src/app/contact/page.tsx:28-36`

- [ ] **Step 1: Apply the fix**

Change:

```tsx
          <Reveal delay={100} className="text-sm">
            <p className="font-display text-lg text-ink">Prefer email?</p>
            <a
              href="mailto:benjamin.omayebu@farmilytechnologies.com"
              className="mt-2 inline-block text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
            >
              benjamin.omayebu@farmilytechnologies.com
            </a>
          </Reveal>
```

to:

```tsx
          <Reveal delay={100} className="text-sm">
            <p className="font-display text-lg text-ink">Prefer email?</p>
            <a
              href="mailto:benjamin.omayebu@farmilytechnologies.com"
              className="mt-2 inline-block py-3 text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
            >
              benjamin.omayebu@farmilytechnologies.com
            </a>
          </Reveal>
```

- [ ] **Step 2: Confirm the fix**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(300);
  const box = await page.locator('a[href^=\"mailto:\"]').boundingBox();
  console.log('prefer-email link box:', box);
  await browser.close();
})();
"
```

Expected: height around 44px (was 20px).

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "Enlarge Contact page email link tap target"
```

---

### Task 5: Fix contact form input font size (prevents iOS Safari auto-zoom)

**Files:**
- Modify: `src/components/ContactForm.tsx:9-10`

Every input/textarea in the form shares `fieldClasses`, which sets `text-[15px]` (15px). iOS Safari auto-zooms the viewport when a focused input's font-size is under 16px — a jarring, unintended zoom the instant a visitor taps into the Name/Company/Email/Message fields on an iPhone. Bumping to `text-base` (Tailwind's 16px utility) fixes it site-wide in one place, since every field shares this constant.

- [ ] **Step 1: Confirm the current font size (baseline)**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  const size = await page.locator('#name').evaluate(el => getComputedStyle(el).fontSize);
  console.log('input font-size:', size);
  await browser.close();
})();
"
```

Expected: `15px`.

- [ ] **Step 2: Apply the fix**

In `src/components/ContactForm.tsx`, change:

```tsx
const fieldClasses =
  "w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-teal";
```

to:

```tsx
const fieldClasses =
  "w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-teal";
```

- [ ] **Step 3: Re-run the check to confirm the fix**

Run the same script as Step 1.
Expected: `16px`.

- [ ] **Step 4: Visual check — confirm the slightly larger text doesn't break the two-column Name/Company row on mobile**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/contact-form-check.png' });
  await browser.close();
})();
"
```

Open `/tmp/contact-form-check.png` and confirm all four fields render cleanly with no overflow or label/input crowding (the form already stacks to a single column below `sm:` per the existing `grid gap-5 sm:grid-cols-2`, so this is a low-risk change).

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactForm.tsx
git commit -m "Bump contact form input font size to 16px to prevent iOS auto-zoom"
```

---

### Task 6: Full-site re-audit and deploy

**Files:** none (verification only)

Re-run the complete breakpoint sweep from the original audit (7 pages × 6 breakpoints: 375, 390, 768, 1024, 1280, 1920px) to confirm zero regressions and zero remaining touch-target issues, then ship.

- [ ] **Step 1: Write the audit script**

Save as `/tmp/full-audit.mjs`:

```js
import { chromium } from 'playwright';

const PAGES = ['/', '/solution', '/about', '/research', '/contact', '/privacy', '/terms'];
const BREAKPOINTS = [
  { name: '375', width: 375, height: 667 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

function isReallyVisible(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    const rect = node.getBoundingClientRect();
    const overflowHidden = style.overflow === 'hidden' || style.overflowY === 'hidden' || style.overflowX === 'hidden';
    if (overflowHidden && (rect.height === 0 || rect.width === 0)) return false;
    node = node.parentElement;
  }
  return true;
}

const browser = await chromium.launch();
let failures = 0;

for (const path of PAGES) {
  for (const bp of BREAKPOINTS) {
    const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const overflowing = await page.evaluate(() => {
      const doc = document.documentElement;
      return Math.max(doc.scrollWidth, document.body.scrollWidth) > doc.clientWidth + 1;
    });

    let smallTargets = [];
    if (bp.width <= 430) {
      smallTargets = await page.evaluate((isReallyVisibleSrc) => {
        // eslint-disable-next-line no-eval
        const isReallyVisible = eval(`(${isReallyVisibleSrc})`);
        const interactive = document.querySelectorAll('a, button, input, textarea');
        const small = [];
        for (const el of interactive) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) continue;
          if (!isReallyVisible(el)) continue;
          if ((rect.height > 0 && rect.height < 40) || (rect.width > 0 && rect.width < 24)) {
            small.push({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 30), w: Math.round(rect.width), h: Math.round(rect.height) });
          }
        }
        return small;
      }, isReallyVisible.toString());
    }

    if (overflowing || consoleErrors.length || smallTargets.length) {
      failures++;
      console.log(`FAIL ${path} @ ${bp.name}: overflow=${overflowing} errors=${consoleErrors.length} smallTargets=${JSON.stringify(smallTargets)}`);
    }

    await page.close();
  }
}

await browser.close();
console.log(failures === 0 ? 'ALL CLEAR' : `${failures} breakpoint(s) with issues`);
process.exit(failures === 0 ? 0 : 1);
```

- [ ] **Step 2: Run it**

```bash
node /tmp/full-audit.mjs
```

Expected: `ALL CLEAR`. If anything fails, fix it before proceeding (do not skip this gate).

- [ ] **Step 3: Run the project's standard verification**

```bash
npm run lint
npm run build
```

Expected: both exit clean, as with every prior change in this project.

- [ ] **Step 4: Push**

```bash
git push origin main
```

This triggers Vercel's existing GitHub auto-deploy — no manual deploy step needed.
