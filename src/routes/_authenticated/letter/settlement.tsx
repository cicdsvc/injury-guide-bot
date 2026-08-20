import { createFileRoute } from "@tanstack/react-router";
import { LetterWizard, type FieldDef } from "@/components/app/LetterWizard";
import { generateSettlementAgreement } from "@/lib/docx-generator";
import { generateSettlementAgreementPdf } from "@/lib/pdf-generator";
import {
  blocksToText,
  buildSettlementAgreement,
  settlementRecitalA,
  type SettlementAgreementData,
} from "@/lib/letter-templates";
import settlementImg from "@/assets/settlement-agreement.png";

export const Route = createFileRoute("/_authenticated/letter/settlement")({
  head: () => ({
    meta: [
      { title: "Settlement Agreement — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "Draft a Private Settlement Agreement using the official template from the Personal Injury Guide.",
      },
      {
        property: "og:title",
        content: "Settlement Agreement — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "Draft a Private Settlement Agreement using the official template from the Personal Injury Guide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettlementAgreementPage,
});

const description = (
  <>
    <p>
      A Private Settlement Agreement records the compensation agreed between you and the other party so the claim is resolved without going to court. Once signed, you cannot make any further claim against the other party for the same accident.
    </p>
    <p>
      Disclaimer: This template is provided for general guidance only and does not constitute legal advice. Always adapt it to your specific circumstances and seek professional advice if needed.
    </p>
  </>
);

const isInstalment = (d: Record<string, string>) => d["paymentType"] === "Instalments";

const fields: FieldDef[] = [
  { name: "day", label: "Day of the month the agreement is entered", type: "text", required: true, placeholder: "e.g. 15th" },
  { name: "month", label: "Month", type: "text", required: true, placeholder: "e.g. February" },
  { name: "year", label: "Year", type: "text", required: true, placeholder: "e.g. 2025" },
  { name: "partyAName", label: "Party A — name (the person claiming)", type: "text", required: true },
  {
    name: "partyAIdType",
    label: "Party A — is this a person or a company?",
    type: "select",
    required: true,
    options: ["Individual (NRIC)", "Company (UEN)"],
  },
  { name: "partyAId", label: "Party A — NRIC / UEN number", type: "text", required: true, placeholder: "e.g. S1234567A" },
  { name: "partyAAddress", label: "Party A — registered address", type: "textarea", required: true, rows: 3 },
  { name: "partyBName", label: "Party B — name (the person paying)", type: "text", required: true },
  {
    name: "partyBIdType",
    label: "Party B — is this a person or a company?",
    type: "select",
    required: true,
    options: ["Individual (NRIC)", "Company (UEN)"],
  },
  { name: "partyBId", label: "Party B — NRIC / UEN number", type: "text", required: true, placeholder: "e.g. 202412345B" },
  { name: "partyBAddress", label: "Party B — registered address", type: "textarea", required: true, rows: 3 },
  { name: "incidentDate", label: "Date of the accident", type: "text", required: true, placeholder: "e.g. 1 November 2024" },
  {
    name: "incidentLocation",
    label: "Location of the accident",
    type: "text",
    required: true,
    placeholder: "e.g. Green Acre Shopping Centre at 100 Greenacre Road, Singapore 456789",
  },
  {
    name: "incidentFacts",
    label: "In one sentence, what happened?",
    type: "textarea",
    required: true,
    rows: 3,
    placeholder: "Party A tripped over a 5cm-high unmarked step at the main entrance and fell",
    help: 'This completes the sentence "On [date], an incident occurred at [location] where ___". Start with "Party A ...", keep it to one short factual sentence, and leave out your injuries, blame and amounts — those are covered elsewhere in the agreement.',
    hint: (d) => {
      const v = (d["incidentFacts"] ?? "").trim();
      if (!v) return null;
      return (
        <div className="space-y-1">
          <p className="rounded-md bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Recital A will read: </span>
            {settlementRecitalA({
              incidentDate: d["incidentDate"] ?? "",
              incidentLocation: d["incidentLocation"] ?? "",
              incidentFacts: v,
            })}
          </p>
          {v.length > 300 && (
            <p className="text-xs text-amber-600">
              That is quite long — try to shorten it to one brief sentence, like the example.
            </p>
          )}
        </div>
      );
    },
  },
  { name: "settlementSum", label: "Settlement Sum", type: "text", required: true, placeholder: "e.g. $12,000" },
  {
    name: "paymentType",
    label: "How will the Settlement Sum be paid?",
    type: "select",
    required: true,
    options: ["Lump sum", "Instalments"],
    help: "The guide provides different clauses 2 and 3 for each option.",
  },
  { name: "bankName", label: "Party A's bank", type: "text", required: true, placeholder: "e.g. DBS Bank" },
  { name: "bankAccount", label: "Party A's bank account number", type: "text", required: true, placeholder: "e.g. 123-456789-0" },
  {
    name: "lumpSumDueDate",
    label: "Payment due date",
    type: "text",
    required: true,
    placeholder: "e.g. 1 March 2025",
    showIf: (d) => !isInstalment(d),
  },
  {
    name: "instalments",
    label: "Instalment schedule",
    type: "textarea",
    rows: 6,
    required: true,
    help: "One instalment per line, in the format: due date | amount",
    placeholder: "1 March 2025 | 2,000\n1 April 2025 | 2,000",
    showIf: isInstalment,
  },
  { name: "witnessA", label: "Witness for Party A", type: "text", required: true, placeholder: "e.g. Mr Peter Tan (S3456789D)" },
  { name: "witnessB", label: "Witness for Party B", type: "text", required: true, placeholder: "e.g. Ms Jane Lim (S2345678C)" },
];

const toData = (d: Record<string, string>): SettlementAgreementData => ({
  day: d["day"] || "",
  month: d["month"] || "",
  year: d["year"] || "",
  partyAName: d["partyAName"] || "",
  partyAIdType: d["partyAIdType"] || "Individual (NRIC)",
  partyAId: d["partyAId"] || "",
  partyAAddress: d["partyAAddress"] || "",
  partyBName: d["partyBName"] || "",
  partyBIdType: d["partyBIdType"] || "Individual (NRIC)",
  partyBId: d["partyBId"] || "",
  partyBAddress: d["partyBAddress"] || "",
  incidentDate: d["incidentDate"] || "",
  incidentLocation: d["incidentLocation"] || "",
  incidentFacts: d["incidentFacts"] || "",
  settlementSum: d["settlementSum"] || "",
  paymentType: d["paymentType"] || "Lump sum",
  bankName: d["bankName"] || "",
  bankAccount: d["bankAccount"] || "",
  lumpSumDueDate: d["lumpSumDueDate"] || "",
  instalments: d["instalments"] || "",
  witnessA: d["witnessA"] || "",
  witnessB: d["witnessB"] || "",
});

function SettlementAgreementPage() {
  return (
    <LetterWizard
      progressKey="letter:settlement"
      documentKey="documents:settlement"
      documentTitle="Settlement Agreement"
      title="Private Settlement Agreement"
      description={description}
      image={settlementImg}
      imageAlt="Illustration of two parties signing a settlement agreement"
      fields={fields}
      requireTerms
      buildPreview={(d) => blocksToText(buildSettlementAgreement(toData(d)))}
      onGenerate={async (d, format) => {
        if (format === "pdf") await generateSettlementAgreementPdf(toData(d));
        else await generateSettlementAgreement(toData(d));
      }}
    />
  );
}
