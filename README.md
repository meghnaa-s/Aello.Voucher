# Aello — Digital Gift Vouchers

A premium, editorial gift-voucher experience for Aello Pilates (Al Ansab,
Muscat, Oman). Recipients open a beautiful digital envelope to reveal a
personalized voucher; purchasers gift Pilates classes through a guided,
four-step flow.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and
Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and set your own `ADMIN_PASSWORD` and
`ADMIN_SESSION_SECRET` before deploying.

## The experience

- **`/`** — minimal homepage with the two primary CTAs.
- **`/gift`** — the purchase wizard: choose a package → personalize →
  preview → checkout → shareable link.
- **`/gift/[code]`** — the recipient's page. This is the link that gets
  shared — it opens straight into the envelope, never the homepage.
- **`/admin`** — password-protected voucher + settings management
  (`ADMIN_PASSWORD`, default `aello-admin` for local development).

## Data

Vouchers and site settings are stored in a local JSON file
(`data/store.json`, created on first run and git-ignored) via
`lib/store.ts`. This keeps the project dependency-free for a prototype/demo
deployment. `lib/store.ts` is the single seam to swap in a real database —
every read/write in the app goes through its exported functions.

Note: on a serverless host with an ephemeral filesystem (e.g. Vercel),
writes won't persist across deployments/invocations. For production, swap
`lib/store.ts`'s file-backed implementation for a real database while
keeping its function signatures.

Admin-uploaded studio photos are written to `public/uploads/` (also
git-ignored) via `/api/admin/upload`.

## Brand assets

`public/brand/` contains the Aello wordmark and mark extracted directly
from the supplied brand PDFs, in the exact brand colors (black, ivory
`#efe5db`, taupe `#dfccba`). The default studio photograph
(`components/StudioPhoto.tsx`) is a hand-built illustration in the brand
palette — replace it any time via **Admin → Settings → Studio Photograph**.

## Configuring the shop

From **Admin → Settings**: class packages and pricing, the Intu booking
URL, the location (directions) URL, Instagram URL, contact email, default
voucher validity, and the studio photograph. Occasions are a fixed list
(see `lib/types.ts`) matching the brief.
