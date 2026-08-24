import { createFileRoute } from "@tanstack/react-router";
import { LetterWizard, type FieldDef } from "@/components/app/LetterWizard";
import { generateLetterOfDemand } from "@/lib/docx-generator";
import { generateLetterOfDemandPdf } from "@/lib/pdf-generator";
import {
  blocksToText,
  buildLetterOfDemand,
  type LetterOfDemandData,
} from "@/lib/letter-templates";
import demandImg from "@/assets/letter-of-demand.png";

export const Route = createFileRoute("/_authenticated/letter/demand")({
  head: () => ({
    meta: [
      { title: "Letter of Demand — PIoneer" },
      {
        name: "description",
        content:
          "Draft a Letter of Demand to enforce a settlement agreement, using the official template from the Personal Injury Guide.",
      },
      {
        property: "og:title",
        content: "Letter of Demand — PIoneer",
      },
      {
        property: "og:description",
        content:
          "Draft a Letter of Demand to enforce a settlement agreement, using the official template from the Personal Injury Guide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LetterOfDemandPage,
});

const description = (
  <>
    <p>
      A Letter of Demand is used when the other party has not paid what they agreed to pay under a signed Settlement Agreement. It formally demands the outstanding sum within a set deadline before you take enforcement action.
    </p>
    <p>
      Disclaimer: This template is provided for general guidance only and does not constitute legal advice. Always adapt it to your specific circumstances and seek professional advice if needed.
    </p>
  </>
);

const isInstalment = (d: Record<string, string>) => d["paymentType"] === "Instalments";

const fields: FieldDef[] = [
  { name: "senderName", label: "Your name", type: "text", required: true },
  { name: "senderAddress", label: "Your address", type: "textarea", required: true, rows: 3 },
  { name: "senderPhone", label: "Your contact number", type: "text", required: true },
  { name: "senderEmail", label: "Your email", type: "text", required: true },
  { name: "date", label: "Date of letter", type: "text", required: true, placeholder: "e.g. 1 July 2025" },
  { name: "recipientName", label: "Name of other party", type: "text", required: true },
  { name: "recipientAddress", label: "Address of other party", type: "textarea", required: true, rows: 3 },
  { name: "agreementDate", label: "Date the Settlement Agreement was signed", type: "text", required: true, placeholder: "e.g. 1 February 2025" },
  {
    name: "paymentType",
    label: "How was the settlement amount to be paid?",
    type: "select",
    required: true,
    options: ["Lump sum", "Instalments"],
    help: "The guide provides different clauses 2 and 3 for each option.",
  },
  { name: "clauseNumber", label: "Clause number setting out the payment", type: "text", required: true, placeholder: "e.g. 2" },
  { name: "settlementAmount", label: "Settlement amount", type: "text", required: true, placeholder: "e.g. $12,000" },
  {
    name: "dueDate",
    label: "Date payment was due",
    type: "text",
    required: true,
    placeholder: "e.g. 1 March 2025",
    showIf: (d) => !isInstalment(d),
  },
  {
    name: "instalmentAmount",
    label: "Instalment amount",
    type: "text",
    required: true,
    placeholder: "e.g. $2,000",
    showIf: isInstalment,
  },
  {
    name: "frequency",
    label: "Frequency of payment",
    type: "text",
    required: true,
    placeholder: "e.g. month",
    showIf: isInstalment,
  },
  {
    name: "accelerationClause",
    label: "Clause saying the full amount falls due if an instalment is missed (optional)",
    type: "text",
    placeholder: "e.g. 3",
    help: "Leave blank if the agreement has no such clause.",
    showIf: isInstalment,
  },
  {
    name: "missedInstalments",
    label: "Unpaid instalments",
    type: "textarea",
    rows: 6,
    required: true,
    help: "One instalment per line, in the format: due date | amount",
    placeholder: "1 March 2025 | 2,000\n1 April 2025 | 2,000",
    showIf: isInstalment,
  },
  {
    name: "outstandingAmount",
    label: "Outstanding amount demanded",
    type: "text",
    required: true,
    placeholder: "e.g. $12,000",
    help: "If the full amount is due immediately, use the total settlement amount. Otherwise use the total of the overdue instalments.",
  },
  { name: "timeframe", label: "Payment deadline", type: "text", required: true, placeholder: "e.g. seven (7) days" },
];

const toData = (d: Record<string, string>): LetterOfDemandData => ({
  senderName: d["senderName"] || "",
  senderAddress: d["senderAddress"] || "",
  senderPhone: d["senderPhone"] || "",
  senderEmail: d["senderEmail"] || "",
  date: d["date"] || "",
  recipientName: d["recipientName"] || "",
  recipientAddress: d["recipientAddress"] || "",
  agreementDate: d["agreementDate"] || "",
  paymentType: d["paymentType"] || "Lump sum",
  clauseNumber: d["clauseNumber"] || "",
  settlementAmount: d["settlementAmount"] || "",
  dueDate: d["dueDate"] || "",
  instalmentAmount: d["instalmentAmount"] || "",
  frequency: d["frequency"] || "",
  accelerationClause: d["accelerationClause"] || "",
  missedInstalments: d["missedInstalments"] || "",
  outstandingAmount: d["outstandingAmount"] || "",
  timeframe: d["timeframe"] || "",
});

function LetterOfDemandPage() {
  return (
    <LetterWizard
      progressKey="letter:demand"
      documentKey="documents:demand"
      documentTitle="Letter of Demand"
      title="Letter of Demand"
      description={description}
      image={demandImg}
      imageAlt="Illustration of a formal demand letter"
      fields={fields}
      requireTerms
      buildPreview={(d) => blocksToText(buildLetterOfDemand(toData(d)))}
      onGenerate={async (d, format) => {
        if (format === "pdf") await generateLetterOfDemandPdf(toData(d));
        else await generateLetterOfDemand(toData(d));
      }}
    />
  );
}
