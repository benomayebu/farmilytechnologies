# Arabic (MSA) + RTL Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full Modern Standard Arabic version of the FARMILY site at `/ar/*` (English staying unprefixed at `/`), with RTL layout, a language switcher, and correct SEO metadata — while every English URL keeps working exactly as before.

**Architecture:** Move all routes under a `src/app/[locale]/` segment; a `middleware.ts` rewrite keeps English URLs unprefixed (`/`, `/solution`, ...) while Arabic is explicit (`/ar`, `/ar/solution`, ...). Every existing named export in `src/lib/content/*.ts` becomes locale-keyed (`{ en: {...}, ar: {...} }`); a small new `chrome.ts` holds shared UI strings (nav, footer, form labels) the same way. `dir="rtl"` on `<html>` handles most layout mirroring automatically; a handful of physical-direction utilities and one directional icon get explicit fixes. Work proceeds low-risk-first: routing infrastructure lands before any content changes (so the restructure itself can be verified against unchanged English behavior), then content, then RTL/font polish, then a full audit before the one and only push.

**Tech Stack:** Next.js 16 (App Router, static export via `generateStaticParams`) + Tailwind CSS v4 + `next/font/google`. No i18n library — hand-rolled locale dictionaries, consistent with the project's existing minimal-footprint style. Verified via Playwright (Chromium) + `npm run lint` / `npm run build`, same toolchain as every prior change in this project. No test runner exists and none is being added.

---

## Before Task 1: what you need to know about this codebase

- The site is **fully static** (`generateStaticParams` + no dynamic data) and deploys to Vercel via GitHub push to `main` — auto-deploy, no manual step.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`) — unaffected by moving files deeper into `[locale]/`.
- Every task in this plan says **"commit, don't push."** Only the final task (Task 11) pushes, after the whole site has been verified end-to-end. This means the live site is untouched until the feature is fully done — never a half-translated site in production.
- The dev server should be running at `http://localhost:3000` for every verification script (`npm run dev &`, wait ~3s, if not already running).

---

### Task 1: Routing infrastructure — `[locale]` segment + middleware

**Files:**
- Create: `middleware.ts` (project root, next to `package.json`)
- Move: `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`
- Move: `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- Move: `src/app/solution/page.tsx` → `src/app/[locale]/solution/page.tsx`
- Move: `src/app/about/page.tsx` → `src/app/[locale]/about/page.tsx`
- Move: `src/app/research/page.tsx` → `src/app/[locale]/research/page.tsx`
- Move: `src/app/contact/page.tsx` → `src/app/[locale]/contact/page.tsx`
- Move: `src/app/privacy/page.tsx` → `src/app/[locale]/privacy/page.tsx`
- Move: `src/app/terms/page.tsx` → `src/app/[locale]/terms/page.tsx`
- Do NOT move: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/icon.png`, `src/app/favicon.ico`, `src/app/opengraph-image.jpg`, `src/app/globals.css` — these stay exactly where they are (see "Why" below).

