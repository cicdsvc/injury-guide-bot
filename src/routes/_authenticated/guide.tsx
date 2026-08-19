import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HomeButton } from "@/components/app/HomeButton";
import { Disclaimer } from "@/components/app/Disclaimer";
import { FileText, ListChecks, Scale, ClipboardList, ArrowRight } from "lucide-react";
import faqImg from "@/assets/faq-questions.png";

export const Route = createFileRoute("/_authenticated/guide")({
  head: () => ({
    meta: [
      { title: "Step-by-Step Guide — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "A guided process to help you understand and draft a personal injury claim letter.",
      },
      {
        property: "og:title",
        content: "Step-by-Step Guide — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "A guided process to help you understand and draft a personal injury claim letter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuideLandingPage,
});

const outcomes = [
  {
    icon: ClipboardList,
    title: "Your case facts",
    description: "A clear, structured summary of what happened, when, and who was involved.",
  },
  {
    icon: ListChecks,
    title: "What evidence you have and what is still lacking",
    description: "A checklist of your supporting documents and any gaps to fill before seeing a lawyer.",
  },
  {
    icon: FileText,
    title: "First cut draft of Letter of Claim",
    description: "A downloadable first draft that a lawyer can review and adapt for your case.",
  },
  {
    icon: Scale,
    title: "Summary sheet for your lawyer consultation",
    description: "A concise brief you can bring to your lawyer so your first meeting is focused and affordable.",
  },
];

function GuideLandingPage() {
  const [accepted, setAccepted] = useState(false);

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={faqImg}
              alt=""
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Step-by-Step Guide
              </h1>
              <p className="text-xs text-muted-foreground">
                Prepare your personal injury claim
              </p>
            </div>
          </div>
          <HomeButton />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <Disclaimer />

        <Card className="mt-6 overflow-hidden border-border/60 bg-card">
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={faqImg}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <h2 className="text-2xl font-bold">How this guide works</h2>
            </div>
          </div>

          <CardContent className="space-y-6 p-6">
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                This guided process helps you understand your personal injury claim and prepare a
                first draft of a Letter of Claim. You will answer simple questions one at a time,
                so the assistant can help you organise your facts, evidence, and next steps.
              </p>
              <p>
                At the end of this interaction, you will receive:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {outcomes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-background p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm text-foreground/90">
              <p className="font-medium">Important reminder</p>
              <p className="mt-1">
                This assistant is not a lawyer and does not provide legal advice. It is designed to
                help you do the groundwork so that a lawyer can advise you more efficiently. Always
                consult a qualified lawyer before settling your claim or sending any formal letter.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary p-4">
              <Checkbox
                id="legal-advice-declaration"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                className="mt-0.5"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="legal-advice-declaration" className="text-sm font-medium">
                  I understand and agree
                </Label>
                <p className="text-sm text-muted-foreground">
                  By checking this box, I understand that this guide does not constitute legal
                  advice and that I should seek advice from a qualified lawyer for my situation.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button asChild disabled={!accepted} className="gap-2">
                <Link to="/faq">
                  Start the guided process
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
