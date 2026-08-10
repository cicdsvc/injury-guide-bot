import { createFileRoute } from "@tanstack/react-router";
import { LetterWizard, type FieldDef } from "@/components/app/LetterWizard";
import { generateSettlementAgreement } from "@/lib/docx-generator";
import {
  blocksToText,
  buildSettlementAgreement,
  type SettlementAgreementData,
} from "@/lib/letter-templates";
import settlementImg from "@/assets/settlement-agreement.png";

export const Route = createFileRoute("/letter/settlement")({
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

const description =
  "A Private Settlement Agreement records the compensation agreed between you and the other party so the claim is resolved without going to court. Once signed, you cannot make any further claim against the other party for the same accident. This builder follows the template in Annex A of the guide.";

const isInstalment = (d: Record<string, string>) => d["paymentType"] === "Instalments";

const fields: FieldDef[] = [
  { name: "day", label: "Day of the month the agreement is entered", type: "text", required: true, placeholder: "e.g. 15th" },
  { name: "month", label: "Month", type: "text", required: true, placeholder: "e.g. February" },
  { name: "year", label: "Year", type: "text", required: true, placeholder: "e.g. 2025" },
  { name: "partyAName", label: "Party A — name (the person claiming)", type: "text", required: true },
  { name: "partyAId", label: "Party A — NRIC / UEN", type: "text", required: true },
  { name: "partyAAddress", label: "Party A — registered address", type: "textarea", required: true, rows: 3 },
  { name: "partyBName", label: "Party B — name (the person paying)", type: "text", required: true },
  { name: "partyBId", label: "Party B — NRIC / UEN", type: "text", required: true },
  { name: "partyBAddress", label: "Party B — registered address", type: "textarea", required: true, rows: 3 },
  { name: "incidentDate", label: "Date of the accident", type: "text", required: true, placeholder: "e.g. 1 November 2024" },
  { name: "incidentLocation", label: "Location of the accident", type: "text", required: true },
  {
    name: "incidentFacts",
    label: "Brief facts of what happened",
    type: "textarea",
    required: true,
    rows: 4,
    help: 'Completes: "an incident occurred at [Location] where ..."',
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
  partyAId: d["partyAId"] || "",
  partyAAddress: d["partyAAddress"] || "",
  partyBName: d["partyBName"] || "",
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
      title="Private Settlement Agreement"
      description={description}
      image={settlementImg}
      imageAlt="Illustration of two parties signing a settlement agreement"
      fields={fields}
      buildPreview={(d) => blocksToText(buildSettlementAgreement(toData(d)))}
      onGenerate={async (d) => {
        await generateSettlementAgreement(toData(d));
      }}
    />
  );
}
