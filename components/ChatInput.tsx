"use client";

import { useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { StudyMode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  mode: StudyMode;
  hasDocuments: boolean;
}

const modePlaceholders: Record<StudyMode, string> = {
  chat: "Ask anything about your documents…",
  quiz: "Ask for a quiz, or answer a question…",
  summary: "Ask for a summary of a topic or section…",
  flashcards: "Ask for flashcards on a topic…",
  explain: "What concept would you like explained?",
};

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  mode,
  hasDocuments,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) onSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className="border-t border-border bg-paper p-4">
      {!hasDocuments && (
        <p className="text-xs text-center text-muted mb-3">
          💡 Upload a PDF to get started, or ask a general question
        </p>
      )}
      <div className="flex items-end gap-2 bg-surface border border-border rounded-2xl px-4 py-3 focus-within:border-accent-dim focus-within:ring-2 focus-within:ring-accent/10 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); handleInput(); }}
          onKeyDown={handleKeyDown}
          placeholder={modePlaceholders[mode]}
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted resize-none outline-none leading-relaxed min-h-[22px] max-h-[160px] disabled:opacity-50"
          style={{ height: "22px" }}
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150",
            value.trim() && !isLoading
              ? "bg-accent text-white hover:bg-accent/90 active:scale-95"
              : "bg-border text-muted cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
        </button>
      </div>
      <p className="text-center text-[10px] text-muted mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
