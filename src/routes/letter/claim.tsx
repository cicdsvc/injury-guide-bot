import { createFileRoute } from "@tanstack/react-router";
import { LetterWizard, type FieldDef } from "@/components/app/LetterWizard";
import { generateLetterOfClaim } from "@/lib/docx-generator";
import { blocksToText, buildLetterOfClaim, type LetterOfClaimData } from "@/lib/letter-templates";
import claimImg from "@/assets/letter-of-claim.png";

export const Route = createFileRoute("/letter/claim")({
  head: () => ({
    meta: [
      { title: "Letter of Claim — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "Draft a Letter of Claim using the official template from the Personal Injury Guide.",
      },
      {
        property: "og:title",
        content: "Letter of Claim — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "Draft a Letter of Claim using the official template from the Personal Injury Guide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LetterOfClaimPage,
});

const description = (
  <>
    <p>
      A Letter of Claim is the first formal step in making your personal injury claim. It tells the other party how the accident happened, what injuries and losses you suffered, and how much you are claiming.
    </p>
    <p>
      Disclaimer: This template is provided for general guidance only and does not constitute legal advice. Always adapt it to your specific circumstances and seek professional advice if needed.
    </p>
  </>
);

const fields: FieldDef[] = [
  { name: "senderName", label: "Your name", type: "text", required: true },
  { name: "senderAddress", label: "Your address", type: "textarea", required: true, rows: 3, help: "One line per line of your address." },
  { name: "senderPhone", label: "Your contact number", type: "text", required: true },
  { name: "senderEmail", label: "Your email", type: "text", required: true },
  { name: "date", label: "Date of letter", type: "text", required: true, placeholder: "e.g. 1 January 2025" },
  { name: "recipientName", label: "Name of other party", type: "text", required: true },
  { name: "recipientAddress", label: "Address of other party", type: "textarea", required: true, rows: 3 },
  { name: "sendingMode", label: "Mode of sending letter", type: "text", placeholder: "e.g. By Registered Post", help: "Keep proof of sending, e.g. a read receipt or registered post slip." },
  { name: "incidentSummary", label: "Describe the incident (short)", type: "text", required: true, placeholder: "e.g. Slip and Fall at Greenacre Shopping Centre" },
  { name: "incidentDate", label: "Date of the accident", type: "text", required: true, placeholder: "e.g. 1 November 2024" },
  { name: "incidentAddress", label: "Address where the accident happened", type: "text", required: true },
  {
    name: "accidentDetails",
    label: "Details of the accident (paragraph 2)",
    type: "textarea",
    required: true,
    rows: 5,
    help: "What happened to cause the accident, what happened after (medical treatment, hospitalisation) and any other relevant matters.",
  },
  {
    name: "evidence",
    label: "Evidence you have (paragraph 3)",
    type: "textarea",
    required: true,
    rows: 4,
    help: "e.g. photographs, witnesses, police reports.",
  },
  {
    name: "injuries",
    label: "Injuries sustained",
    type: "textarea",
    required: true,
    rows: 4,
    help: "One injury per line — they become (a), (b), (c) in the letter.",
    placeholder: "Fracture of my right little finger\nLeft knee contusion (bruising)",
  },
  {
    name: "medicalLeaveImpact",
    label: "Medical leave and impact on work (paragraph 5)",
    type: "textarea",
    required: true,
    rows: 4,
    help: "How long you were on medical leave, your occupation, and the medical records confirming this.",
  },
  {
    name: "negligence",
    label: "Why the accident is the other party's fault",
    type: "textarea",
    required: true,
    rows: 3,
    help: 'Completes the sentence "I believe you have been negligent as you had failed to: ..."',
  },
  {
    name: "generalDamages",
    label: "General damages (pain and suffering)",
    type: "textarea",
    required: true,
    rows: 4,
    help: "One item per line — they become i., ii., iii.",
    placeholder: "Fracture of right little finger: $2,500\nLeft knee contusion: $2,000",
  },
  {
    name: "specialDamages",
    label: "Special damages (expenses and loss of earnings)",
    type: "textarea",
    required: true,
    rows: 4,
    help: "One item per line.",
    placeholder: "Loss of earnings (Monthly salary of $1,500 x 2 months): $3,000\nHospital treatment: $2,500",
  },
  { name: "totalClaim", label: "Total claim", type: "text", required: true, placeholder: "e.g. $12,000" },
  {
    name: "supportingDocuments",
    label: "Supporting documents enclosed",
    type: "textarea",
    required: true,
    rows: 4,
    help: "One document per line — they become (a), (b), (c).",
    placeholder: "Photographs of the accident site\nPolice report filed on 6 November 2024",
  },
  { name: "responseDeadline", label: "14-day response deadline (date)", type: "text", required: true, placeholder: "e.g. 15 January 2025" },
  { name: "contactDetails", label: "Contact details for replies", type: "text", required: true, placeholder: "e.g. the address/email/phone number above" },
];

const toData = (d: Record<string, string>): LetterOfClaimData => ({
  senderName: d["senderName"] || "",
  senderAddress: d["senderAddress"] || "",
  senderPhone: d["senderPhone"] || "",
  senderEmail: d["senderEmail"] || "",
  date: d["date"] || "",
  recipientName: d["recipientName"] || "",
  recipientAddress: d["recipientAddress"] || "",
  sendingMode: d["sendingMode"] || "",
  incidentSummary: d["incidentSummary"] || "",
  incidentDate: d["incidentDate"] || "",
  incidentAddress: d["incidentAddress"] || "",
  accidentDetails: d["accidentDetails"] || "",
  evidence: d["evidence"] || "",
  injuries: d["injuries"] || "",
  medicalLeaveImpact: d["medicalLeaveImpact"] || "",
  negligence: d["negligence"] || "",
  generalDamages: d["generalDamages"] || "",
  specialDamages: d["specialDamages"] || "",
  totalClaim: d["totalClaim"] || "",
  supportingDocuments: d["supportingDocuments"] || "",
  responseDeadline: d["responseDeadline"] || "",
  contactDetails: d["contactDetails"] || "",
});

function LetterOfClaimPage() {
  return (
    <LetterWizard
      title="Letter of Claim"
      description={description}
      image={claimImg}
      imageAlt="Illustration of a formal letter being prepared for a personal injury claim"
      fields={fields}
      buildPreview={(d) => blocksToText(buildLetterOfClaim(toData(d)))}
      onGenerate={async (d) => {
        await generateLetterOfClaim(toData(d));
      }}
    />
  );
}
