import { downloadTextAsDocx, downloadTextAsPdf } from "@/lib/text-export";

export type DocSection = { title: string; body: string };
export type SavedDocuments = { docs: DocSection[]; savedAt?: string };

export function combineDocuments(docs: DocSection[]) {
  return docs
    .map((doc) => `${doc.title}\n\n${doc.body}`)
    .join("\n\n\n----------------------------------------\n\n\n");
}

export async function downloadAllDocuments(docs: DocSection[]) {
  const combined = combineDocuments(docs);
  await downloadTextAsDocx(combined, "Personal_Injury_Claim_Documents");
  await downloadTextAsPdf(combined, "Personal_Injury_Claim_Documents");
}
