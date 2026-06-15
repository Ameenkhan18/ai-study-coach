"use client";

import ReactMarkdown from "react-markdown";
import { Message } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { BookOpen, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isAssistant ? "items-start" : "items-start flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5",
          isAssistant
            ? "bg-accent text-white"
            : "bg-ink text-white"
        )}
      >
        {isAssistant ? <BookOpen size={15} /> : <User size={15} />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3",
          isAssistant
            ? "bg-surface border border-border rounded-tl-sm"
            : "bg-accent text-white rounded-tr-sm"
        )}
      >
        {isAssistant ? (
          <div className={cn("markdown-content text-sm text-ink", isStreaming && "streaming")}>
            {message.content ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              <div className="flex items-center gap-1.5 py-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        <p
          className={cn(
            "text-[10px] mt-2 leading-none",
            isAssistant ? "text-muted" : "text-white/60"
          )}
        >
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
