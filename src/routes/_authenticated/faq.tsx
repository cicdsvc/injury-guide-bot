import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef } from "react";
import { HomeButton } from "@/components/app/HomeButton";
import { Disclaimer } from "@/components/app/Disclaimer";

import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import faqImg from "@/assets/faq-questions.png";
import { Download } from "lucide-react";
import { downloadTextAsDocx, downloadTextAsPdf } from "@/lib/text-export";

function looksLikeLetter(text: string) {
  const t = text.toLowerCase();
  const hasSalutation = /\bdear\b/.test(t);
  const hasSignOff = /(yours faithfully|yours sincerely|yours truly)/.test(t);
  const hasHeading = /(letter of claim|letter of demand)/.test(t);
  return text.length > 400 && hasSalutation && (hasSignOff || hasHeading);
}

function letterName(text: string) {
  const t = text.toLowerCase();
  if (t.includes("letter of demand")) return "Letter_of_Demand_Draft";
  if (t.includes("letter of claim")) return "Letter_of_Claim_Draft";
  return "Draft_Letter";
}

export const Route = createFileRoute("/_authenticated/faq")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { ask?: string } =>
    typeof search["ask"] === "string" ? { ask: search["ask"] } : {},
  head: () => ({
    meta: [
      { title: "Prepare for your lawyer — Personal Injury Claim Helper" },
      {
        name: "description",
        content:
          "Get help gathering evidence and preparing a clear summary of your personal injury claim before you see a lawyer.",
      },
      {
        property: "og:title",
        content: "Prepare for your lawyer — Personal Injury Claim Helper",
      },
      {
        property: "og:description",
        content:
          "Get help gathering evidence and preparing a clear summary of your personal injury claim before you see a lawyer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

const START_MESSAGE = `I would like to prepare for my personal injury consultation. Please walk me through the following steps, one at a time:

1. Identifying relevant evidence to collect (e.g. medical reports, photos, police reports, witness details, expense receipts)
2. Understanding the key issues a lawyer will want to advise on
3. Preparing a structured summary of facts and evidence for a legal consultation
4. Drafting a letter of claim for a lawyer to review (optional)
5. Drafting a letter of demand for a lawyer to review before it is sent (optional)

Please start with step 1.`;

function FaqPage() {
  const { ask } = Route.useSearch();
  const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status, error } = useChat({
    id: "faq",
    transport: chatTransport,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSent = useRef(false);

  useEffect(() => {
    if (!ask || autoSent.current) return;
    autoSent.current = true;
    void sendMessage({ text: ask });
  }, [ask, sendMessage]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex min-h-screen flex-col bg-cream">
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
                Consultation Prep Assistant
              </h1>
              <p className="text-xs text-muted-foreground">
                Groundwork for your claim, so your lawyer's time goes further
              </p>
            </div>
          </div>
          <HomeButton />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-6">
        <Disclaimer />

        {messages.length === 0 && (
          <Card className="mt-6 border-border/60 bg-card p-5">
            <h2 className="text-sm font-medium text-foreground">
              How this helps you
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              I can help you get ready for a legal consultation by walking you
              through these steps:
            </p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>
                Identifying relevant evidence to collect (e.g. medical reports,
                photos, police reports, witness details, expense receipts)
              </li>
              <li>Understanding the key issues a lawyer will want to advise on</li>
              <li>
                Preparing a structured summary of facts and evidence for a legal
                consultation
              </li>
              <li>
                Drafting a letter of claim for a lawyer to review (optional)
              </li>
              <li>
                Drafting a letter of demand for a lawyer to review before it is
                sent (optional)
              </li>
            </ol>
            <p className="mt-2 text-sm text-muted-foreground">
              I cannot tell you how strong your claim is, how much it is worth,
              or whether to accept an offer — those are questions for your
              lawyer. Please get legal advice before you settle anything or send
              any formal letter.
            </p>
            <div className="mt-6">
              <Button
                type="button"
                onClick={() => sendMessage({ text: START_MESSAGE })}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Click here to begin
              </Button>
            </div>
          </Card>
        )}




        <Conversation className="mt-6 flex-1 rounded-xl border border-border/60 bg-card">
          <ConversationContent>
            {messages.map((message) => {
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");
              const isLetter =
                message.role === "assistant" && looksLikeLetter(text);
              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{text}</MessageResponse>
                    {isLetter && (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() =>
                            downloadTextAsPdf(text, letterName(text))
                          }
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            downloadTextAsDocx(text, letterName(text))
                          }
                        >
                          <Download className="h-4 w-4" />
                          Download Word (.docx)
                        </Button>
                      </div>
                    )}
                  </MessageContent>
                </Message>
              );
            })}
            <div ref={bottomRef} />
          </ConversationContent>
        </Conversation>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground">
            Something went wrong. Please try again.
          </div>
        )}

        <div className="mt-4 pb-6">
          <PromptInput
            onSubmit={async ({ text }) => {
              if (!text.trim()) return;
              await sendMessage({ text: text.trim() });
            }}
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Tell me what happened, or ask what to prepare..."
                className="min-h-[60px] resize-none"
              />
              <PromptInputFooter>
                <PromptInputSubmit status={status} />
              </PromptInputFooter>
            </PromptInputBody>
          </PromptInput>
          <p className="mt-3 text-xs text-muted-foreground">
            When you are ready for advice, speak to a private lawyer or{" "}
            <a
              href="https://www.probono.sg"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Pro Bono SG
            </a>
            . Get legal advice before settling anything or sending any formal
            letter.
          </p>
        </div>

      </div>
    </main>
  );
}
