# FARMILY website

Marketing site for FARMILY — Next.js (App Router), TypeScript, Tailwind CSS v4. Deployed on Vercel, domain registered at Hostinger.

## Develop

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Content

Page copy lives in `src/lib/content/*.ts`, one file per page — edit those rather than hunting through JSX for wording changes.

## Contact form

The form posts to Formspree (`FORMSPREE_ENDPOINT` in `src/components/ContactForm.tsx`) — no server code needed. Submissions land in the Formspree dashboard and forward to whatever email the form is configured with there.

## Deploy

Push to `main` on GitHub (`github.com/benomayebu/farmilytechnologies`) — Vercel is connected to the repo and deploys automatically. No manual build/upload step.

`farmilytechnologies.com` is registered at Hostinger; its DNS points at Vercel (see Vercel project → Settings → Domains for the exact records). Hostinger Mail and domain registration are unaffected by where the site is hosted.
