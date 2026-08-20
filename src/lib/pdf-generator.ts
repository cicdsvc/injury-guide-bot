import type { Block } from "@/lib/letter-templates";
import {
  buildLetterOfClaim,
  buildSettlementAgreement,
  buildLetterOfDemand,
  type LetterOfClaimData,
  type SettlementAgreementData,
  type LetterOfDemandData,
} from "@/lib/letter-templates";

const MARGIN = 20; // mm
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_H = 5.2;

async function downloadPdf(blocks: Block[], filename: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const writeText = (
    text: string,
    opts: {
      bold?: boolean;
      italic?: boolean;
      center?: boolean;
      indent?: number;
      hanging?: number;
      after?: number;
      underline?: boolean;
    } = {},
  ) => {
    const style = opts.bold && opts.italic ? "bolditalic" : opts.bold ? "bold" : opts.italic ? "italic" : "normal";
    doc.setFont("helvetica", style);
    const left = MARGIN + (opts.indent ?? 0);
    const width = CONTENT_W - (opts.indent ?? 0);
    const lines = doc.splitTextToSize(text || " ", width) as string[];
    for (const line of lines) {
      ensureSpace(LINE_H);
      if (opts.center) {
        doc.text(line, PAGE_W / 2, y, { align: "center" });
      } else {
        doc.text(line, left, y);
      }
      if (opts.underline) {
        const w = doc.getTextWidth(line);
        const x = opts.center ? PAGE_W / 2 - w / 2 : left;
        doc.line(x, y + 1, x + w, y + 1);
      }
      y += LINE_H;
    }
    y += opts.after ?? 2;
  };

  for (const b of blocks) {
    switch (b.t) {
      case "spacer":
        y += 3;
        break;
      case "line":
        writeText(b.text, {
          bold: !!b.bold,
          italic: !!b.italic,
          underline: !!b.underline,
          center: !!b.center,
          indent: (b.indent ?? 0) * 6,
          after: b.tight ? 0 : 2,
        });
        break;
      case "twoCol": {
        ensureSpace(LINE_H);
        doc.setFont("helvetica", "normal");
        doc.text(b.left, MARGIN, y);
        doc.setFont("helvetica", "bold");
        doc.text(b.right, PAGE_W - MARGIN, y, { align: "right" });
        y += LINE_H;
        break;
      }
      case "num": {
        const indent = (b.indent ?? 0) * 6;
        doc.setFont("helvetica", "normal");
        const numW = Math.max(doc.getTextWidth(b.n) + 3, 8);
        ensureSpace(LINE_H);
        doc.text(b.n, MARGIN + indent, y);
        const startY = y;
        const lines = doc.splitTextToSize(b.text, CONTENT_W - indent - numW) as string[];
        let ly = startY;
        for (const line of lines) {
          if (ly + LINE_H > PAGE_H - MARGIN) {
            doc.addPage();
            ly = MARGIN;
          }
          doc.text(line, MARGIN + indent + numW, ly);
          ly += LINE_H;
        }
        y = ly + (b.tight ? 0 : 2);
        break;
      }
      case "table": {
        const indent = (b.indent ?? 0) * 6;
        const tableW = CONTENT_W - indent;
        const x0 = MARGIN + indent;
        const colW = tableW * 0.6;
        const rows = [b.header, ...b.rows];
        const padX = 2;
        const padY = 1.6;
        rows.forEach((r, i) => {
          doc.setFont("helvetica", i === 0 ? "bold" : "normal");
          const l = doc.splitTextToSize(r[0], colW - padX * 2) as string[];
          const rr = doc.splitTextToSize(r[1], tableW - colW - padX * 2) as string[];
          const h = Math.max(l.length, rr.length) * LINE_H + padY * 2;
          ensureSpace(h);
          if (b.bordered) {
            doc.setDrawColor(150);
            doc.rect(x0, y - LINE_H + padY, colW, h);
            doc.rect(x0 + colW, y - LINE_H + padY, tableW - colW, h);
          }
          l.forEach((line, j) => doc.text(line, x0 + padX, y + j * LINE_H));
          rr.forEach((line, j) => {
            if (b.alignRight) {
              doc.text(line, x0 + tableW - padX, y + j * LINE_H, { align: "right" });
            } else {
              doc.text(line, x0 + colW + padX, y + j * LINE_H);
            }
          });
          y += h;
        });
        y += 3;
        break;
      }
      case "sig": {
        ensureSpace(LINE_H * 3);
        doc.setFont("helvetica", "normal");
        doc.text("__________________________", MARGIN, y);
        doc.text("___________________________", MARGIN + CONTENT_W / 2, y);
        y += LINE_H;
        doc.text(b.left, MARGIN, y);
        doc.text(b.right, MARGIN + CONTENT_W / 2, y);
        y += LINE_H + 2;
        break;
      }
    }
  }

  doc.save(filename);
}

const safe = (s: string) => (s || "Document").replace(/[^\w]+/g, "_");

export async function generateLetterOfClaimPdf(data: LetterOfClaimData) {
  await downloadPdf(buildLetterOfClaim(data), `Letter_of_Claim_${safe(data.senderName)}.pdf`);
}

export async function generateSettlementAgreementPdf(data: SettlementAgreementData) {
  await downloadPdf(
    buildSettlementAgreement(data),
    `Private_Settlement_Agreement_${safe(data.partyAName)}.pdf`,
  );
}

export async function generateLetterOfDemandPdf(data: LetterOfDemandData) {
  await downloadPdf(buildLetterOfDemand(data), `Letter_of_Demand_${safe(data.senderName)}.pdf`);
}
