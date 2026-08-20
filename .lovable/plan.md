# Fix: "Get negotiation tips" starts the guided intake instead of answering

## What's happening

The negotiation link does open a separate chat and does send "Give me Negotiations and Practical Tips" — that part works. The problem is on the server: `/api/chat` always uses one system prompt, and that prompt instructs the assistant to run the guided intake (Steps 1-6, one question at a time, starting with when the accident happened). So whatever the user's first message is, the assistant ignores it and begins the intake.

## The fix: two conversation modes

Give the chat endpoint a `mode` so it can behave as either the guided intake or a plain Q&A helper.

1. Split the prompt into shared base rules (not a lawyer, plain English, warm tone, never mention the source guide, direct to a lawyer or Pro Bono SG) plus two mode-specific sections:
   - `guided` — the current intake script, document generation, letter templates. Unchanged behaviour.
   - `qa` — answer the user's question directly and helpfully using the guide's content (negotiation tips, process questions, etc.). No intake, no forced one-question-at-a-time interrogation, no document generation. Ends by inviting a follow-up question.
2. The chat request body accepts `mode`; the server picks the matching prompt and defaults to `guided` when absent.
3. The chat page sends `mode: "qa"` when it was opened with an `ask` question (Stage 3 negotiation tips, FAQ chips) and `mode: "guided"` when opened with `start` (Stage 1 step-by-step guide).

## Technical notes

- `src/routes/api/chat.ts`: read `mode` from the POST body, validate it to `"guided" | "qa"`, select between `GUIDED_SYSTEM_PROMPT` and `QA_SYSTEM_PROMPT`.
- `src/routes/_authenticated/faq.tsx`: build the `DefaultChatTransport` with a `body: { mode }` (memoised so it isn't recreated each render), where `mode = start ? "guided" : "qa"`.
- Document auto-save on assistant replies stays gated on the `===DOC:===` markers, which the Q&A prompt never emits, so nothing overwrites saved documents.

## Verification

Open Stage 3 → "Get negotiation tips" and confirm the assistant answers with negotiation tips rather than asking when the accident happened; then open Stage 1 → guided process and confirm the intake still starts normally.
