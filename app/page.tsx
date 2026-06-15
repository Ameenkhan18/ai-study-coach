"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { Message, PDFDocument, StudyMode } from "@/lib/types";
import { generateId } from "@/lib/utils";

export default function Home() {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<StudyMode>("chat");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDocumentAdded = (doc: PDFDocument) => {
    setDocuments((prev) => [...prev, doc]);
  };

  const handleDocumentRemoved = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleModeChange = (newMode: StudyMode) => {
    setMode(newMode);
  };

  const handleClearChat = () => {
    setMessages([]);
    setStreamingId(null);
  };

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || inputValue).trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const assistantId = generateId();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInputValue("");
    setIsLoading(true);
    setStreamingId(assistantId);

    try {
      const conversationHistory = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          documents: documents.map((d) => ({ name: d.name, content: d.content })),
          mode,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.error) throw new Error(parsed.error);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: accumulated } : m
                    )
                  );
                }
              } catch {
                // skip parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `⚠️ ${errMsg}` }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      setStreamingId(null);
    }
  }, [inputValue, isLoading, messages, documents, mode]);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        documents={documents}
        mode={mode}
        onDocumentAdded={handleDocumentAdded}
        onDocumentRemoved={handleDocumentRemoved}
        onModeChange={handleModeChange}
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />

      {/* Chat area */}
      <main className="flex flex-col h-full overflow-hidden bg-paper">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/60 backdrop-blur-sm">
          <div>
            <h2 className="text-base font-semibold text-ink capitalize" style={{ fontFamily: "var(--font-display)" }}>
              {mode === "chat" ? "Study Chat" :
               mode === "quiz" ? "Quiz Mode" :
               mode === "summary" ? "Summarizer" :
               mode === "flashcards" ? "Flashcard Generator" :
               "Concept Explainer"}
            </h2>
            <p className="text-xs text-muted">
              {documents.length > 0
                ? `${documents.length} document${documents.length > 1 ? "s" : ""} loaded`
                : "No documents — using general knowledge"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="h-6 px-2 bg-accent-light text-accent text-xs font-medium rounded-full flex items-center max-w-[120px] truncate"
                title={doc.name}
              >
                {doc.name.replace(".pdf", "")}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 ? (
            <WelcomeScreen
              hasDocuments={documents.length > 0}
              mode={mode}
              onSuggestion={(prompt) => sendMessage(prompt)}
            />
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isStreaming={msg.id === streamingId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={() => sendMessage()}
          isLoading={isLoading}
          mode={mode}
          hasDocuments={documents.length > 0}
        />
      </main>
    </div>
  );
}
