export interface PDFDocument {
  id: string;
  name: string;
  content: string;
  pageCount: number;
  uploadedAt: Date;
  size: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface StudySession {
  id: string;
  title: string;
  messages: Message[];
  documents: PDFDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export type StudyMode =
  | "chat"
  | "quiz"
  | "summary"
  | "flashcards"
  | "explain";
