import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TabStopPosition,
  TabStopType,
  TextRun,
  WidthType,
  BorderStyle,
} from "docx";
import FileSaver from "file-saver";
import type { Block } from "@/lib/letter-templates";
import {
  buildLetterOfClaim,
  buildSettlementAgreement,
  buildLetterOfDemand,
  type LetterOfClaimData,
  type SettlementAgreementData,
  type LetterOfDemandData,
} from "@/lib/letter-templates";

const { saveAs } = FileSaver;

const FONT = "Arial";
const SIZE = 22; // 11pt
const INDENT_UNIT = 360; // 0.25"

function run(text: string, opts?: { bold?: boolean; underline?: boolean; italics?: boolean }) {
  return new TextRun({
    text,
    font: FONT,
    size: SIZE,
    ...(opts?.bold ? { bold: true } : {}),
    ...(opts?.italics ? { italics: true } : {}),
    ...(opts?.underline ? { underline: { type: "single" } } : {}),
  });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const solidBorder = { style: BorderStyle.SINGLE, size: 1, color: "999999" };

function cell(
  text: string,
  width: number,
  bold?: boolean,
  opts?: { bordered?: boolean; right?: boolean },
) {
  const b = opts?.bordered ? solidBorder : noBorder;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: { top: b, bottom: b, left: b, right: b },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [run(text, bold ? { bold: true } : undefined)],
        alignment: opts?.right ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { after: 0 },
      }),
    ],
  });
}

function blocksToDocx(blocks: Block[]): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  for (const b of blocks) {
    switch (b.t) {
      case "spacer":
        out.push(new Paragraph({ children: [run("")], spacing: { after: 120 } }));
        break;
      case "line":
        out.push(
          new Paragraph({
            children: [
              run(b.text, {
                ...(b.bold ? { bold: true } : {}),
                ...(b.underline ? { underline: true } : {}),
                ...(b.italic ? { italics: true } : {}),
              }),
            ],
            alignment: b.center ? AlignmentType.CENTER : AlignmentType.LEFT,
            ...(b.indent ? { indent: { left: b.indent * INDENT_UNIT } } : {}),
            spacing: { after: b.tight ? 0 : 200, before: b.bold && !b.center ? 160 : 0 },
          }),
        );
        break;
      case "twoCol":
        out.push(
          new Paragraph({
            children: [run(b.left), run("\t"), run(b.right, { bold: true })],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { after: 0 },
          }),
        );
        break;
      case "num": {
        const left = (b.indent ?? 0) * INDENT_UNIT + 720;
        out.push(
          new Paragraph({
            children: [run(b.n), run("\t"), run(b.text)],
            indent: { left, hanging: 720 },
            tabStops: [{ type: TabStopType.LEFT, position: left }],
            spacing: { after: b.tight ? 0 : 160 },
          }),
        );
        break;
      }
      case "table": {
        const indent = (b.indent ?? 0) * INDENT_UNIT;
        const total = 9360 - indent;
        const c1 = Math.round(total * 0.6);
        const c2 = total - c1;
        const opt = { bordered: !!b.bordered };
        const optR = { bordered: !!b.bordered, right: !!b.alignRight };
        out.push(
          new Table({
            width: { size: total, type: WidthType.DXA },
            columnWidths: [c1, c2],
            indent: { size: indent, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  cell(b.header[0], c1, true, opt),
                  cell(b.header[1], c2, true, optR),
                ],
              }),
              ...b.rows.map(
                (r) =>
                  new TableRow({
                    children: [cell(r[0], c1, false, opt), cell(r[1], c2, false, optR)],
                  }),
              ),
            ],
          }),
        );
        out.push(new Paragraph({ children: [run("")], spacing: { after: 160 } }));
        break;
      }
      case "sig":
        out.push(
          new Paragraph({
            children: [run("__________________________"), run("\t"), run("___________________________")],
            tabStops: [{ type: TabStopType.LEFT, position: 5040 }],
            spacing: { after: 0 },
          }),
        );
        out.push(
          new Paragraph({
            children: [run(b.left), run("\t"), run(b.right)],
            tabStops: [{ type: TabStopType.LEFT, position: 5040 }],
            spacing: { after: 200 },
          }),
        );
        break;
    }
  }
  return out;
}

async function download(blocks: Block[], filename: string) {
  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: blocksToDocx(blocks),
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

const safe = (s: string) => (s || "Document").replace(/[^\w]+/g, "_");

export type { LetterOfClaimData, SettlementAgreementData, LetterOfDemandData };

export async function generateLetterOfClaim(data: LetterOfClaimData) {
  await download(buildLetterOfClaim(data), `Letter_of_Claim_${safe(data.senderName)}.docx`);
}

export async function generateSettlementAgreement(data: SettlementAgreementData) {
  await download(
    buildSettlementAgreement(data),
    `Private_Settlement_Agreement_${safe(data.partyAName)}.docx`,
  );
}

export async function generateLetterOfDemand(data: LetterOfDemandData) {
  await download(buildLetterOfDemand(data), `Letter_of_Demand_${safe(data.senderName)}.docx`);
}