This task does **only** the structural move. It does not add Arabic content, fonts, or RTL styling yet — those are separate tasks. After this task, `/ar` will render, but with the same English content as `/` (since pages haven't been made locale-aware yet). That's an expected, temporary, **never-pushed** intermediate state.

**Why `robots.ts`/`sitemap.ts`/`icon.png`/`favicon.ico`/`opengraph-image.jpg` don't move:** `robots.ts` and `sitemap.ts` generate `/robots.txt` and `/sitemap.xml` — URLs that must resolve at the true site root regardless of locale, not `/en/robots.txt`. Moving them under `[locale]/` would break that. `icon.png`, `favicon.ico`, and `opengraph-image.jpg` are Next.js file-convention metadata images resolved by walking up the segment tree from the matched route to the app root — they stay valid for routes under `[locale]/` even though there's no `layout.tsx` directly beside them anymore, because convention-file resolution doesn't require a co-located layout file, just presence in an ancestor segment directory.

- [ ] **Step 1: Create the middleware**

Save as `middleware.ts` in the project root (same level as `package.json`, `next.config.ts`):

```ts
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCALE = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/ar") ||
    pathname.startsWith(`/${DEFAULT_LOCALE}`)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

The matcher excludes `_next` internals and any path containing a dot (`robots.txt`, `sitemap.xml`, `icon.png`, `favicon.ico`, `opengraph-image.jpg`) — those never hit the middleware at all, so they're untouched by the rewrite. The in-function checks are defense-in-depth for the same thing plus explicit `/ar` and `/en` passthroughs (so a direct request to `/ar/solution` or `/en/solution` isn't double-rewritten).

- [ ] **Step 2: Move the 7 page files**

```bash
mkdir -p "src/app/[locale]/solution" "src/app/[locale]/about" "src/app/[locale]/research" "src/app/[locale]/contact" "src/app/[locale]/privacy" "src/app/[locale]/terms"
git mv src/app/page.tsx "src/app/[locale]/page.tsx"
git mv src/app/solution/page.tsx "src/app/[locale]/solution/page.tsx"
git mv src/app/about/page.tsx "src/app/[locale]/about/page.tsx"
git mv src/app/research/page.tsx "src/app/[locale]/research/page.tsx"
git mv src/app/contact/page.tsx "src/app/[locale]/contact/page.tsx"
git mv src/app/privacy/page.tsx "src/app/[locale]/privacy/page.tsx"
git mv src/app/terms/page.tsx "src/app/[locale]/terms/page.tsx"
rmdir src/app/solution src/app/about src/app/research src/app/contact src/app/privacy src/app/terms
```

None of these files need content changes in this task — they still import from `@/lib/content/*` exactly as before (those files aren't restructured until Task 2), so the site keeps rendering identically. Don't edit their contents in this step.

- [ ] **Step 3: Move and rewrite the root layout**

```bash
git mv src/app/layout.tsx "src/app/[locale]/layout.tsx"
```

Replace the full contents of `src/app/[locale]/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IOSTapFix from "@/components/IOSTapFix";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const siteUrl = "https://farmilytechnologies.com";
const title = "FARMILY — Supply Chain Compliance, Automated";
const description =
  "IoT monitoring, AI exception detection, and audit-ready records — built for food distributors and importers, not enterprise budgets.";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "FARMILY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${publicSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-body antialiased">
        <IOSTapFix />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

This is intentionally the *minimal* change: only path (`../globals.css`), `generateStaticParams`, and the `lang`/`dir` attributes are new. The `metadata` export stays static/English-only for now — it becomes locale-aware and gets `hreflang` alternates in Task 5, once there's real Arabic content to point to. Arabic fonts are added in Task 8, once RTL styling is being wired up — no reason to load them before that.

- [ ] **Step 4: Verify TypeScript recognizes the new route type**

`LayoutProps<"/[locale]">` is Next's typed-routes helper — it only resolves correctly after Next regenerates its route type manifest. Run:

```bash
npm run build
```

Expected: this may fail on the FIRST run with a type error about `LayoutProps<"/[locale]">` not existing yet, or it may succeed directly (Next.js regenerates types as part of the build). If it fails with a route-type error specifically, run `npm run build` a second time — the first run's compilation step generates `.next/types`, which the second run's type-check then sees. If it still fails after a second run, or fails with any error OTHER than the route-type issue, stop and report — don't guess at a workaround.

- [ ] **Step 5: Verify English behavior is completely unchanged**

Start the dev server if not running (`npm run dev &`, wait ~3s), then:

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const paths = ['/', '/solution', '/about', '/research', '/contact', '/privacy', '/terms'];
  for (const path of paths) {
    const res = await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle' });
    const html = await page.locator('html').getAttribute('lang');
    const dir = await page.locator('html').getAttribute('dir');
    console.log(path, res.status(), 'lang=' + html, 'dir=' + dir);
  }
  await browser.close();
})();
"
```

Expected: every path returns status `200`, `lang=en`, `dir=ltr`. The URL bar (not shown by this script, but you can confirm manually) should stay exactly as typed — no `/en` prefix visible.

- [ ] **Step 6: Verify `/ar` is now reachable (with temporary English content — expected)**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const res = await page.goto('http://localhost:3000/ar', { waitUntil: 'networkidle' });
  const html = await page.locator('html').getAttribute('lang');
  const dir = await page.locator('html').getAttribute('dir');
  console.log('/ar', res.status(), 'lang=' + html, 'dir=' + dir);
  await browser.close();
})();
"
```

Expected: status `200`, `lang=ar`, `dir=rtl` — even though the visible text is still English (that's fixed in later tasks).

- [ ] **Step 7: Verify static/metadata files are untouched**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const path of ['/robots.txt', '/sitemap.xml', '/icon.png', '/favicon.ico', '/opengraph-image.jpg']) {
    const res = await page.goto('http://localhost:3000' + path);
    console.log(path, res.status(), res.headers()['content-type']);
  }
  await browser.close();
})();
"
```

Expected: all five return status `200` with sensible content-types (`text/plain` for robots.txt, `application/xml` for sitemap.xml, `image/png`/`image/x-icon`/`image/jpeg` for the images).

- [ ] **Step 8: Run lint**

```bash
npm run lint
```

Expected: clean.

- [ ] **Step 9: Commit**

```bash
git add middleware.ts "src/app/[locale]"
git commit -m "Restructure routing under [locale] segment for Arabic support"
```

Do NOT push.

---

### Task 2: Translate and restructure page content (home, solution, about, research)

**Files:**
- Modify: `src/lib/content/home.ts`
- Modify: `src/lib/content/solution.ts`
- Modify: `src/lib/content/about.ts`
- Modify: `src/lib/content/research.ts`
- Create: `src/lib/content/contact.ts` (this page currently has no content file — its copy is hardcoded directly in JSX; this task extracts it and adds the Arabic version)

Every existing named export becomes an object keyed by locale: `export const hero = { en: {...}, ar: {...} };`. Pages read `hero[locale]` (wired up in Task 5). This step only touches the content files — no page component changes yet.

- [ ] **Step 1: Replace `src/lib/content/home.ts`**

```ts
export const hero = {
  en: {
    eyebrow: "Compliance software for food supply chains",
    headline: "Supply Chain Compliance, Automated.",
    subLine:
      "IoT monitoring, AI exception detection, and audit-ready records — built for food distributors and importers, not enterprise budgets.",
    supportingLine:
      "When a shipment arrives, or an auditor asks for proof, you shouldn't have to scramble for it.",
    cta: "See the problem we're solving",
  },
  ar: {
    eyebrow: "برمجيات الامتثال لسلاسل التوريد الغذائية",
    headline: "امتثال سلسلة التوريد، آلياً بالكامل.",
    subLine:
      "مراقبة عبر إنترنت الأشياء، وكشف الاستثناءات بالذكاء الاصطناعي، وسجلات جاهزة للتدقيق — مصممة لموزعي ومستوردي الأغذية، لا لميزانيات الشركات الكبرى.",
    supportingLine:
      "عندما تصل الشحنة، أو يطلب المدقق دليلاً، لا ينبغي أن تضطر للبحث عنه في اللحظة الأخيرة.",
    cta: "تعرّف على المشكلة التي نحلّها",
  },
} as const;

export const whatWeDo = {
  en: {
    eyebrow: "What we do",
    body: "FARMILY helps small and mid-size food distributors and importers prove their shipments stayed safe — automatically. We turn the sensor data a shipment already generates into a clean, tamper-evident compliance record, so a rejected load, a failed audit, or a disputed claim doesn't turn into a multi-day scramble.",
  },
  ar: {
    eyebrow: "ما نقدّمه",
    body: "تساعد فارميلي موزعي ومستوردي الأغذية الصغار والمتوسطين على إثبات سلامة شحناتهم — بشكل آلي. نحوّل بيانات أجهزة الاستشعار التي تولّدها الشحنة أصلاً إلى سجل امتثال واضح يصعب التلاعب به، حتى لا تتحوّل شحنة مرفوضة، أو تدقيق فاشل، أو مطالبة متنازع عليها، إلى أيام من الفوضى.",
  },
} as const;

export const pillars = {
  en: [
    {
      key: "sense",
      name: "Sense",
      description:
        "Continuous IoT monitoring of temperature, location, and handling events.",
    },
    {
      key: "detect",
      name: "Detect",
      description: "AI flags problems before they become a rejected shipment.",
    },
    {
      key: "prove",
      name: "Prove",
      description:
        "Tamper-evident, audit-ready records, generated in one click.",
    },
  ],
  ar: [
    {
      key: "sense",
      name: "استشعار",
      description:
        "مراقبة مستمرة عبر إنترنت الأشياء لدرجة الحرارة والموقع وأحداث المناولة.",
    },
    {
      key: "detect",
      name: "كشف",
      description: "يرصد الذكاء الاصطناعي المشكلات قبل أن تتحوّل إلى شحنة مرفوضة.",
    },
    {
      key: "prove",
      name: "إثبات",
      description:
        "سجلات يصعب العبث بها وجاهزة للتدقيق، تُنشأ بنقرة واحدة.",
    },
  ],
} as const;

export const closingCta = {
  en: {
    line: "We're currently working with early pilot partners to build this with real operators, not around them.",
    cta: "Talk to us about piloting",
  },
  ar: {
    line: "نعمل حالياً مع شركاء تجريبيين أوائل لبناء هذا الحل معهم كمشغّلين حقيقيين، لا من حولهم.",
    cta: "تواصل معنا بشأن التجربة",
  },
} as const;
```

- [ ] **Step 2: Replace `src/lib/content/solution.ts`**

```ts
export const intro = {
  en: {
    eyebrow: "The solution",
    headline:
      "One mismatch between what the truck says and what the product actually experienced can mean a rejected load, a disputed claim, or a failed audit.",
    sub: "FARMILY closes that gap.",
  },
  ar: {
    eyebrow: "الحل",
    headline:
      "فجوة واحدة بين ما تقوله الشاحنة وما مرّ به المنتج فعلياً قد تعني حمولة مرفوضة، أو مطالبة متنازعاً عليها، أو تدقيقاً فاشلاً.",
    sub: "فارميلي تسدّ هذه الفجوة.",
  },
} as const;

export const whatYouGet = {
  en: {
    eyebrow: "What you get",
    headline:
      "A record that answers the question before anyone has to ask it twice.",
    body: "Every lot gets its own temperature history, its flagged exceptions, and a sealed compliance record — generated automatically, not assembled by hand the night before an audit.",
  },
  ar: {
    eyebrow: "ماذا ستحصل عليه",
    headline: "سجل يجيب عن السؤال قبل أن يُطرح مرتين.",
    body: "تحصل كل دفعة على سجل درجة حرارة خاص بها، واستثناءاتها المرصودة، وسجل امتثال مختوم — يُنشأ تلقائياً، لا يُجمَّع يدوياً في ليلة التدقيق.",
  },
} as const;

export const pillars = {
  en: [
    {
      key: "sense",
      name: "Continuous Monitoring",
      description:
        "Temperature, humidity, and location data captured throughout the journey — not just a single reading at pickup and drop-off.",
    },
    {
      key: "detect",
      name: "AI Exception Detection",
      description:
        "FARMILY flags a developing problem — a power disconnect, a door left open, a slow temperature drift — while there's still time to act, not after the shipment has already failed.",
    },
    {
      key: "prove",
      name: "Tamper-Evident Compliance Records",
      description:
        "When an auditor or buyer asks for proof, generate a complete, verifiable record in minutes — not a scramble through PDFs and spreadsheets.",
    },
  ],
  ar: [
    {
      key: "sense",
      name: "مراقبة مستمرة",
      description:
        "تُسجَّل بيانات درجة الحرارة والرطوبة والموقع طوال الرحلة — لا مجرد قراءة واحدة عند الاستلام والتسليم.",
    },
    {
      key: "detect",
      name: "كشف الاستثناءات بالذكاء الاصطناعي",
      description:
        "ترصد فارميلي المشكلة أثناء تطورها — انقطاع التيار، أو باب مفتوح، أو انحراف بطيء في درجة الحرارة — بينما لا يزال هناك وقت للتصرف، لا بعد أن تكون الشحنة قد فشلت بالفعل.",
    },
    {
      key: "prove",
      name: "سجلات امتثال يصعب العبث بها",
      description:
        "عندما يطلب مدقق أو مشترٍ دليلاً، يمكنك إنشاء سجل كامل وقابل للتحقق في دقائق — لا البحث المحموم بين ملفات PDF وجداول البيانات.",
    },
  ],
} as const;

export const builtAround = {
  en: "Built around who you are",
  ar: "مصمَّم حول من أنت",
} as const;

export const segments = {
  en: [
    {
      key: "distributors",
      name: "Distributors & Importers",
      line: "Stay audit-ready without hiring a compliance team.",
      image: "/images/segment-distributors.jpg",
    },
    {
      key: "coldstorage",
      name: "Cold Storage & Logistics Operators",
      line: "Give your customers proof, not promises.",
      image: "/images/segment-coldstorage.jpg",
    },
  ],
  ar: [
    {
      key: "distributors",
      name: "الموزعون والمستوردون",
      line: "كن جاهزاً للتدقيق دون الحاجة لتوظيف فريق امتثال.",
      image: "/images/segment-distributors.jpg",
    },
    {
      key: "coldstorage",
      name: "مشغّلو التخزين البارد والخدمات اللوجستية",
      line: "امنح عملاءك دليلاً، لا وعوداً.",
      image: "/images/segment-coldstorage.jpg",
    },
  ],
} as const;

export const statusNote = {
  en: "FARMILY is currently in active development, working directly with early pilot partners to shape the product around real operational needs.",
  ar: "فارميلي حالياً قيد التطوير النشط، وتعمل مباشرة مع شركاء تجريبيين أوائل لتصميم المنتج وفق احتياجات تشغيلية حقيقية.",
} as const;
```

Note: `segments[locale][i].image` is intentionally identical in both locales — it's a photo path, not text.

- [ ] **Step 3: Replace `src/lib/content/about.ts`**

```ts
export const intro = {
  en: {
    eyebrow: "About us",
    headline: "Trust, from the farm to the shipment record.",
    body: "FARMILY exists to close the gap between what a shipment is supposed to experience and what it actually experiences — and to make proving the difference take minutes, not days.",
  },
  ar: {
    eyebrow: "من نحن",
    headline: "الثقة، من المزرعة إلى سجل الشحنة.",
    body: "وُجدت فارميلي لسدّ الفجوة بين ما يُفترض أن تمرّ به الشحنة وما تمرّ به فعلياً — ولجعل إثبات هذا الفرق مسألة دقائق، لا أيام.",
  },
} as const;

export const mission = {
  en: {
    eyebrow: "Our mission",
    statement:
      "We believe trust in the food supply chain shouldn't be a luxury only large companies can afford.",
  },
  ar: {
    eyebrow: "مهمتنا",
    statement:
      "نؤمن بأن الثقة في سلسلة التوريد الغذائي لا ينبغي أن تكون رفاهية تقتصر على الشركات الكبرى القادرة على تحمّل تكلفتها.",
  },
} as const;

export const approach = {
  en: {
    eyebrow: "Our approach",
    body: "We're not building FARMILY in a vacuum. Every feature starts as a conversation with a real distributor, importer, or logistics operator — what breaks their week, what an auditor actually asks for, what a rejected shipment actually costs them. We'd rather ship something narrow that works than something broad that doesn't.",
  },
  ar: {
    eyebrow: "منهجنا",
    body: "نحن لا نبني فارميلي في فراغ. كل ميزة تبدأ بحوار حقيقي مع موزّع أو مستورد أو مشغّل لوجستي فعلي — ما الذي يعطّل أسبوعه، وما الذي يطلبه المدقق فعلاً، وما الذي تكلّفه الشحنة المرفوضة حقاً. نفضّل أن نطلق حلاً محدوداً يعمل، على حلٍّ واسع لا يعمل.",
  },
} as const;

export const founderStory = {
  en: {
    eyebrow: "Where it started",
    paragraphs: [
      "FARMILY started with a simple, personal frustration: watching food lost, undervalued, or mistrusted somewhere between the farm and the people who needed it.",
      "Benjamin Omayebu began researching the problem as an undergraduate at the University of Buckingham, and that research became the foundation for FARMILY today — now focused on giving small and mid-size food distributors the tools to prove their shipments are safe, without needing an enterprise budget.",
    ],
    bio: "University of Buckingham. Current MSc candidate at Hult International Business School, Dubai. Published researcher.",
  },
  ar: {
    eyebrow: "من أين بدأنا",
    paragraphs: [
      "بدأت فارميلي من إحباط بسيط وشخصي: مشاهدة الطعام يُفقد، أو يُقلَّل من قيمته، أو يفقد الثقة به في مكان ما بين المزرعة والأشخاص الذين يحتاجونه.",
      "بدأ بنجامين أومايبو بحث هذه المشكلة كطالب جامعي في جامعة باكنغهام، وأصبح ذلك البحث الأساس الذي قامت عليه فارميلي اليوم — التي تركّز الآن على منح موزعي الأغذية الصغار والمتوسطين الأدوات اللازمة لإثبات سلامة شحناتهم، دون الحاجة إلى ميزانية شركة كبرى.",
    ],
    bio: "جامعة باكنغهام. طالب ماجستير حالياً في كلية هالت الدولية لإدارة الأعمال، دبي. باحث له أبحاث منشورة.",
  },
} as const;
```

- [ ] **Step 4: Replace `src/lib/content/research.ts`**

```ts
export const intro = {
  en: {
    eyebrow: "Research",
    headline: "Grounded in peer-reviewed research.",
  },
  ar: {
    eyebrow: "الأبحاث",
    headline: "مبنية على أبحاث محكّمة.",
  },
} as const;

export const framing = {
  en: "FARMILY's foundation is grounded in peer-reviewed academic research. Our founder's original research explored blockchain-based food traceability — published in Securing the Digital Supply Chain (Springer Nature, 2026). Since then, FARMILY has evolved: real-world development has shifted the product's core toward IoT sensor monitoring and AI-driven compliance reporting, with tamper-evident record-keeping as a supporting feature rather than the headline technology.",
  ar: "تقوم فارميلي على أساس بحث أكاديمي محكّم. استكشف البحث الأصلي لمؤسسنا إمكانية تتبّع الأغذية باستخدام تقنية البلوكتشين — وقد نُشر في كتاب Securing the Digital Supply Chain (سبرينغر نيتشر، 2026). ومنذ ذلك الحين تطوّرت فارميلي: فقد حوّل التطوير الفعلي جوهر المنتج نحو المراقبة بأجهزة استشعار إنترنت الأشياء وإعداد تقارير الامتثال المعتمدة على الذكاء الاصطناعي، مع بقاء حفظ السجلات المقاومة للعبث ميزة مساندة لا التقنية الرئيسية.",
} as const;

// The citation itself is a formal bibliographic reference — kept identical in
// both locales (translating a citation makes it unverifiable against the
// actual published work). Only the link label is translated.
export const citation = {
  text: "Omayebu, B., Al Assam, H. (2026). FARMILY: A Blockchain-Based Solution for Food Supply Chain Transparency. In: Hammi, B., El Madhoun, N. (eds) Securing the Digital Supply Chain. Springer, Cham.",
  href: "https://link.springer.com/chapter/10.1007/978-3-032-11119-7_9",
  linkLabel: {
    en: "Read the published chapter",
    ar: "اطّلع على الفصل المنشور",
  },
} as const;
```

- [ ] **Step 5: Create `src/lib/content/contact.ts`**

This file doesn't exist yet — the Contact page's copy is currently hardcoded directly in its JSX (`eyebrow="Contact"`, `title="Let's talk."`, the intro paragraph, and the "Prefer email?" label). Wiring it into the page happens in Task 5; this step just creates the content:

```ts
export const intro = {
  en: {
    eyebrow: "Contact",
    title: "Let's talk.",
    body: "Whether you're a distributor curious about piloting FARMILY, or an investor who wants to learn more — we'd like to hear from you.",
  },
  ar: {
    eyebrow: "تواصل معنا",
    title: "لنتحدث.",
    body: "سواء كنت موزّعاً مهتماً بتجربة فارميلي، أو مستثمراً يريد معرفة المزيد — يسعدنا أن نسمع منك.",
  },
} as const;

export const preferEmail = {
  en: "Prefer email?",
  ar: "تفضّل التواصل عبر البريد الإلكتروني؟",
} as const;
```

- [ ] **Step 6: Verify each file compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors from these 5 files. (Existing pages will now show type errors because they still import the OLD flat shape — e.g. `hero.headline` no longer exists, only `hero.en.headline`/`hero.ar.headline`. That's expected and gets fixed in Task 5, which wires pages to the new shape. Confirm the errors are ONLY in `src/app/[locale]/**/page.tsx` files, not in the content files themselves or anywhere else.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/content/home.ts src/lib/content/solution.ts src/lib/content/about.ts src/lib/content/research.ts src/lib/content/contact.ts
git commit -m "Translate and restructure page content to locale-keyed shape"
```

Do NOT push. (The build will not pass cleanly until Task 5 wires pages to this new shape — that's expected and fine at this intermediate stage; don't run `npm run build` as a gate for this task.)

---

### Task 3: Translate and restructure legal content (Privacy, Terms)

**Files:**
- Modify: `src/lib/content/legal.ts`

Same locale-keyed restructuring as Task 2, plus one addition: both documents get a new "Language" section (in both languages) stating the English text governs if the two versions conflict — the precedence decision made during brainstorming.

- [ ] **Step 1: Replace `src/lib/content/legal.ts`**

```ts
export const lastUpdated = {
  en: "20 August 2026",
  ar: "20 أغسطس 2026",
} as const;

export const lastUpdatedLabel = {
  en: "Last updated",
  ar: "آخر تحديث",
} as const;

export const privacyPolicy = {
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro:
      "FARMILY (\"we\", \"us\") operates farmilytechnologies.com. This policy explains what information we collect through this website, why, and what you can do about it. We're a small, pre-seed team — this policy covers exactly what this site does today, not a hypothetical future product.",
    sections: [
      {
        heading: "1. Information we collect",
        body: [
          "Information you give us directly: when you submit the contact form, we receive your name, company (if provided), email address, and message.",
          "Information collected automatically: like any website, our hosting provider (Vercel) logs standard technical data for every visit — IP address, browser type, and pages requested — for security and reliability purposes. We don't layer any additional tracking, advertising pixels, or analytics scripts on top of that.",
        ],
      },
      {
        heading: "2. How we use it",
        body: [
          "To respond to your message — whether you're a prospective pilot partner, an investor, or asking a general question.",
          "To keep a record of who we've spoken with, so we don't lose track of conversations as a small team.",
          "We do not use your information for advertising, and we do not sell it to anyone.",
        ],
      },
      {
        heading: "3. Who we share it with",
        body: [
          "Contact form submissions are processed by Formspree, a third-party form service, which forwards them to our email. Formspree has its own privacy policy governing how it handles that data in transit.",
          "The site itself is hosted on Vercel, which processes standard connection logs as described above.",
          "We don't share your information with anyone else, and we don't sell or rent it.",
        ],
      },
      {
        heading: "4. How long we keep it",
        body: [
          "We keep contact form submissions for as long as reasonably useful for ongoing conversations (typically as long as we're in active contact, or up to a few years of business records after). You can ask us to delete your information at any time — see \"Your rights\" below.",
        ],
      },
      {
        heading: "5. Cookies",
        body: [
          "This site doesn't set any tracking or advertising cookies. Our hosting and form providers may set minimal technical cookies necessary for the site or form to function; none of these are used to profile or advertise to you.",
        ],
      },
      {
        heading: "6. International transfers",
        body: [
          "Because our hosting (Vercel) and form provider (Formspree) operate infrastructure in multiple countries, including the United States, your information may be processed outside your home country. We only use providers that publish their own data-protection commitments.",
        ],
      },
      {
        heading: "7. Your rights",
        body: [
          "You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. As a small team, we handle these requests manually rather than through an automated tool — email benjamin.omayebu@farmilytechnologies.com and we'll respond promptly.",
        ],
      },
      {
        heading: "8. Changes to this policy",
        body: [
          "If this policy changes, we'll update the date below. Meaningful changes will be reflected here before they take effect.",
        ],
      },
      {
        heading: "9. Language",
        body: [
          "This policy is also available in Arabic. If there's any conflict or inconsistency between the English and Arabic versions, the English version governs.",
        ],
      },
    ],
  },
  ar: {
    eyebrow: "قانوني",
    title: "سياسة الخصوصية",
    intro:
      "تُشغّل فارميلي (\"نحن\") الموقع الإلكتروني farmilytechnologies.com. توضّح هذه السياسة المعلومات التي نجمعها عبر هذا الموقع، ولماذا نجمعها، وما يمكنك فعله حيال ذلك. نحن فريق صغير في مرحلة ما قبل التمويل الأولي — وتغطي هذه السياسة بالضبط ما يقوم به هذا الموقع اليوم، لا منتجاً افتراضياً مستقبلياً.",
    sections: [
      {
        heading: "1. المعلومات التي نجمعها",
        body: [
          "المعلومات التي تزوّدنا بها مباشرة: عند إرسال نموذج التواصل، نستلم اسمك، واسم شركتك (إن وُجد)، وبريدك الإلكتروني، ورسالتك.",
          "المعلومات التي تُجمع تلقائياً: كأي موقع إلكتروني، يسجّل مزوّد الاستضافة لدينا (Vercel) بيانات تقنية اعتيادية لكل زيارة — عنوان IP، ونوع المتصفح، والصفحات المطلوبة — لأغراض الأمان والموثوقية. لا نضيف فوق ذلك أي تتبّع إضافي، أو بكسلات إعلانية، أو نصوص تحليلات.",
        ],
      },
      {
        heading: "2. كيف نستخدمها",
        body: [
          "للرد على رسالتك — سواء كنت شريكاً تجريبياً محتملاً، أو مستثمراً، أو تطرح سؤالاً عاماً.",
          "للاحتفاظ بسجلّ لمن تواصلنا معهم، حتى لا نفقد تتبّع المحادثات كفريق صغير.",
          "لا نستخدم معلوماتك لأغراض إعلانية، ولا نبيعها لأي جهة.",
        ],
      },
      {
        heading: "3. مع من نشاركها",
        body: [
          "تُعالَج طلبات نموذج التواصل عبر Formspree، وهي خدمة نماذج تابعة لجهة خارجية، تقوم بإعادة توجيهها إلى بريدنا الإلكتروني. ولدى Formspree سياسة خصوصية خاصة بها تحكم طريقة تعاملها مع تلك البيانات أثناء النقل.",
          "يُستضاف الموقع نفسه على Vercel، التي تعالج سجلات الاتصال الاعتيادية كما هو موضح أعلاه.",
          "لا نشارك معلوماتك مع أي جهة أخرى، ولا نبيعها أو نؤجّرها.",
        ],
      },
      {
        heading: "4. مدة احتفاظنا بها",
        body: [
          "نحتفظ بطلبات نموذج التواصل طالما كانت مفيدة بشكل معقول للمحادثات الجارية (عادةً طوال فترة التواصل النشط، أو لبضع سنوات كسجلات عمل بعد ذلك). يمكنك أن تطلب منّا حذف معلوماتك في أي وقت — راجع \"حقوقك\" أدناه.",
        ],
      },
      {
        heading: "5. ملفات تعريف الارتباط (الكوكيز)",
        body: [
          "لا يضع هذا الموقع أي ملفات تعريف ارتباط للتتبّع أو الإعلان. قد يضع مزوّدو الاستضافة والنماذج لدينا حداً أدنى من ملفات تعريف الارتباط التقنية اللازمة لعمل الموقع أو النموذج؛ ولا يُستخدم أي منها لتحليل سلوكك أو استهدافك إعلانياً.",
        ],
      },
      {
        heading: "6. عمليات النقل الدولية",
        body: [
          "نظراً لأن مزوّد الاستضافة لدينا (Vercel) ومزوّد النماذج (Formspree) يشغّلان بنية تحتية في عدة دول، بما فيها الولايات المتحدة، فقد تُعالَج معلوماتك خارج بلدك. ولا نستخدم إلا مزوّدين ينشرون التزاماتهم الخاصة بحماية البيانات.",
        ],
      },
      {
        heading: "7. حقوقك",
        body: [
          "يمكنك أن تسألنا عن المعلومات التي نحتفظ بها عنك، أو تطلب منّا تصحيحها، أو حذفها. وبصفتنا فريقاً صغيراً، نتعامل مع هذه الطلبات يدوياً لا عبر أداة آلية — راسلنا على benjamin.omayebu@farmilytechnologies.com وسنردّ عليك بسرعة.",
        ],
      },
      {
        heading: "8. التغييرات على هذه السياسة",
        body: [
          "إذا تغيّرت هذه السياسة، سنحدّث التاريخ أدناه. وستُعرض أي تغييرات جوهرية هنا قبل أن تصبح سارية المفعول.",
        ],
      },
      {
        heading: "9. اللغة",
        body: [
          "تتوفر هذه السياسة أيضاً باللغة الإنجليزية. في حال وجود أي تعارض أو عدم اتساق بين النسختين الإنجليزية والعربية، تكون النسخة الإنجليزية هي المعتمدة.",
        ],
      },
    ],
  },
} as const;

export const termsOfUse = {
  en: {
    eyebrow: "Legal",
    title: "Terms of Use",
    intro:
      "These terms cover your use of farmilytechnologies.com. FARMILY is currently a pre-seed company in active development — this website is informational, not a live product with accounts, subscriptions, or transactions. If we launch a product with its own terms, those will be published separately.",
    sections: [
      {
        heading: "1. Use of this site",
        body: [
          "You're welcome to browse this site and use the contact form to reach us. Please don't attempt to disrupt the site, scrape it at scale, or use it for anything unlawful.",
        ],
      },
      {
        heading: "2. No warranty",
        body: [
          "This site and its content are provided \"as is.\" We've written it in good faith and try to keep it accurate and current, but we don't guarantee it's error-free, and it shouldn't be relied on as professional, legal, or investment advice.",
        ],
      },
      {
        heading: "3. Intellectual property",
        body: [
          "The FARMILY name, logo, and the content on this site (copy, design, illustrations) belong to Farmily Technologies unless otherwise credited. Photography is licensed under the Unsplash License; the cited academic chapter belongs to its publisher and authors under its own copyright terms.",
        ],
      },
      {
        heading: "4. Third-party links and services",
        body: [
          "This site links to and relies on third-party services (our contact form runs on Formspree; the published research chapter is hosted by Springer). We're not responsible for the content or practices of those third-party sites.",
        ],
      },
      {
        heading: "5. Limitation of liability",
        body: [
          "To the fullest extent permitted by law, Farmily Technologies isn't liable for any damages arising from your use of this site. Nothing here limits liability that can't be limited under applicable law.",
        ],
      },
      {
        heading: "6. Changes to these terms",
        body: [
          "We may update these terms as the company and this site evolve. We'll update the date below when we do.",
        ],
      },
      {
        heading: "7. Language",
        body: [
          "These terms are also available in Arabic. If there's any conflict or inconsistency between the English and Arabic versions, the English version governs.",
        ],
      },
      {
        heading: "8. Contact",
        body: [
          "Questions about these terms? Email benjamin.omayebu@farmilytechnologies.com.",
        ],
      },
    ],
  },
  ar: {
    eyebrow: "قانوني",
    title: "شروط الاستخدام",
    intro:
      "تغطي هذه الشروط استخدامك لموقع farmilytechnologies.com. فارميلي حالياً شركة في مرحلة ما قبل التمويل الأولي وقيد التطوير النشط — وهذا الموقع إعلامي، وليس منتجاً فعلياً يحتوي على حسابات أو اشتراكات أو معاملات. وإذا أطلقنا منتجاً له شروطه الخاصة، فستُنشر تلك الشروط بشكل منفصل.",
    sections: [
      {
        heading: "1. استخدام هذا الموقع",
        body: [
          "يسعدنا أن تتصفّح هذا الموقع وتستخدم نموذج التواصل للوصول إلينا. يُرجى عدم محاولة تعطيل الموقع، أو استخراج بياناته على نطاق واسع، أو استخدامه لأي غرض غير قانوني.",
        ],
      },
      {
        heading: "2. عدم وجود ضمان",
        body: [
          "يُقدَّم هذا الموقع ومحتواه \"كما هو\". لقد كتبناه بحسن نية ونحاول إبقاءه دقيقاً وحديثاً، لكننا لا نضمن خلوّه من الأخطاء، ولا ينبغي الاعتماد عليه كنصيحة مهنية أو قانونية أو استثمارية.",
        ],
      },
      {
        heading: "3. الملكية الفكرية",
        body: [
          "اسم فارميلي وشعارها ومحتوى هذا الموقع (النصوص والتصميم والرسوم التوضيحية) ملك لشركة Farmily Technologies ما لم يُذكر خلاف ذلك. والصور مرخّصة بموجب ترخيص Unsplash؛ أما الفصل الأكاديمي المُستشهَد به فيعود لناشره ومؤلفيه بموجب شروط حقوق النشر الخاصة به.",
        ],
      },
      {
        heading: "4. الروابط والخدمات التابعة لجهات خارجية",
        body: [
          "يرتبط هذا الموقع بخدمات تابعة لجهات خارجية ويعتمد عليها (يعمل نموذج التواصل لدينا عبر Formspree؛ ويُستضاف فصل البحث المنشور لدى Springer). ولسنا مسؤولين عن محتوى أو ممارسات تلك المواقع الخارجية.",
        ],
      },
      {
        heading: "5. حدود المسؤولية",
        body: [
          "إلى أقصى حد يسمح به القانون، لا تتحمّل Farmily Technologies المسؤولية عن أي أضرار ناتجة عن استخدامك لهذا الموقع. ولا يحدّ أي مما ورد هنا من مسؤولية لا يجوز الحدّ منها بموجب القانون المعمول به.",
        ],
      },
      {
        heading: "6. التغييرات على هذه الشروط",
        body: [
          "قد نحدّث هذه الشروط مع تطوّر الشركة وهذا الموقع. وسنحدّث التاريخ أدناه عند القيام بذلك.",
        ],
      },
      {
        heading: "7. اللغة",
        body: [
          "تتوفر هذه الشروط أيضاً باللغة الإنجليزية. في حال وجود أي تعارض أو عدم اتساق بين النسختين الإنجليزية والعربية، تكون النسخة الإنجليزية هي المعتمدة.",
        ],
      },
      {
        heading: "8. التواصل",
        body: [
          "لديك أسئلة حول هذه الشروط؟ راسلنا على benjamin.omayebu@farmilytechnologies.com.",
        ],
      },
    ],
  },
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content/legal.ts
git commit -m "Translate and restructure legal content, add language-precedence clause"
```

Do NOT push.

---

### Task 4: Shared UI chrome strings

**Files:**
- Create: `src/lib/content/chrome.ts`

Nav labels, footer strings, and contact-form labels aren't page content — they're UI chrome shared across every page. This creates one new file for them, following the same `{ en, ar }` shape as the content files.

- [ ] **Step 1: Create `src/lib/content/chrome.ts`**

```ts
export const nav = {
  en: {
    home: "Home",
    solution: "Solution",
    about: "About",
    research: "Research",
    contact: "Contact",
    talkToUs: "Talk to us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  ar: {
    home: "الرئيسية",
    solution: "الحل",
    about: "من نحن",
    research: "الأبحاث",
    contact: "اتصل بنا",
    talkToUs: "تواصل معنا",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
  },
} as const;

export const footer = {
  en: {
    tagline:
      "Supply chain compliance, automated — for the distributors and importers who don't have an enterprise budget for it.",
    getInTouch: "Get in touch",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    copyright: (year: number) =>
      `© ${year} Farmily Technologies. Built by a team of one, working with early pilot partners.`,
  },
  ar: {
    tagline:
      "امتثال سلسلة التوريد، بشكل آلي — لصالح الموزعين والمستوردين الذين لا يملكون ميزانية شركة كبرى لذلك.",
    getInTouch: "تواصل معنا",
    privacyPolicy: "سياسة الخصوصية",
    termsOfUse: "شروط الاستخدام",
    copyright: (year: number) =>
      `© ${year} Farmily Technologies. من بناء فريق مكوّن من شخص واحد، يعمل مع شركاء تجريبيين أوائل.`,
  },
} as const;

export const contactForm = {
  en: {
    name: "Name",
    company: "Company",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    successTitle: "Message sent.",
    successBody: "Thanks for reaching out — we'll get back to you shortly.",
    genericError: "Something went wrong. Please email us directly.",
  },
  ar: {
    name: "الاسم",
    company: "الشركة",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    successTitle: "تم إرسال الرسالة.",
    successBody: "شكراً على تواصلك — سنعاود التواصل معك قريباً.",
    genericError: "حدث خطأ ما. يُرجى مراسلتنا مباشرة عبر البريد الإلكتروني.",
  },
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content/chrome.ts
git commit -m "Add shared UI chrome strings (nav, footer, contact form) for both locales"
```

Do NOT push.

---

### Task 5: Wire the 7 page components + root layout to locale

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/solution/page.tsx`
- Modify: `src/app/[locale]/about/page.tsx`
- Modify: `src/app/[locale]/research/page.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/app/[locale]/privacy/page.tsx`
- Modify: `src/app/[locale]/terms/page.tsx`
- Modify: `src/app/[locale]/layout.tsx` (metadata → `generateMetadata` with hreflang alternates)

This is the biggest wiring task — every page becomes an `async` component reading `params.locale`, and every content lookup changes from `home.hero.headline` to `hero[locale].headline` (etc.), plus every internal link gets a locale-aware href, and static `metadata` exports become `generateMetadata` functions with `alternates.languages`.

- [ ] **Step 1: Replace `src/app/[locale]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/Reveal";
import ColdChainIllustration from "@/components/ColdChainIllustration";
import Parallax from "@/components/Parallax";
import { DetectIcon, ProveIcon, SenseIcon } from "@/components/icons";
import { closingCta, hero, pillars, whatWeDo } from "@/lib/content/home";

const pillarIcons = {
  sense: SenseIcon,
  detect: DetectIcon,
  prove: ProveIcon,
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "فارميلي — أتمتة الامتثال في سلسلة التوريد الغذائي"
      : "FARMILY — Supply Chain Compliance, Automated",
    alternates: {
      canonical: isAr ? "/ar" : "/",
      languages: { en: "/", ar: "/ar" },
    },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const l = locale === "ar" ? "ar" : "en";
  const heroText = hero[l];
  const localePillars = pillars[l];
  const localeWhatWeDo = whatWeDo[l];
  const localeClosingCta = closingCta[l];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink text-paper sm:min-h-[760px] lg:min-h-[840px]">
        <Parallax strength={18} className="-z-20 opacity-[0.32]">
          <ColdChainIllustration />
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" />

        <Container className="relative py-24 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow
              tone="paper"
              className="animate-hero-line"
              style={{ animationDelay: "40ms" }}
            >
              {heroText.eyebrow}
            </Eyebrow>
            <h1
              className="animate-hero-line mt-6 font-display text-5xl leading-[1.05] tracking-tight text-paper sm:text-6xl sm:tracking-[-0.03em] md:text-7xl md:tracking-[-0.035em]"
              style={{ animationDelay: "130ms" }}
            >
              {heroText.headline}
            </h1>
            <p
              className="animate-hero-line mt-7 max-w-xl text-lg leading-relaxed text-paper/80 sm:text-xl"
              style={{ animationDelay: "240ms" }}
            >
              {heroText.subLine}
            </p>
            <p
              className="animate-hero-line mt-5 max-w-lg font-display text-xl italic leading-snug text-wheat sm:text-2xl"
              style={{ animationDelay: "330ms" }}
            >
              &ldquo;{heroText.supportingLine}&rdquo;
            </p>
            <div
              className="animate-hero-line mt-10"
              style={{ animationDelay: "420ms" }}
            >
              <a
                href="#what-we-do"
                className="group inline-flex items-center gap-2.5 rounded-full bg-teal px-6 py-3.5 text-[15px] font-medium tracking-wide text-paper transition-all duration-200 hover:bg-teal-deep active:scale-[0.97]"
              >
                {heroText.cta}
                <span className="transition-transform duration-200 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* What We Do */}
      <section id="what-we-do" className="border-y border-line bg-paper-deep scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <Reveal className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow>{localeWhatWeDo.eyebrow}</Eyebrow>
            <p className="max-w-2xl text-2xl leading-relaxed text-ink sm:text-[1.75rem]">
              {localeWhatWeDo.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Three pillars */}
      <section>
        <Container className="py-20 sm:py-28">
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-3">
            {localePillars.map((pillar, i) => {
              const Icon = pillarIcons[pillar.key as keyof typeof pillarIcons];
              return (
                <Reveal key={pillar.key} delay={i * 90}>
                  <span className="font-display text-sm text-ink/35">
                    0{i + 1}
                  </span>
                  <Icon className="mt-4 h-11 w-11 text-teal-deep" />
                  <h3 className="mt-5 font-display text-2xl text-ink">
                    {pillar.name}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink/65">
                    {pillar.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <Container className="py-20 sm:py-24">
          <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-2xl leading-snug sm:text-3xl sm:tracking-[-0.02em]">
              {localeClosingCta.line}
            </p>
            <Button href={locale === "ar" ? "/ar/contact" : "/contact"} variant="primary" className="shrink-0">
              {localeClosingCta.cta}
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
```

One thing worth noting since it's easy to miss: `pillars[l]` items no longer have `as const`-narrowed `key` typed as the exact union `"sense" | "detect" | "prove"` in the same way once read through a plain array lookup — the `pillarIcons[pillar.key as keyof typeof pillarIcons]` cast handles this. If TypeScript still complains here, it's fine — this cast is the standard fix and matches how the codebase already looks up icons by content-driven keys elsewhere (see Task 5 Step 2's `segmentIcons` lookup). The hero CTA's down-arrow (`↓`) intentionally has no `rtl:` class — it points down, not sideways, so it needs no mirroring and stays identical in both locales.

- [ ] **Step 2: Replace `src/app/[locale]/solution/page.tsx`**

```tsx
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ProductPreview from "@/components/ProductPreview";
import {
  DetectIcon,
  ProveIcon,
  SenseIcon,
  TruckIcon,
  WarehouseIcon,
} from "@/components/icons";
import {
  builtAround,
  intro,
  pillars,
  segments,
  statusNote,
  whatYouGet,
} from "@/lib/content/solution";

const pillarIcons = { sense: SenseIcon, detect: DetectIcon, prove: ProveIcon };
const segmentIcons = { distributors: TruckIcon, coldstorage: WarehouseIcon };

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/solution">): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "الحل — فارميلي" : "Solution — FARMILY",
    description: isAr
      ? "مراقبة مستمرة، وكشف استثناءات بالذكاء الاصطناعي، وسجلات امتثال يصعب العبث بها — للموزعين والمستوردين ومشغّلي التخزين البارد."
      : "Continuous monitoring, AI exception detection, and tamper-evident compliance records — for distributors, importers, and cold storage operators.",
    alternates: {
      canonical: isAr ? "/ar/solution" : "/solution",
      languages: { en: "/solution", ar: "/ar/solution" },
    },
  };
}

export default async function SolutionPage({
  params,
}: PageProps<"/[locale]/solution">) {
  const { locale } = await params;
  const l = locale === "ar" ? "ar" : "en";
  const introText = intro[l];
  const whatYouGetText = whatYouGet[l];
  const localePillars = pillars[l];
  const localeSegments = segments[l];

  return (
    <>
      <PageHero eyebrow={introText.eyebrow} title={introText.headline}>
        <p className="font-display text-xl italic text-teal-deep">
          {introText.sub}
        </p>
      </PageHero>

      {/* What it produces */}
      <section>
        <Container className="py-16 sm:py-20">
          <Reveal className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-deep">
                {whatYouGetText.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-2xl leading-snug text-ink sm:text-3xl sm:tracking-[-0.02em]">
                {whatYouGetText.headline}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/65">
                {whatYouGetText.body}
              </p>
            </div>
            <Reveal delay={120} variant="materialize">
              <ProductPreview locale={l} />
            </Reveal>
          </Reveal>
        </Container>
      </section>

      {/* Pillars, expanded */}
      <section className="border-t border-line bg-paper-deep">
        <Container className="py-20 sm:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {localePillars.map((pillar, i) => {
              const Icon = pillarIcons[pillar.key as keyof typeof pillarIcons];
              return (
                <Reveal
                  key={pillar.key}
                  delay={i * 90}
                  className="rounded-2xl border border-line bg-paper p-8 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5"
                >
                  <Icon className="h-11 w-11 text-teal-deep" />
                  <h2 className="mt-6 font-display text-2xl text-ink">
                    {pillar.name}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
                    {pillar.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Segments */}
      <section className="border-y border-line bg-ink text-paper">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl sm:tracking-[-0.03em]">
              {builtAround[l]}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {localeSegments.map((segment, i) => {
              const Icon = segmentIcons[segment.key as keyof typeof segmentIcons];
              return (
                <Reveal
                  key={segment.key}
                  delay={i * 90}
                  className="group relative isolate min-h-[22rem] overflow-hidden rounded-2xl border border-paper/15 p-8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={segment.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 h-full w-full scale-100 object-cover grayscale transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/25" />
                  <div className="flex h-full flex-col justify-end">
                    <Icon className="h-10 w-10 text-wheat" />
                    <h3 className="mt-5 font-display text-xl">
                      {segment.name}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-paper/75">
                      {segment.line}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Honest status note */}
      <section>
        <Container className="py-12">
          <p className="max-w-2xl text-sm leading-relaxed text-ink/55">
            {statusNote[l]}
          </p>
        </Container>
      </section>
    </>
  );
}
```

Note: `ProductPreview` now takes a `locale` prop — that's wired up in Task 7, not this task. This step just passes it through; the component itself doesn't accept it yet until Task 7 lands (this means the site won't fully build between Task 5 and Task 7 — expected, don't push mid-plan).

- [ ] **Step 3: Replace `src/app/[locale]/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/Reveal";
import { approach, founderStory, intro, mission } from "@/lib/content/about";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "من نحن — فارميلي" : "About — FARMILY",
    description: isAr
      ? "لماذا وُجدت فارميلي، وما الذي نؤمن به، والبحث الذي انبثقت منه."
      : "Why FARMILY exists, what we believe, and the research it grew out of.",
    alternates: {
      canonical: isAr ? "/ar/about" : "/about",
      languages: { en: "/about", ar: "/ar/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  const l = locale === "ar" ? "ar" : "en";
  const introText = intro[l];
  const missionText = mission[l];
  const approachText = approach[l];
  const founderText = founderStory[l];

  return (
    <>
      <PageHero eyebrow={introText.eyebrow} title={introText.headline}>
        {introText.body}
      </PageHero>

      {/* Mission */}
      <section className="border-b border-line">
        <Container className="py-16 sm:py-20">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow>{missionText.eyebrow}</Eyebrow>
            <p className="max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl sm:tracking-[-0.02em]">
              {missionText.statement}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Approach */}
      <section className="border-b border-line bg-paper-deep">
        <Container className="py-16 sm:py-20">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow>{approachText.eyebrow}</Eyebrow>
            <p className="max-w-2xl text-lg leading-relaxed text-ink/75">
              {approachText.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Founder story */}
      <section>
        <Container className="py-20 sm:py-24">
          <Reveal>
            <Eyebrow>{founderText.eyebrow}</Eyebrow>
            <div className="mt-8 grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink font-display text-2xl text-paper">
                BO
              </div>
              <div className="max-w-2xl">
                {founderText.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mt-4 text-lg leading-relaxed text-ink/80 first:mt-0"
                  >
                    {p}
                  </p>
                ))}
                <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-ink/55">
                  {founderText.bio}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Replace `src/app/[locale]/research/page.tsx`**

```tsx
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { citation, framing, intro } from "@/lib/content/research";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/research">): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "الأبحاث — فارميلي" : "Research — FARMILY",
    description: isAr
      ? "البحث المحكّم الذي انبثقت منه فارميلي، وكيف تطوّر المنتج منذ ذلك الحين."
      : "The peer-reviewed research FARMILY grew out of, and how the product has evolved since.",
    alternates: {
      canonical: isAr ? "/ar/research" : "/research",
      languages: { en: "/research", ar: "/ar/research" },
    },
  };
}

export default async function ResearchPage({
  params,
}: PageProps<"/[locale]/research">) {
  const { locale } = await params;
  const l = locale === "ar" ? "ar" : "en";
  const introText = intro[l];

  return (
    <>
      <PageHero eyebrow={introText.eyebrow} title={introText.headline} />

      <section>
        <Container className="py-16 sm:py-20">
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-ink/75">
              {framing[l]}
            </p>
          </Reveal>

          <Reveal
            delay={120}
            className="mt-12 max-w-3xl rounded-2xl border border-line bg-paper-deep p-8 sm:p-10"
          >
            <p className="font-display text-lg italic leading-relaxed text-ink" dir="ltr">
              {citation.text}
            </p>
            <a
              href={citation.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 py-3 text-sm font-medium text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
            >
              {citation.linkLabel[l]} →
            </a>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
```

Note the added `dir="ltr"` on the citation `<p>`: a formal bibliographic citation (Latin author names, Latin publisher name, mixed English/Latin punctuation) should not be mirrored by the page's RTL context even on the Arabic page — pinning it to `ltr` keeps the citation readable and correctly ordered regardless of the surrounding page direction, the same reasoning as the hero illustration staying LTR.

- [ ] **Step 5: Replace `src/app/[locale]/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { intro, preferEmail } from "@/lib/content/contact";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "تواصل معنا — فارميلي" : "Contact — FARMILY",
    description: isAr
      ? "سواء كنت موزّعاً مهتماً بتجربة فارميلي، أو مستثمراً يريد معرفة المزيد — يسعدنا أن نسمع منك."
      : "Whether you're a distributor curious about piloting FARMILY, or an investor who wants to learn more — we'd like to hear from you.",
    alternates: {
      canonical: isAr ? "/ar/contact" : "/contact",
      languages: { en: "/contact", ar: "/ar/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  const l = locale === "ar" ? "ar" : "en";
  const introText = intro[l];

  return (
    <>
      <PageHero eyebrow={introText.eyebrow} title={introText.title}>
        {introText.body}
      </PageHero>

      <section>
        <Container className="grid gap-14 py-16 sm:py-20 md:grid-cols-[2fr_1fr] md:gap-20">
          <Reveal>
            <ContactForm locale={l} />
          </Reveal>

          <Reveal delay={100} className="text-sm">
            <p className="font-display text-lg text-ink">{preferEmail[l]}</p>
            <a
              href="mailto:benjamin.omayebu@farmilytechnologies.com"
              className="mt-2 inline-block py-3 text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
              dir="ltr"
            >
              benjamin.omayebu@farmilytechnologies.com
            </a>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
```

Note `dir="ltr"` added to the email address link — email addresses are Latin-script identifiers and should never be visually reversed by an RTL context (Arabic text direction can otherwise garble the `@` and `.` positions in an email address). `ContactForm` now takes a `locale` prop — wired up in Task 7.

- [ ] **Step 6: Replace `src/app/[locale]/privacy/page.tsx`**

```tsx
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { privacyPolicy } from "@/lib/content/legal";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "سياسة الخصوصية — فارميلي" : "Privacy Policy — FARMILY",
    description: isAr
      ? "المعلومات التي تجمعها فارميلي عبر هذا الموقع، ولماذا."
      : "What information FARMILY collects through this website, and why.",
    alternates: {
      canonical: isAr ? "/ar/privacy" : "/privacy",
      languages: { en: "/privacy", ar: "/ar/privacy" },
    },
  };
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  const l = locale === "ar" ? "ar" : "en";
  const p = privacyPolicy[l];

  return (
    <LegalPage
      locale={l}
      eyebrow={p.eyebrow}
      title={p.title}
      intro={p.intro}
      sections={p.sections}
    />
  );
}
```

- [ ] **Step 7: Replace `src/app/[locale]/terms/page.tsx`**

```tsx
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { termsOfUse } from "@/lib/content/legal";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "شروط الاستخدام — فارميلي" : "Terms of Use — FARMILY",
    description: isAr
      ? "الشروط التي تحكم استخدامك لموقع farmilytechnologies.com."
      : "The terms covering your use of farmilytechnologies.com.",
    alternates: {
      canonical: isAr ? "/ar/terms" : "/terms",
      languages: { en: "/terms", ar: "/ar/terms" },
    },
  };
}

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  const l = locale === "ar" ? "ar" : "en";
  const t = termsOfUse[l];

  return (
    <LegalPage
      locale={l}
      eyebrow={t.eyebrow}
      title={t.title}
      intro={t.intro}
      sections={t.sections}
    />
  );
}
```

`LegalPage` now takes a `locale` prop — wired up in Task 6.

- [ ] **Step 8: Commit**

```bash
git add "src/app/[locale]"
git commit -m "Wire all 7 pages to locale-aware content and hreflang metadata"
```

Do NOT push. (`npm run build` still won't pass cleanly — `ProductPreview`, `ContactForm`, and `LegalPage` don't accept their new `locale` prop yet. That's Task 6/7. Don't run the build as a gate here.)

---

### Task 6: Wire Header, Footer, and LegalPage to locale

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/LegalPage.tsx`

Header and Footer both need: (a) translated labels from `chrome.ts`, (b) locale-prefixed hrefs (`/ar/solution` instead of `/solution` when on the Arabic site). Both components need to know the current locale — Header derives it from the URL it already reads via `usePathname()` (no new prop needed); Footer is a server component with no access to the URL, so it receives `locale` as an explicit prop from the layout.

- [ ] **Step 1: Replace `src/components/Header.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { nav } from "@/lib/content/chrome";

export default function Header() {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/ar") ? "ar" : "en";
  const prefix = locale === "ar" ? "/ar" : "";
  const t = nav[locale];

  const NAV = [
    { href: locale === "ar" ? "/ar" : "/", label: t.home, match: "/" },
    { href: `${prefix}/solution`, label: t.solution, match: "/solution" },
    { href: `${prefix}/about`, label: t.about, match: "/about" },
    { href: `${prefix}/research`, label: t.research, match: "/research" },
    { href: `${prefix}/contact`, label: t.contact, match: "/contact" },
  ];

  // The English/Arabic equivalent of the CURRENT page, regardless of which
  // locale is active right now — used by both switcher instances below.
  const enPath = locale === "ar" ? pathname?.replace(/^\/ar/, "") || "/" : pathname || "/";
  const arPath = locale === "ar" ? pathname || "/ar" : `/ar${pathname === "/" ? "" : pathname}`;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`material-header sticky top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}
    >

      <Container className="flex h-20 items-center justify-between">
        <Link
          href={locale === "ar" ? "/ar" : "/"}
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="FARMILY" className="h-14 w-auto sm:h-16" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => {
            const strippedPath =
              locale === "ar" ? pathname?.slice(3) || "/" : pathname;
            const active =
              item.match === "/" ? strippedPath === "/" : strippedPath?.startsWith(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-[15px] font-medium transition-colors active:opacity-60 ${
                  active ? "text-ink" : "text-ink/60 hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-wheat" />
                )}
              </Link>
            );
          })}
          <span className="flex overflow-hidden rounded-full bg-ink/8 p-0.5 text-xs font-medium">
            <Link
              href={enPath}
              aria-label="English"
              aria-current={locale === "en" ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 transition-colors ${locale === "en" ? "bg-paper text-ink" : "text-ink/50 hover:text-ink/80"}`}
            >
              EN
            </Link>
            <Link
              href={arPath}
              aria-label="العربية"
              aria-current={locale === "ar" ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 transition-colors ${locale === "ar" ? "bg-paper text-ink" : "text-ink/50 hover:text-ink/80"}`}
            >
              AR
            </Link>
          </span>
        </nav>

        <Link
          href={`${prefix}/contact`}
          className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-all duration-200 hover:bg-ink-soft active:scale-[0.97] md:inline-flex"
        >
          {t.talkToUs}
        </Link>

        <button
          type="button"
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((v) => !v)}
          className="-me-2 p-2 text-ink transition-transform duration-150 active:scale-90 md:hidden"
        >
          {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
        </button>
      </Container>

      <div
        className={`grid border-line bg-paper transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-ink/80 transition-colors active:bg-ink/10 hover:bg-ink/5 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={locale === "ar" ? enPath : arPath}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg px-2 py-3 text-base font-medium text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {locale === "ar" ? "English" : "العربية"}
            </Link>
          </Container>
        </div>
      </div>
    </header>
  );
}
```

Three things to verify carefully once this is running (covered in Step 3 below):
1. The switcher link target: on the English site, it should link to `/ar` + the current path (e.g. `/solution` → `/ar/solution`); on the Arabic site, it should link back to the English equivalent (`/ar/solution` → `/solution`, `/ar` → `/`). The expressions above compute this from `pathname` directly — double check the edge case of the bare homepage in both directions (`/` → `/ar`, and `/ar` → `/`, not `/ar` → `""`).
2. `strippedPath` in the active-link check: on `/ar/solution`, `pathname.slice(3)` produces `/solution` (stripping the 3-character `/ar` prefix), which is then compared against each nav item's `match` value — this is what makes the active-tab underline work correctly on the Arabic site too.
3. The mobile menu button uses `-me-2` (logical margin-inline-end), not `-mr-2` (physical margin-right), even though the equivalent fix in the English-only responsive-audit work used `-mr-2`. That's not a typo: under `dir="rtl"`, this button — being the last child in a `flex justify-between` row — visually flips to the LEFT edge (flexbox auto-mirrors row order under RTL), so a hardcoded `-mr-2` would compensate the wrong side once mirrored. `-me-2` tracks the trailing edge in whichever direction is active, so the tap-target padding stays visually flush with the container edge in both locales.

- [ ] **Step 2: Replace `src/components/Footer.tsx`**

```tsx
import Link from "next/link";
import Container from "@/components/ui/Container";
import { footer, nav } from "@/lib/content/chrome";

export default function Footer({ locale }: { locale: "en" | "ar" }) {
  const prefix = locale === "ar" ? "/ar" : "";
  const t = footer[locale];
  const n = nav[locale];

  const NAV = [
    { href: locale === "ar" ? "/ar" : "/", label: n.home },
    { href: `${prefix}/solution`, label: n.solution },
    { href: `${prefix}/about`, label: n.about },
    { href: `${prefix}/research`, label: n.research },
    { href: `${prefix}/contact`, label: n.contact },
  ];

  return (
    <footer className="border-t border-line bg-ink text-paper">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link href={locale === "ar" ? "/ar" : "/"} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="FARMILY"
              className="h-12 w-auto invert"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-paper/60">
            {t.tagline}
          </p>
        </div>

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

        <div className="text-sm">
          <p className="text-paper/50">{t.getInTouch}</p>
          <a
            href="mailto:benjamin.omayebu@farmilytechnologies.com"
            className="mt-1 inline-block py-3 text-paper transition-colors hover:text-wheat"
            dir="ltr"
          >
            benjamin.omayebu@farmilytechnologies.com
          </a>
        </div>
      </Container>

      <div className="border-t border-paper/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.copyright(new Date().getFullYear())}</p>
          <div className="flex gap-5">
            <Link href={`${prefix}/privacy`} className="py-3 transition-colors hover:text-paper/80">
              {t.privacyPolicy}
            </Link>
            <Link href={`${prefix}/terms`} className="py-3 transition-colors hover:text-paper/80">
              {t.termsOfUse}
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
```

Now update the layout to pass `locale` to `Footer` (it already renders `<Footer />` with no props — Header stays prop-free since it derives locale from `usePathname()`):

In `src/app/[locale]/layout.tsx`, change:

```tsx
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
```

to:

```tsx
        <Header />
        <main className="flex-1">{children}</main>
        <Footer locale={locale === "ar" ? "ar" : "en"} />
```

- [ ] **Step 3: Replace `src/components/LegalPage.tsx`**

```tsx
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { lastUpdated, lastUpdatedLabel } from "@/lib/content/legal";

type Section = {
  heading: string;
  body: readonly string[];
};

export default function LegalPage({
  locale,
  eyebrow,
  title,
  intro,
  sections,
}: {
  locale: "en" | "ar";
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly Section[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title}>
        {intro}
      </PageHero>

      <section>
        <Container className="max-w-3xl py-16 sm:py-20">
          <p className="text-sm text-ink/45">
            {lastUpdatedLabel[locale]} {lastUpdated[locale]}
          </p>

          <div className="mt-8 flex flex-col gap-10">
            {sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i * 60, 300)}>
                <h2 className="font-display text-xl text-ink sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 30)}
                      className="text-[15px] leading-relaxed text-ink/70"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/components/LegalPage.tsx "src/app/[locale]/layout.tsx"
git commit -m "Wire Header, Footer, and LegalPage to locale-aware labels and links"
```

Do NOT push. (Build still won't pass cleanly — `ContactForm` and `ProductPreview` don't accept `locale` yet. That's Task 7.)

---

### Task 7: Wire ContactForm and ProductPreview to locale

**Files:**
- Modify: `src/components/ContactForm.tsx`
- Modify: `src/components/ProductPreview.tsx`

After this task, `npm run build` should pass cleanly for the first time since Task 1 — every component now accepts the `locale` prop the pages already pass it.

- [ ] **Step 1: Update `src/components/ContactForm.tsx`**

Change the top of the file — add the import and accept a `locale` prop:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { contactForm } from "@/lib/content/chrome";

type Status = "idle" | "sending" | "success" | "error";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljrzevr";

const fieldClasses =
  "w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-teal";

export default function ContactForm({ locale }: { locale: "en" | "ar" }) {
  const t = contactForm[locale];
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
```

The `handleSubmit` function body stays exactly as-is (no changes) — only replace the hardcoded strings used later in the JSX. Change the success-state return block:

```tsx
  if (status === "success") {
    return (
      <div className="animate-pop-in rounded-2xl border border-teal/30 bg-teal/[0.06] p-8">
        <p className="font-display text-xl text-ink">{t.successTitle}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
          {t.successBody}
        </p>
      </div>
    );
  }
```

And the error fallback — change:

```tsx
        setErrorMessage(
          data?.errors?.[0]?.message ??
            "Something went wrong. Please email us directly."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please email us directly.");
    }
```

to:

```tsx
        setErrorMessage(
          data?.errors?.[0]?.message ?? t.genericError
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage(t.genericError);
    }
```

And the form's labels/button — change each hardcoded string:

```tsx
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink/70">
            Name
          </label>
```
→
```tsx
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink/70">
            {t.name}
          </label>
```

Apply the same pattern to the remaining three labels:
- `Company` label → `{t.company}`
- `Email` label → `{t.email}`
- `Message` label → `{t.message}`

And the submit button:

```tsx
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2.5 rounded-full bg-teal px-6 py-3.5 text-[15px] font-medium tracking-wide text-paper transition-all duration-200 hover:bg-teal-deep active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
```

→

```tsx
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2.5 rounded-full bg-teal px-6 py-3.5 text-[15px] font-medium tracking-wide text-paper transition-all duration-200 hover:bg-teal-deep active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
      >
        {status === "sending" ? t.sending : t.send}
      </button>
```

Every other line in the file (the honeypot input, `_subject` hidden field, `handleSubmit` logic, `fieldClasses`, all `id`/`name`/`type`/`autoComplete` attributes) stays completely unchanged.

- [ ] **Step 2: Replace `src/components/ProductPreview.tsx`**

```tsx
const CORE_PTS =
  "40,150 90,148 140,152 190,149 230,151 260,150 280,120 300,52.5 318,70 336,95 356,120 400,148 460,150 520,149 560,151 580,150";

const copy = {
  en: {
    lotLabel: "Lot #4521",
    lotDetail: "Chilled Seafood · 1,800 kg · Muscat → Abu Dhabi",
    exception: "1 exception",
    tempHistory: "Temperature history",
    safeLimit: "Safe limit 5°C",
    incident:
      "14:12 — power disconnect at Port of Jebel Ali, 22 min. Back in spec by 15:26.",
    verified: "Verified — tamper-evident record",
    disclaimer: "Illustrative preview — fictional lot, not live shipment data.",
    dateStart: "11 Aug",
    dateEnd: "12 Aug",
    stats: [
      { label: "Time in spec", value: "97.3%" },
      { label: "Peak core temp", value: "9.4°C" },
      { label: "Exceptions", value: "1" },
    ],
  },
  ar: {
    lotLabel: "الدفعة رقم 4521",
    lotDetail: "مأكولات بحرية مبرّدة · 1,800 كجم · مسقط ← أبوظبي",
    exception: "استثناء واحد",
    tempHistory: "سجل درجة الحرارة",
    safeLimit: "الحد الآمن 5°C",
    incident:
      "14:12 — انقطاع التيار في ميناء جبل علي، لمدة 22 دقيقة. عاد ضمن النطاق المسموح الساعة 15:26.",
    verified: "موثّق — سجل يصعب العبث به",
    disclaimer: "معاينة توضيحية — دفعة افتراضية، وليست بيانات شحنة حقيقية.",
    dateStart: "11 أغسطس",
    dateEnd: "12 أغسطس",
    stats: [
      { label: "الوقت ضمن النطاق", value: "97.3%" },
      { label: "أعلى درجة حرارة داخلية", value: "9.4°C" },
      { label: "الاستثناءات", value: "1" },
    ],
  },
} as const;

export default function ProductPreview({ locale }: { locale: "en" | "ar" }) {
  const t = copy[locale];
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm" dir="ltr">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4 sm:px-8">
        <div>
          <p className="font-display text-lg text-ink">{t.lotLabel}</p>
          <p className="text-xs text-ink/55">
            {t.lotDetail}
          </p>
        </div>
        <span className="rounded-full bg-[#B3453A]/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#9A3A30]">
          {t.exception}
        </span>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
          {t.tempHistory}
        </p>
        <svg
          viewBox="0 0 600 200"
          className="h-auto w-full"
          role="img"
          aria-label={t.tempHistory}
        >
          <rect x={40} y={107.5} width={540} height={62.5} fill="var(--teal)" opacity={0.07} />
          <rect x={280} y={20} width={60} height={150} fill="#B3453A" opacity={0.08} />
          <line
            x1={40}
            y1={107.5}
            x2={580}
            y2={107.5}
            stroke="#B3453A"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
          <text x={578} y={101} textAnchor="end" className="fill-[#9A3A30]" fontSize={10} fontFamily="var(--font-body)">
            {t.safeLimit}
          </text>
          <polyline
            points={CORE_PTS}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={300} cy={52.5} r={4.5} fill="#B3453A" />
          <text x={200} y={200} textAnchor="middle" className="fill-ink/40" fontSize={10} fontFamily="var(--font-body)">
            {t.dateStart}
          </text>
          <text x={410} y={200} textAnchor="middle" className="fill-ink/40" fontSize={10} fontFamily="var(--font-body)">
            {t.dateEnd}
          </text>
        </svg>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
          {t.incident}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
          {t.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">
                {stat.label}
              </p>
              <p className="mt-1.5 font-display text-xl text-ink sm:text-2xl">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm font-medium text-teal-deep">
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M10 2.5 16 5v4.5C16 13.5 13.5 16.5 10 17.5 6.5 16.5 4 13.5 4 9.5V5z" strokeLinejoin="round" />
            <path d="M7.3 9.7 9.2 11.6 12.8 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.verified}
        </div>
      </div>

      <p className="border-t border-line bg-paper-deep px-6 py-3 text-center text-[11px] text-ink/45 sm:px-8">
        {t.disclaimer}
      </p>
    </div>
  );
}
```

Note the `dir="ltr"` on the outer card: this mockup is a product screenshot-style illustration (a chart with a date axis, a stat grid) — like the hero illustration and the citation block, its internal layout (chart reading left-to-right chronologically, stat columns in a fixed grid) is a visual convention, not reading text, so it's pinned LTR regardless of the surrounding page direction. The Arabic labels inside it still render correctly (Arabic text renders fine inside an `ltr`-direction container — only the block flow direction is pinned, not the script itself).

- [ ] **Step 3: Full build check**

```bash
npm run build
```

Expected: clean build, all locale × route combinations statically generated (14 pages: 7 routes × 2 locales, plus `robots.txt`/`sitemap.xml`/etc.). This is the first point since Task 1 where a full clean build is expected — if it fails, read the error carefully; it's most likely a leftover reference to the old flat content shape somewhere not yet updated. It's also the first build to generate route-param types (`PageProps<"/[locale]/solution">` etc.) for most of these routes — if the only errors are about those specific types not existing yet, run `npm run build` a second time (same reasoning as Task 1 Step 4) before treating it as a real bug.

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactForm.tsx src/components/ProductPreview.tsx
git commit -m "Wire ContactForm and ProductPreview to locale-aware content"
```

Do NOT push.

---

### Task 8: Arabic fonts + finalize RTL font wiring

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add Arabic fonts to the layout**

In `src/app/[locale]/layout.tsx`, change:

```tsx
import { Fraunces, Public_Sans } from "next/font/google";
```

to:

```tsx
import { Fraunces, Noto_Naskh_Arabic, Noto_Sans_Arabic, Public_Sans } from "next/font/google";
```

Add the two new font loaders after the existing `publicSans` declaration:

```tsx
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});
```

Change the `<html>` element's font class to be conditional on locale instead of always loading the Latin fonts:

```tsx
  const dir = locale === "ar" ? "rtl" : "ltr";
```

to:

```tsx
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontVariables =
    locale === "ar"
      ? `${notoNaskhArabic.variable} ${notoSansArabic.variable}`
      : `${fraunces.variable} ${publicSans.variable}`;
```

And change:

```tsx
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${publicSans.variable} h-full`}
    >
```

to:

```tsx
    <html
      lang={locale}
      dir={dir}
      className={`${fontVariables} h-full`}
    >
```

- [ ] **Step 2: Make the font tokens direction-aware in `globals.css`**

In `src/app/globals.css`, the `@theme inline` block currently maps `--font-display`/`--font-body` statically to the Latin font variables. Add an override scoped to `dir="rtl"` right after that block. Find:

```css
@theme inline {
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-paper: var(--paper);
  --color-paper-deep: var(--paper-deep);
  --color-teal: var(--teal);
  --color-teal-deep: var(--teal-deep);
  --color-wheat: var(--wheat);
  --color-line: var(--line);
  --font-display: var(--font-fraunces);
  --font-body: var(--font-public-sans);
}
```

Add immediately after this block:

```css
/* Arabic pages load a different font pairing (Fraunces/Public Sans have no
   Arabic glyph coverage) — redefine the same design tokens so every existing
   .font-display / font-body usage picks up the right face automatically. */
:root[dir="rtl"] {
  --font-display: var(--font-noto-naskh-arabic);
  --font-body: var(--font-noto-sans-arabic);
}
```

This works because Tailwind's `font-display`/`font-body` utility classes compile to `font-family: var(--font-display)` — a runtime variable reference, not a build-time-baked value — so redefining `--font-display` under a more specific selector (`:root[dir="rtl"]` beats bare `:root`) correctly overrides it for the whole Arabic page tree without touching any component.

- [ ] **Step 3: Verify fonts load correctly per locale**

Start the dev server if not running, then:

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const enFont = await page.locator('h1').first().evaluate(el => getComputedStyle(el).fontFamily);
  console.log('English h1 font-family:', enFont);

  await page.goto('http://localhost:3000/ar', { waitUntil: 'networkidle' });
  const arFont = await page.locator('h1').first().evaluate(el => getComputedStyle(el).fontFamily);
  console.log('Arabic h1 font-family:', arFont);
  await browser.close();
})();
"
```

Expected: the English font-family string contains `Fraunces`; the Arabic one contains `Noto Naskh Arabic` (or its internal Next.js-generated font name — either way, it must NOT be the same string as the English one).

- [ ] **Step 4: Run build + lint**

```bash
npm run build
npm run lint
```

Expected: both clean.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/layout.tsx" src/app/globals.css
git commit -m "Add Arabic fonts, wire font tokens to flip with text direction"
```

Do NOT push.

---

### Task 9: RTL icon/spacing fixes + hero illustration LTR pin + language switcher polish

**Files:**
- Modify: `src/components/icons/index.tsx`
- Modify: `src/components/ColdChainIllustration.tsx`

The language switcher was already built in Task 6 (Header.tsx) — this task handles the remaining RTL-specific visual details called out in the spec: the directional arrow icon, and pinning the hero illustration to always render left-to-right.

- [ ] **Step 1: Flip `ArrowRight` for RTL in `src/components/icons/index.tsx`**

`ArrowRight` is used in `Button.tsx` (the `→` icon after every CTA button's label) and should point toward the reading-end of the line — right in English, left in Arabic. Change:

```tsx
export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M8 24h32" />
      <path d="M30 14l10 10-10 10" />
    </svg>
  );
}
```

to:

```tsx
export function ArrowRight(props: IconProps) {
  const { className = "", ...rest } = props;
  return (
    <svg {...base} strokeWidth={1.8} className={`rtl:-scale-x-100 ${className}`} {...rest}>
      <path d="M8 24h32" />
      <path d="M30 14l10 10-10 10" />
    </svg>
  );
}
```

This flips the icon horizontally whenever it renders inside an RTL-direction ancestor (i.e. any Arabic page, since `dir="rtl"` is set on `<html>`), without needing every call site (`Button.tsx`, and any inline usage) to know about direction at all — the fix lives once, in the icon itself.

- [ ] **Step 2: Pin the hero illustration to always render LTR**

Per the brainstorming decision, the cold-chain illustration (Sense → Detect → Prove, truck/warehouse scenes) represents a shipment's physical journey, not reading order, so it must never mirror — even on the Arabic page. In `src/components/ColdChainIllustration.tsx`, change:

```tsx
export default function ColdChainIllustration() {
  return (
    <div className="animate-illustration-in absolute inset-0 flex items-center justify-center">
```

to:

```tsx
export default function ColdChainIllustration() {
  return (
    <div
      dir="ltr"
      className="animate-illustration-in absolute inset-0 flex items-center justify-center"
    >
```

Nothing else in this file changes — this single `dir="ltr"` on the outermost wrapper isolates the entire illustration (badges, connector path, truck/warehouse scenes) from the page's `dir="rtl"` context.

- [ ] **Step 3: Verify both fixes visually**

Start the dev server if not running, then:

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/ar/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/ar-contact-button.png' });

  await page.goto('http://localhost:3000/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/ar-hero.png' });
  await browser.close();
})();
"
```

Use the Read tool on both screenshots. On `/tmp/ar-contact-button.png`: find a CTA button (e.g. the submit button, or a nav CTA) and confirm its arrow icon points left (toward the start of the Arabic text, not right). On `/tmp/ar-hero.png`: confirm the hero illustration's truck/warehouse scene still reads left-to-right visually (Sense on the same side as it does on the English homepage), even though the surrounding text is right-aligned Arabic.

- [ ] **Step 4: Run build + lint**

```bash
npm run build
npm run lint
```

Expected: both clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/index.tsx src/components/ColdChainIllustration.tsx
git commit -m "Flip directional arrow icon for RTL, pin hero illustration to LTR"
```

Do NOT push.

---

### Task 10: Sitemap — both locales

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Replace `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = [
  "",
  "/solution",
  "/about",
  "/research",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    entries.push({
      url: `https://farmilytechnologies.com${route}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `https://farmilytechnologies.com${route}`,
          ar: `https://farmilytechnologies.com/ar${route}`,
        },
      },
    });
    entries.push({
      url: `https://farmilytechnologies.com/ar${route}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `https://farmilytechnologies.com${route}`,
          ar: `https://farmilytechnologies.com/ar${route}`,
        },
      },
    });
  }

  return entries;
}
```

- [ ] **Step 2: Verify**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/sitemap.xml');
  const text = await page.content();
  console.log('contains /ar/solution:', text.includes('/ar/solution'));
  console.log('contains hreflang alternate:', text.includes('hreflang'));
  await browser.close();
})();
"
```

