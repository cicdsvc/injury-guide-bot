# Fix: assistant mis-judges dates ("14 August 2026" treated as a future date)

## What's happening

The assistant is never told what today's date is. Language models have no clock, so it falls back on its training cut-off and assumes 2026 dates are in the future. That also makes the 3-year limitation-period check unreliable.

## The fix

Give the model the real current date on every request, and tell it how to use it.

1. In the chat endpoint, compute "today" in Singapore time (Asia/Singapore) at request time and prepend a short context line to whichever system prompt is used — e.g. `Today's date is Friday, 21 August 2026 (Singapore time). Use this as the current date for all date reasoning; never assume a date is in the future based on anything else.`
2. Add explicit date rules to the guided prompt:
   - Compare any date the claimant gives against today's date above before calling it past or future.
   - Only query a date as "in the future" if it is genuinely later than today.
   - Interpret a date with no year as the most recent past occurrence of that day/month.
   - Base the limitation-period check (more than 3 years ago) on today's date, not a guess.
3. Apply the same date line to the Q&A mode prompt so negotiation/FAQ answers use the correct year too.

## Technical notes

- `src/routes/api/chat.ts`: build the date string with `Intl.DateTimeFormat("en-SG", { timeZone: "Asia/Singapore", dateStyle: "full" })` inside the POST handler, and concatenate it ahead of `SYSTEM_PROMPT` / `QA_SYSTEM_PROMPT` when selecting `system`.
- Prompt text only; no changes to the chat UI, storage, or document generation.

## Verification

Start the guided process, enter "14 August 2026" as the accident date, and confirm the assistant accepts it as a recent past date and continues to the next question instead of flagging it as being in the future.
