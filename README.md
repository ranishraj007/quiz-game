# QuizVerse

QuizVerse is a modern Next.js and Supabase quiz-game platform with timed rounds, XP progression, streak scoring, player dashboards, leaderboards, and admin-ready quiz management.

## Features

- Premium responsive UI with dark/light themes, glass panels, animated feedback, loading states, and accessible controls
- Supabase Auth with email/password and Google OAuth entry points
- Timed quiz runs with randomized questions, instant answer feedback, explanations, speed bonuses, streak bonuses, XP, and saved attempts
- Player dashboard with score, level progress, accuracy, recent runs, streaks, and achievement states
- Public leaderboard with rank cards and all-time score ordering
- Admin page for creating categories and questions when a profile has `role = 'admin'`
- Supabase schema for profiles, categories, questions, attempts, bookmarks, achievements, and user achievements
- SEO metadata, OpenGraph metadata, reusable components, and route-level loading/error states

## Screenshots

Add screenshots after deployment:

- Landing page: `docs/screenshots/landing.png`
- Quiz arena: `docs/screenshots/quiz.png`
- Player dashboard: `docs/screenshots/profile.png`
- Admin panel: `docs/screenshots/admin.png`

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui primitives
- Supabase Auth and Postgres
- Zustand for quiz session state
- Three.js / React Three Fiber for animated scenes
- Vercel Analytics

## Folder Structure

```text
app/                    App Router pages, loading, error, auth, admin
components/             Product components and shadcn/ui primitives
hooks/                  Shared client hooks
lib/                    Supabase clients, types, store, utilities
public/                 Icons and static assets
scripts/                Supabase schema and seed SQL
styles/                 Legacy global style location
```

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/categories
```

## Supabase Setup

1. Create a Supabase project.
2. Run `scripts/001_create_quizverse_schema.sql` in the SQL editor.
3. Run `scripts/002_seed_categories_questions.sql`.
4. Existing projects should also run `scripts/003_upgrade_quizverse_platform.sql`.
5. Enable Google OAuth in Supabase Auth if you want social login.
6. To access `/admin`, set your row in `public.profiles` to `role = 'admin'`.

## Scripts

```bash
pnpm dev      # Start local dev server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Deployment

Deploy on Vercel:

1. Import the repository.
2. Add the Supabase environment variables.
3. Configure Supabase Auth redirect URLs for your production domain.
4. Deploy.

## Changelog

- Rebuilt the landing page into a polished product hero with interactive stats, category previews, and feature panels.
- Added responsive navigation, mobile sheet menu, authenticated user menu, and dark/light mode toggle.
- Redesigned category cards with question stats, stronger hover states, better empty state, and preserved existing `song` icon/category mapping.
- Upgraded quiz gameplay with randomized runs, timer state, speed scoring, streak bonuses, XP, explanations, answer logs, no-question states, and richer start/results screens.
- Added result sharing, confetti success animation, and saved attempt metadata.
- Rebuilt the profile page as a dashboard with level progress, metrics, recent games, accuracy bars, and achievement status.
- Rebuilt the leaderboard with podium cards and detailed ranked rows.
- Added an admin page for category/question creation with Supabase role gating.
- Added route loading skeletons and an error boundary.
- Expanded TypeScript types for XP, levels, streaks, answer records, achievements, and question explanations.
- Expanded Supabase schema with profile progression fields, game session metadata, bookmarks, achievements, user achievements, admin RLS policies, and an upgrade migration.
- Improved global theme tokens, typography wiring, SEO metadata, OpenGraph metadata, and reusable visual utilities.

## Future Improvements

- Live multiplayer rooms with Supabase Realtime
- Daily challenge rotation backed by scheduled jobs
- PWA install support and offline quiz packs
- Rich quiz editor with bulk import/export
- AI-assisted quiz generation with moderation workflow
- Email summaries and weekly leaderboard digests

## Credits

Built with Next.js, Supabase, shadcn/ui, Tailwind CSS, Zustand, and React Three Fiber.
