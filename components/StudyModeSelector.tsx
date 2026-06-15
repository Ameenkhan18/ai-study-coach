"use client";

import { MessageCircle, HelpCircle, FileText, Layers, Lightbulb } from "lucide-react";
import { StudyMode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StudyModeSelectorProps {
  mode: StudyMode;
  onChange: (mode: StudyMode) => void;
}

const modes: { id: StudyMode; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: "chat",
    label: "Chat",
    icon: <MessageCircle size={15} />,
    desc: "Ask anything about your documents",
  },
  {
    id: "explain",
    label: "Explain",
    icon: <Lightbulb size={15} />,
    desc: "Get concepts explained simply",
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: <HelpCircle size={15} />,
    desc: "Test your knowledge",
  },
  {
    id: "summary",
    label: "Summarize",
    icon: <FileText size={15} />,
    desc: "Get structured summaries",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: <Layers size={15} />,
    desc: "Generate study flashcards",
  },
];

export default function StudyModeSelector({ mode, onChange }: StudyModeSelectorProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wide px-1 mb-2">
        Study Mode
      </p>
      <div className="space-y-1.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
              mode === m.id
                ? "bg-accent text-white shadow-sm"
                : "text-ink hover:bg-surface-hover"
            )}
          >
            <span className={cn(
              "flex-shrink-0 transition-colors",
              mode === m.id ? "text-white/90" : "text-accent"
            )}>
              {m.icon}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium leading-tight">{m.label}</div>
              <div className={cn(
                "text-xs leading-tight mt-0.5 truncate",
                mode === m.id ? "text-white/70" : "text-muted"
              )}>
                {m.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