Expected: both `true`.

- [ ] **Step 3: Run build + lint, commit**

```bash
npm run build
npm run lint
git add src/app/sitemap.ts
git commit -m "Add Arabic routes and hreflang alternates to sitemap"
```

Do NOT push.

---

### Task 11: Full bilingual audit and deploy

**Files:** none (verification only)

The last task. Every page in both locales, at the same breakpoint matrix used for the responsiveness audit, plus a handful of Arabic-specific checks (no missing-glyph rendering, switcher round-trips correctly, RTL layout mirrors sensibly). Only push if everything is clean.

- [ ] **Step 1: Write the bilingual audit script**

Save as `/tmp/bilingual-audit.mjs`:

```js
import { chromium } from 'playwright';

const ROUTES = ['', '/solution', '/about', '/research', '/contact', '/privacy', '/terms'];
const LOCALES = [
  { prefix: '', locale: 'en', dir: 'ltr' },
  { prefix: '/ar', locale: 'ar', dir: 'rtl' },
];
const BREAKPOINTS = [
  { name: '375', width: 375, height: 667 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 900 },
];

const browser = await chromium.launch();
let failures = 0;

for (const route of ROUTES) {
  for (const loc of LOCALES) {
    for (const bp of BREAKPOINTS) {
      const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
      const consoleErrors = [];
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', err => consoleErrors.push(err.message));

      const url = `http://localhost:3000${loc.prefix}${route}`;
      const res = await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const status = res.status();
      const htmlLang = await page.locator('html').getAttribute('lang');
      const htmlDir = await page.locator('html').getAttribute('dir');

      const overflowing = await page.evaluate(() => {
        const doc = document.documentElement;
        return Math.max(doc.scrollWidth, document.body.scrollWidth) > doc.clientWidth + 1;
      });

      const problems = [];
      if (status !== 200) problems.push(`status=${status}`);
      if (htmlLang !== loc.locale) problems.push(`lang=${htmlLang} expected ${loc.locale}`);
      if (htmlDir !== loc.dir) problems.push(`dir=${htmlDir} expected ${loc.dir}`);
      if (overflowing) problems.push('horizontal-overflow');
      if (consoleErrors.length) problems.push(`console-errors:${JSON.stringify(consoleErrors)}`);

      if (problems.length) {
        failures++;
        console.log(`FAIL ${url} @ ${bp.name}: ${problems.join(', ')}`);
      }

      await page.close();
    }
  }
}

