# Fashion Hub — Binaki Mangalwari, Nagpur

Premium storefront + admin panel for Fashion Hub (men's & women's fashion).
Built with Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4.

## Run locally

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and ADMIN_SESSION_SECRET
npm run dev                  # http://localhost:3000
```

- Store: `/`, `/men`, `/women`, `/new-arrivals`, `/trending`, `/offers`, `/product/[slug]`, `/cart`, `/checkout`, `/wishlist`, `/search`, `/contact`
- Admin: `/admin` (password from `ADMIN_PASSWORD`)

## Data

Everything (products, categories, offers, orders, settings) lives in `data/db.json`;
uploaded photos go to `data/uploads/` and are served from `/media/...`.
The folder is created and seeded with sample products on first run.
**Back up the `data/` folder** — it is the shop's database. Delete it to reset to the sample catalogue.

Sample product photos are placeholder editorial images from Unsplash — replace them
with real shop photos from **Admin → Products** (upload or paste an image URL).

## Admin can

- Add / edit / hide / delete products, set price, MRP, stock, sizes, colours, photos
- Mark products as **New Arrival**, **Trending**, **Best Seller**, **On Offer** (one tap in the product list)
- Add / rename / reorder / hide / delete Men's and Women's categories (empty categories are hidden on the site automatically)
- Create, schedule, enable/disable offers with coupon codes, T&Cs and banners
- See checkout orders, update status (cancelling returns stock), message the customer on WhatsApp
- Change delivery charge, free-delivery threshold and the announcement bar

Changes appear on the live site immediately.

## Deploy to Firebase App Hosting (recommended)

On Firebase the site stores data in **Firestore** and uploaded photos in **Firebase Storage**
(`DATA_STORE=firestore`, set in `apphosting.yaml`). Locally it keeps using `data/`.

One-time setup (in the Firebase console — https://console.firebase.google.com):
1. Create a project and upgrade it to the **Blaze** plan (App Hosting requires billing; a small shop normally stays within the free quotas).
2. **Build → Firestore Database → Create database** (production mode, region close to India, e.g. asia-south1).
3. **Build → Storage → Get started** (same region).

Then from this folder:

```bash
npx firebase login
npx firebase use --add                                   # pick your project
npx firebase apphosting:secrets:set adminPassword        # the /admin password
npx firebase apphosting:secrets:set adminSessionSecret   # any long random text
npx firebase deploy --only apphosting,firestore,storage
```

The first deploy creates the `fashion-hub` backend and prints the live URL. Put that URL (or your
custom domain) into `NEXT_PUBLIC_SITE_URL` in `apphosting.yaml` and deploy again.
Redeploy after any code change with `npx firebase deploy --only apphosting`.

A fresh Firestore shows the sample catalogue; the first admin change or order saves it to Firestore.

## Deploy (any Node.js 20+ host / VPS)


```bash
npm ci
npm run build
npm start            # port 3000; put Nginx/Caddy in front for HTTPS
```

Set `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and (recommended)
`DATA_DIR` to a persistent folder outside the app directory. Run a single instance
(e.g. with `pm2`) — the file-based store is designed for one server.
Serverless platforms with read-only filesystems need `DATA_STORE=firestore` (see Firebase above).
