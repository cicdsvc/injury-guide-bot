import { createFileRoute } from "@tanstack/react-router";
import { LetterWizard } from "@/components/app/LetterWizard";
import { generateLetterOfClaim } from "@/lib/docx-generator";
import claimImg from "@/assets/letter-of-claim.png";

export const Route = createFileRoute("/letter/claim")({
  head: () => ({
    meta: [
      { title: "Letter of Claim — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "Draft a Letter of Claim for your personal injury matter.",
      },
      {
        property: "og:title",
        content: "Letter of Claim — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "Draft a Letter of Claim for your personal injury matter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LetterOfClaimPage,
});

const description =
  "A Letter of Claim formally notifies the other party (or their insurer) that you are making a personal injury claim. It sets out how the incident happened, the injuries you suffered, the losses you incurred, and the amount you are asking for.";

const fields = [
  { name: "senderName", label: "Your full name", type: "text" as const, required: true },
  { name: "senderAddress", label: "Your address", type: "textarea" as const, required: true, rows: 3 },
  { name: "senderContact", label: "Your contact number / email", type: "text" as const, required: true },
  { name: "recipientName", label: "Recipient name (e.g. Defendant or insurer)", type: "text" as const, required: true },
  { name: "recipientAddress", label: "Recipient address", type: "textarea" as const, required: true, rows: 3 },
  { name: "recipientInsurer", label: "Insurer (if known)", type: "text" as const },
  { name: "date", label: "Date of letter", type: "text" as const, required: true, placeholder: "e.g. 15 May 2026" },
  { name: "incidentDate", label: "Date of incident", type: "text" as const, required: true },
  { name: "incidentLocation", label: "Location of incident", type: "text" as const, required: true },
  { name: "incidentDescription", label: "Describe how the incident happened", type: "textarea" as const, required: true, rows: 5 },
  { name: "injuries", label: "Injuries sustained", type: "textarea" as const, required: true, rows: 4 },
  { name: "medicalTreatment", label: "Medical treatment received", type: "textarea" as const, required: true, rows: 4 },
  { name: "specialDamages", label: "Special damages (out-of-pocket expenses, e.g. medical bills, transport, lost earnings)", type: "textarea" as const, required: true, rows: 4 },
  { name: "generalDamages", label: "General damages (pain, suffering, loss of amenity — optional)", type: "textarea" as const, rows: 3 },
  { name: "totalDemand", label: "Total amount you are claiming", type: "text" as const, required: true, placeholder: "e.g. SGD 15,000" },
  { name: "deadlineDays", label: "Response deadline (days)", type: "text" as const, required: true, placeholder: "e.g. 14" },
];

function LetterOfClaimPage() {
  return (
    <LetterWizard
      title="Letter of Claim"
      description={description}
      image={claimImg}
      imageAlt="Illustration of a formal letter being prepared for a personal injury claim"
      fields={fields}
      onGenerate={async (data) => {
        await generateLetterOfClaim({
          senderName: data["senderName"] || "",
          senderAddress: data["senderAddress"] || "",
          senderContact: data["senderContact"] || "",
          recipientName: data["recipientName"] || "",
          recipientAddress: data["recipientAddress"] || "",
          recipientInsurer: data["recipientInsurer"] || "",
          date: data["date"] || "",
          incidentDate: data["incidentDate"] || "",
          incidentLocation: data["incidentLocation"] || "",
          incidentDescription: data["incidentDescription"] || "",
          injuries: data["injuries"] || "",
          medicalTreatment: data["medicalTreatment"] || "",
          specialDamages: data["specialDamages"] || "",
          generalDamages: data["generalDamages"] || "",
          totalDemand: data["totalDemand"] || "",
          deadlineDays: data["deadlineDays"] || "",
        });
      }}
    />
  );
}
