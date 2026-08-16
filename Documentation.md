# Coffee Brew Log

A small full-stack app for a micro-roastery to log, filter, edit, and delete their coffee brews.

## Description

Users can:

- Create a brew entry (beans, method, coffee grams, water grams, rating, tasting notes)
- View all brews in a list, with the page title showing `Brews: {count}`
- Filter the list by brew method
- Edit and update an existing brew
- Delete a brew

## Tech stack

| Layer     | Choice                                   |
| --------- | ----------------------------------------- |
| Front-end | React (Vite) + Tailwind CSS               |
| Back-end  | Node.js + Express                         |
| ORM / DB  | Sequelize ORM, SQLite (dev) / PostgreSQL (prod-ready) |

> Note: the brief required an ORM backed by a SQL database, so this uses Sequelize
> over SQLite locally (Postgres in production, if you deploy to a host with a managed
> Postgres add-on) rather than MongoDB.

## Project structure

```
coffee-brew-log/
├── backend/     # Express API, Sequelize models, routes
├── frontend/    # React app (Vite + Tailwind)
├── Documentation.md
└── deployment.md
```

## API

Base path: `/api/brews`

| Method | Path              | Description                          |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/api/brews`        | List all brews (optional `?method=`) |
| GET    | `/api/brews/:id`    | Get a single brew                    |
| POST   | `/api/brews`        | Create a brew                        |
| PUT    | `/api/brews/:id`    | Update a brew                        |
| DELETE | `/api/brews/:id`    | Delete a brew                        |

Required fields on create/update: `beans`, `method`, `coffeeGrams`, `waterGrams`, `rating`, `tastingNotes`.
Missing or blank fields return `400`. A brew that doesn't exist returns `404`.

## Local setup

### Prerequisites

- Node.js 18+
- npm

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run start        # or: npm run dev (with nodemon)
```

The API starts on `http://localhost:4000` and creates a local SQLite database
file at `backend/data/brewlog.sqlite` automatically on first run.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app opens on `http://localhost:5173` and talks to the API at the URL
set in `VITE_API_URL` (`.env`).

## Environment variables

See `backend/.env.example` and `frontend/.env.example`. No secrets are hardcoded
anywhere in the codebase — all configuration is read from environment variables.

## Running tests / manual verification

There's no automated test suite included; CRUD behaviour, validation, and status
codes (200/201/204/400/404) were manually verified against the running API using
curl before committing (see git log for the corresponding commits).
