"use client";

import { BookOpen, Trash2 } from "lucide-react";
import PDFUploader from "./PDFUploader";
import StudyModeSelector from "./StudyModeSelector";
import { PDFDocument, StudyMode } from "@/lib/types";

interface SidebarProps {
  documents: PDFDocument[];
  mode: StudyMode;
  onDocumentAdded: (doc: PDFDocument) => void;
  onDocumentRemoved: (id: string) => void;
  onModeChange: (mode: StudyMode) => void;
  onClearChat: () => void;
  messageCount: number;
}

export default function Sidebar({
  documents,
  mode,
  onDocumentAdded,
  onDocumentRemoved,
  onModeChange,
  onClearChat,
  messageCount,
}: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-paper border-r border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-ink leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Study Coach
          </h1>
          <p className="text-xs text-muted">AI-powered learning</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* PDF Upload */}
        <div>
          <PDFUploader
            documents={documents}
            onDocumentAdded={onDocumentAdded}
            onDocumentRemoved={onDocumentRemoved}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Mode selector */}
        <StudyModeSelector mode={mode} onChange={onModeChange} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            Clear conversation
          </button>
        )}
        <p className="text-center text-[10px] text-muted">
          {documents.length} {documents.length === 1 ? "document" : "documents"} · {messageCount} {messageCount === 1 ? "message" : "messages"}
        </p>
      </div>
    </aside>
  );
}
