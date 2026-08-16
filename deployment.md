# Deployment

**Live URL:** _add your deployed frontend URL here once deployed, e.g. `https://coffee-brew-log.vercel.app`_

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
3. Framework preset: "Other" (Vercel should auto-detect the `/api` function).
4. Environment variables:
   - `DB_DIALECT=postgres`
   - `DATABASE_URL=` (the Neon connection string from step 1)
   - `CORS_ORIGIN=` (leave as `http://localhost:5173` for now, update in step 4)
5. Deploy. Once live, copy the deployment URL, e.g. `https://brew-log-backend.vercel.app`.
6. Sanity check: visit `https://<backend-url>/api/health` — should return `{"status":"ok"}`.

### 3. Frontend (Vercel project)

1. Add New → Project → same repo again, but this time set **Root Directory** to `frontend`.
2. Vercel auto-detects Vite — leave build command (`npm run build`) and output
   directory (`dist`) as default.
3. Environment variable: `VITE_API_URL=` (the backend URL from step 2, no
   trailing slash).
4. Deploy. Copy the resulting frontend URL.

### 4. Wire CORS together

Go back to the **backend** Vercel project → Settings → Environment Variables →
update `CORS_ORIGIN` to the frontend URL from step 3 → redeploy (Vercel
prompts you, or trigger it from the Deployments tab).

### 5. Verify

Open the frontend URL. Add a brew, filter by method, edit it, delete it —
each of those hits the backend, which hits Neon.

## Troubleshooting notes (fill in as you go)

- **CORS errors in the browser console**: `CORS_ORIGIN` on the backend must
  exactly match the frontend's URL (including `https://`, no trailing slash),
  and the backend needs a redeploy after changing it — env var changes don't
  apply to already-running functions.
- **500 errors on every request**: usually means `DATABASE_URL` is wrong or
  Neon's connection string changed. Check the backend's Vercel function logs
  (Project → Deployments → the deployment → Functions tab).
- **`VITE_API_URL` not taking effect**: Vite bakes environment variables in at
  *build* time, not runtime — changing the env var alone won't update a live
  site, you need to trigger a redeploy of the frontend.
- **Cold starts**: Vercel's free tier serverless functions spin down when
  idle, so the first request after a while can take a couple of seconds while
  it wakes up — this is normal, not a bug.
