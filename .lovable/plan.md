# Make Stage 5 (Letter of Demand) an optional branch

Today the claim journey shows 5 equal stages, so the Letter of Demand always looks like a required final step and the progress bar can never reach 100% unless the user ticks it. In reality, once a Settlement Agreement is signed and payment is received, the journey is finished.

## What changes

**Stage 4 gets a follow-up question.** Once stage 4 is ticked, a small prompt appears inside that stage card:

"Has the agreed compensation been received?"  →  buttons: **Yes, received** / **Not yet**

**Stage 5 presents itself based on that answer:**

```text
No answer yet   Stage 5 shown dimmed, badge "Only if needed",
                helper line: "You only need this if payment
                is not received by the deadline."

Yes, received   Stage 5 collapses to a muted "Not needed —
                compensation received" row with a green tick
                on the journey. Journey shows as complete.
                A small "Payment didn't arrive after all?" link
                reopens the stage.

Not yet         Stage 5 becomes an active, required stage with
                its existing "Draft a Letter of Demand" link.
```

**Progress bar and counter adapt.** When compensation is received, the journey counts 4 stages ("4 of 4 done") and the completion banner appears. Otherwise it counts 5 as today.

**Completion banner wording** for the settled path: "Your claim journey is complete — settlement reached and compensation received." The existing wording stays for the demand path.

## Persistence

The answer is stored with the timeline progress (a `paymentReceived: true | false | null` field) so it is tied to the user and restored on next login. "Start New Process" resets it to unanswered along with everything else.

If a Letter of Demand has already been generated, stage 5 always stays visible and active regardless of the answer, so the user keeps access to that document.

## Technical notes

- `src/components/app/ClaimTimeline.tsx`: extend `TimelineState` to `{ done: boolean[]; paymentReceived?: boolean | null }`, derive `requiredStages` (4 or 5) for the progress/counter/allDone logic, and render the stage 4 prompt plus the three stage 5 presentations.
- No schema change needed — `progress` already stores arbitrary JSON per key.
