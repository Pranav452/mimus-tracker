<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mimus — CA Inter tracker

Mobile-only PWA for **Mimansha**'s CA Intermediate **January 2027** attempt (Group I:
Accounts 2 Jan, Law 4 Jan, Tax 6 Jan — dates live in `lib/exam.ts`). Sept 2026 result was
Accounts 55, Law 49, Tax 35 (139/300, unsuccessful); Tax is the paper to fix.
**Pranav** = admin/mentor, **Mimansha** = student. Everything is Asia/Kolkata time
(`todayIST()` in `lib/auth.ts`).

## The nightly routine

This is the main recurring task. She logs what she studied; Pranav turns it into a test.

```bash
# 1. She logs topics herself in /topics. If she forgot, log for her (see below).
# 2. Generate + publish a test from that day's topics:
npx tsx scripts/nightly-test.ts --count=10 --duration=25 [--date=YYYY-MM-DD]
# 3. Optional: push a message to her phone
npx tsx scripts/send-nudge.ts --title="..." --body="..."
```

Both also exist as UI: `/admin/create` (generate → review/edit → publish) and
`/admin/nudge`. The scripts are just faster when Pranav asks in chat.

To log topics on her behalf, insert into `daily_topics` (userId 1) for the date,
then call `syncPlanProgress(1)` — or simply re-run `scripts/seed-plan.ts`, which
syncs at the end.

## Architecture

- **Next.js 16** — `params`/`searchParams`/`cookies()` are Promises; middleware is
  `proxy.ts`; route handlers are dynamic by default.
- **Neon + Drizzle** (`neon-http`). `lib/db/index.ts` connects **lazily via a Proxy** —
  CLI scripts load `.env.local` after imports hoist, so an eager `neon(...)` breaks
  them. Don't make it eager. It also retries transient "fetch failed" 3×.
- **Auth**: jose cookie `mimus_session`, bcrypt. Roles `student` / `admin`.
- **AI is OpenAI** (`OPENAI_MODEL`, default `gpt-5-mini`) — see `lib/ai.ts`.
- Syllabus lives in `lib/syllabus.ts` (72 chapters, seeded); `scripts/seed.ts` seeds it.

## Things that will bite you

- **`lib/changes.ts` is the single source of current law.** Its `AMENDMENTS_BRIEF`
  is injected into both the chat prompt and every question-generation prompt
  (FA 2025 slabs/87A, new TDS thresholds, GST 2.0 5/18/40). Update it when law
  changes — don't hardcode figures elsewhere.
- **Planner auto-ticks** from logged topics: `syncPlanProgress()` in `lib/plan-sync.ts`
  is a pure, idempotent recomputation. A topic maps to the *nearest-by-date* plan item
  covering that chapter; an item ticks only when **all** its chapters are covered.
  Items she taps get `manual: true` and are never auto-touched again.
- **Re-running `scripts/seed-plan.ts` rebuilds all plan items**, so her *manual* ticks
  are lost (auto-ticks are restored by the sync it runs at the end). Exam dates are the
  `EXAM_DATES` constant at the top; chapter links use the `C` name map and the script
  throws on an unknown chapter name.
- **`npm run db:push` can't rename columns here** — drizzle-kit prompts interactively
  and there's no TTY. Run the `alter table` directly.
- The AI returns chapter names that don't match seeded names verbatim ("Buy-back" vs
  "Buyback") — both the admin UI and the CLI fuzzy-match. Keep that.

## Accounts

Seed logins are in `.env.local` (`SEED_*`): `mimansha@mimus.app` (student),
`pranav@mimus.app` (admin). She has the PWA installed on iPhone with notifications
enabled, so nudges genuinely reach her — treat them as outward-facing messages.

## January 2027 attempt (added 23 Nov 2026)

- **Daily 5** (`lib/daily-five.ts`): home-screen button builds a 5-question, 5-minute quiz
  from today's plan chapters, drawing ONLY from reviewed bank questions (never generated on
  the fly). Copies carry `source_question_id` so history follows the original.
- **Question bank**: hand-written files in `scripts/bank/*.ts` (correct option FIRST; the
  seeder shuffles) → `npx tsx scripts/seed-bank.ts --bank=tax-income`.
- **Flashcards**: `scripts/gen-flashcards.ts` drafts to `scripts/flashcards/*.json`; review
  by hand, then `npx tsx scripts/seed-flashcards.ts --paper=tax|law|accounts`. All three
  papers are reviewed and seeded (934 cards, every one of the 72 chapters). The
  `_patch_*.py` files beside the JSON are the record of that review — **never seed a fresh
  draft unreviewed**: roughly 1 card in 5 was wrong or stale, and the Accounts drafts were
  full of Ind AS/IFRS rules (restating comparatives, "held for sale", discounting
  provisions) that are wrong for this AS-based syllabus.
- **Plan sync ignores topics logged before the plan's first day**, so an old attempt's
  history can't tick a new plan.
- Tax past papers older than May 2026 use old slabs/GST rates — don't schedule them.
- Verify any threshold against a primary source before asserting it: the small-company
  limit (now ₹10cr/₹100cr) was taught wrongly for September from model memory.
