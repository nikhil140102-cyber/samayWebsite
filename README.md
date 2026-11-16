# The World of Samay Raina — Fan Website

An independent, fan-made tribute to Samay Raina, built with **Next.js 16 (App Router, JavaScript only)**, Tailwind CSS v4, Three.js / React Three Fiber, GSAP, Framer Motion and MongoDB.

> **Disclaimer:** This website is an independent fan project. It is not officially affiliated with, endorsed by, or managed by Samay Raina or his team.

---

## Highlights

- **Cinematic 3D homepage**: a procedural vintage microphone and floating chess pawns (a nod to his chess streams), with mouse parallax, scroll-linked camera motion and a GSAP text reveal. The scene pauses when off-screen, adapts its pixel ratio under load, simplifies on mobile and stays still for users who prefer reduced motion.
- **Dark and light themes**: follows the system setting by default, saves the user's choice, and avoids a flash of the wrong theme on load.
- **Real data only.** Every biography fact links to a public source. Tour dates, venues, prices and booking links were checked against District on 16 Nov 2026. Seed videos were confirmed as uploads from the official channel. No view counts, products or shows are invented.
- **YouTube in three tiers**: Data API v3 (when a key is set), then the channel's public RSS feed (no key needed), then a list of verified videos. Responses are cached.
- **District booking**: there is no public District API, so shows are stored as verified listings that admins maintain by hand, with outbound booking links.
- **Store**: persistent cart and Razorpay checkout. Prices and stock are re-checked on the server, the payment signature is verified, Razorpay is queried to confirm the payment, and a webhook acts as a backup. Stock is decremented exactly once per order.
- **Admin dashboard** (`/admin`): signed-JWT session in an httpOnly cookie, `admin` and `editor` roles, and editing for shows, merch, videos, gallery, Fan Picks, homepage copy, newsletter subscribers (CSV export), fan submissions, messages and orders.
- **Security**: zod validation everywhere, rate limiting, honeypot and timing spam checks, a recorded consent timestamp for newsletter sign-ups, security headers, and no secrets sent to the browser.
- **SEO**: page metadata, generated Open Graph and Twitter images, sitemap, robots.txt, and JSON-LD for the person, events and products.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in what you have; everything is optional for a first run
npm run dev                    # http://localhost:3000
```

The site runs fully **without any credentials**: shows, videos (via RSS), the biography, gallery and Fan Picks all work from the verified seed files in `/data`. Forms, the admin dashboard and checkout switch on as you add credentials.

### Sign in to the admin dashboard

Add these to `.env.local`, restart `npm run dev`, then open `/admin/login`:

```
AUTH_SECRET=<random 32+ character string>
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<your own 12+ character password>
```

The dashboard opens without a database. Saving changes needs MongoDB (below).

### Enable the backend

```bash
# 1. MongoDB Atlas → create a free cluster → copy the connection string into MONGODB_URI
# 2. Generate an auth secret
openssl rand -base64 48        # → AUTH_SECRET
# 3. Create your admin account
npm run create-admin -- you@example.com "a-long-strong-passphrase" admin
# 4. (optional) copy the verified seed data into MongoDB so it's editable in /admin
npm run seed
```

Then sign in at `/admin/login`.

Roles:

- `admin`: full access, including deleting items, viewing subscribers and viewing orders.
- `editor`: can create and edit content, but cannot delete anything or see subscribers and orders.

### Check integration status

`GET /api/health` reports which integrations are configured. It returns true/false values only and never exposes secrets.

---

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and OG images |
| `MONGODB_URI` | Enables admin, newsletter, contact, fan submissions and orders |
| `AUTH_SECRET` | Signs admin sessions (32+ characters) |
| `YOUTUBE_API_KEY` | Optional. Unlocks Popular videos, Playlists, durations and view counts |
| `YOUTUBE_CHANNEL_ID` | Defaults to `UCAov2BBv1ZJav0c_yHEciAw` (@SamayRainaOfficial) |
| `AMAZON_ASSOCIATE_TAG` | Your Associates tracking ID, added to every Fan Picks link |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments. Checkout stays off until these **and** MongoDB are set |
| `RAZORPAY_WEBHOOK_SECRET` | Verifies `/api/webhooks/razorpay` |

Stripe is intentionally not included. Razorpay covers Indian payments, and the brief asked to configure only the integrations actually used.

Never commit `.env.local`. It is already git-ignored.

---

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repo. The framework is detected as Next.js automatically.
3. Add the environment variables above under **Settings → Environment Variables**.
4. Deploy, then set `NEXT_PUBLIC_SITE_URL` to your production domain and redeploy.
5. In MongoDB Atlas, go to **Network Access** and allow Vercel. `0.0.0.0/0` together with a strong password is the common setup.
6. In the Razorpay Dashboard, go to **Webhooks** and add `https://your-domain/api/webhooks/razorpay` with the event `payment.captured` and your webhook secret.
7. Run `npm run create-admin` once from your machine with the production `MONGODB_URI`.

