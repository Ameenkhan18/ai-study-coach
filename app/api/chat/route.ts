import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildSystemPrompt(documents: { name: string; content: string }[], mode: string): string {
  const docsContext = documents.length > 0
    ? documents.map((d, i) =>
        `--- DOCUMENT ${i + 1}: "${d.name}" ---\n${d.content.slice(0, 15000)}\n--- END OF DOCUMENT ${i + 1} ---`
      ).join("\n\n")
    : "No documents uploaded yet.";

  const modeInstructions: Record<string, string> = {
    chat: "Answer questions directly and helpfully. Reference specific parts of the documents when relevant.",
    quiz: `Generate quiz questions based on the document content. After the student answers, give detailed feedback. 
           Format questions clearly and explain why answers are correct or incorrect.`,
    summary: `Create structured, comprehensive summaries. Use headers, bullet points, and highlight key concepts. 
              Make summaries scannable and study-friendly.`,
    flashcards: `Create Q&A flashcard pairs. Format as:
                 **Q:** [Question]
                 **A:** [Answer]
                 Cover the most important facts, definitions, and concepts.`,
    explain: `Act as a patient tutor. Break down complex concepts into simple terms. 
              Use analogies, examples, and step-by-step explanations. Check for understanding.`,
  };

  return `You are an expert AI Study Coach specialized in helping students understand their learning materials deeply.

STUDY DOCUMENTS:
${docsContext}

YOUR ROLE: ${modeInstructions[mode] || modeInstructions.chat}

GUIDELINES:
- Always ground your responses in the uploaded documents when they exist
- If something isn't covered in the documents, say so clearly and offer general knowledge
- Be encouraging, clear, and pedagogically effective
- Use markdown formatting to make responses readable (headers, bullets, bold for key terms)
- When quoting or referencing documents, mention the document name
- Adapt your language complexity to match the student's apparent level
- If asked to quiz, generate varied question types (multiple choice, short answer, true/false)
- Keep responses focused and actionable for studying

Current mode: ${mode.toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, documents, mode = "chat" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured. Add ANTHROPIC_API_KEY to your environment variables." }),
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(documents || [], mode);

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = await anthropic.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 2048,
            system: systemPrompt,
            messages: formattedMessages,
            stream: true,
          });

          for await (const chunk of anthropicStream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
            }
            if (chunk.type === "message_stop") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            }
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
