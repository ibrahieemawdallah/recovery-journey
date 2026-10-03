# Deploy to Vercel — Step-by-Step Guide

This guide walks you through deploying the Recovery Journey app to Vercel's free tier with a hosted Postgres database.

---

## Why not SQLite on Vercel?

Vercel runs serverless functions with an **ephemeral, read-only filesystem**. A SQLite file database would be lost on every deploy/invocation. You must use a hosted database provider.

**Recommended: Neon Postgres** — one click from the Vercel dashboard, free tier, zero config.

---

## Step 1 — Create the Hosted Database

### Option A: Neon Postgres (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and create a new project (or open an existing one).
2. In the project dashboard, go to **Storage** → **Create Database** → **Neon Postgres**.
3. Choose the **Free** plan and a region close to your users.
4. Once created, Neon provides two connection strings:
   - **Pooled connection** (for the app) — copy this as `DATABASE_URL`
   - **Direct connection** (for migrations) — copy this as `DIRECT_URL`
5. Both strings look like:
   ```
   postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require
   ```

### Option B: Turso / libSQL (SQLite-compatible)

1. Go to [turso.tech](https://turso.tech) and create a free account.
2. Create a new database.
3. Copy the connection URL and auth token:
   - `TURSO_DATABASE_URL` — looks like `libsql://<db>.turso.io`
   - `TURSO_AUTH_TOKEN` — the auth token from the Turso dashboard
4. **Note:** If using Turso, you'll need to install `@libsql/client` and `@prisma/adapter-libsql`, and update the Prisma datasource. The schema in `prisma/schema.postgres.prisma` is Postgres-only.

---

## Step 2 — Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Pooled Postgres connection string from Neon | ✅ |
| `DIRECT_URL` | Direct Postgres connection string from Neon | ✅ |
| `AUTH_SECRET` | Random string — generate with `openssl rand -base64 32` | ✅ |
| `NEXTAUTH_URL` | `https://<your-app>.vercel.app` | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://<your-app>.vercel.app` | ✅ |
| `GROQ_API_KEY` | Your Groq API key (if using AI features) | Optional |
| `GEMINI_API_KEY` | Your Gemini API key (if using AI features) | Optional |

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Step 3 — Push the Database Schema

Run `prisma db push` against the hosted database to create all tables:

```bash
# Set the env vars locally (or use a .env file)
export DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require&pgbouncer=true"
export DIRECT_URL="postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require"

# Push the schema
npx prisma db push --schema=prisma/schema.postgres.prisma
```

This creates all tables in your Neon database without running migrations.

---

## Step 4 — Import the Repo into Vercel

1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Vercel auto-detects Next.js — no extra config needed.
5. The `vercel.json` in the repo root sets the build command to `prisma generate && next build`.
6. Click **Deploy**.

---

## Step 5 — Verify the Deployment

1. Once deployed, open `https://<your-app>.vercel.app`.
2. Check that the app loads and the database connects (try signing up or loading data).
3. Check Vercel logs for any runtime errors.

---

## Important Caveats

### Local `dev.db` is NOT migrated

The local SQLite database (`prisma/dev.db`) contains your development data. This data is **not** automatically migrated to the hosted Postgres database. After deployment:

- The production database starts empty.
- You can seed it manually by creating users through the app UI.
- If you need to migrate local data, you'd need to export from SQLite and import into Postgres (not covered here).

### `output: "standalone"` is disabled on Vercel

The `next.config.ts` automatically disables standalone output when `VERCEL` env var is set. Local production builds (`bun run build`) still produce the standalone output at `.next/standalone/`.

### `postinstall` script

The `postinstall` script in `package.json` runs `prisma generate` automatically after `bun install` / `npm install`. This ensures the Prisma client is generated during Vercel's build process.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `DATABASE_URL` not found | Make sure the env var is set in Vercel → Settings → Environment Variables |
| `prisma db push` fails | Check that `DIRECT_URL` is set and the database is reachable |
| Build fails on Vercel | Check that `postinstall` script runs — look for `prisma generate` in build logs |
| Auth errors | Ensure `AUTH_SECRET` and `NEXTAUTH_URL` are set correctly |
| `output: standalone` error | This is expected on Vercel — the config auto-disables it |

---

## Files Added for Deployment

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel config — framework preset, build command |
| `prisma/schema.postgres.prisma` | Postgres-compatible Prisma schema |
| `.env.production.example` | Template for production env vars |
| `DEPLOY.md` | This guide |
| `next.config.ts` (modified) | Conditional `output: standalone` |
| `package.json` (modified) | Added `postinstall` script |
