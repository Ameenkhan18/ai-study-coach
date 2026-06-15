import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Max size is 10MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamically import pdf-parse to avoid edge runtime issues
    const pdfParse = (await import("pdf-parse")).default;
    const pdfData = await pdfParse(buffer);

    const content = pdfData.text
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from this PDF. It may be scanned or image-based." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      name: file.name,
      content,
      pageCount: pdfData.numpages,
      size: file.size,
      charCount: content.length,
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF. Please try again." },
      { status: 500 }
    );
  }
}
