# AI Agency Automation Platform

This is a Next.js app (Next 16) that generates AI-powered demo websites and includes a dashboard.

## Local development

1. Copy the example env and update values:

```bash
cp .env.example .env
# edit .env with your DATABASE_URL, SMTP and API keys
```

2. Install and run locally:

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build for production

```bash
npm run build
npm start
# app serves on port 3000
```

## Deploy to Vercel

1. Push your repo to GitHub (or connect Git provider to Vercel).
2. Import project in Vercel and set Environment Variables in the Vercel dashboard using values from `.env` (do NOT commit secrets).

- Build command: `npm run build`
- Output directory: leave default (Vercel will detect Next.js)

3. Deploy from Vercel UI — it will build and host the app.

## Deploy with Docker

Build and run locally with Docker:

```bash
docker build -t ai-agency .
docker run -p 3000:3000 --env-file .env ai-agency
```

## Notes

- The repository contains `Dockerfile`, `.env.example`, and `vercel.json` to help deployment.
- Ensure `DATABASE_URL` points to a reachable PostgreSQL instance in production.
- Set `NEXT_PUBLIC_APP_URL` to your production domain for demo links.

If you'd like, I can also:

- Remove unused auth API endpoints (`/api/auth/register`) now that registration UI is removed.
- Create a GitHub Actions workflow to auto-deploy to a registry or to Vercel.
