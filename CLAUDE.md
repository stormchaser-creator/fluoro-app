# fluoro-app — Session Orientation

**What:** Fluoroscopy study app for medical professionals preparing for fluoroscopy certification/exams. Covers equipment physics, study domains, badges, and structured study phases.

**Stack:** React + Vite, Supabase (auth + database), Stripe payments. Deployed via Vercel.

## Key Files & Structure
- `src/data/` — Study content: questions, domains, phases, equipment physics guide, confusables, badges
- `src/studyMaterial.js` — Core study material
- `supabase-auth-migration.sql` — Auth setup
- `supabase-stripe-migration.sql` — Payment integration
- `landing/` — Landing page

## Related
- **fluoro-app-mock-exam** — Companion project with exam-focused UI using the same study material
