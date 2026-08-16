# Deployment

**Live URL:** https://coffee-brew-log-lujt.vercel.app/

## Approach: Vercel (frontend + backend) + Neon (Postgres)

Two separate Vercel projects point at the same GitHub repo — one for `frontend`,
one for `backend` — plus a free Neon Postgres database.

### 1. Database (Neon)

1. Create a free account at neon.tech and create a new project.
2. Copy the connection string it gives you (starts with `postgres://` and
   includes `?sslmode=require`).

### 2. Backend (Vercel project)

1. Vercel dashboard → Add New → Project → import this repo.
2. Set **Root Directory** to `backend`.
3. Framework preset: "Other" (Vercel auto-detects the `/api` function).
4. Environment variables:
   - `DB_DIALECT=postgres`
   - `DATABASE_URL=` (the Neon connection string from step 1)
   - `CORS_ORIGIN=` (the frontend URL from step 3, no trailing slash)
5. Deploy. Once live, copy the deployment URL.
6. Sanity check: visit `https://<backend-url>/api/health` — should return `{"status":"ok"}`.

### 3. Frontend (Vercel project)

1. Add New → Project → same repo again, but this time set **Root Directory** to `frontend`.
2. Vercel auto-detects Vite — leave build command (`npm run build`) and output
   directory (`dist`) as default.
3. Environment variable: `VITE_API_URL=` (the backend URL from step 2, no
   trailing slash).
4. Deploy. Copy the resulting frontend URL, then update `CORS_ORIGIN` on the
   backend project to match it and redeploy the backend.

### 4. Verify

Open the frontend URL. Add a brew, filter by method, edit it, delete it —
each of those hits the backend, which hits Neon.

## Issues I actually hit and how I fixed them

- **GitHub org permissions**: the assessment repo lives under the
  `Umuzi-classroom` GitHub organization. Vercel needs org-admin access to
  import a repo from an org, which I don't have as a student. Fix: pushed the
  same commit history to a personal repo (`Ckola99/coffee-brew-log`) and
  deployed from that instead.

- **`Error: Please install pg package manually`**: the backend deployed
  successfully but crashed on every request. Sequelize loads its Postgres
  driver (`pg`) dynamically based on a config value, and Vercel's dependency
  bundler (`@vercel/nft`) can't detect that dynamic `require` at build time —
  so it left `pg` out of the deployed function even though it was listed in
  `package.json` and installed locally. Fix: added an explicit
  `require('pg')` (and `require('pg-hstore')`) at the top of
  `backend/config/database.js` so the bundler's static analysis picks it up.

- **CORS blocked all requests from the frontend**: after both projects were
  live, the browser console showed `No 'Access-Control-Allow-Origin' header
  is present`. This happens when `CORS_ORIGIN` on the backend doesn't exactly
  match the frontend's URL — even a trailing slash is enough to break it,
  since it's a straight string comparison. Fix: double-checked the exact
  value in Vercel's environment variables, redeployed the backend, and also
  updated the CORS code to trim whitespace and strip trailing slashes so a
  small copy-paste difference doesn't silently break it again.

## Troubleshooting notes for future reference

- **500 errors on every request**: usually means `DATABASE_URL` is wrong or
  Neon's connection string changed. Check the backend's Vercel function logs
  (Project → Logs, not the build log — the crash happens at runtime).
- **`VITE_API_URL` not taking effect**: Vite bakes environment variables in at
  *build* time, not runtime — changing the env var alone won't update a live
  site, you need to trigger a redeploy of the frontend.
- **Cold starts**: Vercel's free tier serverless functions spin down when
  idle, so the first request after a while can take a couple of seconds while
  it wakes up — this is normal, not a bug.
