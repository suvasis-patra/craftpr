import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  isStepCount,
} from "ai";
import { google } from "@ai-sdk/google";
import {
  aiPrChatTools,
  ChatMessage,
} from "@/features/ai/tools/chat/ai-pr-chat";

export const maxDuration = 30;

function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, context } = body as {
      messages: ChatMessage[];
      context?: { prId?: string; repoFullName?: string; prNumber?: number };
    };

    console.log("DEBUG: Incoming messages:", JSON.stringify(messages, null, 2));
    console.log("DEBUG: Context:", context);

    // Add context to the first user message if available
    let messagesToProcess = messages;
    if (context?.prId && context?.repoFullName && context?.prNumber) {
      const contextText = `[Context: You are discussing PR #${context.prNumber} in ${context.repoFullName}, PR ID: ${context.prId}. Use these specific values when calling tools.]`;

      messagesToProcess = messages.map((msg, index) => {
        if (index === 0 && msg.role === "user") {
          // Create a new message with context prepended to the first text part
          const textParts =
            msg.parts?.filter((part: any) => part.type === "text") || [];
          const nonTextParts =
            msg.parts?.filter((part: any) => part.type !== "text") || [];

          console.log("DEBUG: Text parts found:", textParts);
          console.log("DEBUG: Non-text parts found:", nonTextParts);

          let updatedParts;
          if (textParts.length > 0) {
            // Prepend context to the first text part
            const firstTextPart = textParts[0] as any;
            updatedParts = [
              {
                ...firstTextPart,
                text: contextText + "\n\n" + firstTextPart.text,
              },
              ...textParts.slice(1),
              ...nonTextParts,
            ];
          } else {
            // No text parts exist, add one with context
            updatedParts = [
              { type: "text", text: contextText },
              ...nonTextParts,
            ];
          }

          console.log(
            "DEBUG: Updated parts:",
            JSON.stringify(updatedParts, null, 2),
          );

          return {
            ...msg,
            parts: updatedParts,
          } as ChatMessage;
        }
        return msg;
      });
    }

    console.log(
      "DEBUG: Messages to process:",
      JSON.stringify(messagesToProcess, null, 2),
    );
    console.log("DEBUG: About to call convertToModelMessages");

    const result = streamText({
      model: google("gemini-3.8-flash"),
      tools: { ...aiPrChatTools },
      stopWhen: isStepCount(10),
      messages: await convertToModelMessages(messagesToProcess),
      onStepFinish: async (step) => {
        console.log("STEP:", step.stepNumber);
        console.log("TEXT:", step.text);
        console.log("FINISH:", step.finishReason);
        console.log("RAW:", step.rawFinishReason);
        console.log("USAGE:", step.usage);
      },

      onFinish: async (result) => {
        console.log("FINAL TEXT:", result.text);
        console.log("FINAL REASON:", result.finishReason);
        console.log("RAW:", result.rawFinishReason);
        console.log("TOTAL USAGE:", result.usage);
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: errorHandler,
      }),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    // Log the error if it's a Zod validation error
    if (error && typeof error === "object" && "issues" in error) {
      console.error(
        "Zod validation issues:",
        JSON.stringify(error.issues, null, 2),
      );
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