---

## Integration checklist

| Integration | Status | What's needed |
|---|---|---|
| 3D homepage, themes, animations, all 14 routes | ✅ **Works now** | — |
| Biography (sourced), gallery, membership page | ✅ **Works now** | — |
| District booking links (7 verified tour listings) | ✅ **Works now** | Keep dates and prices updated in `/admin`. District has no public API |
| YouTube latest uploads + shorts (RSS) | ✅ **Works now, no key** | — |
| YouTube popular videos, playlists, view counts | 🔑 Needs credentials | `YOUTUBE_API_KEY` (Google Cloud → YouTube Data API v3) |
| YouTube channel membership | ✅ **Works now** | Links to the official YouTube “Join” page. Perks are set by the channel |
| Amazon Fan Picks | 🟡 Links work now, no commission yet | `AMAZON_ASSOCIATE_TAG` (needs an approved Amazon Associates India account). Live product images and prices need Amazon's Product Advertising API |
| Newsletter, contact, fan submissions | 🔑 Needs credentials | `MONGODB_URI` |
| Admin dashboard | 🔑 Needs credentials | `MONGODB_URI` + `AUTH_SECRET` + `npm run create-admin` |
| Cart | ✅ **Works now** | — |
| Razorpay checkout and server verification | 🔑 Needs credentials | Razorpay account (KYC) + keys + `MONGODB_URI` |
| Merchandise products | 🛑 Needs external authorisation | No licensed Samay Raina merch supplier has been confirmed. The store shows a "coming soon" state until licensed products (with a licence note) are added |
| Hero portrait / official photos | 🛑 Needs external authorisation | Add a licensed image URL in `/admin` → Homepage. Until then the 3D scene is shown |
| Instagram feed embed | — | Not built. It needs Meta app review. Social links are provided instead |

---

## Project structure

```
app/                 routes (pages + API route handlers)
  api/               newsletter, contact, fan-submissions, videos, shows, products,
                     checkout/{create-order,verify}, webhooks/razorpay, auth/*, admin/[resource]
  admin/             protected dashboard + login
components/          layout, navigation, hero, three, animations, videos, shows,
                     merchandise, gallery, admin, common
lib/                 mongodb, data (DB→seed fallback), youtube, district, amazon, auth,
                     payments, razorpay-verify, admin-fields/registry, http (rate limit, spam)
models/              Mongoose models (index.js + one re-export file per model)
data/                verified seed data: shows, videos, journey, gallery, affiliate, products
scripts/             create-admin.mjs, seed.mjs
proxy.js             Next 16 proxy (formerly middleware) guarding /admin and /api/admin
```

## Updating content

- **Tour dates:** open the event on district.in, copy its URL, and add or edit it in `/admin` → Shows. Only enter prices you have seen on the live listing.
- **Videos:** the latest uploads update themselves. Use `/admin` → Videos to pin featured ones (you can paste a full YouTube URL).
- **Gallery:** every image needs a credit, plus a source URL where the licence requires one.
