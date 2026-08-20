import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/app/HomeButton";
import { Download, Home, ArrowRight } from "lucide-react";
import { loadProgress } from "@/lib/progress";
import {
  downloadAllDocuments,
  type SavedDocuments,
} from "@/lib/claim-documents";

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => ({
    meta: [
      { title: "Your claim documents — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "View and download the claim documents generated from your guided personal injury claim session.",
      },
      {
        property: "og:title",
        content: "Your claim documents — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "View and download the claim documents generated from your guided personal injury claim session.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const [saved, setSaved] = useState<SavedDocuments | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadProgress<SavedDocuments>("documents").then((data) => {
      if (!active) return;
      setSaved(data);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const docs = saved?.docs ?? [];

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Your claim documents
          </h1>
          <HomeButton />
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        {ready && docs.length === 0 ? (
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                You have not generated any documents yet. Complete the
                step-by-step guide to create your Letter of Claim, case facts,
                evidence table and lawyer summary sheet.
              </p>
              <Button asChild className="mt-4 gap-2">
                <Link to="/guide">
                  Start the step-by-step guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {docs.map((doc, i) => (
              <Card key={`${doc.title}-${i}`} className="border-border/60 bg-card">
                <CardContent className="p-6">
                  <h2 className="mb-3 text-sm font-semibold text-foreground">
                    {doc.title}
                  </h2>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                    {doc.body}
                  </pre>
                </CardContent>
              </Card>
            ))}

            {docs.length > 0 && (
              <Card className="border-border/60 bg-card">
                <CardContent className="p-6">
                  <Button
                    type="button"
                    className="gap-2"
                    onClick={() => downloadAllDocuments(docs)}
                  >
                    <Download className="h-4 w-4" />
                    Download all documents (Word + PDF)
                  </Button>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    What to do next
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Bring these documents to a lawyer and consult them to get
                    proper legal advice on your situation before you send
                    anything or agree to any settlement.
                  </p>
                  <div className="mt-4 border-t border-border/60 pt-3">
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link to="/">
                        <Home className="h-4 w-4" />
                        Go back to main menu
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
