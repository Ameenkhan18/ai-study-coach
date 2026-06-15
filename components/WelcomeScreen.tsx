"use client";

import { StudyMode } from "@/lib/types";

interface WelcomeScreenProps {
  hasDocuments: boolean;
  mode: StudyMode;
  onSuggestion: (text: string) => void;
}

const suggestions: Record<StudyMode, { label: string; prompt: string }[]> = {
  chat: [
    { label: "Key concepts", prompt: "What are the most important concepts in this document?" },
    { label: "Main argument", prompt: "What is the main argument or thesis of this document?" },
    { label: "Quick overview", prompt: "Give me a brief overview of what this document covers." },
    { label: "Key terms", prompt: "List and define the key terms used in this document." },
  ],
  quiz: [
    { label: "Start a quiz", prompt: "Give me a 5-question quiz on the main topics." },
    { label: "True/False", prompt: "Create 5 true/false questions from the content." },
    { label: "Multiple choice", prompt: "Give me 3 multiple choice questions on key concepts." },
    { label: "Short answer", prompt: "Create 3 short answer questions for exam practice." },
  ],
  summary: [
    { label: "Full summary", prompt: "Provide a comprehensive structured summary of the document." },
    { label: "Bullet points", prompt: "Summarize the document in 10 key bullet points." },
    { label: "Executive summary", prompt: "Write a one-paragraph executive summary." },
    { label: "Chapter breakdown", prompt: "Break down the document section by section." },
  ],
  flashcards: [
    { label: "Key terms", prompt: "Create 10 flashcards for key terms and definitions." },
    { label: "Concepts", prompt: "Make flashcards for the 8 most important concepts." },
    { label: "Dates & facts", prompt: "Create flashcards for important dates and facts." },
    { label: "Q&A pairs", prompt: "Generate 10 Q&A flashcard pairs for studying." },
  ],
  explain: [
    { label: "Main concept", prompt: "Explain the main concept in simple terms." },
    { label: "Like I'm 10", prompt: "Explain this topic as if I'm completely new to it." },
    { label: "With examples", prompt: "Explain the key ideas with real-world examples." },
    { label: "Deep dive", prompt: "Give me a thorough explanation of the core theory." },
  ],
};

const noDocSuggestions = [
  { label: "Study tips", prompt: "What are effective study techniques for retaining information?" },
  { label: "Note-taking", prompt: "Teach me the Cornell note-taking method." },
  { label: "Memory tricks", prompt: "What are some mnemonic devices and memory techniques?" },
  { label: "Exam prep", prompt: "How should I prepare for an upcoming exam?" },
];

export default function WelcomeScreen({ hasDocuments, mode, onSuggestion }: WelcomeScreenProps) {
  const chips = hasDocuments ? suggestions[mode] : noDocSuggestions;

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-12 text-center">
      <div className="text-5xl mb-5">📚</div>
      <h2 className="text-2xl font-semibold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
        {hasDocuments ? `Ready to ${mode === "chat" ? "chat" : mode}` : "Your AI Study Coach"}
      </h2>
      <p className="text-sm text-muted max-w-xs leading-relaxed mb-8">
        {hasDocuments
          ? `I have your ${mode === "flashcards" ? "flashcard generator" : mode === "quiz" ? "quiz master" : mode === "summary" ? "summarizer" : mode === "explain" ? "tutor" : "study companion"} ready. Try a suggestion or ask your own question.`
          : "Upload a PDF to get personalized help with your study materials, or start with a study tip."}
      </p>

      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
        {chips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => onSuggestion(chip.prompt)}
            className="text-left px-4 py-3 bg-surface border border-border rounded-xl hover:border-accent-dim hover:bg-surface-hover transition-all text-sm group"
          >
            <span className="font-medium text-ink group-hover:text-accent transition-colors">
              {chip.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
