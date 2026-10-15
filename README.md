# Resitly

AI receipt and invoice processor for Malaysian SMEs and freelancers. Snap or upload a receipt, let Gemini extract the vendor, line items and SST, review the result, then export a CSV for SQL Accounting, AutoCount or QuickBooks.

- Currency: MYR
- Tax: SST (6% service tax, 8% sales tax)
- Single-user accounts (no organisations yet)

## How it works

```
upload (R2 presigned URL) → create invoice → AI extract (Gemini) → review & edit → confirm → export CSV
```

Invoice status: `pending → extracting → review → reviewed → exported`

## Stack

| Layer    | Tech                                                      |
| -------- | --------------------------------------------------------- |
| Monorepo | pnpm workspaces + Turborepo                               |
| API      | [Hono](https://hono.dev) on Node (`apps/api`, port 3001)  |
| Web      | Next.js 16 + React 19 + Tailwind v4 (`apps/web`, port 3000) |
| Database | PostgreSQL 16 + Drizzle ORM                               |
| Auth     | Better Auth (email/password + Google OAuth)               |
| Storage  | Cloudflare R2                                             |
| AI       | Google Gemini (`gemini-2.5-flash-lite`)                   |
| Email    | Resend                                                    |
| Shared   | Zod schemas in `packages/types`                           |

## Repo layout

```
apps/
  api/            Hono API — routes, use-cases, data-access, Drizzle schema & migrations
  web/            Next.js app — marketing, auth, and the /app dashboard
packages/
  types/          Shared Zod schemas and TypeScript types
sample-receipts/  Example receipts for testing extraction
nginx/            Reverse proxy config
DESIGN.md         Design system reference
```

## Getting started

### Prerequisites

- Node.js 22
- pnpm 9 (`corepack enable`)
- Docker (for local Postgres)
- Accounts/keys for: Gemini, Cloudflare R2, Resend, Google OAuth

### 1. Install

```bash
pnpm install
```

### 2. Start Postgres

```bash
docker compose -f docker-compose.dev.yml up -d postgres
```

This runs Postgres on `localhost:5432` with user/password `resitly` and database `resitly_dev`.

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Fill in `apps/api/.env`. All of these are required (validated at startup in `apps/api/src/lib/env.ts`):

| Variable                                                                 | Notes                                         |
| ------------------------------------------------------------------------ | --------------------------------------------- |
| `DATABASE_URL`                                                           | `postgresql://resitly:resitly@localhost:5432/resitly_dev` |
| `BETTER_AUTH_SECRET`                                                     | 32+ random characters                         |
| `BETTER_AUTH_URL`                                                        | `http://localhost:3001`                       |
| `CORS_ORIGINS`                                                           | Comma-separated, e.g. `http://localhost:3000` |
| `RESEND_API_KEY`, `EMAIL_FROM`                                           | Transactional email                           |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Uploads — not in `.env.example`, add them |
| `GEMINI_API_KEY`                                                         | AI extraction                                 |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                               | Google sign-in                                |
| `COOKIE_DOMAIN`                                                          | Optional; only needed when web and API are on different subdomains |

`apps/web/.env` only needs `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_URL`.

### 4. Set up the database

```bash
pnpm --filter @resitly/api db:migrate
pnpm --filter @resitly/api db:seed     # default expense categories
```

### 5. Run

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001 (health check at `/v1/health`)

## Scripts

Root:

| Command      | Description                    |
| ------------ | ------------------------------ |
| `pnpm dev`   | Run API and web in watch mode  |
| `pnpm build` | Build all packages             |

API (`pnpm --filter @resitly/api <script>`):

| Script        | Description                              |
| ------------- | ---------------------------------------- |
| `db:generate` | Generate a migration from schema changes |
| `db:migrate`  | Apply migrations                         |
| `db:push`     | Push schema directly (prototyping only)  |
| `db:studio`   | Open Drizzle Studio                      |
| `db:seed`     | Seed default categories                  |

## API overview

All routes are under `/v1` and require a session, except health and auth.

| Method | Route                       | Purpose                         |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/uploads/presign`          | Get an R2 presigned upload URL  |
| GET    | `/invoices`                 | List invoices                   |
| POST   | `/invoices`                 | Create an invoice record        |
| GET    | `/invoices/:id`             | Get one invoice                 |
| PATCH  | `/invoices/:id`             | Edit extracted data             |
| POST   | `/invoices/:id/extract`     | Run AI extraction (rate-limited)|
| PATCH  | `/invoices/:id/confirm`     | Mark as reviewed                |
| DELETE | `/invoices/:id`             | Delete an invoice               |
| GET    | `/categories`               | List expense categories         |
| GET    | `/dashboard/summary`        | Totals                          |
| GET    | `/dashboard/by-category`    | Spend by category               |
| GET    | `/dashboard/by-month`       | Spend by month                  |
| GET    | `/export`                   | Download CSV                    |

## Deployment

Pushing to `main` triggers GitHub Actions:

1. **build.yml** — typecheck, build, then push `resitly-api` and `resitly-web` images to GHCR.
2. **deploy.yml** — SSH into the VPS, copy `docker-compose.yml` to `/srv/resitly`, pull images, run `db:migrate`, and `docker compose up -d`.

Production env files live on the VPS at `/srv/resitly/.env`, `.env.api` and `.env.web` — see the matching `*.example` files in the repo root.

To try the full Docker setup locally:

```bash
docker compose -f docker-compose.dev.yml up --build
```