await browser.close();
console.log(failures === 0 ? 'ALL CLEAR' : `${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
```

- [ ] **Step 2: Run it**

```bash
node /tmp/bilingual-audit.mjs
```

Expected: `ALL CLEAR` (42 page/locale/breakpoint combinations: 7 routes × 2 locales × 3 breakpoints). If anything fails, stop — do not proceed to push. Report exactly what failed.

- [ ] **Step 3: Verify the language switcher round-trips correctly**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000/solution', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'AR' }).click();
  await page.waitForLoadState('networkidle');
  console.log('after clicking AR from /solution:', page.url());

  await page.getByRole('link', { name: 'EN' }).click();
  await page.waitForLoadState('networkidle');
  console.log('after clicking EN from /ar/solution:', page.url());

  await browser.close();
})();
"
```

Expected: first line ends in `/ar/solution`, second line ends in `/solution` (not `/en/solution`, and not back to the homepage). If the switcher instead always returns to the homepage, that's a bug in the href logic from Task 6 Step 1 — go back and fix it before proceeding.

- [ ] **Step 4: Visual spot-check for Arabic glyph rendering and the contact form**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/ar-mobile-home.png' });

  await page.goto('http://localhost:3000/ar/privacy', { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/ar-mobile-privacy.png' });

  await page.goto('http://localhost:3000/ar/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/ar-mobile-contact.png' });
  await page.fill('#name', 'اختبار');
  await page.fill('#message', 'هذه رسالة اختبار للتحقق من محاذاة النص من اليمين لليسار.');
  await page.screenshot({ path: '/tmp/ar-mobile-contact-filled.png' });
  await browser.close();
})();
"
```

Use the Read tool on all four screenshots. Confirm on the first two: Arabic text renders as actual Arabic glyphs (not empty boxes/tofu, not Latin fallback text), right-aligned, with the layout mirrored sensibly (e.g. the header's CTA/switcher on the left instead of the right). Confirm on the contact-form pair: labels are in Arabic and right-aligned, and once filled in, the typed Arabic text in the Name/Message fields is right-aligned with the cursor behaving correctly (this is native browser behavior once `dir="rtl"` is inherited from `<html>` — no ContactForm code change is expected to be needed for this to already work, but it must be visually confirmed here, not assumed).

- [ ] **Step 5: Run the project's standard verification**

```bash
npm run lint
npm run build
```

Expected: both clean.

- [ ] **Step 6: Push**

```bash
git push origin main
```

This triggers Vercel's existing GitHub auto-deploy. Only do this if every prior step in this task was clean.

- [ ] **Step 7: Final confirmation**

```bash
git log origin/main..HEAD --oneline
```

Expected: empty output (nothing ahead of `origin/main` — everything pushed).
