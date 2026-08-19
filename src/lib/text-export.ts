// Generic exporters for free-form text (letters, summaries, evidence tables)
// produced by the chat assistant. Markdown pipe tables are rendered as real
// tables in both .docx and .pdf output.

const safeName = (s: string) => (s || "Document").replace(/[^\w]+/g, "_").slice(0, 60);

const clean = (s: string) => s.replace(/[*_#`]/g, "").trim();

type Block =
  | { type: "text"; lines: string[] }
  | { type: "table"; rows: string[][] };

const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isSeparator = (line: string) => /^\s*\|[\s:|-]+\|\s*$/.test(line);

function parseRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => clean(cell));
}

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split("\n");
  let buffer: string[] = [];

  const flushText = () => {
    if (buffer.length) {
      blocks.push({ type: "text", lines: buffer });
      buffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (isTableRow(line) && !isSeparator(line)) {
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i] ?? "")) {
        const current = lines[i] ?? "";
        if (!isSeparator(current)) rows.push(parseRow(current));
        i++;
      }
      i--;
      if (rows.length) {
        flushText();
        blocks.push({ type: "table", rows });
        continue;
      }
    }
    buffer.push(clean(line));
  }
  flushText();
  return blocks;
}

export async function downloadTextAsDocx(text: string, filename = "Document") {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    ShadingType,
    BorderStyle,
  } = await import("docx");

  const CONTENT_W = 11906 - 1134 * 2; // A4 minus margins
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = {
    top: cellBorder,
    bottom: cellBorder,
    left: cellBorder,
    right: cellBorder,
  };

  const children: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [];

  for (const block of parseBlocks(text)) {
    if (block.type === "text") {
      for (const line of block.lines) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: line })],
          }),
        );
      }
      continue;
    }

    const colCount = Math.max(...block.rows.map((r) => r.length));
    const colWidth = Math.floor(CONTENT_W / colCount);
    const columnWidths = Array.from({ length: colCount }, (_, i) =>
      i === colCount - 1 ? CONTENT_W - colWidth * (colCount - 1) : colWidth,
    );

    children.push(
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths,
        rows: block.rows.map(
          (row, rowIndex) =>
            new TableRow({
              children: columnWidths.map(
                (width, colIndex) =>
                  new TableCell({
                    borders,
                    width: { size: width, type: WidthType.DXA },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    ...(rowIndex === 0
                      ? {
                          shading: {
                            fill: "E8EDF5",
                            type: ShadingType.CLEAR,
                          },
                        }
                      : {}),
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: row[colIndex] ?? "",
                            bold: rowIndex === 0,
                          }),
                        ],
                      }),
                    ],
                  }),
              ),
            }),
        ),
      }),
    );
    children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${safeName(filename)}.docx`);
}

export async function downloadTextAsPdf(text: string, filename = "Document") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const MARGIN = 15;
  const PAGE_H = 297;
  const CONTENT_W = 210 - MARGIN * 2;
  const LINE_H = 5.2;
  let y = MARGIN;

  const newPageIfNeeded = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  for (const block of parseBlocks(text)) {
    if (block.type === "text") {
      for (const line of block.lines) {
        const wrapped = doc.splitTextToSize(line || " ", CONTENT_W) as string[];
        for (const w of wrapped) {
          newPageIfNeeded(LINE_H);
          doc.text(w, MARGIN, y);
          y += LINE_H;
        }
      }
      continue;
    }

    doc.setFontSize(9);
    const colCount = Math.max(...block.rows.map((r) => r.length));
    const colW = CONTENT_W / colCount;
    const PAD = 1.5;

    block.rows.forEach((row, rowIndex) => {
      const cells = Array.from({ length: colCount }, (_, i) =>
        doc.splitTextToSize(row[i] ?? "", colW - PAD * 2) as string[],
      );
      const rowH = Math.max(...cells.map((c) => c.length)) * 4.2 + PAD * 2;
      newPageIfNeeded(rowH);

      if (rowIndex === 0) {
        doc.setFillColor(232, 237, 245);
        doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }

      doc.setDrawColor(200, 200, 200);
      cells.forEach((lines, i) => {
        const x = MARGIN + colW * i;
        doc.rect(x, y, colW, rowH);
        lines.forEach((line, li) => {
          doc.text(line, x + PAD, y + PAD + 3.2 + li * 4.2);
        });
      });
      y += rowH;
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 4;
  }

  doc.save(`${safeName(filename)}.pdf`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
