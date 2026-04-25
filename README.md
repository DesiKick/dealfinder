# DealFinder — AI-Powered Deal Finding Site

Real-time price comparison, buy-or-wait AI verdicts, deal scoring, affiliate monetization, and Google AdSense — all in one Next.js app.

---

## What's built

- **Typo-tolerant search** — AI figures out what you mean even with bad spelling
- **Real-time web search** — searches Amazon, Best Buy, Walmart, Target etc. live
- **Deal score (0-100)** — tells users instantly how good a deal is
- **Buy / Wait / Watch verdict** — AI recommendation with reasoning
- **Price trend chart** — historical price bars with trend arrows
- **Smarter alternatives** — suggests better options at lower prices
- **Price drop alerts** — users enter email + target price to get notified
- **Voice search** — one tap to search by voice (Chrome / mobile)
- **Google AdSense** — 3 ad slots built in, just add your publisher ID
- **Affiliate links** — Amazon, Best Buy, Walmart auto-tagged server-side
- **SEO ready** — metadata, OpenGraph, robots.txt included
- **Fully responsive** — works on mobile, tablet, desktop

---

## Project structure

```
dealfinder/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deals/route.ts      ← AI search endpoint (server-side, API key safe)
│   │   │   └── alert/route.ts      ← Price alert endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx              ← Root layout with AdSense script
│   │   └── page.tsx                ← Homepage
│   ├── components/
│   │   ├── SearchBar.tsx           ← Search input with voice + trending chips
│   │   ├── DealResults.tsx         ← Full results dashboard
│   │   ├── DealScore.tsx           ← Animated score ring
│   │   ├── AlertModal.tsx          ← Price alert modal
│   │   ├── LoadingSkeleton.tsx     ← Loading state
│   │   └── AdBanner.tsx            ← Google AdSense banner wrapper
│   └── lib/
│       ├── types.ts                ← TypeScript types
│       └── affiliate.ts            ← Affiliate URL injection
├── public/
│   └── robots.txt
├── .env.local.example              ← Copy this to .env.local
├── vercel.json
└── README.md
```

---

## Step 1 — Local setup

```bash
# 1. Go into the project folder
cd dealfinder

# 2. Install dependencies
npm install

# 3. Copy the env template
cp .env.local.example .env.local

# 4. Open .env.local and fill in your Anthropic API key
#    Get it at: https://console.anthropic.com
#    It looks like: sk-ant-api03-xxxxx

# 5. Run the dev server
npm run dev

# 6. Open http://localhost:3000
```

---

## Step 2 — Get your Anthropic API key

1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click "API Keys" → "Create Key"
4. Copy the key (starts with `sk-ant-`)
5. Paste it into `.env.local` as `ANTHROPIC_API_KEY`

---

## Step 3 — Deploy to Vercel (free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow the prompts)
vercel

# On first deploy it'll ask:
# - Link to existing project? No
# - Project name: dealfinder (or whatever you want)
# - Root directory: ./  (just press enter)

