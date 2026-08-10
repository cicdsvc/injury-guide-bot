import { createFileRoute } from "@tanstack/react-router";
import { LetterWizard } from "@/components/app/LetterWizard";
import { generateSettlementAgreement } from "@/lib/docx-generator";
import settlementImg from "@/assets/settlement-agreement.png";

export const Route = createFileRoute("/letter/settlement")({
  head: () => ({
    meta: [
      { title: "Settlement Agreement — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "Draft a Settlement Agreement to record the terms of settlement for your personal injury claim.",
      },
      {
        property: "og:title",
        content: "Settlement Agreement — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "Draft a Settlement Agreement to record the terms of settlement for your personal injury claim.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettlementAgreementPage,
});

const description =
  "A Settlement Agreement records the agreed terms between you and the other party to resolve a personal injury dispute. It typically covers the settlement sum, payment arrangements, release of future claims, confidentiality, and governing law.";

const fields = [
  { name: "claimantName", label: "Claimant full name", type: "text" as const, required: true },
  { name: "claimantAddress", label: "Claimant address", type: "textarea" as const, required: true, rows: 3 },
  { name: "claimantIc", label: "Claimant NRIC/FIN (optional)", type: "text" as const },
  { name: "defendantName", label: "Defendant full name", type: "text" as const, required: true },
  { name: "defendantAddress", label: "Defendant address", type: "textarea" as const, required: true, rows: 3 },
  { name: "defendantIc", label: "Defendant NRIC/FIN (optional)", type: "text" as const },
  { name: "date", label: "Date of agreement", type: "text" as const, required: true, placeholder: "e.g. 15 May 2026" },
  { name: "incidentDate", label: "Date of incident", type: "text" as const, required: true },
  { name: "incidentDescription", label: "Brief description of the incident", type: "textarea" as const, required: true, rows: 5 },
  { name: "settlementAmount", label: "Settlement amount", type: "text" as const, required: true, placeholder: "e.g. SGD 25,000" },
  { name: "paymentMethod", label: "Payment method", type: "text" as const, required: true, placeholder: "e.g. bank transfer to DBS account ending 1234" },
  { name: "paymentDeadline", label: "Payment deadline", type: "text" as const, required: true, placeholder: "e.g. 30 days from signing" },
  { name: "releaseScope", label: "Scope of release", type: "textarea" as const, required: true, rows: 3, placeholder: "e.g. all claims, demands and causes of action arising out of the incident" },
  { name: "confidentiality", label: "Confidentiality term", type: "textarea" as const, required: true, rows: 3, placeholder: "e.g. The terms of this settlement are confidential." },
  { name: "governingLaw", label: "Governing law", type: "text" as const, required: true, placeholder: "e.g. the Republic of Singapore" },
];

function SettlementAgreementPage() {
  return (
    <LetterWizard
      title="Settlement Agreement"
      description={description}
      image={settlementImg}
      imageAlt="Illustration of two parties signing a settlement agreement"
      fields={fields}
      onGenerate={async (data) => {
        await generateSettlementAgreement({
          claimantName: data["claimantName"] || "",
          claimantAddress: data["claimantAddress"] || "",
          claimantIc: data["claimantIc"],
          defendantName: data["defendantName"] || "",
          defendantAddress: data["defendantAddress"] || "",
          defendantIc: data["defendantIc"],
          date: data["date"] || "",
          incidentDate: data["incidentDate"] || "",
          incidentDescription: data["incidentDescription"] || "",
          settlementAmount: data["settlementAmount"] || "",
          paymentMethod: data["paymentMethod"] || "",
          paymentDeadline: data["paymentDeadline"] || "",
          releaseScope: data["releaseScope"] || "",
          confidentiality: data["confidentiality"] || "",
          governingLaw: data["governingLaw"] || "",
        });
      }}
    />
  );
}
