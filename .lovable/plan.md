# Personal Injury Claim Helper — Interactive Guide App

An interactive app to help you understand more about your Personal Injury claims. Built from the attached Legal Aid Bureau guide, it opens with a main menu of four choices, and a persistent "Main menu" button lets the user restart at any time.

## Main menu

Four illustrated cards:

- a. I have questions about my Personal Injury claim
- b. I want to craft a Letter of Claim
- c. I want to craft a Settlement Agreement
- d. I want to draft a Letter of Demand

A clear disclaimer banner appears on every screen: this is general information from the Legal Aid Bureau guide, not legal advice; consult a lawyer if in doubt. A first-visit disclaimer notice must be acknowledged before entering.

## (a) FAQ assistant

- Landing view shows the guide's common questions as clickable chips (do I need a lawyer, what if they deny responsibility, offer too low, accepting without a lawyer, do I need a signed Settlement Agreement, how long do I have to claim, what evidence do I need, what if I was partly at fault, how do I enforce a settlement, etc.), plus a free-text box.
- Answers are strictly guide-only. The assistant is given the full guide text and instructed to answer only from it; when the guide doesn't cover something, it says so and points to the guide's legal-clinic list and the advice to see a lawyer.
- Streaming answers with markdown, cited by guide section (e.g. "Step 3E – Limitation Periods").
- One conversation, not saved: refreshing or returning to the menu starts fresh. A "New question" reset is available.
- Every answer ends with the not-legal-advice reminder.

## (b)–(d) Letter builders

Each builder opens with a 2–3 line description of what the letter is and when to use it, then runs a guided, one-question-at-a-time wizard with progress, back/next, and plain-language help text.

- **Letter of Claim** — your details, other party's details, accident date/place, what happened, injuries, treatment and medical costs, lost income, other expenses, total claimed, response deadline, attached documents.
- **Settlement Agreement** — Party A/B details, accident reference, settlement sum, lump sum or instalments (with an instalment schedule table), payment method, full-and-final-settlement and confidentiality choices, witness details.
- **Letter of Demand** — settlement agreement date and clause, lump sum or instalment version, unpaid instalment table, outstanding amount, payment deadline.

Wording follows the exact templates in Annex A of the guide. Free-text narrative answers (accident description, injuries) are tidied into clear formal prose by AI while every fixed clause stays verbatim from the template.

Output: an on-screen preview of the finished letter with copy-to-clipboard, plus a **Download as Word (.docx)** button producing a properly formatted, editable document with headings, numbered clauses, payment tables and signature blocks. Answers are kept in memory only for the current session.

## Look and feel

Warm, reassuring, non-corporate design — deep navy and a warm amber accent, generous whitespace, rounded cards, soft illustration-style hero and per-section imagery (generated, on-theme: accident scene, documents/evidence, handshake settlement, signing). Fully responsive, accessible contrast, subtle motion.

## Technical notes

- TanStack Start. Routes: `/` (menu), `/faq`, `/letter/claim`, `/letter/settlement`, `/letter/demand`.
- Guide text extracted from the PDF once and stored as a server-side content module; the FAQ route (`src/routes/api/chat.ts`) streams from Lovable AI (`google/gemini-3.6-flash`) with the guide as grounded context and a strict "answer only from this document" system prompt. Chat UI built with AI Elements.
- Letter narrative polishing runs through a server function with a tight, template-preserving prompt.
- `.docx` generated in the browser with the `docx` library and downloaded directly — no backend or storage needed.
- No database, no login, no persistence.
