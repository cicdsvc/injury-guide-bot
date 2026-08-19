// Generic exporters for free-form letter text produced in the chat assistant.

const safeName = (s: string) => (s || "Letter").replace(/[^\w]+/g, "_").slice(0, 60);

export async function downloadTextAsDocx(text: string, filename = "Draft_Letter") {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const paragraphs = text.split("\n").map(
    (line) =>
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: line.replace(/[*_#`]/g, "").trimEnd() })],
      }),
  );

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
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${safeName(filename)}.docx`);
}

export async function downloadTextAsPdf(text: string, filename = "Draft_Letter") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const MARGIN = 20;
  const PAGE_H = 297;
  const CONTENT_W = 210 - MARGIN * 2;
  const LINE_H = 5.2;
  let y = MARGIN;

  for (const raw of text.split("\n")) {
    const line = raw.replace(/[*_#`]/g, "").trimEnd();
    const wrapped = doc.splitTextToSize(line || " ", CONTENT_W) as string[];
    for (const w of wrapped) {
      if (y + LINE_H > PAGE_H - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }
      doc.text(w, MARGIN, y);
      y += LINE_H;
    }
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
