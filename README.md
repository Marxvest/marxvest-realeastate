# Marxvest Spec Limited

Premium, security-first land sales platform built with Next.js 16, Tailwind, and a Supabase-ready schema.

## Stack

- Next.js 16 App Router
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Demo session auth with signed `HttpOnly` cookies
- Paystack transaction initialization + webhook verification routes
- Supabase schema and RLS starter in [supabase/schema.sql](/home/oduzz/projects/marxvest/supabase/schema.sql)

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in `AUTH_SECRET`, demo credentials, and `PAYSTACK_SECRET_KEY`.
3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

## Demo accounts

- Buyer: value of `DEMO_BUYER_EMAIL` / `DEMO_BUYER_PASSWORD`
- Admin: value of `DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD`

## Security notes

- Public listing pages do not expose payment buttons.
- Payment initialization is buyer-only and server-side.
- The Paystack callback page is informational only.
- Webhook verification uses HMAC signature checking and amount matching.
- The SQL schema is structured so allocation remains locked until full settlement.
