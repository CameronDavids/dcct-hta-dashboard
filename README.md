# DCCT HTA Dashboard

A Vite + React + TypeScript dashboard for Deaf Community of Cape Town's monthly HIV Testing & Awareness programme data.

## 1. Create Supabase project

1. Go to [supabase.com](https://supabase.com), create a free account, and create a new project.
2. In the Supabase project dashboard, open **Project Settings > API**.
3. Copy the **Project URL** and the `anon` / public key.
4. Copy `.env.local.example` to `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The local `.env.local` is gitignored.

## 2. Run the database migration

The schema and seed data are in `supabase/migrations/0001_init.sql`. In the Supabase dashboard, open **SQL Editor**, paste the file contents, and run it. The migration creates `hta_months`, enables Row Level Security, adds an authenticated staff policy, and inserts the initial April-August 2026 data.

Alternatively, with the Supabase CLI installed and linked to your project:

```bash
supabase db push
```

## 3. Add staff users

In the Supabase dashboard, open **Authentication > Users > Add user**. Add each invited DCCT staff member with their email and a temporary password. There is no public sign-up screen.

## 4. Run locally

Install Node.js 20 or newer, then from the project folder run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
```

The output is written to `dist`.

## 5. Deploy

Deploy the `dist` folder to Netlify, Vercel, or GitHub Pages. Configure the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in the hosting provider before building. For a client-side Vite app, configure the host to fall back to `index.html` for unknown routes.

## Notes

When `.env.local` still contains placeholder values, the dashboard uses the bundled seed data for UI preview, but authentication and persistence remain unavailable until Supabase is configured.
