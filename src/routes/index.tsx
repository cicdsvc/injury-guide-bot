import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Disclaimer } from "@/components/app/Disclaimer";
import { AccountBar } from "@/components/app/AccountBar";
import { ClaimTimeline } from "@/components/app/ClaimTimeline";
import heroImg from "@/assets/hero-person-with-injury.png.asset.json";
import faqImg from "@/assets/faq-questions.png";
import settlementImg from "@/assets/settlement-agreement.png";
import demandImg from "@/assets/letter-of-demand.png";
import whatIsImg from "@/assets/what-is-personal-injury.png";
import { ArrowRight, HelpCircle, Scale, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "An interactive guide to facilitate out of court settlements for minor Personal Injury claims.",
      },
      { property: "og:title", content: "Personal Injury Claim Helper" },
      {
        property: "og:description",
        content:
          "An interactive guide to facilitate out of court settlements for minor Personal Injury claims.",
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
    label: "1. Step-by-Step guide on how to make a Personal Injury claim",
    description:
      "Follow a guided process to understand and prepare your Personal Injury claim.",

    to: "/guide",
    icon: HelpCircle,
    image: faqImg,
    imagePosition: "center" as const,
  },
  {
    id: "settlement",
    label: "4. I want to draft a Settlement Agreement",
    description: "Record the terms of settlement between the parties.",
    to: "/letter/settlement",
    icon: ShieldCheck,
    image: settlementImg,
    imagePosition: "top" as const,
  },
  {
    id: "demand",
    label: "5. I want to draft a Letter of Demand",
    description: "Formally demand payment or action before legal proceedings.",
    to: "/letter/demand",
    icon: Scale,
    image: demandImg,
    imagePosition: "top" as const,
  },
];

function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-navy-foreground sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex justify-end">
            <AccountBar />
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Personal Injury Claim Helper
              </h1>
              <p className="text-lg/relaxed text-navy-foreground/80 sm:text-xl/relaxed">
                An interactive guide to facilitate out of court settlements for
                minor Personal Injury claims.
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
        <div className="mx-auto max-w-5xl space-y-12">
          <Card className="overflow-hidden border-border/60 bg-card">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              <div className="relative h-64 w-full overflow-hidden bg-muted lg:h-full">
                <img
                  src={whatIsImg}
                  alt="Illustration of a person with a minor injury reading a guide on a tablet at home"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={1024}
                  height={768}
                />
              </div>
              <CardContent className="space-y-4 p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  What is a Personal Injury and who this guide is for?
                </h2>
                <div className="space-y-3 text-foreground/90 leading-relaxed">
                  <p>
                    A personal injury is when you suffer harm to your body or mind because of someone else’s actions or carelessness. It could include:
                  </p>
                  <ul className="space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>Physical injuries (e.g. cuts, bruises, broken bones, or whiplash); or</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>Psychological injuries (e.g., anxiety or trauma).</span>
                    </li>
                  </ul>
                  <p>
                    This guide is designed for self-represented persons - people who are handling their own minor personal injuries claim to try and reach an out of court settlement. This guide does not cover what to do if you need to file a claim in court. If you need to file a claim in court, then you should seek a lawyer’s advice on what to do.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>

          <ClaimTimeline />

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              What would you like to do?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Choose an option below to get started. Sign in to save your
              progress and continue later.
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
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          option.imagePosition === "top" ? "object-top" : "object-center"
                        }`}
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
