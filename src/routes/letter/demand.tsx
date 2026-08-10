import { createFileRoute } from "@tanstack/react-router";
import { LetterWizard } from "@/components/app/LetterWizard";
import { generateLetterOfDemand } from "@/lib/docx-generator";
import demandImg from "@/assets/letter-of-demand.png";

export const Route = createFileRoute("/letter/demand")({
  head: () => ({
    meta: [
      { title: "Letter of Demand — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "Draft a Letter of Demand to formally request payment or action before legal proceedings.",
      },
      {
        property: "og:title",
        content: "Letter of Demand — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "Draft a Letter of Demand to formally request payment or action before legal proceedings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LetterOfDemandPage,
});

const description =
  "A Letter of Demand is a formal written request asking the other party to pay a specific sum or take a specific action within a set timeframe. It explains the basis of the claim and warns of the legal consequences if the demand is not met.";

const fields = [
  { name: "senderName", label: "Your full name", type: "text" as const, required: true },
  { name: "senderAddress", label: "Your address", type: "textarea" as const, required: true, rows: 3 },
  { name: "senderContact", label: "Your contact number / email", type: "text" as const, required: true },
  { name: "recipientName", label: "Recipient name", type: "text" as const, required: true },
  { name: "recipientAddress", label: "Recipient address", type: "textarea" as const, required: true, rows: 3 },
  { name: "date", label: "Date of letter", type: "text" as const, required: true, placeholder: "e.g. 15 May 2026" },
  { name: "demandAmount", label: "Amount demanded", type: "text" as const, required: true, placeholder: "e.g. SGD 10,000" },
  { name: "incidentDate", label: "Date of incident", type: "text" as const, required: true },
  { name: "basisOfClaim", label: "Basis of your claim", type: "textarea" as const, required: true, rows: 5 },
  { name: "deadlineDays", label: "Payment deadline (days)", type: "text" as const, required: true, placeholder: "e.g. 7" },
  { name: "consequences", label: "Consequences of non-payment", type: "textarea" as const, required: true, rows: 3, placeholder: "e.g. I reserve the right to commence legal proceedings to recover the amount due." },
];

function LetterOfDemandPage() {
  return (
    <LetterWizard
      title="Letter of Demand"
      description={description}
      image={demandImg}
      imageAlt="Illustration of a formal demand letter"
      fields={fields}
      onGenerate={async (data) => {
        await generateLetterOfDemand({
          senderName: data.senderName,
          senderAddress: data.senderAddress,
          senderContact: data.senderContact,
          recipientName: data.recipientName,
          recipientAddress: data.recipientAddress,
          date: data.date,
          demandAmount: data.demandAmount,
          basisOfClaim: data.basisOfClaim,
          incidentDate: data.incidentDate,
          deadlineDays: data.deadlineDays,
          consequences: data.consequences,
        });
      }}
    />
  );
}