# Then add your environment variables in the Vercel dashboard:
# vercel.com → your project → Settings → Environment Variables
# Add: ANTHROPIC_API_KEY = sk-ant-yourkey
```

Or deploy via GitHub (easier):
1. Push this folder to a GitHub repo
2. Go to vercel.com → "Import Project" → pick your repo
3. Add `ANTHROPIC_API_KEY` in the Environment Variables section
4. Click Deploy — done

---

## Step 4 — Add your domain (optional, ~$12/year)

1. Buy a domain at Namecheap (namecheap.com) — search "dealfinder" variations
2. In Vercel dashboard → your project → Settings → Domains
3. Add your domain → copy the DNS records shown
4. In Namecheap, update the nameservers or DNS to point to Vercel
5. Done — SSL is automatic

Good domain ideas: getdealfinder.com, dealradar.ai, pricecheck.ai, findbest.deals

---

## Step 5 — Set up affiliate links (earn money from day 1)

### Amazon Associates (biggest commissions)
1. Go to https://affiliate-program.amazon.com
2. Sign up — takes 5 minutes
3. You get approved and get a tag like `yourname-20`
4. Add to `.env.local`: `AMAZON_AFFILIATE_TAG=yourname-20`
5. Every Amazon link now earns you 1-4% of sales

### Best Buy Affiliate
1. Go to https://www.bestbuy.com/site/help/affiliate-program
2. Apply through Commission Junction (cj.com)
3. Once approved, get your affiliate ID
4. Add to `.env.local`: `BESTBUY_AFFILIATE_ID=yourID`

### Walmart Affiliate
1. Go to https://affiliates.walmart.com
2. Sign up through Impact Radius
3. Add to `.env.local`: `WALMART_AFFILIATE_ID=yourID`

Affiliate links are injected automatically server-side in `/src/lib/affiliate.ts`. Users don't see any difference — they just click "View →" and you earn commission if they buy within 24 hours.

---

## Step 6 — Add Google AdSense

1. Go to https://adsense.google.com/start/
2. Sign up with your Google account
3. Add your site URL (must be your live domain, not localhost)
4. They'll review your site (takes 1-14 days for approval)
5. Once approved, get your Publisher ID (looks like `ca-pub-1234567890123456`)
6. Add to `.env.local`: `NEXT_PUBLIC_ADSENSE_ID=ca-pub-yourID`
7. In AdSense dashboard, create 3 ad units and get their Slot IDs
8. Replace these in `DealResults.tsx` and `page.tsx`:
   - `TOP_RESULTS_SLOT_ID`
   - `MID_RESULTS_SLOT_ID`
   - `HOMEPAGE_BOTTOM_SLOT_ID`

AdSense tips:
- The ad above results (TOP_RESULTS_SLOT_ID) will earn the most — users are engaged
- Don't put more than 3-4 ads per page — Google penalizes over-ad'd sites
- Responsive format (`auto`) works best on mobile

---

## Step 7 — Set up price alerts (email)

Right now alerts log to console. To send real emails:

### Resend (recommended — free for 100 emails/day)
```bash
npm install resend
```

In `/src/app/api/alert/route.ts`, uncomment and fill in the Resend section.

```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'alerts@yourdomain.com',
  to: email,
  subject: `Price alert set for ${product}`,
  html: `<p>We'll notify you when <strong>${product}</strong> drops to <strong>${target_price}</strong>.</p>`
})
```

Add `RESEND_API_KEY` to your `.env.local`.

### Store alerts in Supabase (free database)
1. Sign up at supabase.com
2. Create a table: `alerts (id, email, product, target_price, created_at)`
3. Install: `npm install @supabase/supabase-js`
4. Connect and insert in the alert route

---

## Revenue expectations

| Traffic | AdSense (est.) | Affiliate (est.) | Total |
|---------|---------------|-----------------|-------|
| 1,000 visitors/month | $5–20 | $10–50 | $15–70 |
| 10,000 visitors/month | $50–200 | $100–500 | $150–700 |
| 100,000 visitors/month | $500–2,000 | $1,000–5,000 | $1,500–7,000 |

Affiliate revenue scales much faster than AdSense because deal-finding users have high purchase intent.

---

## Growth ideas (make it smarter)

- **Browser extension** — highlight deals on any Amazon/Best Buy page the user visits
- **Deal of the day** email newsletter — auto-send top deals every morning
- **Category pages** — `/deals/headphones`, `/deals/laptops` for SEO traffic
- **Comparison mode** — search two products side-by-side
- **Fake review detector** — flag suspicious listings
- **Seasonal predictions** — "this product historically drops 40% on Black Friday"
- **Reddit/Twitter bot** — post best deals automatically to drive traffic

---

## Cost to run

| Item | Cost |
|------|------|
| Vercel hosting | Free (Hobby tier) |
| Domain | ~$12/year |
| Anthropic API | ~$0.01–0.05 per search |
| At 1,000 searches/month | ~$10–50/month API cost |

The API cost is the main expense. At 1,000 searches/month you're spending ~$10-50 on AI. This gets offset quickly once affiliate commissions and AdSense kick in.

To reduce costs: add caching so the same product query within 1 hour returns cached results instead of calling the API again.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| AI | Anthropic Claude claude-opus-4-5 + Web Search |
| Icons | Lucide React |
| Hosting | Vercel |
| Database (for alerts) | Supabase (free) |
| Email (for alerts) | Resend (free) |
| Affiliate | Amazon/Best Buy/Walmart programs |
| Ads | Google AdSense |
