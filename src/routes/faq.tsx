import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { HomeButton } from "@/components/app/HomeButton";
import { Disclaimer } from "@/components/app/Disclaimer";
import { ClaimChecklist } from "@/components/app/ClaimChecklist";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
import faqImg from "@/assets/faq-questions.png";

export const Route = createFileRoute("/faq")({
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

const CHECKLIST_QUESTION =
  "Show me the Personal Injuries Claim Process checklist";

const commonQuestions = [
  "Help me work out what evidence I should collect",
  "Help me prepare a summary of my case for a lawyer",
  "What will a lawyer want to advise me on?",
  CHECKLIST_QUESTION,
  "Help me draft a letter of claim for my lawyer to review",
  "Help me draft a letter of demand for my lawyer to review",
  "What is a Personal Injury?",
];

function FaqPage() {
  const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status, error } = useChat({
    id: "faq",
    transport: chatTransport,
  });
  const [showChecklist, setShowChecklist] = useState(false);


  const bottomRef = useRef<HTMLDivElement>(null);

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
              I am not a lawyer and I cannot give legal advice. I can help you
              get ready for a legal consultation: working out what evidence to
              collect, understanding the questions a lawyer will want to go
              through with you, putting your facts into a clear summary, and
              drafting a letter of claim or letter of demand for your lawyer to
              review.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              I cannot tell you how strong your claim is, how much it is worth,
              or whether to accept an offer — those are questions for your
              lawyer. Please get legal advice before you settle anything or send
              any formal letter.
            </p>
            <h3 className="mt-5 mb-3 text-sm font-medium text-foreground">
              Where would you like to start?
            </h3>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() =>
                    question === CHECKLIST_QUESTION
                      ? setShowChecklist(true)
                      : sendMessage({ text: question })
                  }
                  className="rounded-full border border-border/60 bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  {question}
                </button>
              ))}
            </div>
          </Card>
        )}

        {showChecklist && (
          <ClaimChecklist onClose={() => setShowChecklist(false)} />
        )}




        <Conversation className="mt-6 flex-1 rounded-xl border border-border/60 bg-card">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Nothing here yet"
                description="Pick a starting point above, or tell me in your own words what happened."
              />

            ) : (
              messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })
            )}
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
                placeholder="Type your question..."
                className="min-h-[60px] resize-none"
              />
              <PromptInputFooter>
                <PromptInputSubmit status={status} />
              </PromptInputFooter>
            </PromptInputBody>
          </PromptInput>
        </div>
      </div>
    </main>
  );
}
