# Fix the Private Settlement Agreement format and the "brief facts" prompt

## 1. Match the Sample Settlement Agreement layout

The wording already follows the template, but the layout on screen and in the Word/PDF downloads does not read like the sample in the guide. Rework the document layout so it mirrors the sample:

- Centred title, then a blank line, then the "entered on this __ day of [Month] [Year]" line.
- Proper spacing around `BETWEEN:` / `AND` / `WHEREAS:` / `IT IS HEREBY AGREED THAT:` headings, with the (1) and (2) party blocks indented and hanging-aligned like the sample.
- Party identifier adapts to the party type: `NRIC No.` for an individual, `UEN:` for a company (the sample uses "Greenacre Shopping Centre Pte Ltd (UEN: 202412345B)").
- Recitals A/B/C as a hanging-indent lettered list, matching the sample's indentation.
- "Payment Plan", "Entire Agreement", "Jurisdiction & Governing Law", "Legal Advice" as indented bold sub-headings sitting directly above their numbered clause, with the clause numbers running 1-6 continuously.
- Instalment table rendered as a real two-column table with the DUE DATE / AMOUNT (S$) header row, header in caps, amounts column aligned like the sample, and consistent spacing above and below.
- Signature block: "SIGNED By:" then the two signature rules with "Party A" / "In the presence of: [witness]" beneath, repeated for Party B, with the correct vertical gaps for signing.

Applies to all three outputs so they look identical: the on-screen preview, the `.docx` download, and the `.pdf` download.

## 2. Guide the "brief facts of what happened" answer

Recital A in the sample reads: "On 1 November 2024, an incident occurred at Green Acre Shopping Centre at 100 Greenacre Road, Singapore 456789 where **Party A tripped over a 5cm-high unmarked step at the main entrance and fell**."

Change that wizard step so the user writes only the bolded fragment, in that brief style:

- Label: "In one sentence, what happened?"
- Help text explaining it completes the sentence "On [date], an incident occurred at [location] where ___", so it should start with "Party A ..." (or their own name), be one short factual sentence, and leave out injuries, blame and amounts (those are covered by the rest of the agreement).
- Placeholder using the sample: "Party A tripped over a 5cm-high unmarked step at the main entrance and fell".
- Show a live preview of the completed Recital A sentence under the field so the user sees exactly how their words will read.
- Light input guard: trim a trailing full stop and a leading "On ..."/"I was ..." style opener is left to the user, with a short hint if the answer runs long (over roughly 300 characters) suggesting they shorten it.

## Technical notes

- Layout work lives in `src/lib/letter-templates.ts` (`buildSettlementAgreement` block list) plus the renderers `src/lib/docx-generator.ts` and `src/lib/pdf-generator.ts` (spacing, hanging indents, table borders/alignment).
- May add a `bordered`/`align` option to the `table` block and a tighter spacing option on `line` blocks so headings hug their clause.
- Field changes in `src/routes/_authenticated/letter/settlement.tsx`; the inline sentence preview uses the existing `LetterWizard` help/preview mechanism.
- No database or auth changes; saved documents keep working as they do now.
