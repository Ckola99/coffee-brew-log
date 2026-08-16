# Deployment

**Live URL:** _add your deployed URL here once deployed, e.g. `https://coffee-brew-log.onrender.com`_

## Suggested approach: Render.com (free tier)

### 1. Database
Create a **Render PostgreSQL** instance (free tier). Copy the "Internal Database URL" it gives you.

### 2. Backend (Web Service)
- New → Web Service → connect this repo, root directory `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `DB_DIALECT=postgres`
  - `DATABASE_URL=` (paste the Render Postgres internal URL)
  - `CORS_ORIGIN=` (your deployed frontend URL, once you have it)
  - `PORT` — Render sets this automatically, no need to set it yourself

### 3. Frontend (Static Site)
- New → Static Site → connect this repo, root directory `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL=` (your deployed backend URL from step 2)

### 4. Wire them together
Once both are deployed, update `CORS_ORIGIN` on the backend to the frontend's
real URL and redeploy the backend so the browser isn't blocked by CORS.

## Troubleshooting notes (fill in as you go)

- If the frontend can't reach the API: check `VITE_API_URL` was set **before**
  the static site build ran — Vite bakes env vars in at build time, so changing
  it afterwards requires a rebuild, not just a restart.
- If Postgres connection fails on Render: make sure `DB_DIALECT=postgres` and
  `DATABASE_URL` are both set, and that SSL isn't being rejected (the backend
  config already sets `rejectUnauthorized: false` for Render's self-signed cert).
- If migrations/tables don't appear: the backend runs `sequelize.sync()` on
  startup, which creates the `brews` table automatically — check the deploy
  logs for the "listening on port" message to confirm startup succeeded.
