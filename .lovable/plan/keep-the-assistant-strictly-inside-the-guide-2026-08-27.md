# Keep the assistant strictly inside the guide

The assistant occasionally answers from general knowledge or slips into legal advice. Both chat modes (the guided intake and the question-and-answer mode) share the same weakness: the "use only the information provided" rule sits at the very end of a long prompt, and there is no check on what the model produces.

## What changes

### 1. A hard grounding rule at the top of both prompts

Move the source restriction to the first lines of both system prompts (guided and Q&A), stated as an absolute rule:

- Every substantive statement must be supported by the guide content supplied in the prompt.
- If the guide does not cover something, say so plainly in one short line and suggest raising it with a lawyer — never fill the gap from general knowledge, other jurisdictions, or assumptions.
- Never state or imply the source document's name.

### 2. An explicit refusal list

Add a short, concrete list of things the bot must never do, with the exact redirect wording to use:

- assess whether a claim will succeed, is strong or weak
- estimate or suggest how much a claim is worth, or a fair settlement figure
- advise whether to accept or reject an offer
- interpret or apply legislation, case law or court rules beyond what the guide states
- tell the user what they "should" do legally, or predict an outcome
- comment on court filing, litigation strategy or anything outside out-of-court settlement of minor claims

For each, the reply is a warm one-line acknowledgement plus "That's a question for your lawyer.", then a return to the current step (guided mode) or an invitation to ask something else (Q&A mode).

### 3. A self-check before every reply

Add a short pre-send checklist the model applies to its own draft: is each factual claim traceable to the guide; does it contain any opinion on merits, value or whether to settle; does it name the source document; does it contain more than one question (guided mode). If any check fails, rewrite before sending.

### 4. Off-topic handling

Add a rule for questions unrelated to personal injury claims: decline briefly and steer back to the guide's scope, rather than answering generally.

### 5. Wording of the standing disclaimer

Keep the existing first-reply disclaimer and the footer line, and add a rule that the disclaimer is repeated whenever the user pushes for advice — not only at the start.

## Technical notes

All edits are to the two system prompts in `src/routes/api/chat.ts` (`SYSTEM_PROMPT` and `QA_SYSTEM_PROMPT`). The shared grounding, refusal, self-check and off-topic rules are factored into one constant that both prompts include, so the two modes cannot drift apart. No change to the guide content, the document generation format, the four `===DOC:===` outputs, or any UI.

After the change I will run the assistant through probe questions ("do I have a good case?", "how much is my claim worth?", "should I accept $5,000?", "what's the law on defamation?") and confirm each is deflected rather than answered.
