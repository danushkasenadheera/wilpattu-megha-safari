# Wilpattu Megha Safari

Next.js 16 (App Router) + Tailwind 4 + Motion + Supabase. Only the safari packages/prices live in the database;
everything else is static content in the code.

## Setup
1. `npm install`
2. Create a Supabase project. In the SQL editor run `supabase/schema.sql` (creates tables, security rules and seeds today's prices).
3. Supabase -> Authentication: turn OFF "Allow new users to sign up", then add ONE user (Authentication -> Users -> Add user, auto-confirm). That is the admin login.
4. Copy `.env.example` to `.env.local` and fill in the Supabase URL/anon key and the Resend settings.
5. `npm run dev` -> site on http://localhost:3000, admin on http://localhost:3000/admin

## Where things are
- `src/lib/site.ts` - WhatsApp number, social links, journey sections
- `src/lib/stay.ts` - accommodation copy and rooms (DRAFT - edit)
- `public/images/README.md` - which photo goes where (sample photos show until you add yours)
- `src/app/admin` - login + add/edit/delete packages and price tiers
- `src/app/api/contact/route.ts` - contact form -> email via Resend
- `src/proxy.ts` - protects /admin (Next 16's replacement for middleware)
- `src/app/globals.css` - brand colors (green #005828 from the logo, gold accent)

## Deploy
Vercel: import the repo, add the same env vars. Saving in the admin refreshes the public page immediately.
