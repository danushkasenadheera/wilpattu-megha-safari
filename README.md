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

## Deploy to Netlify (free)
1. Push this repo to GitHub.
2. Netlify -> Add new site -> Import from Git -> pick the repo. Netlify detects Next.js; `netlify.toml` sets the build command and Node 22.
3. Site settings -> Environment variables - add all of these (same values as `.env.local`):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL` (your live URL).
4. Deploy. Then open `/admin`, sign in, and edit a package to confirm changes appear on the home page.
5. Resend: verify your domain and use an address on it for `CONTACT_FROM_EMAIL` (onboarding@resend.dev only works for testing).
6. Supabase free projects can pause when idle: add the `SUPABASE_URL` and `SUPABASE_ANON_KEY` secrets to the GitHub repo so `.github/workflows/keepalive.yml` can ping it twice a week.
7. Photos: after adding files to `public/images`, restart `npm run dev` (the photo list is built at start-up / build).
