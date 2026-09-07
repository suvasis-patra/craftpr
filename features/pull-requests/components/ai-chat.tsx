"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { User, Bot, Loader2, Send, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface ChatProps {
  prId?: string;
  repoFullName?: string;
  prNumber?: number;
}

function ToolPartRenderer({ part }: { part: any }) {
  const toolName = part.type.replace("tool-", "");
  const callId = part.toolCallId;

  const getStatus = () => {
    switch (part.state) {
      case "input-streaming":
        return "Preparing";
      case "input-available":
        return "Running";
      case "output-available":
        return "Completed";
      case "output-error":
        return "Failed";
      case "output-denied":
        return "Denied";
      case "approval-requested":
        return "Approval required";
      case "approval-responded":
        return "Approval received";
      default:
        return "Processing";
    }
  };

  const isRunning =
    part.state === "input-streaming" || part.state === "input-available";

  const isError = part.state === "output-error";

  return (
    <details
      key={callId}
      className="group my-2 rounded-md border border-[#3c3c3c] bg-[#1e1e1e]"
    >
      {/* Header */}
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm text-[#b8b8b8] hover:bg-[#2a2a2a]">
        {/* Chevron */}
        <svg
          className="size-3 shrink-0 transition-transform group-open:rotate-90"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M4 2L8 6L4 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Tool icon / status */}
        {isRunning ? (
          <Loader2 className="size-3 animate-spin text-chart-3" />
        ) : isError ? (
          <AlertCircle className="size-3 text-red-400" />
        ) : (
          <div className="size-1.5 rounded-full bg-emerald-400" />
        )}

        {/* Tool name */}
        <span className="font-medium text-[#d4d4d4]">{toolName}</span>

        {/* Status */}
        <span className="text-xs text-[#6a6a6a]">{getStatus()}</span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* State */}
        {part.state === "output-available" && (
          <span className="text-[11px] text-emerald-400/80">done</span>
        )}
      </summary>

      {/* Content */}
      <div className="border-t border-[#3c3c3c] px-3 py-3 space-y-3">
        {/* Input */}
        {part.input && (
          <div>
            <div className="mb-1 text-[11px] uppercase tracking-wide text-[#6a6a6a]">
              Input
            </div>

            <pre className="max-h-48 overflow-auto rounded-md bg-[#181818] p-2 text-xs text-[#b8b8b8]">
              {JSON.stringify(part.input, null, 2)}
            </pre>
          </div>
        )}

        {/* Output */}
        {part.state === "output-available" && part.output && (
          <div>
            <div className="mb-1 text-[11px] uppercase tracking-wide text-[#6a6a6a]">
              Output
            </div>

            <pre className="max-h-72 overflow-auto rounded-md bg-[#181818] p-2 text-xs text-[#b8b8b8]">
              {JSON.stringify(part.output, null, 2)}
            </pre>
          </div>
        )}

        {/* Error */}
        {part.state === "output-error" && (
          <div className="rounded-md bg-red-400/5 p-2 text-xs text-red-400">
            {part.errorText}
          </div>
        )}

        {/* Approval */}
        {part.state === "approval-requested" && (
          <div className="text-xs text-[#858585]">
            This tool requires approval before it can continue.
          </div>
        )}

        {part.state === "output-denied" && (
          <div className="text-xs text-[#858585]">
            Tool execution was denied.
          </div>
        )}
      </div>
    </details>
  );
}

export default function Chat({ prId, repoFullName, prNumber }: ChatProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, addToolOutput, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        context: { prId, repoFullName, prNumber },
      },
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const { data: session } = authClient.useSession();

  const isLoading = status === "streaming" || status === "submitted";
  const isSubmitted = status === "submitted";

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e]">
      {/* Header */}
      <div className="border-b border-[#3c3c3c] px-6 py-4 bg-[#252526]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-chart-3" />
            <h1 className="text-lg font-semibold text-[#d4d4d4]">AI Chat</h1>
          </div>
          <div className="flex-1" />
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#858585]">
              <Loader2 className="size-3 animate-spin" />
              <span>
                {isSubmitted ? "Sending..." : "Generating response..."}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <Conversation>
          <ConversationContent className="px-6 py-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Start a conversation"
                description="Type a message below to begin"
              />
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white",
                        message.role === "user"
                          ? "order-2"
                          : "order-1 bg-chart-3",
                      )}
                    >
                      {message.role === "user" ? (
                        session?.user.image ? (
                          <Image
                            alt="user"
                            src={session.user.image}
                            height={30}
                            width={30}
                          />
                        ) : (
                          <User className="size-4" />
                        )
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-3",
                        message.role === "user"
                          ? ""
                          : "bg-[#252526] border border-[#3c3c3c] order-2",
                      )}
                    >
                      <Message from={message.role}>
                        <MessageContent>
                          {message.role === "assistant" ? (
                            message.parts?.map((part, index) => {
                              switch (part.type) {
                                case "text":
                                  return (
                                    <MessageResponse key={index}>
                                      {part.text}
                                    </MessageResponse>
                                  );

                                case "step-start":
                                  return index > 0 ? (
                                    <div
                                      key={index}
                                      className="text-gray-500 my-2"
                                    >
                                      <hr className="border-gray-300" />
                                    </div>
                                  ) : null;

                                case "tool-getPrDetails":
                                case "tool-getPrFiles":
                                case "tool-getFileDiff":
                                case "tool-getAiReview":
                                case "tool-buildPrNamespace":
                                case "tool-buildRepoNamespace":
                                case "tool-repoContext":
                                case "tool-prContext":
                                  return (
                                    <ToolPartRenderer key={index} part={part} />
                                  );

                                default:
                                  return null;
                              }
                            })
                          ) : (
                            <div className="text-[#d4d4d4] whitespace-pre-wrap">
                              {message.parts
                                ?.filter((part) => part.type === "text")
                                .map((part, index) => (
                                  <span key={index}>{part.text}</span>
                                ))}
                            </div>
                          )}
                        </MessageContent>
                      </Message>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isSubmitted && (
                  <div className="flex gap-4 justify-start">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-chart-3 text-white">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-[#858585]">
                        <Loader2 className="size-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ConversationContent>
        </Conversation>
      </div>

      {/* Input Area */}
      <div className="border-t border-[#3c3c3c] p-4 bg-[#252526]">
        <div className="max-w-3xl mx-auto">
          <PromptInput
            onSubmit={(message, event) => {
              event.preventDefault();
              if (message.text) {
                sendMessage({ text: message.text });
                setInput("");
              }
            }}
            className="flex gap-2 items-end"
          >
            <div className="flex-1 relative">
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                rows={1}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] text-[#d4d4d4] placeholder:text-[#6a6a6a] resize-none rounded-lg px-4 py-3 focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
            <PromptInputSubmit
              disabled={isLoading || !input.trim()}
              className="bg-[#58a6ff] hover:bg-[#58a6ff]/80 text-white rounded-lg px-4 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </PromptInputSubmit>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
