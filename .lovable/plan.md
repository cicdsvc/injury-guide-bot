# Export the AI prompts to a Word document

## What you will get

One Word file in your Files: **`PIoneer - AI Prompts.docx`**. It holds every prompt the assistant uses, copied word for word from the app, so you can read, share or mark it up without touching any code.

## What goes inside

1. **Front page** — the app name, the date of export, and a short "how the prompt is assembled" note:
   - where the prompts live in the app,
   - which AI model is used,
   - the order the blocks are stacked in (date note, then guardrails, then either the guided-mode or question-mode instructions, then the guide reference material),
   - that the guide reference material is roughly 98,000 characters long and is **not** reproduced in this export (it can be added as a separate file if you want it).
2. **Section 1 — Date note** (added to every message, both modes).
3. **Section 2 — Guardrails** (shared by both modes, highest priority).
4. **Section 3 — Guided mode instructions** (step-by-step guide, including the four-document rules, the Letter of Claim template, the evidence table categories and the "Type 'Yes' to generate the documents" script).
5. **Section 4 — Question mode instructions** (used for free-typed questions and "Get negotiation tips").
6. **Closing note** — the Settlement Agreement and Letter of Demand screens do not use AI; they are fixed forms.

## How it is presented

- A cover heading and numbered section headings for quick navigation.
- Each prompt block printed exactly as written, in a monospace font on a lightly shaded panel, so nothing is reworded and line breaks are preserved.
- A page break before every section, and a footer showing the page number.
- Checked after generation by turning every page into an image and looking for clipped text, missing lines or broken formatting before it is handed over.

## Technical details

- Source: the prompt constants in `src/routes/api/chat.ts` (the only file in the app that sends anything to the AI model).
- Built with the `docx` library; explicit A4 page size, 1-inch margins, `Courier New` runs for the verbatim blocks, `ShadingType.CLEAR` for the panel fill.
- Output written to `/mnt/documents/PIoneer - AI Prompts.docx`, then converted to PDF and rendered page by page for a visual check.
- No app code is changed by this export.
