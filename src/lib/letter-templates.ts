// Letter/agreement content builders that follow the templates in
// Annex A of the Personal Injury Guide (Legal Aid Bureau) verbatim.

export type Block =
  | {
      t: "line";
      text: string;
      bold?: boolean;
      underline?: boolean;
      center?: boolean;
      italic?: boolean;
      indent?: number; // in "characters" ~ converted for docx
      tight?: boolean;
    }
  | { t: "twoCol"; left: string; right: string; bold?: boolean }
  | { t: "num"; n: string; text: string; indent?: number; tight?: boolean }
  | { t: "spacer" }
  | {
      t: "table";
      header: [string, string];
      rows: [string, string][];
      bordered?: boolean;
      alignRight?: boolean;
      indent?: number;
    }
  | { t: "sig"; left: string; right: string };

const lines = (v: string | undefined) =>
  (v ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const letters = ["(a)", "(b)", "(c)", "(d)", "(e)", "(f)", "(g)", "(h)", "(i)", "(j)"];
const romans = ["i.", "ii.", "iii.", "iv.", "v.", "vi.", "vii.", "viii.", "ix.", "x."];

const ph = (v: string | undefined, fallback: string) =>
  v && v.trim() ? v.trim() : fallback;

/* ------------------------------------------------------------------ */
/* Letter of Claim                                                     */
/* ------------------------------------------------------------------ */

export type LetterOfClaimData = {
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  date: string;
  recipientName: string;
  recipientAddress: string;
  sendingMode: string;
  incidentSummary: string;
  incidentDate: string;
  incidentAddress: string;
  accidentDetails: string;
  evidence: string;
  injuries: string;
  medicalLeaveImpact: string;
  negligence: string;
  generalDamages: string;
  specialDamages: string;
  totalClaim: string;
  supportingDocuments: string;
  responseDeadline: string;
  contactDetails: string;
};

export function buildLetterOfClaim(d: LetterOfClaimData): Block[] {
  const b: Block[] = [];

  b.push({ t: "line", text: ph(d.senderName, "[Your Name]"), tight: true });
  for (const l of lines(d.senderAddress).length ? lines(d.senderAddress) : ["[Your Address]"])
    b.push({ t: "line", text: l, tight: true });
  b.push({ t: "line", text: ph(d.senderPhone, "[Your Contact Number]"), tight: true });
  b.push({ t: "line", text: ph(d.senderEmail, "[Your Email]"), tight: true });
  b.push({ t: "spacer" });
  b.push({ t: "line", text: ph(d.date, "[Date]") });
  b.push({ t: "spacer" });

  const rAddr = lines(d.recipientAddress).length
    ? lines(d.recipientAddress)
    : ["[Address of other party]"];
  b.push({
    t: "twoCol",
    left: ph(d.recipientName, "[Name of other party]"),
    right: "FOR IMMEDIATE ATTENTION",
  });
  rAddr.forEach((l, i) => {
    b.push({
      t: "twoCol",
      left: l,
      right: i === 0 ? ph(d.sendingMode, "[Mode Of Sending Letter]") : "",
    });
  });
  b.push({ t: "spacer" });

  b.push({ t: "line", text: "Dear Sir/Madam," });
  b.push({
    t: "line",
    text: `Claim for Injury from ${ph(d.incidentSummary, "[Describe Incident]")} on ${ph(d.incidentDate, "[Date]")}`,
    bold: true,
    underline: true,
  });
  b.push({
    t: "num",
    n: "1.",
    text: `I am writing to seek compensation for injuries I suffered from an accident that occurred on ${ph(d.incidentDate, "[Date]")} at ${ph(d.incidentAddress, "[Address]")}.`,
  });

  b.push({ t: "line", text: "Details of the Accident", bold: true });
  b.push({ t: "num", n: "2.", text: ph(d.accidentDetails, "[State the details of the accident.]") });
  b.push({ t: "num", n: "3.", text: ph(d.evidence, "[State any evidence you have to support your case.]") });

  b.push({ t: "line", text: "Injuries and Impact", bold: true });
  b.push({ t: "num", n: "4.", text: "Due to the accident, I sustained the following injuries:" });
  const inj = lines(d.injuries).length ? lines(d.injuries) : ["[List the injuries resulting from the accident, as stated in your medical report(s)]"];
  inj.forEach((l, i) => b.push({ t: "num", n: letters[i] ?? "(x)", text: l, indent: 2 }));
  b.push({
    t: "num",
    n: "5.",
    text: ph(
      d.medicalLeaveImpact,
      "[State whether you were on medical leave, and for how long, and whether this affected your ability to work.]",
    ),
  });

  b.push({ t: "line", text: "Claim for Compensation", bold: true });
  b.push({
    t: "num",
    n: "6.",
    text: `I believe you have been negligent as you had failed to: ${ph(d.negligence, "[State why you think the accident is the other party's fault]")}`,
  });
  b.push({ t: "num", n: "7.", text: "I am claiming the following amounts:" });
  b.push({ t: "num", n: "(a)", text: "General Damages (Pain and Suffering)", indent: 2 });
  const gd = lines(d.generalDamages).length ? lines(d.generalDamages) : ["[State the amount claimed for pain and suffering]"];
  gd.forEach((l, i) => b.push({ t: "num", n: romans[i] ?? "-", text: l, indent: 3 }));
  b.push({ t: "num", n: "(b)", text: "Special Damages", indent: 2 });
  const sd = lines(d.specialDamages).length ? lines(d.specialDamages) : ["[List your out-of-pocket expenses and loss of earnings]"];
  sd.forEach((l, i) => b.push({ t: "num", n: romans[i] ?? "-", text: l, indent: 3 }));
  b.push({ t: "line", text: `Total Claim: ${ph(d.totalClaim, "[State amount]")}`, bold: true, indent: 2 });

  b.push({ t: "line", text: "Supporting Documents", bold: true });
  b.push({ t: "num", n: "8.", text: "I have enclosed copies of the following:" });
  const docs = lines(d.supportingDocuments).length ? lines(d.supportingDocuments) : ["[Attach the documents you referred to above]"];
  docs.forEach((l, i) => b.push({ t: "num", n: letters[i] ?? "(x)", text: l, indent: 2 }));

  b.push({ t: "line", text: "Next Steps", bold: true });
  b.push({
    t: "num",
    n: "9.",
    text: `If you have insurance that covers such incidents, please forward this letter and all enclosed documents to your insurer immediately. Please acknowledge receipt of this letter within 14 days and inform me whether you accept my claim. If I do not receive a response by ${ph(d.responseDeadline, "[14-day deadline]")}, I may take legal action against you, without communicating with you any further.`,
  });
  b.push({
    t: "num",
    n: "10.",
    text: `If you have any questions, please contact me at ${ph(d.contactDetails, "[state your contact details]")}. I hope to resolve this matter amicably and look forward to your prompt response.`,
  });

  b.push({ t: "spacer" });
  b.push({ t: "line", text: "Yours sincerely," });
  b.push({ t: "spacer" });
  b.push({ t: "line", text: "[Your Signature]", tight: true });
  b.push({ t: "line", text: ph(d.senderName, "[Your Name]") });

  return b;
}

/* ------------------------------------------------------------------ */
/* Private Settlement Agreement                                        */
/* ------------------------------------------------------------------ */

export type SettlementAgreementData = {
  day: string;
  month: string;
  year: string;
  partyAName: string;
  partyAIdType?: string; // "Individual (NRIC)" | "Company (UEN)"
  partyAId: string;
  partyAAddress: string;
  partyBName: string;
  partyBIdType?: string;
  partyBId: string;
  partyBAddress: string;
  incidentDate: string;
  incidentLocation: string;
  incidentFacts: string;
  settlementSum: string;
  paymentType: string; // "Lump sum" | "Instalments"
  bankName: string;
  bankAccount: string;
  lumpSumDueDate: string;
  instalments: string; // "due date | amount" per line
  witnessA: string;
  witnessB: string;
};

export function buildSettlementAgreement(d: SettlementAgreementData): Block[] {
  const b: Block[] = [];
  const instalment = d.paymentType === "Instalments";

  b.push({ t: "line", text: "PRIVATE SETTLEMENT AGREEMENT", bold: true, center: true });
  b.push({ t: "spacer" });
  b.push({
    t: "line",
    text: `THIS SETTLEMENT AGREEMENT ("Agreement") is entered on this ${ph(d.day, "__")} day of ${ph(d.month, "[Month]")} ${ph(d.year, "[Year]")}`,
  });
  b.push({ t: "spacer" });
  b.push({ t: "line", text: "BETWEEN:", bold: true });
  b.push({
    t: "num",
    n: "(1)",
    indent: 1,
    text: `${ph(d.partyAName, "[Name of Party A]")} (${idLabel(d.partyAIdType)} ${ph(d.partyAId, "[XXXXXXXXX]")}) of ${ph(d.partyAAddress.replace(/\n/g, ", "), "[registered address]")} ("Party A");`,
  });
  b.push({ t: "line", text: "AND", bold: true });
  b.push({
    t: "num",
    n: "(2)",
    indent: 1,
    text: `${ph(d.partyBName, "[Name of Party B]")} (${idLabel(d.partyBIdType)} ${ph(d.partyBId, "[XXXXXXXXX]")}) of ${ph(d.partyBAddress.replace(/\n/g, ", "), "[registered address]")} ("Party B");`,
  });
  b.push({
    t: "line",
    text: '(Together, both individuals are called the "Parties," and each of them is a "Party").',
    indent: 1,
  });
  b.push({ t: "spacer" });

  b.push({ t: "line", text: "WHEREAS:", bold: true });
  b.push({
    t: "num",
    n: "A.",
    indent: 1,
    text: settlementRecitalA(d),
  });
  b.push({
    t: "num",
    n: "B.",
    text: "Both Parties understand and accept that this is a legal agreement that both Parties must follow, and it can be enforced in court.",
  });
  b.push({
    t: "num",
    n: "C.",
    text: "Subject to the terms of this Agreement, both Parties agree that this Agreement settles everything between them related to the Accident, and that they will not make any further claims against each other for any losses that may have been caused by it.",
  });

  b.push({ t: "line", text: "IT IS HEREBY AGREED THAT:", bold: true });
  b.push({
    t: "num",
    n: "1.",
    text: `To fully and finally settle any claims Party A may have against Party B because of the Accident, Party B agrees to pay Party A ${ph(d.settlementSum, "$[amount]")} (the "Settlement Sum").`,
  });

  b.push({ t: "line", text: "Payment Plan", bold: true, indent: 1 });
  if (instalment) {
    b.push({
      t: "num",
      n: "2.",
      text: `Party B will pay the Settlement Sum by way of bank transfer to Party A's bank account ${ph(`${d.bankName} ${d.bankAccount}`.trim(), "[name of bank and bank account number]")} in the following instalments:`,
    });
    b.push({ t: "table", header: ["DUE DATE", "AMOUNT (S$)"], rows: parseRows(d.instalments) });
    b.push({
      t: "num",
      n: "3.",
      text: "If Party B misses any instalment payment, the full remaining amount will be due right away, and Party A can go ahead to take legal action to collect that full amount.",
    });
  } else {
    b.push({
      t: "num",
      n: "2.",
      text: `Party B will pay the Settlement Sum by ${ph(d.lumpSumDueDate, "[date]")} through a bank transfer to Party A's account at ${ph(d.bankName, "[name of bank]")}, account number ${ph(d.bankAccount, "[bank account number]")}.`,
    });
    b.push({
      t: "num",
      n: "3.",
      text: "If Party B does not pay the full amount by the due date, the full remaining amount will be due right away, and Party A can go ahead to take legal action to collect that full amount.",
    });
  }

  b.push({ t: "line", text: "Entire Agreement", bold: true, indent: 1 });
  b.push({
    t: "num",
    n: "4.",
    text: "This Agreement replaces all previous statements, promises, agreements, or understandings — whether made in writing or spoken — made by the Parties or their representatives. The rights and responsibilities of the Parties in relation to the Accident are governed by the terms in this Agreement only – meaning that the Parties can only refer to the contents of this Agreement in relation to the Accident, and not any other document, text, recording or communication.",
  });
  b.push({ t: "line", text: "Jurisdiction & Governing Law", bold: true, indent: 1 });
  b.push({
    t: "num",
    n: "5.",
    text: "This Agreement is governed by Singapore law. If there is any legal dispute or action related to this Agreement, it will be handled under Singapore law in the courts of Singapore.",
  });
  b.push({ t: "line", text: "Legal Advice", bold: true, indent: 1 });
  b.push({
    t: "num",
    n: "6.",
    text: "Each Party confirms that they have read and understand this Agreement and its consequences. Each Party also confirms that they have had the chance to get legal advice.",
  });

  b.push({ t: "spacer" });
  b.push({
    t: "line",
    text: "The Parties have signed this Settlement Agreement, in the presence of witnesses, to confirm their agreement to the terms.",
    bold: true,
  });
  b.push({ t: "spacer" });
  b.push({ t: "line", text: "SIGNED By:" });
  b.push({ t: "spacer" });
  b.push({
    t: "sig",
    left: "Party A",
    right: `In the presence of: ${ph(d.witnessA, "[Name of witness]")}`,
  });
  b.push({ t: "spacer" });
  b.push({ t: "line", text: "SIGNED By:" });
  b.push({ t: "spacer" });
  b.push({
    t: "sig",
    left: "Party B",
    right: `In the presence of: ${ph(d.witnessB, "[Name of witness]")}`,
  });

  return b;
}

function parseRows(v: string | undefined): [string, string][] {
  const rows = lines(v).map((l) => {
    const parts = l.split(/\s*[|\t]\s*/);
    return [(parts[0] ?? "").trim(), (parts[1] ?? "").trim()] as [string, string];
  });
  return rows.length
    ? rows
    : ([
        ["[Due Date 1]", "[Amount 1]"],
        ["[Due Date 2]", "[Amount 2]"],
      ] as [string, string][]);
}

/* ------------------------------------------------------------------ */
/* Letter of Demand (to enforce the Settlement Agreement)              */
/* ------------------------------------------------------------------ */

export type LetterOfDemandData = {
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  date: string;
  recipientName: string;
  recipientAddress: string;
  agreementDate: string;
  paymentType: string; // "Lump sum" | "Instalments"
  clauseNumber: string;
  settlementAmount: string;
  dueDate: string;
  instalmentAmount: string;
  frequency: string;
  accelerationClause: string;
  missedInstalments: string;
  outstandingAmount: string;
  timeframe: string;
};

export function buildLetterOfDemand(d: LetterOfDemandData): Block[] {
  const b: Block[] = [];
  const instalment = d.paymentType === "Instalments";

  b.push({ t: "line", text: ph(d.senderName, "[Your Name]"), tight: true });
  for (const l of lines(d.senderAddress).length ? lines(d.senderAddress) : ["[Your Address]"])
    b.push({ t: "line", text: l, tight: true });
  b.push({ t: "line", text: ph(d.senderPhone, "[Your Contact Number]"), tight: true });
  b.push({ t: "line", text: ph(d.senderEmail, "[Your Email]"), tight: true });
  b.push({ t: "spacer" });
  b.push({ t: "line", text: ph(d.date, "[Date]") });
  b.push({ t: "spacer" });

  b.push({
    t: "twoCol",
    left: ph(d.recipientName, "[Name of other party]"),
    right: "FOR IMMEDIATE ATTENTION",
  });
  for (const l of lines(d.recipientAddress).length
    ? lines(d.recipientAddress)
    : ["[Address of other party]"])
    b.push({ t: "twoCol", left: l, right: "" });
  b.push({ t: "spacer" });

  b.push({ t: "line", text: "Dear Sir/Madam," });
  b.push({ t: "line", text: "Outstanding Payment Under Settlement Agreement", bold: true, underline: true });
  b.push({
    t: "num",
    n: "1.",
    text: `I am writing regarding the settlement agreement we signed on ${ph(d.agreementDate, "[insert date]")} (the "Settlement Agreement"). I attach a copy of the Settlement Agreement to this letter.`,
  });

  if (instalment) {
    b.push({
      t: "num",
      n: "2.",
      text:
        `According to clause ${ph(d.clauseNumber, "[insert clause number]")} of the Settlement Agreement, you agreed to pay me ${ph(d.settlementAmount, "[insert settlement amount]")} in instalments of ${ph(d.instalmentAmount, "[insert instalment amount]")} every ${ph(d.frequency, "[insert frequency of payment]")} as full settlement of my personal injury claim against you.` +
        (d.accelerationClause?.trim()
          ? ` The Settlement Agreement also states in clause ${d.accelerationClause.trim()} that if you miss any instalment payment, the entire remaining amount becomes due immediately.`
          : ""),
    });
    b.push({ t: "num", n: "3.", text: "I have not received payment for the following instalment(s):" });
    b.push({ t: "table", header: ["DUE DATE", "AMOUNT (S$)"], rows: parseRows(d.missedInstalments) });
  } else {
    b.push({
      t: "num",
      n: "2.",
      text: `According to clause ${ph(d.clauseNumber, "[insert clause number]")} of the Settlement Agreement, you agreed to pay me ${ph(d.settlementAmount, "[insert settlement amount]")} by ${ph(d.dueDate, "[insert due date]")} as full settlement of my personal injury claim against you.`,
    });
    b.push({ t: "num", n: "3.", text: "I have not yet received this payment." });
  }

  b.push({
    t: "num",
    n: "4.",
    text: `I am requesting that you pay the outstanding amount of ${ph(d.outstandingAmount, "[insert amount]")} in full within ${ph(d.timeframe, "[insert timeframe, e.g. seven (7) days]")} from the date of this letter.`,
  });
  b.push({
    t: "num",
    n: "5.",
    text: "If I do not receive payment within this timeframe, I will take steps to enforce our settlement agreement and recover the money owed to me.",
  });
  b.push({ t: "num", n: "6.", text: "I reserve all my rights under the agreement." });

  b.push({ t: "spacer" });
  b.push({ t: "line", text: "Yours sincerely," });
  b.push({ t: "spacer" });
  b.push({ t: "line", text: "[Your Signature]", tight: true });
  b.push({ t: "line", text: ph(d.senderName, "[Your Name]") });

  return b;
}

/* ------------------------------------------------------------------ */
/* Plain-text rendering (for the on-screen preview / copy)             */
/* ------------------------------------------------------------------ */

export function blocksToText(blocks: Block[]): string {
  const out: string[] = [];
  for (const bl of blocks) {
    switch (bl.t) {
      case "spacer":
        out.push("");
        break;
      case "line":
        out.push(" ".repeat((bl.indent ?? 0) * 4) + bl.text);
        if (!bl.tight) out.push("");
        break;
      case "twoCol":
        out.push(bl.right ? `${bl.left}\t\t${bl.right}` : bl.left);
        break;
      case "num":
        out.push(`${" ".repeat((bl.indent ?? 0) * 4)}${bl.n}\t${bl.text}`);
        out.push("");
        break;
      case "table":
        out.push(`${bl.header[0].padEnd(34)}${bl.header[1]}`);
        for (const r of bl.rows) out.push(`${r[0].padEnd(34)}${r[1]}`);
        out.push("");
        break;
      case "sig":
        out.push("__________________________\t___________________________");
        out.push(`${bl.left.padEnd(28)}${bl.right}`);
        out.push("");
        break;
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
