import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

const DEFAULT_FONT = "Arial";
const DEFAULT_SIZE = 22; // 11pt

function createRun(text: string, opts?: { bold?: boolean; underline?: boolean }) {
  return new TextRun({
    text,
    font: DEFAULT_FONT,
    size: DEFAULT_SIZE,
    bold: opts?.bold,
    underline: opts?.underline ? { type: "single" } : undefined,
  });
}

function createP(text: string, opts?: { bold?: boolean; spacing?: object }) {
  return new Paragraph({
    children: [createRun(text, { bold: opts?.bold ?? false })],
    spacing: opts?.spacing ?? { after: 200 },
  });
}

export type LetterOfClaimData = {
  senderName: string;
  senderAddress: string;
  senderContact: string;
  recipientName: string;
  recipientAddress: string;
  recipientInsurer?: string;
  date: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  injuries: string;
  medicalTreatment: string;
  specialDamages: string;
  generalDamages?: string;
  totalDemand: string;
  deadlineDays: string;
};

export async function generateLetterOfClaim(data: LetterOfClaimData) {
  const children: Paragraph[] = [
    new Paragraph({
      children: [createRun(data.senderName, { bold: true })],
      spacing: { after: 0 },
    }),
    ...data.senderAddress.split("\n").map((line) =>
      new Paragraph({
        children: [createRun(line)],
        spacing: { after: 0 },
      })
    ),
    new Paragraph({
      children: [createRun(data.senderContact)],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [createRun(data.date)],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [createRun(data.recipientName, { bold: true })],
      spacing: { after: 0 },
    }),
    ...data.recipientAddress.split("\n").map((line) =>
      new Paragraph({
        children: [createRun(line)],
        spacing: { after: 0 },
      })
    ),
    ...(data.recipientInsurer
      ? [createP(`Insurer (if known): ${data.recipientInsurer}`)]
      : []),
    new Paragraph({
      children: [createRun("LETTER OF CLAIM", { bold: true, underline: true })],
      spacing: { before: 300, after: 200 },
    }),
    createP(`Date of incident: ${data.incidentDate}`),
    createP(`Location of incident: ${data.incidentLocation}`),
    new Paragraph({
      children: [createRun("Circumstances of the incident", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    ...data.incidentDescription
      .split("\n")
      .filter(Boolean)
      .map((para) => createP(para)),
    new Paragraph({
      children: [createRun("Injuries sustained", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    ...data.injuries.split("\n").filter(Boolean).map((para) => createP(para)),
    new Paragraph({
      children: [createRun("Medical treatment", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    ...data.medicalTreatment.split("\n").filter(Boolean).map((para) => createP(para)),
    new Paragraph({
      children: [createRun("Losses and expenses", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    ...data.specialDamages.split("\n").filter(Boolean).map((para) => createP(para)),
    ...(data.generalDamages
      ? [
          new Paragraph({
            children: [createRun("General damages", { bold: true })],
            spacing: { before: 200, after: 100 },
          }),
          ...data.generalDamages
            .split("\n")
            .filter(Boolean)
            .map((para) => createP(para)),
        ]
      : []),
    new Paragraph({
      children: [createRun("Proposed settlement", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    createP(
      `In the circumstances, I propose to settle my claim for the sum of ${data.totalDemand}.`
    ),
    createP(
      `Please respond within ${data.deadlineDays} days from the date of this letter, failing which I reserve the right to commence legal proceedings without further notice.`
    ),
    createP("Yours faithfully,"),
    new Paragraph({ children: [createRun("")], spacing: { after: 400 } }),
    createP(data.senderName),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Letter_of_Claim_${data.senderName.replace(/\s+/g, "_")}.docx`);
}

export type SettlementAgreementData = {
  claimantName: string;
  claimantAddress: string;
  claimantIc?: string;
  defendantName: string;
  defendantAddress: string;
  defendantIc?: string;
  date: string;
  incidentDate: string;
  incidentDescription: string;
  settlementAmount: string;
  paymentMethod: string;
  paymentDeadline: string;
  releaseScope: string;
  confidentiality: string;
  governingLaw: string;
};

export async function generateSettlementAgreement(data: SettlementAgreementData) {
  const children: Paragraph[] = [
    new Paragraph({
      children: [createRun("SETTLEMENT AGREEMENT", { bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    createP(`Date: ${data.date}`),
    new Paragraph({
      children: [createRun("Parties", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    createP(`1. ${data.claimantName} of ${data.claimantAddress} ("the Claimant")${data.claimantIc ? `, NRIC/FIN: ${data.claimantIc}` : ""}.`),
    createP(`2. ${data.defendantName} of ${data.defendantAddress} ("the Defendant")${data.defendantIc ? `, NRIC/FIN: ${data.defendantIc}` : ""}.`),
    new Paragraph({
      children: [createRun("Background", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    createP(
      `The Claimant alleges that on ${data.incidentDate}, the Defendant caused personal injury to the Claimant as a result of the following incident:`
    ),
    ...data.incidentDescription
      .split("\n")
      .filter(Boolean)
      .map((para) => createP(para)),
    new Paragraph({
      children: [createRun("Terms of settlement", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    createP(
      `1. The Defendant shall pay the Claimant the sum of ${data.settlementAmount} in full and final settlement of all claims arising from the incident.`
    ),
    createP(`2. Payment shall be made by ${data.paymentMethod} on or before ${data.paymentDeadline}.`),
    createP(
      `3. Upon receipt of the settlement amount, the Claimant releases the Defendant from ${data.releaseScope}.`
    ),
    createP(`4. ${data.confidentiality}`),
    createP(
      `5. This agreement shall be governed by and construed in accordance with the laws of ${data.governingLaw}.`
    ),
    new Paragraph({
      children: [createRun("Signatures", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    createP("Claimant: _________________________"),
    createP(`Name: ${data.claimantName}`),
    createP("Date: _________________________"),
    createP("Defendant: _________________________"),
    createP(`Name: ${data.defendantName}`),
    createP("Date: _________________________"),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Settlement_Agreement_${data.claimantName.replace(/\s+/g, "_")}.docx`);
}

export type LetterOfDemandData = {
  senderName: string;
  senderAddress: string;
  senderContact: string;
  recipientName: string;
  recipientAddress: string;
  date: string;
  demandAmount: string;
  basisOfClaim: string;
  incidentDate: string;
  deadlineDays: string;
  consequences: string;
};

export async function generateLetterOfDemand(data: LetterOfDemandData) {
  const children: Paragraph[] = [
    new Paragraph({
      children: [createRun(data.senderName, { bold: true })],
      spacing: { after: 0 },
    }),
    ...data.senderAddress.split("\n").map((line) =>
      new Paragraph({
        children: [createRun(line)],
        spacing: { after: 0 },
      })
    ),
    new Paragraph({
      children: [createRun(data.senderContact)],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [createRun(data.date)],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [createRun(data.recipientName, { bold: true })],
      spacing: { after: 0 },
    }),
    ...data.recipientAddress.split("\n").map((line) =>
      new Paragraph({
        children: [createRun(line)],
        spacing: { after: 0 },
      })
    ),
    new Paragraph({
      children: [createRun("LETTER OF DEMAND", { bold: true, underline: true })],
      spacing: { before: 300, after: 200 },
    }),
    createP(`Re: Demand for payment of ${data.demandAmount}`),
    createP(`Date of incident: ${data.incidentDate}`),
    new Paragraph({
      children: [createRun("Basis of claim", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    ...data.basisOfClaim.split("\n").filter(Boolean).map((para) => createP(para)),
    new Paragraph({
      children: [createRun("Demand", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    createP(
      `I hereby demand payment of ${data.demandAmount} within ${data.deadlineDays} days from the date of this letter.`
    ),
    new Paragraph({
      children: [createRun("Consequences of non-payment", { bold: true })],
      spacing: { before: 200, after: 100 },
    }),
    ...data.consequences.split("\n").filter(Boolean).map((para) => createP(para)),
    createP(
      `Please make payment to the undersigned within the stated timeframe. If you dispute this claim, please respond in writing within ${data.deadlineDays} days stating the grounds of your dispute.`
    ),
    createP("Yours faithfully,"),
    new Paragraph({ children: [createRun("")], spacing: { after: 400 } }),
    createP(data.senderName),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Letter_of_Demand_${data.senderName.replace(/\s+/g, "_")}.docx`);
}
