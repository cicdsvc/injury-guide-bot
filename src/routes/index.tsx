import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Disclaimer } from "@/components/app/Disclaimer";
import heroImg from "@/assets/hero-person-with-injury.png.asset.json";
import faqImg from "@/assets/faq-questions.png";
import claimImg from "@/assets/letter-of-claim.png";
import settlementImg from "@/assets/settlement-agreement.png";
import demandImg from "@/assets/letter-of-demand.png";
import { ArrowRight, FileText, HelpCircle, Scale, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "An interactive app to help you understand more about your Personal Injury claims.",
      },
      { property: "og:title", content: "Personal Injury Claim Helper" },
      {
        property: "og:description",
        content:
          "An interactive app to help you understand more about your Personal Injury claims.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const options = [
  {
    id: "faq",
    label: "I got questions regarding my Personal Injury claim",
    description: "Browse common questions or ask your own.",
    to: "/faq",
    icon: HelpCircle,
    image: faqImg,
  },
  {
    id: "claim",
    label: "I want to craft a Letter of Claim",
    description: "Notify the other party of your claim and demand compensation.",
    to: "/letter/claim",
    icon: FileText,
    image: claimImg,
  },
  {
    id: "settlement",
    label: "I want to craft a Settlement Agreement",
    description: "Record the terms of settlement between the parties.",
    to: "/letter/settlement",
    icon: ShieldCheck,
    image: settlementImg,
  },
  {
    id: "demand",
    label: "I want to draft a Letter of Demand",
    description: "Formally demand payment or action before legal proceedings.",
    to: "/letter/demand",
    icon: Scale,
    image: demandImg,
  },
];

function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-navy-foreground sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Personal Injury Claim Helper
              </h1>
              <p className="text-lg/relaxed text-navy-foreground/80 sm:text-xl/relaxed">
                An interactive app to help you understand more about your
                Personal Injury claims.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <img
                src={heroImg.url}
                alt="Illustration of a person with an injury using the app at home"
                className="rounded-2xl shadow-2xl"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              What would you like to do?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Choose an option below to get started.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {options.map((option) => (
              <Card
                key={option.id}
                className="group overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-lg"
              >
                <Link to={option.to} className="block">
                  <CardContent className="flex h-full flex-col p-0">
                    <div className="relative h-40 w-full overflow-hidden bg-muted">
                      <img
                        src={option.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <option.icon className="absolute bottom-3 left-3 h-8 w-8 text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold text-foreground">
                        {option.label}
                      </h3>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground">
                        {option.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary">
                        Get started
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          <Disclaimer />
        </div>
      </section>
    </main>
  );
}
