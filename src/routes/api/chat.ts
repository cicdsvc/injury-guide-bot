import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { GUIDE_CONTENT } from "@/lib/guide-content";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are a helpful assistant for a Singapore Personal Injury Guide app.
Answer questions using ONLY the information in the guide below.
If the answer is not in the guide, say you cannot answer based on the guide and suggest consulting a qualified lawyer.
Always include a brief disclaimer that this is not legal advice.

GUIDE CONTENT:
${GUIDE_CONTENT}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway.languageModel("google/gemini-3.6-flash");
        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
