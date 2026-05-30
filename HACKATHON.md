# Beta Hacks 5/30 — Foundry demo kit

## Quick start (no OAuth wall)

1. Copy `.env.example` → `.env.local`
2. Set `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (AR handoffs + fab orders)
3. Optional sponsors:
   - `EVERMIND_API_KEY` — EverOS agent memory ([docs](https://docs.evermind.ai))
   - `BUTTERBASE_API_KEY` + `BUTTERBASE_APP_ID` — event logging for judging (`BUTTERBASE_SUBMISSION_CODE=build0530`)
4. `npm install && npm run dev`
5. Open home → continue as demo user (default). AR QR + Stripe checkout work without Supabase OAuth.

## Sponsor integrations

| Sponsor | What ships in this repo |
|---------|------------------------|
| **EverMind / EverOS** | `src/lib/sponsors/evermind.ts` — hybrid memory search before each AI turn; async write after replies. Per-project `user_id` = project name. |
| **Butterbase** | `src/lib/sponsors/butterbase.ts` — `foundry_events` table rows for chat, AR handoff, Stripe checkout/verify. MCP judging uses your Butterbase project. |

## Demo checklist for judges (2:30)

1. **Slide 1** — Team + why hardware founders need one AI workspace for CAD + PCB + AR assembly.
2. **Slide 2** — Foundry: chat → enclosure + schematic → AR assembly guide on phone → fab checkout.
3. **Live demo** — Prompt a board → open AR tab → scan QR on phone → step through assembly → place mock/stripe order.

## Env keys (never commit)

Put secrets only in `.env.local` or your host dashboard — not in git or chat logs.
